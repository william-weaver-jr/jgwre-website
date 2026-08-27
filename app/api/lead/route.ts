import { NextResponse } from "next/server";
import { Resend } from "resend";

import { leadSchema, type Lead } from "@/lib/lead";
import { sendToFollowUpBoss } from "@/lib/fub";
import { formatIntake } from "@/lib/intake";
import { AGENT } from "@/lib/site";

/**
 * The single lead handler. Every form on the site posts here.
 *
 * Contract: a submitted lead is never lost. If Follow Up Boss fails we still
 * send the notification email and return success to the visitor, logging the
 * failure for follow-up. CLAUDE.md §9.
 */

export const runtime = "nodejs";

// Naive in-memory rate limit. Adequate for a single-instance site; swap for a
// shared store if this ever runs on more than one node.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  // Honeypot tripped: accept silently so the bot sees success, but do nothing.
  if (lead.website) {
    return NextResponse.json({ ok: true });
  }

  let fubError: unknown = null;
  try {
    await sendToFollowUpBoss(lead);
  } catch (error) {
    fubError = error;
    console.error("[lead] Follow Up Boss delivery failed", { source: lead.source, error });
  }

  try {
    await sendNotificationEmail(lead, fubError);
  } catch (error) {
    console.error("[lead] Resend delivery failed", { source: lead.source, error });

    // Both channels failed. Tell the visitor to call rather than pretend it worked.
    if (fubError) {
      return NextResponse.json(
        {
          ok: false,
          error: `We couldn’t submit your request. Please call ${AGENT.phoneDisplay}.`,
        },
        { status: 502 },
      );
    }
  }

  /*
    Which channel actually persisted the lead, reported so the client can say so
    in its conversion event rather than guess.

    Reaching here with `fubError` set means the CRM refused it and the email did
    not — the both-failed case returned above. So "email" is not a soft warning:
    it is a lead that exists only in an inbox, and a run of them is how you find
    out the Follow Up Boss integration has quietly stopped working. It is a
    dimension on the event for exactly that reason.
  */
  return NextResponse.json({ ok: true, delivery: fubError ? "email" : "crm" });
}

async function sendNotificationEmail(lead: Lead, fubError: unknown): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error("Resend environment variables are not configured");
  }

  const resend = new Resend(apiKey);

  const intake = formatIntake(lead.side, lead.intake);

  const warning = fubError
    ? "WARNING: this lead did NOT reach Follow Up Boss. Add it manually.\n\n"
    : "";

  await resend.emails.send({
    from,
    to,
    replyTo: lead.email,
    subject: `${warning ? "[FUB FAILED] " : ""}New ${lead.leadType} lead: ${lead.name}`,
    text: [
      warning,
      `Name:  ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone}`,
      `Type:  ${lead.leadType}`,
      `Page:  ${lead.source}`,
      intake.length ? `\n${intake.join("\n")}` : "",
      lead.message ? `\nMessage:\n${lead.message}` : "",
      `\nTCPA consent accepted at submission.`,
    ].join("\n"),
  });
}
