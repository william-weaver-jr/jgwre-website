import type { Lead } from "@/lib/lead";

const FUB_ENDPOINT = "https://api.followupboss.com/v1/events";

/**
 * Push a lead into Follow Up Boss.
 *
 * The API key is read from the environment at call time and never reaches the
 * client. Throws on any non-2xx so the caller can fall back to email — a lead
 * must never be silently dropped. CLAUDE.md §9.
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
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Follow Up Boss responded ${response.status}: ${body.slice(0, 300)}`);
  }
}

function buildMessage(lead: Lead): string {
  const lines = [
    `Lead type: ${lead.leadType}`,
    `Page: ${lead.source}`,
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
