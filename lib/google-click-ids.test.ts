import { afterEach, describe, expect, it, vi } from "vitest";

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
