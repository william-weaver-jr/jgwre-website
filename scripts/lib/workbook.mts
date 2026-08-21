/**
 * Parsing the closed-transactions workbook.
 *
 * The sheet is the business record. This module turns one CSV export of it into
 * typed rows, and it is deliberately strict: a column it does not recognise is
 * an error, not a shrug. The sheet has already been restructured twice —
 * Neighborhood and Property Type appeared in one revision, Relocation and a
 * reordered Client Name column in another — and each time the silent failure
 * mode would have been importing garbage under a plausible-looking header.
 */

/** One row of the sheet, still in the sheet's own vocabulary. */
export type WorkbookRow = {
  /** 1-based row number in the sheet, for error messages that a human can act on. */
  lineNumber: number;
  clientName: string;
  address: string;
  city: string;
  state: string;
  closingPrice: string;
  closingMonth: string;
  closingYear: string;
  sellOrBuy: string;
  propertyType: string;
  neighborhood: string;
  newBuild: string;
  builder: string;
  relocation: string;
  concessions: string;
  leftReview: string;
  highlights: string;
  reviews: string;
};

/**
 * Header text as it appears in the sheet, mapped to the field it fills.
 *
 * Matching is case-insensitive and whitespace-collapsed, because the sheet is
 * hand-maintained and "Closing Month " has had a trailing space more than once.
 */
const COLUMNS: Record<string, keyof WorkbookRow> = {
  "client name": "clientName",
  address: "address",
  city: "city",
  state: "state",
  "closing price": "closingPrice",
  "closing month": "closingMonth",
  "closing year": "closingYear",
  "sell or buy": "sellOrBuy",
  "property type": "propertyType",
  neighborhood: "neighborhood",
  "new build (y/n)": "newBuild",
  builder: "builder",
  relocation: "relocation",
  concessions: "concessions",
  "left review (y/n)": "leftReview",
  highlights: "highlights",
  reviews: "reviews",
};

/** Columns that must exist for an import to mean anything. */
const REQUIRED: (keyof WorkbookRow)[] = [
  "city",
  "state",
  "closingMonth",
  "closingYear",
  "sellOrBuy",
  "propertyType",
];

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * A CSV reader that handles quoted fields, embedded commas, embedded newlines,
 * and doubled quotes.
 *
 * Written out rather than pulled in because the review bodies in this sheet are
 * long, quoted, full of commas, and occasionally contain newlines — which is
 * exactly the input that a naive `split(",")` mangles and that a dependency
 * would be overkill for.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // Strip a UTF-8 BOM; Google Sheets exports one and it corrupts the first header.
  const input = text.replace(/^﻿/, "").replace(/\r\n/g, "\n");

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  // Whatever is buffered when the input ends is a final field, unless the file
  // ended on a newline and left nothing behind.
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export class WorkbookError extends Error {}

/**
 * Read a Markdown pipe table into the same shape `parseCsv` produces.
 *
 * Supported because the Google Drive connector hands back Markdown rather than
 * CSV, so this is what you get when the sheet is fetched through a tool instead
 * of downloaded by hand. Cell text is unescaped for the `\!` and `\#` that the
 * converter introduces.
 */
export function parseMarkdownTable(text: string): string[][] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    /* Drop the |:-:|:-:| alignment rule, which is layout rather than data. */
    .filter((line) => !/^\|[\s:|-]+\|$/.test(line))
    .map((line) =>
      line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.replace(/\\([!#|*_])/g, "$1").trim()),
    );
}

/** Markdown if the first non-empty line is a pipe row, CSV otherwise. */
export function parseTable(text: string): string[][] {
  const firstLine = text.split("\n").find((line) => line.trim() !== "") ?? "";
  return firstLine.trim().startsWith("|") ? parseMarkdownTable(text) : parseCsv(text);
}

/**
 * Turn a CSV export or a Markdown table into typed rows.
 *
 * Throws on an unrecognised or missing column rather than importing under a
 * header nobody checked.
 */
export function parseWorkbook(source: string): WorkbookRow[] {
  const table = parseTable(source).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (table.length === 0) throw new WorkbookError("The workbook export is empty.");

  const header = table[0];
  const mapping: (keyof WorkbookRow | null)[] = header.map((cell) => {
    const key = normalizeHeader(cell);
    if (key === "") return null; // trailing spacer columns; the sheet has several
    const field = COLUMNS[key];
    if (!field) {
      throw new WorkbookError(
        `Unrecognised column "${cell.trim()}". The sheet's shape changed — update COLUMNS in ` +
          `scripts/lib/workbook.ts so the new column is imported deliberately rather than dropped.`,
      );
    }
    return field;
  });

  const present = new Set(mapping.filter(Boolean) as (keyof WorkbookRow)[]);
  const missing = REQUIRED.filter((field) => !present.has(field));
  if (missing.length > 0) {
    throw new WorkbookError(`The export is missing required columns: ${missing.join(", ")}.`);
  }

  return table.slice(1).map((cells, index) => {
    const row: Record<string, string | number> = { lineNumber: index + 2 };
    for (const field of Object.values(COLUMNS)) row[field] = "";
    mapping.forEach((field, column) => {
      if (field) row[field] = (cells[column] ?? "").trim();
    });
    return row as unknown as WorkbookRow;
  });
}
