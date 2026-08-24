import type { BrandImage } from "@/lib/images";

/**
 * The four pillars video is organised by.
 *
 * Deliberately mapped onto structures the site already has rather than invented:
 * `tables` is PILLARS in lib/site.ts, `negotiable` is the `negotiation` post
 * category, `ground-truth` is lib/areas. A taxonomy that does not match the
 * site's own is a taxonomy that drifts from it.
 *
 * Two categories are absent on purpose:
 *
 * - **Market updates.** docs/CONTENT-MARKETING.md §1 rules them out by name and
 *   lib/blog/validate.ts fails the build on median price, days on market, months
 *   of inventory, and year-over-year framing. A video does not create an
 *   exemption. Those live on YouTube and are never embedded, summarised, or
 *   transcribed onto this domain.
 * - **Client stories.** A video testimonial is a testimonial, and CLAUDE.md §7
 *   forbids altering one. An edited clip is an altered testimonial. Revisit with
 *   the BIC and counsel, not here.
 */
export type VideoPillar = "meet" | "negotiable" | "tables" | "ground-truth";

export const VIDEO_PILLARS: Record<VideoPillar, { label: string; blurb: string }> = {
  meet: {
    label: "Meet Jasmine",
    blurb: "Who she is, and what she is like to work with.",
  },
  negotiable: {
    label: "What's actually negotiable",
    blurb: "The USP demonstrated rather than asserted. Which levers exist, and when.",
  },
  tables: {
    label: "The four tables",
    blurb: "One video per pillar page — the USP applied to a specific table.",
  },
  "ground-truth": {
    label: "Charlotte ground truth",
    blurb: "Housing stock, commute, and what trades. Never a listing.",
  },
};

/**
 * How one video appears on one page.
 *
 * `heading` and `intro` live here rather than on the video because the same
 * video says a different thing on `/about` than beside a phone number on
 * `/contact`. Copy belongs to the placement.
 */
export type VideoPlacement = {
  /** A route that exists. lib/video/index.test.ts checks it against the site's routes. */
  route: string;

  /**
   * `feature` — full-width 16:9 in the content column. At most one per page.
   * `card`    — thumbnail beside title and summary. Secondary placements.
   */
  variant: "feature" | "card";

  /** The `<h2>` above the block. A sentence, not "Video". */
  heading: string;

  /** The eyebrow above the heading, matching every other section on the site. */
  eyebrow: string;

  /** The `id` the section is labelled by. Unique within its page. */
  id: string;

  /**
   * Two sentences describing what is in the video, in her register.
   *
   * Not "watch my video." docs/BRAND-VOICE.md: no adjectives doing a noun's job.
   */
  intro: string;

  /**
   * The canonical home of this video. Exactly one placement per video sets it,
   * and only that page emits VideoObject.
   *
   * Emitting the same VideoObject on two URLs invites Google to pick the wrong
   * one, and the canonical would not resolve the ambiguity because the pages
   * are not duplicates of each other — they each host the same asset.
   */
  primary?: boolean;
};

/**
 * One video in the registry.
 *
 * Adding an entry here is the whole mechanism. A video with an empty
 * `placements` array renders nowhere and that is a supported state — the same
 * posture as lib/areas/data.ts, where the template is finished and content
 * activates it. The channel publishes irregularly (one video in June 2025, one
 * in June 2026), so nothing here may depend on a cadence.
 */
export type Video = {
  /** The YouTube video ID. The join key, and the only thing YouTube owns. */
  id: string;

  /** Stable kebab-case. Used if the video ever earns a page of its own. */
  slug: string;

  /**
   * The video's title as it appears on YouTube.
   *
   * Kept in sync deliberately: it is what VideoObject declares, and structured
   * data naming a title the destination does not use is a mismatch a crawler
   * can check.
   */
  title: string;

  pillar: VideoPillar;

  /** ISO `YYYY-MM-DD`. A future date holds the video back — see index.ts. */
  publishedAt: string;

  /** Runtime in seconds. Rendered as `1:42` and declared as `PT1M42S`. */
  durationSeconds: number;

  /**
   * ORIGINAL prose, written for this site. Never the YouTube description.
   *
   * Two reasons it cannot be the description. It is written for a different
   * audience — video 2's opens "Welcome to Your Dream Home," which is on
   * docs/BRAND-VOICE.md's banned list and would fail tests/compliance.test.tsx
   * on sight. And this string is what VideoObject declares, so it is an
   * advertising claim under NC 334700 and SC 125546 the moment it ships.
   */
  summary: string;

  /**
   * Evergreen video may sit on the home page or a pillar page. Time-sensitive
   * video may not — it goes on an area page or nowhere.
   */
  evergreen: boolean;

  /** Required when `evergreen` is false. ISO date this entry gets re-read. */
  reviewBy?: string;

  /** Where it renders. Empty is valid and means "on YouTube only". */
  placements: readonly VideoPlacement[];

  /**
   * The still frame, committed to assets/images/video/ and served through
   * next/image like every other image on the site (lib/images.ts).
   *
   * Optional, and its absence is not a defect: components/video-embed.tsx falls
   * back to a typographic panel built from the site's own tokens. Hotlinking
   * i.ytimg.com would forfeit the intrinsic dimensions and blur placeholder that
   * a static import gives for free, and would put a third-party request on the
   * page before the visitor has asked for one — which is the whole reason the
   * embed is a facade in the first place.
   */
  poster?: BrandImage;

  /**
   * A cleaned transcript. Optional, and gated on §7 rather than on effort.
   *
   * A transcript is copy. If she states a dollar figure on camera and it is
   * transcribed here, the §7 results disclaimer is triggered on the page. If she
   * states a figure outside the docs/CONTENT-MARKETING.md §2 allowlist, the clip
   * cannot be transcribed on this site at all. Auto-captions are never pasted
   * raw — they mangle names, numbers, and both license numbers.
   */
  transcript?: string;
};
