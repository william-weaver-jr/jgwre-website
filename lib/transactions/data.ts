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

export const TRANSACTIONS: readonly Transaction[] = [];
