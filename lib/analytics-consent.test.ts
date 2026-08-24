import { afterEach, describe, expect, it, vi } from "vitest";

import { ANALYTICS_OPT_OUT_KEY, hasOptedOutOfAnalytics, setAnalyticsOptOut } from "./analytics-consent";

/*
  The opt-out is a promise made in writing on /privacy-policy, so its failure
  mode is not a broken button — it is a visitor who was told they were not being
  measured and was. Every assertion below is about that sentence staying true.
*/

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("hasOptedOutOfAnalytics", () => {
  it("is false by default — nobody is opted out until they say so", () => {
    expect(hasOptedOutOfAnalytics()).toBe(false);
  });

  it("is true once the choice is stored", () => {
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
    expect(hasOptedOutOfAnalytics()).toBe(true);
  });

  /* Safari in private mode throws rather than returning null. A page that
     crashes here would take the whole privacy policy down with it. */
  it("survives a browser that refuses to read localStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(() => hasOptedOutOfAnalytics()).not.toThrow();
    expect(hasOptedOutOfAnalytics()).toBe(false);
  });
});

describe("setAnalyticsOptOut", () => {
  it("stores the choice and sets gtag's own kill switch", () => {
    setAnalyticsOptOut(true, "G-TEST123");

    expect(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY)).toBe("1");
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST123"]).toBe(true);
  });

  it("clears both again when analytics are turned back on", () => {
    setAnalyticsOptOut(true, "G-TEST123");
    setAnalyticsOptOut(false, "G-TEST123");

    expect(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY)).toBeNull();
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST123"]).toBe(false);
  });

  /* The measurement ID is inlined at build time and can be absent. The
     preference still has to persist — the next page load reads it. */
  it("persists the choice with no measurement ID configured", () => {
    expect(() => setAnalyticsOptOut(true)).not.toThrow();
    expect(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY)).toBe("1");
  });

  it("still disables the live tag when the choice cannot be persisted", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    setAnalyticsOptOut(true, "G-TEST123");

    expect((window as unknown as Record<string, unknown>)["ga-disable-G-TEST123"]).toBe(true);
  });
});
