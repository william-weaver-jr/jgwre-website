/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sendToFollowUpBoss } from "./fub";
import type { Lead } from "./lead";

/**
 * Locked Decision #5: nothing ships with an unwired form, and §9 says a lead is
 * never silently dropped. That makes two things testable here — the payload FUB
 * receives, and that any non-2xx throws so the caller falls back to email.
 */

const lead: Lead = {
  name: "Dana Ruiz Ortega",
  email: "dana@example.com",
  phone: "704-555-0100",
  source: "/new-construction",
  leadType: "buyer",
  side: "buying",
  intake: { propertyType: "new-construction", markets: ["carolinas-border"] },
  consent: true,
};

function mockFetch(response: Partial<Response> = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: async () => "",
    ...response,
  } as Response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function bodyOf(fetchMock: ReturnType<typeof mockFetch>) {
  return JSON.parse(fetchMock.mock.calls[0][1].body as string);
}

beforeEach(() => {
  vi.stubEnv("FUB_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("sendToFollowUpBoss", () => {
  it("throws when the API key is not configured rather than posting unauthenticated", async () => {
    vi.stubEnv("FUB_API_KEY", "");
    const fetchMock = mockFetch();

    await expect(sendToFollowUpBoss(lead)).rejects.toThrow(/FUB_API_KEY/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("authenticates with HTTP Basic, key as username and empty password", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);

    const header = fetchMock.mock.calls[0][1].headers.Authorization as string;
    expect(header.startsWith("Basic ")).toBe(true);
    expect(Buffer.from(header.slice(6), "base64").toString()).toBe("test-key:");
  });

  it("never puts the API key in the URL", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("test-key");
  });

  it("splits the name into first and last", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);

    expect(bodyOf(fetchMock).person).toMatchObject({
      firstName: "Dana",
      lastName: "Ruiz Ortega",
    });
  });

  it("omits lastName for a single-token name instead of sending an empty string", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss({ ...lead, name: "Cher" });

    const person = bodyOf(fetchMock).person;
    expect(person.firstName).toBe("Cher");
    expect(person.lastName).toBeUndefined();
  });

  it("tags the person with the lead type so the CRM stays filterable", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss({ ...lead, leadType: "relocation" });
    expect(bodyOf(fetchMock).person.tags).toEqual(["relocation"]);
  });

  it("carries the source page through as sourceUrl", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);
    expect(bodyOf(fetchMock).person.sourceUrl).toBe("/new-construction");
  });

  describe("the note", () => {
    it("includes the intake answers in the visitor's own words, not option ids", async () => {
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      const message = bodyOf(fetchMock).message as string;
      expect(message).toContain("New construction");
      expect(message).toContain("The NC/SC border");
      expect(message).not.toContain("carolinas-border");
    });

    it("records that TCPA consent was accepted", async () => {
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);
      expect(bodyOf(fetchMock).message).toContain("TCPA consent: accepted at submission");
    });

    it("flattens UTM parameters onto one line and drops the empty ones", async () => {
      const fetchMock = mockFetch();
      await sendToFollowUpBoss({
        ...lead,
        utm: { source: "google", medium: undefined, campaign: "border" },
      });

      expect(bodyOf(fetchMock).message).toContain("UTM: source=google campaign=border");
    });

    it("omits the message line entirely when the visitor left it blank", async () => {
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);
      expect(bodyOf(fetchMock).message).not.toContain("Message:");
    });
  });

  describe("failures", () => {
    it("throws on a non-2xx so the caller can fall back to email", async () => {
      mockFetch({ ok: false, status: 401, text: async () => "unauthorized" });
      await expect(sendToFollowUpBoss(lead)).rejects.toThrow(/401/);
    });

    it("does not swallow a network error", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
      await expect(sendToFollowUpBoss(lead)).rejects.toThrow("ECONNRESET");
    });

    it("truncates the upstream body so a long error page cannot flood the logs", async () => {
      mockFetch({ ok: false, status: 500, text: async () => "x".repeat(5000) });
      await expect(sendToFollowUpBoss(lead)).rejects.toThrow(
        expect.objectContaining({ message: expect.stringMatching(/^.{0,400}$/s) }),
      );
    });
  });
});
