/**
 * ============================================================================
 * INTERNAL ONLY. NEVER IMPORT THIS FROM app/ OR components/.
 * ============================================================================
 *
 * Closing prices and negotiated amounts from the closed-transactions workbook,
 * kept so the numbers survive somewhere queryable — for refreshing the CLAUDE.md
 * §5 stat block, and for the price-band idea parked in §12.
 *
 * They are deliberately NOT part of the `Transaction` type. A price field on
 * the rendered schema is a field someone eventually renders, and three separate
 * rules say it should not be:
 *
 *   1. SOUTH CAROLINA IS A NON-DISCLOSURE STATE. The SC rows marked below are
 *      not public record. Publishing one discloses a client's private financial
 *      information without written per-transaction permission. They are here as
 *      her own business record; that is the only reason they may exist at all.
 *   2. CLAUDE.md §7 requires <ResultsDisclaimer /> adjacent to every displayed
 *      dollar outcome. Thirty-odd rows of prices is a stat wall wearing a disclaimer.
 *   3. docs/TRANSACTIONS-SPEC.md §1 settles the default as no prices, with
 *      dollar figures confined to the case studies and reviews where they are
 *      documented and disclaimed.
 *
 * A test asserts nothing under app/ or components/ imports this module. If you
 * need a number on a page, that is a decision for the Broker-in-Charge, not an
 * import.
 *
 * `belowList` is what the workbook's Highlights column recorded as the gap to
 * list price; `concessions` is seller-paid money at closing. Absent means the
 * workbook recorded none, not that none existed.
 */

export type TransactionMetrics = {
  /** Joins to the `id` of a row in ./data.ts. */
  transactionId: string;
  closingPrice: number;
  concessions?: number;
  belowList?: number;
  /** Anything else the workbook recorded that has no column of its own. */
  note?: string;
};

export const TRANSACTION_METRICS: readonly TransactionMetrics[] = [
  /* 2026 */
  {
    transactionId: "2026-annsborough-park-01",
    closingPrice: 707990,
    concessions: 21929.7,
    belowList: 27000,
    /* Seller-funded 2-1 buydown: 2.87% year one, 3.87% year two, 4.87% for the
       remainder. Recorded here because it is the substance of that row's lever
       and nowhere else keeps the numbers. */
    note: "2-1 rate buydown at 2.87 / 3.87 / 4.87 percent, seller paid.",
  },

  { transactionId: "2026-turtle-rock-01", closingPrice: 345000 },
  { transactionId: "2026-trinity-park-01", closingPrice: 250000 },
  /* SOUTH CAROLINA — non-disclosure. */
  { transactionId: "2026-edgewater-01", closingPrice: 360000, concessions: 5000 },
  { transactionId: "2026-windsor-park-01", closingPrice: 309900, concessions: 15066.91, belowList: 15100 },
  { transactionId: "2026-charlotte-01", closingPrice: 400000 },
  { transactionId: "2026-providence-plantation-01", closingPrice: 895000, concessions: 20477.46, belowList: 5000 },
  { transactionId: "2026-wynfield-forest-01", closingPrice: 582500 },
  /* SOUTH CAROLINA — non-disclosure. */
  {
    transactionId: "2026-masons-bend-01",
    closingPrice: 901000,
    note: "Closed 2,000 ABOVE list — the only over-list figure in the set, and a seller-side one, so belowList would be the wrong field.",
  },
  { transactionId: "2026-sloan-station-01", closingPrice: 264000 },
  { transactionId: "2026-beverly-crest-02", closingPrice: 380000 },
  { transactionId: "2026-shannon-park-02", closingPrice: 305000 },
  /* SOUTH CAROLINA — non-disclosure. */
  { transactionId: "2026-english-trails-01", closingPrice: 485000, concessions: 10500 },

  /* 2024 */
  /* SOUTH CAROLINA — non-disclosure. Internal reference only. */
  { transactionId: "2024-patriots-crossing-01", closingPrice: 519000 },
  { transactionId: "2024-loso-terraces-01", closingPrice: 740000 },
  { transactionId: "2024-cresswind-01", closingPrice: 500000 },

  /* 2023 */
  { transactionId: "2023-the-providence-01", closingPrice: 745000 },
  { transactionId: "2023-moores-chapel-village-01", closingPrice: 380000 },
  { transactionId: "2023-brownes-ferry-01", closingPrice: 396000 },
  { transactionId: "2023-preston-park-01", closingPrice: 455000, concessions: 11950, belowList: 14540 },
  /* SOUTH CAROLINA — non-disclosure. */
  { transactionId: "2023-lancaster-01", closingPrice: 267200 },
  { transactionId: "2023-riverfront-01", closingPrice: 540000, concessions: 10000, belowList: 9900 },
  { transactionId: "2023-waterlyn-01", closingPrice: 370000 },
  /* SOUTH CAROLINA — non-disclosure. */
  { transactionId: "2023-walnut-creek-01", closingPrice: 535100 },
  { transactionId: "2023-concord-01", closingPrice: 355000 },
  { transactionId: "2023-shopton-point-01", closingPrice: 399550, concessions: 15013 },
  { transactionId: "2023-mountainbrook-01", closingPrice: 600000, concessions: 11250 },
  /* SOUTH CAROLINA — non-disclosure. */
  { transactionId: "2023-lexington-commons-01", closingPrice: 259900, concessions: 5000 },
  { transactionId: "2023-easthaven-01", closingPrice: 385000, belowList: 14900 },

  /* 2022 */
  { transactionId: "2022-carlton-hills-01", closingPrice: 340000, belowList: 12800 },
  { transactionId: "2022-easthaven-01", closingPrice: 350000, concessions: 7000, belowList: 10000 },
  { transactionId: "2022-katelyn-moors-01", closingPrice: 400000, concessions: 3500, belowList: 15000 },
  { transactionId: "2022-southpark-01", closingPrice: 280000, belowList: 15000 },
  { transactionId: "2022-park-place-01", closingPrice: 202000 },
  /* SOUTH CAROLINA — non-disclosure. */
  { transactionId: "2022-midbrook-01", closingPrice: 330000 },
  { transactionId: "2022-fieldlark-trails-01", closingPrice: 275000 },
  { transactionId: "2022-aveline-at-coulwood-01", closingPrice: 300000 },
  { transactionId: "2022-aveline-at-coulwood-02", closingPrice: 351000 },
  { transactionId: "2022-hunters-pointe-01", closingPrice: 327000, concessions: 8000 },
  { transactionId: "2022-shannon-park-01", closingPrice: 375000, concessions: 2500 },
  { transactionId: "2022-belle-vista-01", closingPrice: 330000 },
  { transactionId: "2022-oakwood-acres-01", closingPrice: 460000, concessions: 4500 },
  { transactionId: "2022-dilworth-01", closingPrice: 260000, concessions: 3000, belowList: 38500 },
  { transactionId: "2022-beverly-crest-01", closingPrice: 295000, concessions: 2500 },
];
