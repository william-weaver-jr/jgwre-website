import type { StaticImageData } from "next/image";

import { AGENT, BROKERAGE } from "@/lib/site";

import jasmineClosingDay from "@/assets/images/jasmine-closing-day.jpg";
import jasmineEnvironmental from "@/assets/images/jasmine-environmental.jpg";
import jasminePortraitStudio from "@/assets/images/jasmine-portrait-studio.jpg";
import jasminePortraitWarm from "@/assets/images/jasmine-portrait-warm.jpg";
import meetJasmineStill from "@/assets/images/video/meet-jasmine-still.jpg";

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

/*
 * No borrowed images on the site today.
 *
 * There was one — a public-domain photograph banded above /areas/steele-creek —
 * and it came back out on 2026-08-31: at 1587px wide it was being upscaled by a
 * full-bleed layout on any large or high-DPR display, and the credit line under
 * it was doing more visual damage than the photograph was doing good.
 *
 * The `SourcedImage` type went with it. If another borrowed image is ever added,
 * bring the type back rather than adding it to `PHOTOS` — a borrowed file has an
 * obligation that has to travel *with the file rather than beside it*, because
 * the failure mode is silent: a stock photo whose licence nobody can reconstruct
 * looks exactly like one whose licence is fine, right up until it isn't. Making
 * `credit` and `sourceUrl` required by the type is what stops an entry being
 * added without them.
 *
 * The sourcing rules, and the resolution floor this one failed, are in
 * `docs/IMAGE-CREDITS.md`.
 */
/**
 * The absolute URL and intrinsic size of a brand image, for structured data.
 *
 * Components never need this — `next/image` takes the static import directly.
 * JSON-LD does, because a crawler needs an absolute URL and cannot follow a
 * bundler path.
 *
 * The shape check is not defensive programming. A static import really is two
 * different things depending on who compiled it: under Next it is a
 * `StaticImageData` object carrying `src`, `width`, and `height`, and under
 * Vite — which is what both test suites run on — it is a bare URL string. So
 * `image.src.width` is a number in production and `undefined` in every test,
 * which is precisely the kind of divergence that ships wrong and is never seen,
 * because the assertion that would have caught it was written against the test
 * environment's shape.
 *
 * Under Vite the returned URL is not meaningful and no test should assert on
 * it. Under Next it is the real, hashed, immutable asset URL.
 */
export function imageObject(
  image: BrandImage,
  origin: string,
): { url: string; width?: number; height?: number } {
  const src = image.src as StaticImageData | string;

  if (typeof src === "string") return { url: `${origin}${src}` };

  return { url: `${origin}${src.src}`, width: src.width, height: src.height };
}

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

  /**
   * Landscape, 12:7, candid, at the closing table. The only photograph on the
   * site of the thing the site is selling actually having happened.
   *
   * Two things about it are settled and should not be re-litigated. The clients
   * pictured and the closing attorney whose office it was shot in have both
   * approved this use, and the copyright is hers (Bill, 2026-08-28). It ran on
   * mattstoneteam.com first, which is where the file came from, not where the
   * permission came from.
   *
   * It is 1200×700 — under the 2000px standard in assets/images/README.md,
   * because that is the largest version published. Fine at the width it is used
   * at; get the original off her phone before it goes anywhere large.
   *
   * The alt names nobody. The clients approved a photograph, not the publication
   * of their names, and the law firm's sign in the frame is scenery rather than
   * something a reader who cannot see the image needs described.
   */
  closingDay: {
    src: jasmineClosingDay,
    alt: `Two clients on their closing day, one holding a bouquet of roses, with ${AGENT.name}, ${AGENT.title} with ${BROKERAGE.name}.`,
  },
} as const satisfies Record<string, BrandImage>;

/**
 * Stills for the video registry. Same indirection, same two reasons.
 *
 * These are frames from a video rather than commissioned photography, so they
 * sit apart from PHOTOS — nothing here should be reachable by a page looking for
 * a portrait. lib/video/data.ts is the only consumer.
 */
export const VIDEO_STILLS = {
  /**
   * The still for `EpLuc5n6hHs`, taken from YouTube's own generated thumbnail.
   *
   * It carries Stone Realty Group's stylized hexagon, burned into the frame —
   * the video is watermarked throughout, so no frame of it is clean. CLAUDE.md
   * §7 forbids using the brokerage's registered marks decoratively, and this is
   * the documented exception to that: the BIC funded and distributes the video,
   * and Bill confirmed 2026-08-20 that it ships as-is pending a custom
   * thumbnail from the channel cleanup. It is a temporary state with an owner,
   * not a standing permission — see CLAUDE.md §7 Approvals.
   *
   * The alt describes the photograph and not the mark, because the mark is not
   * what a reader who cannot see the image needs to be told about it.
   */
  meetJasmine: {
    src: meetJasmineStill,
    alt: `${AGENT.name} seated on a lakeside dock, holding her infant twin daughters.`,
  },
} as const satisfies Record<string, BrandImage>;

