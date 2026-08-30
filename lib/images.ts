import type { StaticImageData } from "next/image";

import { AGENT, BROKERAGE } from "@/lib/site";

import jasmineClosingDay from "@/assets/images/jasmine-closing-day.jpg";
import jasmineEnvironmental from "@/assets/images/jasmine-environmental.jpg";
import jasminePortraitStudio from "@/assets/images/jasmine-portrait-studio.jpg";
import jasminePortraitWarm from "@/assets/images/jasmine-portrait-warm.jpg";
import meetJasmineStill from "@/assets/images/video/meet-jasmine-still.jpg";
import busterBoydBridge from "@/assets/images/areas/steele-creek-buster-boyd-bridge.jpg";

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

/**
 * A photograph this site did not take, carrying the provenance it is used under.
 *
 * `PHOTOS` and `VIDEO_STILLS` are hers or the brokerage's, so the only thing a
 * call site needs from them is alt text. A borrowed image has a second
 * obligation that has to travel *with the file rather than beside it*, because
 * the failure mode is silent: a stock photo whose licence nobody can reconstruct
 * looks exactly like one whose licence is fine, right up until it isn't.
 *
 * So `credit` and `sourceUrl` are required by the type. An entry cannot be added
 * without stating where the image came from, and `docs/IMAGE-CREDITS.md` holds
 * the long-form log this is the machine-readable half of.
 *
 * `credit` renders on the page. CC0 and public-domain files require no
 * attribution at all — we print one anyway, because the cost is one line of
 * small type and the benefit is that the next person to touch the page can see
 * that the question was asked and answered.
 */
export type SourcedImage = BrandImage & {
  /** The visible credit line. Rendered under the image, verbatim. */
  credit: string;
  /** The file page the licence was confirmed on — not a search or category page. */
  sourceUrl: string;
};

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

/**
 * Establishing images for `/areas/[slug]`, keyed by slug.
 *
 * **Every one of these is a placeholder.** The area pages argue from local
 * knowledge — "I live here, I know what is askable here" — and a stock
 * photograph is the one element on such a page that was not sourced locally.
 * The right image is one of hers. These exist so a page is not textually naked
 * while that is arranged, and each should be replaced rather than kept.
 *
 * Partial by design: an area with no entry renders no banner, which is the
 * correct outcome. Do not fill a gap by reusing a neighbouring market's
 * photograph — a Steele Creek reader who recognises Fort Mill learns that the
 * page does not know where it is.
 *
 * Sourcing rules and the full licence log: `docs/IMAGE-CREDITS.md`. The rule
 * that matters most is the one that is easy to skip — **confirm the licence on
 * the file page itself**, never on the category page it was found through, and
 * if it cannot be confirmed there, move to the next candidate.
 */
export const AREA_IMAGES: Partial<Record<string, SourcedImage>> = {
  /**
   * The Buster Boyd Bridge, carrying NC/SC 49 over Lake Wylie at the southwest
   * edge of Steele Creek. Chosen because it is the one structure a Steele Creek
   * reader will recognise on sight, and because it happens to be a picture of
   * the border — which is the pillar the rest of the site rests on.
   *
   * Public domain (Fife_Club, 2007), confirmed on the Commons file page. Note
   * this is the *original*, not the 2100×300 Wikivoyage banner crop derived
   * from it: same photograph, same licence, and 629px of height instead of 300,
   * which is the difference between a banner that can be cropped and one that
   * can only be stretched.
   *
   * The alt describes the bridge and the lake. It does not describe Steele
   * Creek, because a reader who cannot see the image is told where they are by
   * the h1 directly beneath it.
   */
  "steele-creek": {
    src: busterBoydBridge,
    alt: "The Buster Boyd Bridge crossing Lake Wylie, seen from the shoreline on a clear day.",
    credit: "Photo: Fife_Club, public domain, via Wikimedia Commons.",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Buster_Boyd_Bridge.jpg",
  },
};
