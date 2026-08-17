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
 *   1. SOUTH CAROLINA IS A NON-DISCLOSURE STATE. The Rock Hill figure below is
 *      not public record. Publishing it discloses a client's private financial
 *      information without written per-transaction permission. It is here as
 *      her own business record; that is the only reason it may exist at all.
 *   2. CLAUDE.md §7 requires <ResultsDisclaimer /> adjacent to every displayed
 *      dollar outcome. Eight rows of prices is a stat wall wearing a disclaimer.
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
};

export const TRANSACTION_METRICS: readonly TransactionMetrics[] = [
  { transactionId: "2022-dilworth-01", closingPrice: 260000, concessions: 3000, belowList: 38500 },
  { transactionId: "2022-montclaire-01", closingPrice: 460000, concessions: 4500 },
  { transactionId: "2022-aveline-at-coulwood-02", closingPrice: 351000 },
  { transactionId: "2022-dallas-01", closingPrice: 327000, concessions: 8000 },
  { transactionId: "2022-shannon-park-01", closingPrice: 375000, concessions: 2500 },
  /* SOUTH CAROLINA — non-disclosure. Internal reference only. */
  { transactionId: "2022-oakwood-acres-01", closingPrice: 330000 },
  { transactionId: "2022-southpark-01", closingPrice: 280000, belowList: 15000 },
  { transactionId: "2022-prosperity-village-01", closingPrice: 400000, concessions: 3500, belowList: 15000 },
  { transactionId: "2022-carlton-hills-01", closingPrice: 340000, belowList: 12800 },
];
