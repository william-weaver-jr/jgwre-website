import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";

import {
  VIDEOS,
  embedUrl,
  formatDuration,
  isPrimaryPlacement,
  isoDuration,
  publishedVideos,
  sortVideos,
  spokenDuration,
  thumbnailUrl,
  videoForRoute,
  watchUrl,
} from "./index";
import { VIDEO_PILLARS } from "./types";

/**
 * Integrity over the real video registry.
 *
 * The compliance and accessibility suites render the pages a video lands on and
 * check the §7 surfaces there. They cannot see an entry with no placements, or
 * one dated forward — so the data itself is checked here, before a video
 * publishes itself onto a licensed broker's advertising with nobody watching.
 *
 * The failure mode this guards is not a crash. It is a plausible-looking entry:
 * a summary lifted from a YouTube description, a duration that disagrees with
 * the asset, a second video quietly appearing on a page that already has one.
 */

/** Every route the site actually serves that a placement may name. */
const ROUTES = [
  "/",
  "/about",
  "/buyers",
  "/sellers",
  "/new-construction",
  "/relocation",
  "/carolinas-border",
  "/negotiation",
  "/home-value",
  "/reviews",
  "/contact",
  "/blog",
  "/areas",
];

describe("the registry", () => {
  it("has at least one video", () => {
    expect(VIDEOS.length).toBeGreaterThan(0);
  });

  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s has a usable YouTube id", (_slug, video) => {
    /* YouTube ids are 11 characters of [A-Za-z0-9_-]. A typo here renders a
       player that says the video is unavailable, on a page that says it is her. */
    expect(video.id).toMatch(/^[A-Za-z0-9_-]{11}$/);
  });

  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s has a stable slug", (_slug, video) => {
    expect(video.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("gives every video a distinct id and slug", () => {
    expect(new Set(VIDEOS.map((v) => v.id)).size).toBe(VIDEOS.length);
    expect(new Set(VIDEOS.map((v) => v.slug)).size).toBe(VIDEOS.length);
  });

  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s names a known pillar", (_slug, video) => {
    expect(Object.keys(VIDEO_PILLARS)).toContain(video.pillar);
  });

  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s carries an ISO date", (_slug, video) => {
    expect(video.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(video.publishedAt))).toBe(false);
  });

  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s has a real duration", (_slug, video) => {
    expect(video.durationSeconds).toBeGreaterThan(0);
    expect(Number.isInteger(video.durationSeconds)).toBe(true);
  });

  /**
   * The summary is copy under NC 334700 and SC 125546 the moment it ships: it is
   * rendered beside the player and declared as the VideoObject description. A
   * one-line stub would pass a type check and fail a reader.
   */
  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s has a substantive summary", (_slug, video) => {
    expect(video.summary.length).toBeGreaterThan(80);
    expect(video.summary.trim()).toBe(video.summary);
  });

  /**
   * docs/BRAND-VOICE.md's banned list, applied to the registry.
   *
   * The specific risk is copy-paste: video 2's YouTube description opens
   * "Welcome to Your Dream Home." Pasting a description in here is the single
   * most likely way banned language reaches this site, so it is caught in the
   * data rather than only in the rendered page.
   */
  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s avoids banned language", (_slug, video) => {
    const copy = [video.summary, video.transcript ?? "", ...video.placements.flatMap((p) => [p.heading, p.intro, p.eyebrow])]
      .join(" ")
      .toLowerCase();
    for (const phrase of ["dream home", "nestled", "boasts", "hidden gem", "unparalleled", "luxury lifestyle", "passionate about helping"]) {
      expect(copy, `contains "${phrase}"`).not.toContain(phrase);
    }
  });

  /**
   * §6: no figure that is not documented. A summary is the easy place to invent
   * one, because a video full of numbers is a video that sounds authoritative.
   */
  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s states no dollar figure", (_slug, video) => {
    expect(`${video.summary} ${video.transcript ?? ""}`).not.toMatch(/\$\s?\d/);
  });

  /** A time-sensitive entry without a review date is one nobody revisits. */
  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s dates its own review if it ages", (_slug, video) => {
    if (!video.evergreen) expect(video.reviewBy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("placements", () => {
  const placements = VIDEOS.flatMap((v) => v.placements.map((p) => [v.slug, p] as const));

  it.each(placements)("%s → %o names a route that exists", (_slug, placement) => {
    expect(ROUTES).toContain(placement.route);
  });

  it.each(placements)("%s → %o carries its own copy", (_slug, placement) => {
    expect(placement.heading.length).toBeGreaterThan(0);
    expect(placement.intro.length).toBeGreaterThan(30);
    expect(placement.eyebrow.length).toBeGreaterThan(0);
    expect(placement.id).toMatch(/^[a-z0-9-]+$/);
  });

  /**
   * One video per page. A page with two has decided nothing, and asks the reader
   * to choose between things they cannot evaluate without watching both.
   */
  it("puts at most one video on any route", () => {
    const seen = new Set<string>();
    for (const [, placement] of placements) {
      expect(seen.has(placement.route), `${placement.route} has two videos`).toBe(false);
      seen.add(placement.route);
    }
  });

  /**
   * Exactly one canonical home per video. Emitting the same VideoObject on two
   * URLs invites a crawler to pick the wrong one.
   */
  it.each(VIDEOS.map((v) => [v.slug, v] as const))("%s has one primary placement", (_slug, video) => {
    if (video.placements.length === 0) return;
    expect(video.placements.filter(isPrimaryPlacement)).toHaveLength(1);
  });

  /** Time-sensitive video never sits on the home page or a pillar page. */
  it.each(placements)("%s → %o keeps aging video off the evergreen pages", (slug, placement) => {
    const video = VIDEOS.find((v) => v.slug === slug)!;
    if (video.evergreen) return;
    expect(["/", "/new-construction", "/sellers", "/relocation", "/carolinas-border"]).not.toContain(
      placement.route,
    );
  });
});

describe("publishing gate", () => {
  const video = VIDEOS[0];

  it("hides a video dated after today", () => {
    const dayBefore = new Date(`${video.publishedAt}T00:00:00Z`);
    dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);
    expect(publishedVideos(dayBefore).map((v) => v.slug)).not.toContain(video.slug);
  });

  it("publishes on the date itself, not the day after", () => {
    const onTheDay = new Date(`${video.publishedAt}T00:00:00Z`);
    expect(publishedVideos(onTheDay).map((v) => v.slug)).toContain(video.slug);
  });

  it("returns nothing for a route with no placement", () => {
    expect(videoForRoute("/privacy-policy")).toBeUndefined();
  });

  it("returns the placement written for the route it was asked about", () => {
    const found = videoForRoute("/about");
    expect(found?.placement.route).toBe("/about");
    expect(found?.video.slug).toBe("meet-jasmine");
  });

  it("hides a route's video while the video is still scheduled", () => {
    const before = new Date("2000-01-01T00:00:00Z");
    expect(videoForRoute("/about", before)).toBeUndefined();
  });

  it("sorts newest first with a stable tiebreak", () => {
    const sorted = sortVideos(VIDEOS);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].publishedAt >= sorted[i].publishedAt).toBe(true);
    }
  });
});

describe("urls and formatting", () => {
  const video = VIDEOS[0];

  it("embeds through the no-cookie host", () => {
    expect(embedUrl(video)).toContain("youtube-nocookie.com");
    expect(embedUrl(video)).toContain(video.id);
  });

  it("keeps the end screen on her own channel", () => {
    expect(embedUrl(video)).toContain("rel=0");
  });

  it("only autoplays when asked", () => {
    expect(embedUrl(video)).not.toContain("autoplay");
    expect(embedUrl(video, true)).toContain("autoplay=1");
  });

  it("links the watch page", () => {
    expect(watchUrl(video)).toBe(`https://www.youtube.com/watch?v=${video.id}`);
  });

  /*
    Built rather than read off the registry entry. Under Vite a `.jpg` import is
    a plain URL string, not the StaticImageData the Next build produces, so
    asserting against the real poster would assert the test environment's shape
    and not the browser's.
  */
  it("declares the committed still, so markup and page show the same file", () => {
    const still: StaticImageData = {
      src: "/_next/static/media/meet-jasmine-still.abc123.jpg",
      width: 1280,
      height: 720,
    };
    const withPoster = { ...video, poster: { src: still, alt: "A still." } };
    expect(thumbnailUrl(withPoster, "https://jasminegarcia.com")).toBe(
      "https://jasminegarcia.com/_next/static/media/meet-jasmine-still.abc123.jpg",
    );
  });

  /** The state every future entry starts in, before a still is committed. */
  it("falls back to YouTube's own still when there is no artwork", () => {
    const { poster: _poster, ...noArtwork } = video;
    expect(thumbnailUrl(noArtwork, "https://jasminegarcia.com")).toBe(
      `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
    );
  });

  it("declares ISO 8601 durations", () => {
    expect(isoDuration(102)).toBe("PT1M42S");
    expect(isoDuration(117)).toBe("PT1M57S");
    expect(isoDuration(120)).toBe("PT2M");
    expect(isoDuration(45)).toBe("PT45S");
    expect(isoDuration(0)).toBe("PT0S");
  });

  it("shows a clock-shaped duration", () => {
    expect(formatDuration(102)).toBe("1:42");
    expect(formatDuration(117)).toBe("1:57");
    expect(formatDuration(600)).toBe("10:00");
  });

  /** Never "1:42" — a screen reader reads that as a time of day. §10. */
  it("speaks the duration in words", () => {
    expect(spokenDuration(102)).toBe("1 minute 42 seconds");
    expect(spokenDuration(60)).toBe("1 minute");
    expect(spokenDuration(45)).toBe("45 seconds");
  });
});
