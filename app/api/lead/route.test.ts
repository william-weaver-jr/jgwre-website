/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The lead handler's contract, from CLAUDE.md §9: a submitted lead is never
 * lost. Follow Up Boss failing must not cost the lead, and both channels
 * failing must not be reported to the visitor as success.
 *
 * FUB and Resend are mocked at the module boundary. The route is imported fresh
 * per test because its rate limiter is module-level state.
 */

const sendToFollowUpBoss = vi.fn();
const emailsSend = vi.fn();

vi.mock("@/lib/fub", () => ({
  sendToFollowUpBoss: (...args: unknown[]) => sendToFollowUpBoss(...args),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => emailsSend(...args) };
  },
}));

async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

const valid = {
  name: "Dana Ruiz",
  email: "dana@example.com",
  phone: "704-555-0100",
  source: "/new-construction",
  leadType: "buyer",
  side: "buying",
  intake: { propertyType: "new-construction" },
  consent: true,
};

function post(body: unknown, ip = "203.0.113.1") {
  return new Request("https://jasminegarcia.com/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

let ipCounter = 0;
/** A fresh IP per test, so one test's submissions never trip another's limit. */
function freshIp() {
  return `198.51.100.${++ipCounter % 250}`;
}

beforeEach(() => {
  vi.stubEnv("FUB_API_KEY", "test-key");
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("LEAD_NOTIFICATION_EMAIL", "jasmine@example.com");
  vi.stubEnv("LEAD_FROM_EMAIL", "site@example.com");
  sendToFollowUpBoss.mockResolvedValue(undefined);
  emailsSend.mockResolvedValue({ id: "email_1" });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  sendToFollowUpBoss.mockReset();
  emailsSend.mockReset();
});

describe("POST /api/lead — the happy path", () => {
  it("returns ok and delivers to both channels", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post(valid, freshIp()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendToFollowUpBoss).toHaveBeenCalledTimes(1);
    expect(emailsSend).toHaveBeenCalledTimes(1);
  });

  it("passes the parsed lead to Follow Up Boss, not the raw body", async () => {
    const { POST } = await loadRoute();
    await POST(post({ ...valid, name: "  Dana Ruiz  " }, freshIp()));

    expect(sendToFollowUpBoss).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Dana Ruiz", leadType: "buyer" }),
    );
  });

  it("puts the intake answers and the consent record in the notification email", async () => {
    const { POST } = await loadRoute();
    await POST(post(valid, freshIp()));

    const email = emailsSend.mock.calls[0][0];
    expect(email.replyTo).toBe("dana@example.com");
    expect(email.subject).toContain("New buyer lead: Dana Ruiz");
    expect(email.text).toContain("New construction");
    expect(email.text).toContain("TCPA consent accepted at submission");
  });
});

describe("POST /api/lead — validation", () => {
  it("rejects a body that is not JSON", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post("not json", freshIp()));

    expect(response.status).toBe(400);
    expect(sendToFollowUpBoss).not.toHaveBeenCalled();
  });

  it("rejects a lead without consent and says why", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...valid, consent: false }, freshIp()));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: expect.stringMatching(/consent/i),
    });
    expect(sendToFollowUpBoss).not.toHaveBeenCalled();
    expect(emailsSend).not.toHaveBeenCalled();
  });

  it("rejects a malformed email before either channel is touched", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...valid, email: "nope" }, freshIp()));

    expect(response.status).toBe(400);
    expect(sendToFollowUpBoss).not.toHaveBeenCalled();
  });
});

describe("POST /api/lead — the honeypot", () => {
  it("reports success to the bot but delivers nothing", async () => {
    const { POST } = await loadRoute();
    // `website` must be within the schema's max(0) to reach the honeypot branch;
    // a longer value is rejected as invalid one step earlier. Both are silent.
    const response = await POST(post({ ...valid, website: "" }, freshIp()));

    expect(response.status).toBe(200);
    expect(sendToFollowUpBoss).toHaveBeenCalledTimes(1);
  });

  it("treats a filled honeypot as a rejected submission and delivers nothing", async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...valid, website: "http://spam.example" }, freshIp()));

    expect(response.status).toBe(400);
    expect(sendToFollowUpBoss).not.toHaveBeenCalled();
    expect(emailsSend).not.toHaveBeenCalled();
  });
});

describe("POST /api/lead — a lead is never dropped", () => {
  it("still emails and still returns ok when Follow Up Boss fails", async () => {
    sendToFollowUpBoss.mockRejectedValue(new Error("FUB 500"));
    const { POST } = await loadRoute();
    const response = await POST(post(valid, freshIp()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(emailsSend).toHaveBeenCalledTimes(1);
  });

  it("flags the failed CRM delivery in the subject and the body, so it gets added by hand", async () => {
    sendToFollowUpBoss.mockRejectedValue(new Error("FUB 500"));
    const { POST } = await loadRoute();
    await POST(post(valid, freshIp()));

    const email = emailsSend.mock.calls[0][0];
    expect(email.subject).toContain("[FUB FAILED]");
    expect(email.text).toContain("did NOT reach Follow Up Boss");
  });

  it("logs the CRM failure rather than swallowing it", async () => {
    sendToFollowUpBoss.mockRejectedValue(new Error("FUB 500"));
    const { POST } = await loadRoute();
    await POST(post(valid, freshIp()));

    expect(console.error).toHaveBeenCalledWith(
      "[lead] Follow Up Boss delivery failed",
      expect.objectContaining({ source: "/new-construction" }),
    );
  });

  it("still returns ok when only the email fails, because the CRM has the lead", async () => {
    emailsSend.mockRejectedValue(new Error("Resend down"));
    const { POST } = await loadRoute();
    const response = await POST(post(valid, freshIp()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("tells the visitor to call when BOTH channels fail, rather than pretending it worked", async () => {
    sendToFollowUpBoss.mockRejectedValue(new Error("FUB 500"));
    emailsSend.mockRejectedValue(new Error("Resend down"));
    const { POST } = await loadRoute();
    const response = await POST(post(valid, freshIp()));

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toContain("(704) 200-9360");
  });

  it("treats missing Resend configuration as an email failure, not a crash", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const { POST } = await loadRoute();
    const response = await POST(post(valid, freshIp()));

    expect(response.status).toBe(200);
    expect(sendToFollowUpBoss).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/lead — rate limiting", () => {
  it("allows five submissions from one IP inside the window", async () => {
    const { POST } = await loadRoute();
    const ip = freshIp();

    for (let i = 0; i < 5; i++) {
      expect((await POST(post(valid, ip))).status).toBe(200);
    }
  });

  it("rejects the sixth with 429 and delivers nothing", async () => {
    const { POST } = await loadRoute();
    const ip = freshIp();

    for (let i = 0; i < 5; i++) await POST(post(valid, ip));
    sendToFollowUpBoss.mockClear();

    const response = await POST(post(valid, ip));
    expect(response.status).toBe(429);
    expect(sendToFollowUpBoss).not.toHaveBeenCalled();
  });

  it("limits per IP, so one flooder cannot lock out everyone else", async () => {
    const { POST } = await loadRoute();
    const flooder = freshIp();

    for (let i = 0; i < 6; i++) await POST(post(valid, flooder));

    expect((await POST(post(valid, freshIp()))).status).toBe(200);
  });

  it("uses the first entry of a comma-separated x-forwarded-for", async () => {
    const { POST } = await loadRoute();
    const client = freshIp();
    const proxied = (body: unknown) =>
      new Request("https://jasminegarcia.com/api/lead", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": `${client}, 10.0.0.1, 10.0.0.2`,
        },
        body: JSON.stringify(body),
      });

    for (let i = 0; i < 5; i++) await POST(proxied(valid));
    expect((await POST(proxied(valid))).status).toBe(429);
  });

  it("lets the same IP through again once the window has passed", async () => {
    vi.useFakeTimers();
    try {
      const { POST } = await loadRoute();
      const ip = freshIp();

      for (let i = 0; i < 6; i++) await POST(post(valid, ip));
      expect((await POST(post(valid, ip))).status).toBe(429);

      vi.advanceTimersByTime(61_000);
      expect((await POST(post(valid, ip))).status).toBe(200);
    } finally {
      vi.useRealTimers();
    }
  });
});
