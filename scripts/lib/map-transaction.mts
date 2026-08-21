/**
 * Workbook row → `Transaction`.
 *
 * This module does the mechanical half of the import and refuses the editorial
 * half. Specifically it will NOT invent a `lever`: the lever line is where the
 * page's argument lives, and turning "$15,100 below list price" into "Purchased
 * under list price, with concessions covering foundation work the house needed"
 * is a writing decision, not a mapping. The importer surfaces the raw Highlights
 * and Concessions text as a suggestion for a human to rewrite, and leaves the
 * field off the generated row.
 *
 * Three things are dropped on the floor here and that is the point — see the
 * header of lib/transactions/data.ts. Street addresses, closing prices, and
 * client names never reach the `Transaction` type. Prices are routed to the
 * internal-metrics record instead; addresses and names are used only to derive
 * a neighborhood and to match a review, then discarded.
 */

import type { Transaction, TransactionPillar } from "../../lib/transactions/types.ts";
import type { WorkbookRow } from "./workbook.mts";

export type MappedRow = {
  transaction: Transaction;
  /** Everything the ledger may not carry, for ./internal-metrics.ts. */
  metrics: {
    transactionId: string;
    closingPrice: number;
    concessions?: number;
    belowList?: number;
  };
  /**
   * Raw workbook text a human should turn into a `lever`, or undefined when the
   * sheet recorded nothing to work from. Never written to the row directly.
   */
  leverSource?: string;
  /** Client name, used only to match a review. Never rendered, never stored. */
  clientName: string;
  /** Non-fatal observations about this row. */
  warnings: string[];
};

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const PROPERTY_TYPES: Record<string, Transaction["propertyType"]> = {
  sfh: "Single Family",
  "single family": "Single Family",
  "single-family": "Single Family",
  townhome: "Townhouse",
  townhouse: "Townhouse",
  condo: "Condo",
};

/** Values the sheet uses for "no builder", which must not become a builder name. */
const EMPTY_MARKERS = new Set(["", "n/a", "na", "none", "-", "n"]);

export function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isEmpty(value: string): boolean {
  return EMPTY_MARKERS.has(value.trim().toLowerCase());
}

/** "$21,929.70" / "3500 Seller Concessions" / "" → number | undefined */
export function parseMoney(value: string): number | undefined {
  const match = value.replace(/,/g, "").match(/\d+(\.\d+)?/);
  if (!match) return undefined;
  const amount = Number(match[0]);
  return Number.isFinite(amount) ? amount : undefined;
}

/**
 * "Purchased $14,540 below list price" → 14540. "$27k off of list price" → 27000.
 * Returns undefined when the Highlights text is not about list price at all,
 * and deliberately ignores ABOVE-list figures, which are a different fact and
 * would be wrong in a field named `belowList`.
 */
export function parseBelowList(highlights: string): number | undefined {
  if (!/below list|off of list|under list/i.test(highlights)) return undefined;
  const match = highlights.replace(/,/g, "").match(/\$?\s*(\d+(?:\.\d+)?)\s*(k\b)?/i);
  if (!match) return undefined;
  const amount = Number(match[1]) * (match[2] ? 1000 : 1);
  return Number.isFinite(amount) ? amount : undefined;
}

export class RowError extends Error {
  constructor(row: WorkbookRow, message: string) {
    super(`Sheet row ${row.lineNumber} (${row.clientName || "unnamed"}): ${message}`);
  }
}

function side(row: WorkbookRow): Transaction["side"] {
  const value = row.sellOrBuy.trim().toLowerCase();
  if (value.startsWith("buy")) return "buyer";
  if (value.startsWith("sell")) return "seller";
  if (value.startsWith("both")) return "both";
  throw new RowError(row, `cannot read "Sell or Buy" value "${row.sellOrBuy}".`);
}

/**
 * Pillars are derived only from columns the sheet actually records. Relocation
 * used to be inferable only from a review mentioning a move, which undercounted
 * it; the sheet now has a column, so this reads that and nothing else.
 *
 * `sellers` and `new-construction` follow from Side and New Build. The border
 * pillar is every South Carolina closing plus Waxhaw, which is the North
 * Carolina half of the same corridor (CLAUDE.md §5).
 */
function pillars(row: WorkbookRow, transactionSide: Transaction["side"]): TransactionPillar[] {
  const found: TransactionPillar[] = [];
  if (/^y/i.test(row.newBuild.trim())) found.push("new-construction");
  if (transactionSide === "seller" || transactionSide === "both") found.push("sellers");
  if (/^y/i.test(row.relocation.trim())) found.push("relocation");
  if (row.state.trim().toUpperCase() === "SC" || /waxhaw/i.test(row.city)) {
    found.push("carolinas-border");
  }
  return found;
}

/**
 * Builds the row. `usedIds` is mutated so repeat neighborhoods get -01, -02 in
 * the order the sheet lists them; pass the ids already in the dataset so a new
 * closing in an existing neighborhood does not collide with a shipped row.
 */
export function mapRow(row: WorkbookRow, usedIds: Set<string>): MappedRow {
  const warnings: string[] = [];

  const year = Number(row.closingYear.trim());
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new RowError(row, `cannot read closing year "${row.closingYear}".`);
  }

  const monthIndex = MONTHS.indexOf(row.closingMonth.trim().toLowerCase());
  if (monthIndex === -1 && row.closingMonth.trim() !== "") {
    throw new RowError(row, `cannot read closing month "${row.closingMonth}".`);
  }

  const state = row.state.trim().toUpperCase();
  if (state !== "NC" && state !== "SC") {
    throw new RowError(row, `state must be NC or SC, got "${row.state}".`);
  }

  const propertyType = PROPERTY_TYPES[row.propertyType.trim().toLowerCase()];
  if (!propertyType) {
    throw new RowError(row, `unrecognised property type "${row.propertyType}".`);
  }

  const city = row.city.trim();
  const rawNeighborhood = isEmpty(row.neighborhood) ? "" : row.neighborhood.trim();

  /* A street address in the Neighborhood column would publish where a client
     lives — the one rule this file exists to enforce. */
  if (/^\d+\s/.test(rawNeighborhood)) {
    throw new RowError(row, `neighborhood "${rawNeighborhood}" looks like a street address.`);
  }

  /* The sheet writes some neighborhoods as "X in Y" ("Piedmont Row in
     SouthPark"). That names a single complex, which is narrower than a
     neighborhood and narrows toward the buyer, so take the wider half. */
  const inMatch = rawNeighborhood.match(/^(.+?)\s+in\s+(.+)$/i);
  let neighborhood = rawNeighborhood;
  if (inMatch) {
    neighborhood = inMatch[2].trim();
    warnings.push(
      `neighborhood "${rawNeighborhood}" names a complex inside a neighborhood; ` +
        `imported as "${neighborhood}". Confirm that is the right level.`,
    );
  }

  const transactionSide = side(row);
  const base = `${year}-${slug(neighborhood || city)}`;
  let counter = 1;
  while (usedIds.has(`${base}-${String(counter).padStart(2, "0")}`)) counter += 1;
  const id = `${base}-${String(counter).padStart(2, "0")}`;
  usedIds.add(id);

  const builder = isEmpty(row.builder) ? undefined : row.builder.trim();
  if (builder && !/^y/i.test(row.newBuild.trim())) {
    warnings.push(`builder "${builder}" is set but New Build is not Y. Check which is right.`);
  }
  if (!builder && /^y/i.test(row.newBuild.trim())) {
    warnings.push("New Build is Y but no builder is named. The builder is the point of that row.");
  }

  const transaction: Transaction = {
    id,
    side: transactionSide,
    year,
    ...(monthIndex === -1 ? {} : { month: monthIndex + 1 }),
    ...(neighborhood && neighborhood.toLowerCase() !== city.toLowerCase()
      ? { neighborhood }
      : {}),
    city,
    state,
    propertyType,
    ...(builder ? { builder } : {}),
    pillars: pillars(row, transactionSide),
  };

  const closingPrice = parseMoney(row.closingPrice);
  if (closingPrice === undefined) {
    throw new RowError(row, `cannot read closing price "${row.closingPrice}".`);
  }

  const leverSource = [row.highlights.trim(), row.concessions.trim()]
    .filter((part) => part !== "")
    .join(" · ");

  return {
    transaction,
    metrics: {
      transactionId: id,
      closingPrice,
      ...(parseMoney(row.concessions) !== undefined
        ? { concessions: parseMoney(row.concessions) }
        : {}),
      ...(parseBelowList(row.highlights) !== undefined
        ? { belowList: parseBelowList(row.highlights) }
        : {}),
    },
    ...(leverSource ? { leverSource } : {}),
    clientName: row.clientName.trim(),
    warnings,
  };
}
