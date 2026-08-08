import type { StaticImageData } from "next/image";

import { AGENT, BROKERAGE } from "@/lib/site";

import jasmineEnvironmental from "@/assets/images/jasmine-environmental.jpg";
import jasminePortraitStudio from "@/assets/images/jasmine-portrait-studio.jpg";
import jasminePortraitWarm from "@/assets/images/jasmine-portrait-warm.jpg";

/**
 * Single source of truth for photography, matching the pattern in `lib/site.ts`.
 *
 * Two reasons this indirection exists rather than importing the file at the call
 * site:
 *
 * 1. **Alt text cannot drift.** The same photo is described the same way on every
 *    page, and the REALTOR® mark is composed from `AGENT`/`BROKERAGE` so it cannot
 *    be miscapitalised into a compliance problem. CLAUDE.md §7 and §10.
 * 2. **Explicit dimensions come free.** These are static imports, so each entry
 *    carries intrinsic `width`/`height` and a generated `blurDataURL`. Every image
 *    reserves its own space and nothing shifts on load. CLAUDE.md §4.
 *
 * Source files live in `assets/images/`, not `public/`, precisely so they go
 * through the bundler and get those dimensions. See `assets/images/README.md` for
 * the naming convention and the slots still awaiting a photograph.
 */

export type BrandImage = {
  src: StaticImageData;
  /** Describes the photograph. Never a caption, never keyword filler. */
  alt: string;
};

const PORTRAIT_ALT = `${AGENT.name}, ${AGENT.title} with ${BROKERAGE.name}.`;

export const PHOTOS = {
  /**
   * Warm interior, camel blazer, 4:5. The approachable frame — it carries the
   * ivory/gold ground of the brand better than a dark backdrop does, so it takes
   * the home page hero where the reader meets her first.
   */
  portraitWarm: {
    src: jasminePortraitWarm,
    alt: PORTRAIT_ALT,
  },

  /**
   * Dark backdrop, black blazer, 4:5. The composed frame. It goes on `/about`,
   * which is the page that has to carry the record — and it is deliberately not
   * the home page portrait, because two large frames of one photograph a single
   * click apart is what makes a personal-brand site read as a template.
   */
  portraitStudio: {
    src: jasminePortraitStudio,
    alt: PORTRAIT_ALT,
  },

  /**
   * Landscape, 3:2, in a room rather than against a backdrop. Used in the home
   * page closing block, where the ask is to pick up a phone: a person is a better
   * argument for calling someone than a photograph of a building is.
   */
  environmental: {
    src: jasmineEnvironmental,
    alt: `${AGENT.name} at work. ${AGENT.title} with ${BROKERAGE.name}.`,
  },
} as const satisfies Record<string, BrandImage>;
