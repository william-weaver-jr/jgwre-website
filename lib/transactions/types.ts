/**
 * Transaction schema. See docs/TRANSACTIONS-SPEC.md for the reasoning behind
 * every constraint below — most of them are compliance decisions, not modeling
 * preferences.
 *
 * Like the reviews schema, this is the eventual CMS document type: serializable,
 * no JSX, no functions.
 */

/** Matches the pillar routes in lib/site.ts. Powers the filters and cross-links. */
export type TransactionPillar =
  | "new-construction"
  | "sellers"
  | "relocation"
  | "carolinas-border";

export type Transaction = {
  id: string;
  /**
   * Which side she represented. Always rendered. Implying she listed a home she
   * did not list is misleading advertising, so this is never inferred or omitted.
   */
  side: "buyer" | "seller" | "both";
  /** Closing year. Month optional — only if the export carries it. */
  year: number;
  month?: number;
  /**
   * Neighborhood level, never a street address on a buyer-side transaction.
   * Publishing the address of a home a client just bought publishes where that
   * client lives, which is the same line the abbreviated review bylines drew.
   */
  neighborhood?: string;
  city: string;
  state: "NC" | "SC";
  propertyType: "Single Family" | "Townhouse" | "Condo";
  /** Named on new-construction entries — the ten-builder list is a real moat. */
  builder?: string;
  pillars: readonly TransactionPillar[];
  /**
   * One factual line about what was negotiated. This is the USP column and the
   * reason the page is not just a list of houses.
   *
   * NO DOLLAR FIGURES unless the transaction is documented in
   * docs/CASE-STUDIES.md, and then the page must carry <ResultsDisclaimer />.
   * South Carolina is a non-disclosure state: SC sold prices are not public
   * record and may not appear at all without written client permission.
   */
  lever?: string;
  /** Joins to lib/reviews when a published review describes this closing. */
  reviewId?: string;
  /**
   * Her own photography only. Listing photos belong to the listing photographer
   * or the listing brokerage, and on a buyer-side deal that is another firm.
   * Nothing from the MLS, Zillow, or the team site. Rows render fine without.
   */
  photo?: { src: string; alt: string; width: number; height: number };
  /**
   * Set on the placeholder rows in ./sample.ts. Production never renders these —
   * see the gate in ./index.ts.
   */
  isSample?: boolean;
};

/*
  Deliberately no `status` field.

  The active / pending / coming-soon states are blocked pending written BIC
  approval — docs/TRANSACTIONS-SPEC.md §2. Adding the field before the decision
  invites someone to populate it. When it is approved, it lands here, the filter
  chips gain a state row, and nothing else about this page has to change.
*/
