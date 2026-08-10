/**
 * Completed transactions — one source of truth, many renderers.
 *
 * The page is built and working; `./data.ts` is empty until the Follow Up Boss
 * or MLS export arrives. See docs/TRANSACTIONS-SPEC.md.
 */

import { TRANSACTIONS } from "./data";
import { SAMPLE_TRANSACTIONS } from "./sample";
import type { Transaction, TransactionPillar } from "./types";

export { TRANSACTIONS } from "./data";
export type { Transaction, TransactionPillar } from "./types";

/**
 * The only function a page should call.
 *
 * Returns the real rows. When there are none AND this is a development build,
 * returns the placeholders instead so the layout can be judged — the page
 * renders a banner whenever it is showing them.
 *
 * `NODE_ENV` is inlined at build time, so a production bundle contains the
 * `[]` branch and the sample rows are unreachable. There is no env var or
 * query string that turns them on in production, deliberately: a fabricated
 * transaction on a licensed broker's site is not a risk worth a preview flag.
 */
export function visibleTransactions(): { rows: readonly Transaction[]; isSample: boolean } {
  if (TRANSACTIONS.length > 0) return { rows: TRANSACTIONS, isSample: false };
  if (process.env.NODE_ENV === "development") {
    return { rows: SAMPLE_TRANSACTIONS, isSample: true };
  }
  return { rows: [], isSample: false };
}

/** Newest first, then by month where the export supplied one. */
export function sortTransactions(rows: readonly Transaction[]): Transaction[] {
  return [...rows].sort((a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0));
}

/** Grouped into year buckets for the ledger's year headings. */
export function groupByYear(rows: readonly Transaction[]): { year: number; rows: Transaction[] }[] {
  const buckets = new Map<number, Transaction[]>();
  for (const row of sortTransactions(rows)) {
    const bucket = buckets.get(row.year);
    if (bucket) bucket.push(row);
    else buckets.set(row.year, [row]);
  }
  return [...buckets.entries()].map(([year, yearRows]) => ({ year, rows: yearRows }));
}

export function filterByPillar(
  rows: readonly Transaction[],
  pillar: TransactionPillar | null,
): Transaction[] {
  if (!pillar) return [...rows];
  return rows.filter((row) => row.pillars.includes(pillar));
}

/** "Represented the buyer" — always stated, never inferred. */
export function sideLabel(side: Transaction["side"]): string {
  if (side === "buyer") return "Represented the buyer";
  if (side === "seller") return "Represented the seller";
  return "Represented both sides";
}

/**
 * "Baxter Village, Fort Mill, SC" — degrades to city and state.
 *
 * Drops a neighborhood identical to the city, which the exports produce for
 * small municipalities: Tega Cay is both, and "Tega Cay, Tega Cay, SC" reads
 * like a bug because it is one.
 */
export function locationLabel(row: Transaction): string {
  const neighborhood =
    row.neighborhood && row.neighborhood.toLowerCase() !== row.city.toLowerCase()
      ? row.neighborhood
      : undefined;
  return [neighborhood, row.city, row.state].filter(Boolean).join(", ");
}
