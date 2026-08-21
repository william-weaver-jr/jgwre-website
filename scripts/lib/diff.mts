/**
 * Comparing a fresh workbook import against the shipped dataset.
 *
 * Matching is the whole difficulty. Ids are derived from year + neighborhood,
 * so a corrected neighborhood produces a DIFFERENT id for the same closing —
 * and that has already happened: Montclaire became Oakwood Acres, Prosperity
 * Village became Katelyn Moors, Rock Hill's Oakwood Acres became Midbrook. An
 * id-only match would have reported each of those as one deletion plus one
 * addition, which is the report that gets a real correction thrown away.
 *
 * So rows are matched on what does not change when a name is corrected: the
 * year, the month, the side, and the city.
 */

import type { Transaction } from "../../lib/transactions/types.ts";

export type FieldChange = { field: string; before: unknown; after: unknown };

export type Comparison = {
  added: Transaction[];
  changed: { existing: Transaction; incoming: Transaction; changes: FieldChange[] }[];
  /** In the dataset but not in this export. Usually a workbook edit, sometimes a mistake. */
  removed: Transaction[];
  unchanged: number;
  /**
   * Provisional id → shipped id, for every row that matched an existing closing.
   *
   * Ids are derived before the diff can know whether a row is new, so an
   * existing closing is provisionally numbered as though it were another one in
   * the same neighborhood (-02). Callers reporting on a row must translate
   * through this, or they will print an id that does not exist.
   */
  idRemap: Map<string, string>;
};

/** Year, month, side, city — stable across the renames the sheet keeps making. */
function identity(row: Transaction): string {
  return [row.year, row.month ?? "?", row.side, row.city.toLowerCase()].join("|");
}

/**
 * Fields compared for drift. `id` is excluded deliberately: it is derived, so
 * comparing it would report every neighborhood correction twice. `lever` is
 * excluded because it is written by hand and the importer never produces one —
 * comparing them would flag every curated row as changed forever.
 */
const COMPARED: (keyof Transaction)[] = [
  "side",
  "year",
  "month",
  "neighborhood",
  "city",
  "state",
  "propertyType",
  "builder",
  "pillars",
];

function equal(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);
  }
  return a === b;
}

export function compare(
  existing: readonly Transaction[],
  incoming: readonly Transaction[],
): Comparison {
  const buckets = new Map<string, Transaction[]>();
  for (const row of existing) {
    const key = identity(row);
    buckets.set(key, [...(buckets.get(key) ?? []), row]);
  }

  const added: Transaction[] = [];
  const changed: Comparison["changed"] = [];
  const matched = new Set<Transaction>();
  const idRemap = new Map<string, string>();
  let unchanged = 0;

  for (const row of incoming) {
    const bucket = buckets.get(identity(row)) ?? [];
    /* Prefer the same neighborhood, so two closings in one city and month pair
       up correctly; otherwise take the first unmatched row in the bucket. */
    const match =
      bucket.find((c) => !matched.has(c) && c.neighborhood === row.neighborhood) ??
      bucket.find((c) => !matched.has(c));

    if (!match) {
      added.push(row);
      continue;
    }

    matched.add(match);
    if (row.id !== match.id) idRemap.set(row.id, match.id);
    const changes = COMPARED.flatMap((field) =>
      equal(match[field], row[field])
        ? []
        : [{ field: String(field), before: match[field], after: row[field] }],
    );
    /* An existing closing keeps its shipped id even when a field moved. Ids are
       derived from the neighborhood, so a corrected name would otherwise mint a
       second id for a row already on the site — and the internal-metrics join,
       which is keyed on id, would break for a row that merely got a better
       spelling. Only genuinely new rows take a freshly derived id. */
    if (changes.length > 0) {
      changed.push({ existing: match, incoming: { ...row, id: match.id }, changes });
    } else unchanged += 1;
  }

  return {
    added,
    changed,
    removed: existing.filter((row) => !matched.has(row)),
    unchanged,
    idRemap,
  };
}
