import { formatIntake } from "@/lib/intake";
import type { Lead } from "@/lib/lead";

/**
 * One host for every account, and it is not the one the account logs in at.
 *
 * The team's Follow Up Boss lives at `mattstone.followupboss.com`, and the page
 * that mints an API key is `mattstone.followupboss.com/2/api` — which reads like
 * an API base URL and is not one. That is the web app: `/2/` is a UI route and
 * `/api` is the key-management screen inside it.
 *
 * The REST API is always `https://api.followupboss.com/v1/`. FUB's reference is
 * explicit that the hostname is "always the same"; which account a request
 * belongs to is carried by the API key, never by the hostname. Posting to the
 * app subdomain would reach the web app, not the API.
 *
 * Confirm any key against `GET https://api.followupboss.com/v1/identity`, which
 * returns the account and the user it authenticates as.
 */
const FUB_ENDPOINT = "https://api.followupboss.com/v1/events";

/**
 * Push a lead into Follow Up Boss.
 *
 * The API key is read from the environment at call time and never reaches the
 * client. Throws on any non-2xx so the caller can fall back to email — a lead
 * must never be silently dropped. CLAUDE.md §9.
 *
 * ---------------------------------------------------------------------------
 * Assignment, and why it is set explicitly
 *
 * The key belongs to a user inside the brokerage's Follow Up Boss account, so a
 * lead posted here arrives in an account whose Lead Flow rules are configured
 * elsewhere and are not visible from this repository. Those rules can route an
 * incoming lead — including round-robin to whoever is next in a rotation.
 *
 * This site exists to produce leads that belong to her, so assignment is stated
 * rather than left to a default. `FUB_ASSIGNED_USER_ID` is preferred over
 * `FUB_ASSIGNED_TO` because a numeric id cannot be broken by a display-name
 * change.
 *
 * Setting it is not a guarantee. Account-level Lead Flow and Automations can
 * still reassign after the fact, and nothing in this codebase can see that
 * happen. Two things compensate, and both are deliberate:
 *
 *   - `source` and `sourceUrl` are always "jasminegarcia.com" and the page
 *     slug, which is the durable evidence of where a lead actually came from
 *     however it is later routed.
 *   - The Resend notification in app/api/lead/route.ts fires on every
 *     submission, not only on failure. It is an independent record of the lead
 *     that does not live in someone else's CRM.
 *
 * Verify the routing with a real test submission after the key is added. It is
 * the only way to see what the account actually does with these.
 * ---------------------------------------------------------------------------
 */
export async function sendToFollowUpBoss(lead: Lead): Promise<void> {
  const apiKey = process.env.FUB_API_KEY;
  if (!apiKey) {
    throw new Error("FUB_API_KEY is not configured");
  }

  // FUB authenticates with HTTP Basic: the API key as username, empty password.
  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  const response = await fetch(FUB_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...systemHeaders(),
    },
    body: JSON.stringify({
      source: "jasminegarcia.com",
      system: "jasminegarcia.com",
      type: "Registration",
      message: buildMessage(lead),
      person: {
        firstName: lead.name.split(" ")[0],
        lastName: lead.name.split(" ").slice(1).join(" ") || undefined,
        emails: [{ value: lead.email }],
        phones: [{ value: lead.phone }],
        tags: [lead.leadType],
        sourceUrl: lead.source,
        ...assignment(),
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Follow Up Boss responded ${response.status}: ${body.slice(0, 300)}`);
  }
}

/**
 * Who the lead is assigned to, if this deployment has been told.
 *
 * Absent both variables the field is simply omitted and the account decides —
 * which is the current behaviour, and is why setting one of these is part of
 * connecting the integration rather than an optional extra.
 */
function assignment(): { assignedUserId: number } | { assignedTo: string } | Record<string, never> {
  const id = process.env.FUB_ASSIGNED_USER_ID;
  if (id && Number.isFinite(Number(id))) return { assignedUserId: Number(id) };

  const name = process.env.FUB_ASSIGNED_TO;
  if (name) return { assignedTo: name };

  return {};
}

/**
 * The registered-system headers.
 *
 * Follow Up Boss identifies the calling system separately from the user: the
 * API key says who the request is for, `X-System` says what made it. Registering
 * at apps.followupboss.com/system-registration raises the rate limit from 125
 * to 250 requests per ten seconds — irrelevant at this volume — and makes the
 * integration identifiable in the account as this website rather than as an
 * anonymous API caller. That second reason is the one worth having.
 *
 * Both or neither. Sending one without the other is worse than sending
 * neither, because a mismatched pair is rejected rather than ignored.
 */
function systemHeaders(): Record<string, string> {
  const system = process.env.FUB_SYSTEM;
  const systemKey = process.env.FUB_SYSTEM_KEY;

  if (!system || !systemKey) return {};

  return { "X-System": system, "X-System-Key": systemKey };
}

function buildMessage(lead: Lead): string {
  const lines = [
    `Lead type: ${lead.leadType}`,
    `Page: ${lead.source}`,
    // The intake answers are the reason to call this lead prepared. They go above
    // the free-text message, which is optional and usually empty.
    ...formatIntake(lead.side, lead.intake),
    lead.message ? `Message: ${lead.message}` : null,
    lead.utm
      ? `UTM: ${Object.entries(lead.utm)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}=${v}`)
          .join(" ")}`
      : null,
    "TCPA consent: accepted at submission",
  ].filter(Boolean);

  return lines.join("\n");
}
