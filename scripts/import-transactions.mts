/**
 * Import the closed-transactions workbook and report what changed.
 *
 *   npm run import:transactions -- ~/Downloads/Closed\ Transactions.csv
 *
 * Get the CSV from the sheet: File → Download → Comma-separated values.
 *
 * THIS SCRIPT DOES NOT WRITE lib/transactions/data.ts, and that is a decision
 * rather than an unfinished edge. Two parts of every row are editorial:
 *
 *   The lever, which is where the page's argument lives. "$15,100 below list
 *   price" is a fact; "Purchased under list price, with concessions covering
 *   foundation work the house needed" is the same fact made to argue. Only the
 *   second belongs on the page and only a person can write it.
 *
 *   The compliance calls. Whether a review may run, whether a figure drags the
 *   results disclaimer in, whether a neighborhood is too narrow — CLAUDE.md §7,
 *   read by someone who has read it.
 *
 * So it does the mechanical half completely and hands over the rest: paste the
 * generated rows into data.ts, write the levers, wire the reviews.
 */

import { readFileSync } from "node:fs";

import { TRANSACTIONS } from "../lib/transactions/data.ts";
import type { Transaction } from "../lib/transactions/types.ts";
import { checkDataset, suggestReview, type Problem } from "./lib/checks.mts";
import { compare } from "./lib/diff.mts";
import { mapRow, type MappedRow } from "./lib/map-transaction.mts";
import { parseWorkbook } from "./lib/workbook.mts";

const BOLD = "[1m";
const DIM = "[2m";
const RED = "[31m";
const YELLOW = "[33m";
const GREEN = "[32m";
const OFF = "[0m";

function heading(text: string): void {
  console.log(`\n${BOLD}${text}${OFF}`);
}

/** Renders one row as the source a person will paste into data.ts. */
function render(mapped: MappedRow): string {
  const { transaction: row } = mapped;
  const lines = [
    "  {",
    `    id: ${JSON.stringify(row.id)},`,
    `    side: ${JSON.stringify(row.side)},`,
    `    year: ${row.year},`,
  ];
  if (row.month !== undefined) lines.push(`    month: ${row.month},`);
  if (row.neighborhood) lines.push(`    neighborhood: ${JSON.stringify(row.neighborhood)},`);
  lines.push(`    city: ${JSON.stringify(row.city)},`);
  lines.push(`    state: ${JSON.stringify(row.state)},`);
  lines.push(`    propertyType: ${JSON.stringify(row.propertyType)},`);
  if (row.builder) lines.push(`    builder: ${JSON.stringify(row.builder)},`);
  lines.push(`    pillars: [${row.pillars.map((p) => JSON.stringify(p)).join(", ")}],`);

  if (mapped.leverSource) {
    lines.push(`    /* TODO(lever): from the sheet — ${mapped.leverSource}`);
    lines.push(`       Rewrite as one factual line. No dollar figures. */`);
  }

  const suggestions = mapped.clientName ? suggestReview(mapped.clientName) : [];
  if (suggestions.length === 1) {
    lines.push(`    /* TODO(review): likely ${suggestions[0]} — confirm it is the same closing. */`);
  } else if (suggestions.length > 1) {
    lines.push(`    /* TODO(review): candidates — ${suggestions.join(", ")} */`);
  }

  lines.push("  },");
  return lines.join("\n");
}

function renderMetric(mapped: MappedRow): string {
  const parts = [`transactionId: ${JSON.stringify(mapped.metrics.transactionId)}`,
    `closingPrice: ${mapped.metrics.closingPrice}`];
  if (mapped.metrics.concessions !== undefined) {
    parts.push(`concessions: ${mapped.metrics.concessions}`);
  }
  if (mapped.metrics.belowList !== undefined) {
    parts.push(`belowList: ${mapped.metrics.belowList}`);
  }
  return `  { ${parts.join(", ")} },`;
}

function report(problems: Problem[]): number {
  const errors = problems.filter((p) => p.level === "error");
  const warnings = problems.filter((p) => p.level === "warning");
  for (const problem of errors) console.log(`  ${RED}error${OFF}   ${problem.message}`);
  for (const problem of warnings) console.log(`  ${YELLOW}warning${OFF} ${problem.message}`);
  return errors.length;
}

function main(): void {
  const path = process.argv[2];
  if (!path) {
    console.error(
      "Usage: npm run import:transactions -- <path-to-csv>\n\n" +
        "Export the sheet with File → Download → Comma-separated values.",
    );
    process.exit(2);
  }

  let mapped: MappedRow[];
  try {
    const rows = parseWorkbook(readFileSync(path, "utf8"));
    /* Seed with the shipped ids so a new closing in an existing neighborhood
       gets -02 rather than colliding with a row already on the site. */
    const usedIds = new Set(TRANSACTIONS.map((row) => row.id));
    mapped = rows.map((row) => mapRow(row, usedIds));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n${RED}Import failed.${OFF} ${message}\n`);
    process.exit(1);
  }

  console.log(`\nRead ${BOLD}${mapped.length}${OFF} rows from ${path}`);

  const incoming = mapped.map((m) => m.transaction);
  const diff = compare(TRANSACTIONS, incoming);

  heading("Summary");
  console.log(
    `  ${GREEN}${diff.added.length} new${OFF} · ` +
      `${YELLOW}${diff.changed.length} changed${OFF} · ` +
      `${RED}${diff.removed.length} missing from the export${OFF} · ` +
      `${DIM}${diff.unchanged} unchanged${OFF}`,
  );

  if (diff.changed.length > 0) {
    heading("Changed — the sheet disagrees with what is shipped");
    for (const { existing, changes } of diff.changed) {
      console.log(`  ${BOLD}${existing.id}${OFF}`);
      for (const change of changes) {
        console.log(
          `    ${change.field}: ${DIM}${JSON.stringify(change.before)}${OFF} → ` +
            `${JSON.stringify(change.after)}`,
        );
      }
    }
    console.log(
      `\n  ${DIM}The workbook is the closing record and normally wins. Note the${OFF}\n` +
        `  ${DIM}correction inline so nobody reverses it later.${OFF}`,
    );
  }

  if (diff.removed.length > 0) {
    heading("In the dataset, absent from this export");
    for (const row of diff.removed) console.log(`  ${row.id}`);
    console.log(
      `\n  ${DIM}Usually a sheet edit. Check before deleting anything — a shipped${OFF}\n` +
        `  ${DIM}row that vanished is more likely a workbook slip than a real removal.${OFF}`,
    );
  }

  if (diff.added.length > 0) {
    const byId = new Map(mapped.map((m) => [m.transaction.id, m]));
    heading(`New rows — paste into lib/transactions/data.ts`);
    console.log(
      `${DIM}Levers are left as TODO on purpose; write them by hand. See the header${OFF}\n` +
        `${DIM}of this script for why.${OFF}\n`,
    );
    for (const row of diff.added) console.log(render(byId.get(row.id)!));

    heading("Matching entries for lib/transactions/internal-metrics.ts");
    for (const row of diff.added) console.log(renderMetric(byId.get(row.id)!));
  }

  /* mapRow derives a provisional id before the diff can know whether a row is
     new, so an existing closing gets numbered as though it were another one in
     the same neighborhood. Translate through the diff's remap so the report
     never prints an id that will not exist. */
  const rowWarnings = mapped.flatMap((m) =>
    m.warnings.map((message) => ({
      level: "warning" as const,
      message: `${diff.idRemap.get(m.transaction.id) ?? m.transaction.id}: ${message}`,
    })),
  );

  heading("Checks");
  /* Checked against the dataset as it would be AFTER the import, so a problem
     shows up before the row is written rather than after. */
  const merged: Transaction[] = [
    ...TRANSACTIONS.filter((row) => !diff.changed.some((c) => c.existing.id === row.id)),
    ...diff.changed.map((c) => c.incoming),
    ...diff.added,
  ];
  const errors = report([...rowWarnings, ...checkDataset(merged)]);
  if (rowWarnings.length === 0 && errors === 0) console.log(`  ${GREEN}no errors${OFF}`);

  console.log("");
  if (errors > 0) process.exit(1);
}

main();
