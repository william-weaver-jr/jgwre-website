/**
 * Review schema.
 *
 * This is the eventual CMS document type. When Sanity or Payload lands
 * (CLAUDE.md §12) these fields move across unchanged and only the loader is
 * replaced, so everything here stays serializable: no JSX, no functions.
 */

/** Where the review was posted. Attribution has to be accurate. */
export type ReviewPlatform = "google" | "zillow";

/**
 * Zillow's own generated transaction line ("Bought a Single Family home in 2022
 * in Montclaire, Charlotte, NC"). Platform metadata, not the client's words, so
 * it is stored structured and capitalization is normalized.
 *
 * Useful beyond decoration: it is what lets a pillar or area page pull the
 * reviews that actually match its argument instead of hand-picking them.
 *
 * `propertyType` and `location` are optional — Zillow omits both on some
 * reviews, printing only "Bought a home in 2025."
 */
export type ReviewTransaction = {
  role: "bought" | "sold" | "bought and sold";
  propertyType?: "Single Family" | "Townhouse";
  year: number;
  /** Neighborhood, city, state as applicable. */
  location?: string;
};

export type Review = {
  /**
   * Stable key, `platform-author-slug`. Also the dedupe unit: where a client
   * posted the same review to both platforms, ONE entry is canonical and
   * `crossPostedTo` records the other. Two entries only exist for genuinely
   * separate transactions — see the two Brittany T. reviews, four years apart.
   */
  id: string;
  /** Byline exactly as posted. Never rendered — use `displayName()`. */
  author: string;
  rating: 5;
  platform: ReviewPlatform;
  /**
   * The profile the review sits on. Some of hers are on the Stone Realty Group
   * page rather than her own, which changes nothing about attribution but does
   * mean the §5 review counts (42 Zillow / 62 Google) are undercounting.
   */
  postedOn: string;
  /** ISO date. Zillow prints exact dates; Google shows relative times. */
  date: string;
  /**
   * How much of `date` is actually known. Zillow prints exact dates, so most
   * entries are `day`. Google prints only a relative age, and how coarse that
   * is depends on how old the review is:
   *
   *   `month` — pinned to a month, e.g. a recent "2 weeks ago".
   *   `year`  — all Google offered was "3 years ago". `date` is then the first
   *             of the closing month, and only its YEAR should be trusted.
   *
   * Google floors that label, so "3 years ago" means three-to-four years
   * elapsed — which is what lets a closing year be reconciled against it
   * rather than guessed. Nothing renders a review date today; this exists so a
   * later caller can tell precision from false precision.
   */
  datePrecision: "day" | "month" | "year";
  transaction?: ReviewTransaction;
  /**
   * Verbatim. Typos, capitalization, and the occasional phrase our own
   * styleguide bans all stay as posted — these are the client's words, not
   * ours, and CLAUDE.md §7 forbids altering testimonial wording.
   */
  body: string;
  /**
   * True when the review states a specific dollar figure or a quantified
   * financial outcome ("saved us thousands", "no seller concessions"). Any page
   * rendering one of these must carry <ResultsDisclaimer /> adjacent. §7.
   */
  statesDollarOutcome: boolean;
  /**
   * A material connection to Jasmine — family, a long friendship, anything the
   * FTC endorsement guides would want disclosed. Where the disclosure lives
   * inside the verbatim text, the review must run whole and must never be
   * pulled as an excerpt: cropping the quote strips the disclosure.
   */
  materialConnection?: string;
  /**
   * Other reviews of the same transaction — usually the second half of a
   * couple. Both are real and either may run, but never together on one page:
   * two accounts of one closing reads as padding.
   */
  sameTransactionAs?: readonly string[];
  /** The same review posted on the other platform. Recorded, not published. */
  crossPostedTo?: string;
  /** Editorial context for whoever is choosing reviews for a page. */
  note?: string;
  /**
   * Blocks publication until answered. `publishableReviews()` filters these
   * out, so an unresolved review sits in the dataset without risk of shipping.
   */
  openQuestion?: string;
  /**
   * Also blocks publication, but for a settled reason rather than an open one:
   * the question was asked, answered, and the answer was don't run it. Kept in
   * the dataset so nobody re-adds it later thinking it was an oversight.
   */
  withheld?: string;
  /** TODO(verify): permalink to the review. Wanted before launch. */
  sourceUrl?: string;
  /**
   * Reviewer-attached photo, recorded for provenance only. DO NOT RENDER.
   * These are googleusercontent CDN URLs — unstable, hotlink-hostile, and the
   * photograph belongs to the reviewer, not to us. If she wants images beside
   * reviews, get written permission and self-host, or use her own photography.
   */
  photoSourceUrl?: string;
};
