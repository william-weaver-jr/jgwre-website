/**
 * Client reviews — one source of truth, many renderers.
 *
 * /reviews, the home page pair, the pillar pages, and review JSON-LD all read
 * from here. Nothing gets retyped into a component: retyping is how a
 * testimonial quietly drifts from what the client actually wrote, and
 * CLAUDE.md §7 makes altered testimonial wording a build-breaking violation.
 *
 * ---------------------------------------------------------------------------
 * Why this is a file and not a service
 *
 * Reviews are read-only, identical for every visitor, and change a few times a
 * month, so they render at build time. Google Places returns at most five,
 * truncated, with terms that restrict storing them, and Zillow has no public
 * review API — a live feed was never actually on the table. The shape in
 * ./types.ts is the eventual CMS document type; when Sanity or Payload lands,
 * only the loader changes.
 * ---------------------------------------------------------------------------
 *
 * Start every query at `publishableReviews()`. Reaching into REVIEWS directly
 * bypasses the `openQuestion` gate and can ship a review that is not cleared.
 */

import { REVIEWS } from "./data";
import type { Review } from "./types";

export { REVIEWS } from "./data";
export type { Review, ReviewPlatform, ReviewTransaction } from "./types";

/**
 * First name + last initial, title-cased — "Brittany T.", "Shayna Q.".
 *
 * Attribution is not testimonial wording, so shortening it is not a §7 edit.
 * It is also the safer choice: a full name beside a neighborhood and a
 * purchase year identifies where a specific client lives.
 *
 * Single-token bylines return unchanged. That only happens for unresolved
 * usernames and first-name-only reviews, all of which carry an `openQuestion`
 * and never reach a page.
 */
export function displayName(review: Review): string {
  const parts = review.author.trim().split(/\s+/);
  if (parts.length === 1) return review.author;
  const first = parts[0];
  const titled = first.charAt(0).toUpperCase() + first.slice(1);
  const initial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${titled} ${initial}.`;
}

/**
 * Everything cleared to appear on the site. Start here.
 *
 * Two gates: `openQuestion` (unresolved) and `withheld` (resolved, and the
 * answer was no). Both keep a review in the dataset and off the site.
 */
export function publishableReviews(reviews: readonly Review[] = REVIEWS): Review[] {
  return reviews.filter((review) => !review.openQuestion && !review.withheld);
}

/** True when any review in the set requires the results disclaimer beside it. */
export function needsResultsDisclaimer(reviews: readonly Review[]): boolean {
  return reviews.some((review) => review.statesDollarOutcome);
}

/**
 * Reviews safe to pull as a short quote. A review carrying a material
 * connection is not — the disclosure lives in the client's own sentence, and
 * an excerpt drops it.
 */
export function quotableReviews(reviews: readonly Review[] = REVIEWS): Review[] {
  return publishableReviews(reviews).filter((review) => !review.materialConnection);
}

/**
 * Drops any review describing a transaction already represented in the set —
 * the second half of a couple, usually. Both accounts are real; two accounts
 * of one closing on one page reads as padding. Earlier entries win, so pass
 * them in the order you want preferred.
 */
export function dedupeByTransaction(reviews: readonly Review[]): Review[] {
  const taken = new Set<string>();
  return reviews.filter((review) => {
    if (taken.has(review.id)) return false;
    taken.add(review.id);
    review.sameTransactionAs?.forEach((id) => taken.add(id));
    return true;
  });
}

/** Look one up by id — for a page that anchors on a specific review. */
export function reviewById(id: string): Review | undefined {
  return REVIEWS.find((review) => review.id === id);
}

/**
 * Look one up by id, but only if it is cleared to appear on the site.
 *
 * Use this anywhere the result drives something a visitor can see. A review
 * held behind `openQuestion` or `withheld` still exists in the dataset and
 * still answers `reviewById`, so a caller that renders a link on the strength
 * of "the id resolves" will point at a review /reviews does not show. The
 * transactions ledger is exactly that caller.
 */
export function publishableReviewById(id: string): Review | undefined {
  const review = reviewById(id);
  return review && !review.openQuestion && !review.withheld ? review : undefined;
}
