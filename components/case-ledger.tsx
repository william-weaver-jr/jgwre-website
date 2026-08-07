/**
 * The ledger treatment for transaction outcomes.
 *
 * `<dl>` markup is deliberate: these are term/value pairs, not a table and not a
 * list of features. Figures are tabular so the column aligns like a ledger — they
 * read as evidence, not marketing.
 *
 * docs/CASE-STUDIES.md: do not round, restate, or amplify. $22,210 stays $22,210.
 * No animated counters, no oversized badges. Restraint is the point.
 */

export type LedgerEntry = { term: string; value: string };

export function CaseLedger({
  entries,
  className = "",
}: {
  entries: readonly LedgerEntry[];
  className?: string;
}) {
  return (
    <dl className={`divide-y divide-border border-y border-border ${className}`}>
      {entries.map((entry) => (
        <div key={entry.term} className="flex items-baseline justify-between gap-6 py-3.5">
          <dt className="text-base">{entry.term}</dt>
          <dd className="figure-plain text-lg">{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/*
  The three documented cases. Single source of truth so the figures cannot drift
  between the home page and the pillar pages that reference them.

  Numbering matches docs/CASE-STUDIES.md — NOT display order. The home page leads
  with `CONDITION` because it is the most surprising, not the biggest; that is a
  presentation decision, and it does not renumber the cases.
*/

/** Case 1 — resale: price, cash, and position in one contract. */
export const CASE_RESALE: readonly LedgerEntry[] = [
  { term: "Below list price", value: "$20,000" },
  { term: "Seller-paid concessions", value: "$22,210" },
  { term: "Immediate equity at closing", value: "$34,000" },
];

/** Case 2 — resale: zero dollars off price, all value in condition. */
export const CASE_CONDITION: readonly LedgerEntry[] = [
  { term: "Roof", value: "Brand new" },
  { term: "HVAC", value: "Serviced" },
  { term: "Home warranty", value: "Included" },
  { term: "Refrigerator", value: "Included" },
];

/** Case 3 — new construction: the builder's own money. */
export const CASE_NEW_CONSTRUCTION: readonly LedgerEntry[] = [
  { term: "Builder incentives", value: "$50,000" },
  { term: "Closing costs paid", value: "3%" },
  { term: "Refrigerator", value: "Included" },
];
