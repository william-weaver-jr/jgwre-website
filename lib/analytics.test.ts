import { afterEach, describe, expect, it, vi } from "vitest";

import { track, readUtm } from "./analytics";

/*
  These tests exist because this module's failure mode is silence.

  A shim that pushes the wrong shape still returns, still throws nothing, and
  still leaves a `dataLayer` on the page that looks populated in a console. The
  events simply never become events. That is what happened here for the whole
  life of the file, so what is asserted below is not "something was recorded"
  but the exact command shape gtag.js acts on.
*/

afterEach(() => {
  delete window.gtag;
  delete window.dataLayer;
  vi.unstubAllGlobals();
});

describe("track", () => {
  it("calls gtag with the event command when the tag has loaded", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    track("call_click", { placement: "header", page: "/" });

    expect(gtag).toHaveBeenCalledWith("event", "call_click", {
      placement: "header",
      page: "/",
    });
  });

  it("queues an argument-shaped command when the tag has not loaded yet", () => {
    track("call_click", { placement: "sticky-bar" });

    expect(window.dataLayer).toEqual([
      ["event", "call_click", { placement: "sticky-bar" }],
    ]);
  });

  /* The regression that prompted the test. A plain object carrying an `event`
     key is the Tag Manager message format; gtag.js ignores it. */
  it("never pushes the Tag Manager object shape", () => {
    track("intake_submit", { side: "buy" });

    const [entry] = window.dataLayer ?? [];
    expect(Array.isArray(entry)).toBe(true);
    expect(entry).not.toHaveProperty("event");
  });

  it("appends to a dataLayer the tag snippet already created", () => {
    window.dataLayer = [["js", new Date(0)]];

    track("intake_start", { placement: "sticky-bar" });

    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer[1]).toEqual([
      "event",
      "intake_start",
      { placement: "sticky-bar" },
    ]);
  });

  it("sends an empty parameter object when none are given", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    track("intake_start");

    expect(gtag).toHaveBeenCalledWith("event", "intake_start", {});
  });
});

describe("readUtm", () => {
  function withSearch(search: string) {
    vi.stubGlobal("location", { ...window.location, search });
  }

  it("returns undefined when the URL carries no utm parameters", () => {
    withSearch("?ref=instagram");
    expect(readUtm()).toBeUndefined();
  });

  it("strips the utm_ prefix and keeps only the five known keys", () => {
    withSearch("?utm_source=instagram&utm_medium=bio&utm_unknown=x");
    expect(readUtm()).toEqual({ source: "instagram", medium: "bio" });
  });

  it("truncates a value long enough to be someone padding the payload", () => {
    withSearch(`?utm_campaign=${"a".repeat(200)}`);
    expect(readUtm()?.campaign).toHaveLength(120);
  });
});
