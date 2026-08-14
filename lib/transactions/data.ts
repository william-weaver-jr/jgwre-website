/**
 * Completed transactions — the real dataset.
 *
 * EMPTY ON PURPOSE. CLAUDE.md §6 forbids inventing transactions, and a
 * transactions page carrying three plausible-looking placeholder rows argues
 * against her rather than for her.
 *
 * The page, the row component, the filters, and the year grouping are all built
 * and working against this array. Populating it is the only remaining step —
 * nothing about the layout has to change.
 *
 * ---------------------------------------------------------------------------
 * What the export needs, per row (docs/TRANSACTIONS-SPEC.md §4):
 *
 *   closing year (and month if available)
 *   side represented — buyer, seller, or both
 *   neighborhood, city, state
 *   property type
 *   builder, on new construction
 *   the negotiation lever, where she remembers it — one factual line, no dollars
 *
 * Source is Follow Up Boss or the MLS. The same pull settles the CLAUDE.md §12
 * open item about refreshing the §5 stat block, so it is one ask serving two.
 *
 * Do not add a row from memory, from Instagram, or from a review. A review
 * describing a closing is evidence that it happened, not a record of its
 * details — link it with `reviewId` once the real row exists.
 * ---------------------------------------------------------------------------
 */

import type { Transaction } from "./types";

export const TRANSACTIONS: readonly Transaction[] = [
  {
    /* id convention: `{year}-{neighborhood-slug}-{nn}`. Stable, readable, and it
       sorts usefully in a diff. The counter suffix exists because she has closed
       in Aveline at Coulwood more than once. */
    id: "2022-aveline-at-coulwood-01",
    side: "buyer",
    year: 2022,
    /* Closing month. Under contract February 2022, closed April 2022 — the gap
       is the build. The schema records the closing only, because that is what
       the ledger sorts and groups on. */
    month: 4,
    neighborhood: "Aveline at Coulwood",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    /* Aveline at Coulwood is the community; JCB Urban is the builder.
       jcburban.com. Not among the ten in CLAUDE.md §5 — that list is not
       exhaustive, and this page is where it stops being a list. */
    builder: "JCB Urban",
    pillars: ["new-construction"],
    /* A hot market and the winning offer went over asking. Deliberately not
       marketed: it is a dollar outcome, it would drag <ResultsDisclaimer /> onto
       the row, and "paid more than asking" is not a lever that recommends her. */
    lever:
      "The client would consider no other community. Multiple offers on the homesite; this one was accepted.",
    reviewId: "zillow-saquanna-carter",
  },
];
