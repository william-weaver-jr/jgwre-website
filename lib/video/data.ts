/**
 * The video registry — every video, and every page it appears on.
 *
 * Adding an entry here is the entire mechanism. A new video needs no layout
 * change, no new component, and no route: it needs a `placements` array. That is
 * the requirement this file exists to satisfy, because the channel publishes
 * irregularly and a hand-placed embed is a redesign every time.
 *
 * ---------------------------------------------------------------------------
 * What does NOT go here
 *
 * - **Market updates.** docs/CONTENT-MARKETING.md §1 rules them out by name and
 *   lib/blog/validate.ts fails the build on the figures they need. Filming one
 *   for YouTube is a fine idea; it stays on YouTube. See lib/video/types.ts.
 * - **Video testimonials.** CLAUDE.md §7 forbids altering a testimonial, and an
 *   edited clip is an altered testimonial.
 * - **Anything from another channel.** See the note on the Stone Realty Group
 *   asset below.
 * - **Any figure outside docs/CONTENT-MARKETING.md §2.** A `summary` and a
 *   `transcript` are copy under NC 334700 and SC 125546, checked by
 *   tests/compliance.test.tsx like every other string on the site.
 * ---------------------------------------------------------------------------
 */

import type { Video } from "./types";

export const VIDEOS: readonly Video[] = [
  {
    id: "EpLuc5n6hHs",
    slug: "meet-jasmine",
    title: "Meet Jasmine Garcia | Charlotte Realtor, Former Teacher & Mom of Twins",
    pillar: "meet",
    publishedAt: "2026-06-15",
    durationSeconds: 102,

    /*
      Original prose. The YouTube description is not reusable here — it is
      written for a viewer who has already pressed play, and it closes on a
      phone number this page already carries twice.

      The teaching years are deliberately not stated. /about says ten; the
      video's own description says six. Until that is reconciled, this summary
      says neither rather than picking one.
      TODO(verify): confirm the number with Jasmine and, if the video is wrong,
      decide whether it is re-recorded or the placement waits.
    */
    summary:
      "A minute and a half of introduction, recorded in her own words: the classroom she came from, the HOA board she sits on, the property she has owned as an investor, and how she works with the people she represents.",

    evergreen: true,

    placements: [
      {
        route: "/about",
        variant: "feature",
        eyebrow: "In her own words",
        id: "video",
        heading: "A minute and a half, if you would rather hear it.",
        /* Names the cost up front, which is what makes someone press play, and
           tells them what is in it rather than instructing them to watch. */
        intro:
          "The page above is the long version. This is the short one, and it is the closest thing to meeting her before you call.",
        primary: true,
      },
      /*
        A second, `card`-variant placement on /contact is drafted and deliberately
        not enabled. It reads well — "know who you are calling", above the form —
        but /contact's whole job is the phone number (docs/CONTENT-PLAN.md: "Phone
        first, large"), and putting anything between the number and the form is a
        conversion decision rather than a video one. Enable it after the /about
        placement has been seen live, not at the same time.

        The variant itself is built and tested; this is one array entry away.
      */
    ],
  },

  /*
    ---------------------------------------------------------------------------
    NOT YET PLACED — the Palisades home tour, `6z4XTnfMgF4`, published
    2025-06-14, 1:57.

    It has no page to live on. Locked Decision #1 keeps listings off this
    domain, there is no /listings route and there will not be one in Phase 1,
    and the video is address-specific and time-bound — the two things that make
    an entry `evergreen: false`.

    Where it could land: /areas/steele-creek, once lib/areas/data.ts has that
    entry, and only as housing-stock and amenity texture rather than as a
    listing. Two conditions first. The property must be confirmed sold or
    expired. And its narration has to be checked against the fair-housing rules
    in CLAUDE.md §7, which apply to a spoken sentence exactly as they apply to a
    written one — lib/areas/validate.ts scans authored strings and cannot hear a
    video.

    ---------------------------------------------------------------------------
    NEVER PLACE — `J6T4pmDWQ6M`, "Meet Jasmine Garcia - Stone Realty Group |
    MattStoneTeam.com".

    CLAUDE.md §6 lists it as her bio video. It is not on her channel: it is
    published by Stone Realty Group (@StoneRealtyGroup), runs 0:39, and its
    description is a wall of Matt Stone Team links, a different phone number,
    and a "#2 Agent in Charlotte" claim documented nowhere in §5. Embedding it
    would put a second brand's calls to action and an undocumented superlative
    inside her advertising.

    It remains a perfectly good voice reference, which is what §6 uses it for.
    `EpLuc5n6hHs` above is the same subject on her own channel, at more than
    twice the length, closing on the Follow Up Boss tracking number.
    ---------------------------------------------------------------------------
  */
];
