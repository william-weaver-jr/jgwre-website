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

  /**
   * The first production lead came back as `via: <unspecified>` because only the
   * event carried a source. The contact is the record anyone reads, and the only
   * thing a Lead Flow rule can route on — so the two have to agree.
   */
  it("sets the same source on the event and on the person", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);

    const body = bodyOf(fetchMock);
    expect(body.source).toBe("jasminegarcia.com");
    expect(body.person.source).toBe("jasminegarcia.com");
  });

  /**
   * The body's system name and the `X-System` header identify the same
   * integration and FUB compares them, so they cannot drift. Tested live: an
   * unregistered caller cannot set a lead source at all, which is what makes
   * this pair matter rather than being cosmetic.
   */
  it("names the registered system in the body when one is configured", async () => {
    vi.stubEnv("FUB_SYSTEM", "Jasmine-Garcia-Website");
    vi.stubEnv("FUB_SYSTEM_KEY", "abc123");
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);

    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(bodyOf(fetchMock).system).toBe("Jasmine-Garcia-Website");
    expect(headers["X-System"]).toBe("Jasmine-Garcia-Website");
  });

  it("falls back to the site name as the system when unregistered", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);
    expect(bodyOf(fetchMock).system).toBe("jasminegarcia.com");
  });

  /** FUB renders sourceUrl as a link, so a bare path resolves against their domain. */
  it("carries the source page through as an absolute sourceUrl", async () => {
    const fetchMock = mockFetch();
    await sendToFollowUpBoss(lead);
    expect(bodyOf(fetchMock).person.sourceUrl).toBe(
      "https://jasminegarcia.com/new-construction",
    );
  });

  /**
   * The key belongs to a user inside the brokerage's account, and that account's
   * Lead Flow rules are not visible from here. A lead this site produced that
   * arrives unassigned is a lead the account routes by a rule nobody in this
   * repository controls, so the absence of this field is a real failure and not
   * a cosmetic one.
   */
  describe("assignment", () => {
    it("assigns by numeric user id when one is configured", async () => {
      vi.stubEnv("FUB_ASSIGNED_USER_ID", "4821");
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      expect(bodyOf(fetchMock).person.assignedUserId).toBe(4821);
      expect(bodyOf(fetchMock).person.assignedTo).toBeUndefined();
    });

    it("prefers the id over the name when both are set", async () => {
      vi.stubEnv("FUB_ASSIGNED_USER_ID", "4821");
      vi.stubEnv("FUB_ASSIGNED_TO", "Jasmine Garcia");
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      expect(bodyOf(fetchMock).person.assignedUserId).toBe(4821);
      expect(bodyOf(fetchMock).person.assignedTo).toBeUndefined();
    });

    it("falls back to the name when only that is set", async () => {
      vi.stubEnv("FUB_ASSIGNED_TO", "Jasmine Garcia");
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      expect(bodyOf(fetchMock).person.assignedTo).toBe("Jasmine Garcia");
    });

    /** A non-numeric id is a typo, not an assignment. Fall through rather than send NaN. */
    it("ignores a malformed user id instead of sending NaN", async () => {
      vi.stubEnv("FUB_ASSIGNED_USER_ID", "jasmine");
      vi.stubEnv("FUB_ASSIGNED_TO", "Jasmine Garcia");
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      expect(bodyOf(fetchMock).person.assignedUserId).toBeUndefined();
      expect(bodyOf(fetchMock).person.assignedTo).toBe("Jasmine Garcia");
    });

    it("omits assignment entirely when neither is configured", async () => {
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      const person = bodyOf(fetchMock).person;
      expect(person.assignedUserId).toBeUndefined();
      expect(person.assignedTo).toBeUndefined();
    });
  });

  /**
   * Both headers or neither. A mismatched pair is rejected by FUB rather than
   * ignored, so sending one alone would break every lead — the exact failure
   * this site's email fallback exists to survive, and still not one to ship.
   */
  describe("system identification", () => {
    it("sends both headers when both are configured", async () => {
      vi.stubEnv("FUB_SYSTEM", "jasminegarcia.com");
      vi.stubEnv("FUB_SYSTEM_KEY", "abc123");
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
      expect(headers["X-System"]).toBe("jasminegarcia.com");
      expect(headers["X-System-Key"]).toBe("abc123");
    });

    it.each([
      ["only the name", { FUB_SYSTEM: "jasminegarcia.com", FUB_SYSTEM_KEY: "" }],
      ["only the key", { FUB_SYSTEM: "", FUB_SYSTEM_KEY: "abc123" }],
    ])("sends neither header given %s", async (_label, env) => {
      for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
      expect(headers["X-System"]).toBeUndefined();
      expect(headers["X-System-Key"]).toBeUndefined();
    });

    it("never puts the system key in the body", async () => {
      vi.stubEnv("FUB_SYSTEM", "jasminegarcia.com");
      vi.stubEnv("FUB_SYSTEM_KEY", "abc123");
      const fetchMock = mockFetch();
      await sendToFollowUpBoss(lead);

      expect(fetchMock.mock.calls[0][1].body as string).not.toContain("abc123");
    });
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
