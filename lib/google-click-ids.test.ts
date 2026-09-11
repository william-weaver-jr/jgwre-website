import { afterEach, describe, expect, it, vi } from "vitest";

import { ANALYTICS_OPT_OUT_KEY } from "./analytics-consent";
import {
  captureFirstTouchGoogleClickIds,
  clickIdsFromSearch,
  GOOGLE_CLICK_IDS_STORAGE_KEY,
} from "./google-click-ids";

afterEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/*
  The opt-out shipped before this capture did, and for a day the two did not
  know about each other: a visitor could switch analytics off and still have a
  Google Ads identifier stored and sent to the CRM. Nothing failed, which is why
  it survived review — the gap was only visible by reading both files at once.

  These assert the switch from the outside, the way a visitor experiences it:
  nothing new is kept, nothing already kept is sent, and nothing is left behind.
*/
describe("the analytics opt-out gates the capture", () => {
  function optOut() {
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
  }

  it("captures nothing from a tagged URL", () => {
    optOut();
    vi.stubGlobal("location", { ...window.location, search: "?gclid=click-1" });

    expect(captureFirstTouchGoogleClickIds()).toBeUndefined();
    expect(window.localStorage.getItem(GOOGLE_CLICK_IDS_STORAGE_KEY)).toBeNull();
  });

  it("does not return an identifier stored before the visitor opted out", () => {
    window.localStorage.setItem(
      GOOGLE_CLICK_IDS_STORAGE_KEY,
      JSON.stringify({ gclid: "click-1" }),
    );
    optOut();

    expect(captureFirstTouchGoogleClickIds()).toBeUndefined();
  });

  /* The switch is a promise about what this browser holds, not only about what
     it sends next — and it is what cleans up anyone who opted out before the
     gate existed. */
  it("forgets an identifier stored before the visitor opted out", () => {
    window.localStorage.setItem(
      GOOGLE_CLICK_IDS_STORAGE_KEY,
      JSON.stringify({ gclid: "click-1" }),
    );
    optOut();

    captureFirstTouchGoogleClickIds();

    expect(window.localStorage.getItem(GOOGLE_CLICK_IDS_STORAGE_KEY)).toBeNull();
  });

  it("still captures for a visitor who has not opted out", () => {
    vi.stubGlobal("location", { ...window.location, search: "?gclid=click-1" });

    expect(captureFirstTouchGoogleClickIds()).toEqual({ gclid: "click-1" });
  });

  /* Private browsing throws on localStorage. hasOptedOutOfAnalytics() reports
     false there, so the capture proceeds — the same tie-break the tag makes. */
  it("captures when storage is unavailable and no preference can be read", () => {
    vi.stubGlobal("location", { ...window.location, search: "?gclid=click-1" });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });

    expect(captureFirstTouchGoogleClickIds()).toEqual({ gclid: "click-1" });
  });
});

describe("clickIdsFromSearch", () => {
  it("reads all three supported Google identifiers and ignores unrelated parameters", () => {
    expect(
      clickIdsFromSearch("?gclid=click-1&wbraid=web-2&gbraid=app-3&utm_source=google"),
    ).toEqual({ gclid: "click-1", wbraid: "web-2", gbraid: "app-3" });
  });

  it("returns undefined without a Google click identifier", () => {
    expect(clickIdsFromSearch("?utm_source=google")).toBeUndefined();
  });

  it("caps values before they cross the public API boundary", () => {
    expect(clickIdsFromSearch(`?gclid=${"x".repeat(700)}`)?.gclid).toHaveLength(512);
  });
});

describe("captureFirstTouchGoogleClickIds", () => {
  function withSearch(search: string) {
    vi.stubGlobal("location", { ...window.location, search });
  }

  it("persists an incoming click identifier", () => {
    withSearch("?gclid=first-click");

    expect(captureFirstTouchGoogleClickIds()).toEqual({ gclid: "first-click" });
    expect(JSON.parse(window.localStorage.getItem(GOOGLE_CLICK_IDS_STORAGE_KEY) ?? "null")).toEqual({
      gclid: "first-click",
    });
  });

  it("preserves the first touch instead of overwriting it on a later ad visit", () => {
    window.localStorage.setItem(
      GOOGLE_CLICK_IDS_STORAGE_KEY,
      JSON.stringify({ wbraid: "first-web-click" }),
    );
    withSearch("?gclid=later-click");

    expect(captureFirstTouchGoogleClickIds()).toEqual({ wbraid: "first-web-click" });
  });

  it("recovers from corrupt storage by using the current landing URL", () => {
    window.localStorage.setItem(GOOGLE_CLICK_IDS_STORAGE_KEY, "not-json");
    withSearch("?gbraid=current-app-click");

    expect(captureFirstTouchGoogleClickIds()).toEqual({ gbraid: "current-app-click" });
  });
});
