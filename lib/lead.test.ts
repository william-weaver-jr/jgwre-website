/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";

import { leadSchema } from "./lead";

/**
 * The schema is the only thing standing between the public internet and the CRM,
 * and one of its rules is a compliance rule: TCPA consent must be explicitly
 * true. CLAUDE.md §7.
 */

const valid = {
  name: "Test Person",
  email: "test@example.com",
  phone: "704-555-0100",
  source: "/contact",
  leadType: "buyer" as const,
  consent: true as const,
};

describe("leadSchema", () => {
  it("accepts a minimal valid lead", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("trims whitespace off the contact fields", () => {
    const parsed = leadSchema.parse({ ...valid, name: "  Test Person  ", email: " t@e.com " });
    expect(parsed.name).toBe("Test Person");
    expect(parsed.email).toBe("t@e.com");
  });

  describe("consent", () => {
    it("rejects a lead with consent false", () => {
      expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    });

    it("rejects a lead with consent missing entirely", () => {
      const { consent: _consent, ...withoutConsent } = valid;
      expect(leadSchema.safeParse(withoutConsent).success).toBe(false);
    });

    it("rejects truthy non-true values, so a checkbox string can never pass", () => {
      for (const consent of ["on", "true", 1, "yes"]) {
        expect(leadSchema.safeParse({ ...valid, consent }).success).toBe(false);
      }
    });

    it("explains why it failed, because the message is shown to the visitor", () => {
      const result = leadSchema.safeParse({ ...valid, consent: false });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/consent/i);
      }
    });
  });

  describe("contact fields", () => {
    it("rejects an empty name", () => {
      expect(leadSchema.safeParse({ ...valid, name: "   " }).success).toBe(false);
    });

    it("rejects a malformed email", () => {
      expect(leadSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    });

    it("rejects a phone number too short to dial", () => {
      expect(leadSchema.safeParse({ ...valid, phone: "704" }).success).toBe(false);
    });

    it("caps field lengths so a payload cannot be used to flood the CRM", () => {
      expect(leadSchema.safeParse({ ...valid, name: "a".repeat(121) }).success).toBe(false);
      expect(
        leadSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success,
      ).toBe(false);
    });
  });

  describe("honeypot", () => {
    it("accepts an absent or empty website field", () => {
      expect(leadSchema.safeParse({ ...valid, website: "" }).success).toBe(true);
      expect(leadSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects a filled website field at the schema boundary", () => {
      expect(leadSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
    });
  });

  describe("leadType", () => {
    it("accepts every type the intake can produce", () => {
      for (const leadType of ["buyer", "seller", "valuation", "guide", "relocation", "general"]) {
        expect(leadSchema.safeParse({ ...valid, leadType }).success).toBe(true);
      }
    });

    it("rejects an unknown type", () => {
      expect(leadSchema.safeParse({ ...valid, leadType: "investor" }).success).toBe(false);
    });
  });

  describe("intake answers", () => {
    it("accepts strings and string arrays keyed by question id", () => {
      const parsed = leadSchema.safeParse({
        ...valid,
        side: "buying",
        intake: { propertyType: "new-construction", markets: ["south-charlotte"] },
      });
      expect(parsed.success).toBe(true);
    });

    it("rejects non-string answer values", () => {
      expect(
        leadSchema.safeParse({ ...valid, intake: { timeline: 30 } }).success,
      ).toBe(false);
    });

    it("caps the number of options in a multi-select", () => {
      expect(
        leadSchema.safeParse({ ...valid, intake: { markets: Array(13).fill("x") } }).success,
      ).toBe(false);
    });
  });

  it("accepts UTM parameters and drops nothing", () => {
    const parsed = leadSchema.parse({
      ...valid,
      utm: { source: "google", medium: "cpc", campaign: "border" },
    });
    expect(parsed.utm).toEqual({ source: "google", medium: "cpc", campaign: "border" });
  });
});
