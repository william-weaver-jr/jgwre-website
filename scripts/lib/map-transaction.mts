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

import { MARKETS } from "../../lib/areas/markets.ts";
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

/**
 * A number followed by a street suffix — "123 Main Street", not "1315 East
 * Condominium". Shared with checks.ts so the two street-address checks (one
 * at import time, one over the shipped dataset) cannot drift into disagreeing
 * about what counts as an address, the way plain `/^\d+\s/` and this used to.
 */
export function looksLikeStreetAddress(value: string): boolean {
  return /^\d+\s+\S.*\b(street|st|drive|dr|road|rd|lane|ln|way|court|ct|circle|cir|avenue|ave|boulevard|blvd|place|pl|parkway|pkwy|trail|loop)\.?\s*$/i.test(
    value,
  );
}

function isEmpty(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  /* The sheet also writes "None / Acreage" and "None / Rural Acreage" for a
     subdivision it has nothing finer to say about — not in EMPTY_MARKERS
     verbatim, but the same fact. */
  return EMPTY_MARKERS.has(trimmed) || /^none\b/.test(trimmed);
}

/**
 * §5 market whose name exactly matches the city, or the workbook's Neighborhood
 * or Geographical Submarket cell, in the same state as this closing.
 *
 * Exact only, deliberately: adjacent labels are common in this sheet ("North
 * Charlotte" beside "Northwest Charlotte") and a fuzzy match would fold one
 * into the other. This mirrors the by-hand rule that has governed every
 * `market` assignment so far — city IS the market, or a workbook column names
 * the market exactly — so it can be applied automatically without becoming a
 * new kind of guess.
 */
function marketMatch(row: WorkbookRow): string | undefined {
  const state = row.state.trim().toUpperCase();
  const candidates = [row.city, row.neighborhood, row.geoSubmarket]
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value !== "");
  const market = MARKETS.find(
    (m) => m.state === state && candidates.includes(m.name.toLowerCase()),
  );
  return market?.slug;
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
  /* The ledger's `neighborhood` field is the sheet's Subdivision column — the
     finest of the three tiers, and the one the ledger has always stored under
     that name, back to when it was the sheet's only location column. The
     coarser Neighborhood and Geographical Submarket columns are read only for
     `marketMatch`, above; they are never written to the row. */
  const rawNeighborhood = isEmpty(row.subdivision) ? "" : row.subdivision.trim();

  /* A street address in the Subdivision column would publish where a client
     lives — the one rule this file exists to enforce. Requiring a street
     suffix (not just a leading number) avoids a false positive on something
     like "1315 East Condominium" — a building name, not an address, and the
     kind of edge case that street-address matching alone cannot tell apart
     from "1315 East Boulevard". */
  if (looksLikeStreetAddress(rawNeighborhood)) {
    throw new RowError(row, `subdivision "${rawNeighborhood}" looks like a street address.`);
  }

  /* Legacy pattern from before the three-tier split: "Piedmont Row in
     SouthPark" named a single complex inside a neighborhood in one column.
     Kept defensively in case the sheet ever collapses the columns again. */
  const inMatch = rawNeighborhood.match(/^(.+?)\s+in\s+(.+)$/i);
  let neighborhood = rawNeighborhood;
  if (inMatch) {
    neighborhood = inMatch[2].trim();
    warnings.push(
      `subdivision "${rawNeighborhood}" names a complex inside a neighborhood; ` +
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
    ...(marketMatch(row) ? { market: marketMatch(row) } : {}),
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
