import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { track, readUtm } from "./analytics";
import { ANALYTICS_OPT_OUT_KEY } from "./analytics-consent";

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
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("the opt-out", () => {
  /* gtag.js honours `ga-disable-*` itself, but a command queued on dataLayer
     before the tag loads is written by this shim and drained afterwards — the
     tag would run it. So the shim has to refuse first. */
  it("sends nothing once a visitor has opted out", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");

    track("call_click", { placement: "header" });

    expect(gtag).not.toHaveBeenCalled();
    expect(window.dataLayer).toBeUndefined();
  });

  it("queues nothing for a tag that has not loaded yet either", () => {
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");

    track("intake_submit", { side: "buy" });

    expect(window.dataLayer).toBeUndefined();
  });
});

/**
 * Google's terms forbid sending personal information to Analytics, and
 * /privacy-policy tells visitors in as many words that we do not. GA4 accepts a
 * name or an email as happily as a step number, so nothing at runtime will ever
 * catch this — the call sites are read here instead.
 */
describe("no personal information reaches an event", () => {
  const FORBIDDEN = /\b(email|phone|tel|first_?name|last_?name|full_?name|message|notes|address|zip|budget)\b/i;

  function sources(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return sources(path);
      if (!/\.tsx?$/.test(entry.name) || entry.name.includes(".test.")) return [];
      return [path];
    });
  }

  it.each(["components", "app"])("%s passes no personal field to track()", (dir) => {
    for (const path of sources(dir)) {
      const source = readFileSync(path, "utf8");
      for (const call of source.matchAll(/\btrack\(([\s\S]*?)\);/g)) {
        expect(call[1], `${path} sends a personal field to GA4`).not.toMatch(FORBIDDEN);
      }
    }
  });
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
