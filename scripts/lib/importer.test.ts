/**
 * @vitest-environment node
 *
 * Tests for the workbook importer.
 *
 * The importer's failure mode is not a crash — it is importing something
 * plausible and wrong, which then gets pasted into a licensed broker's
 * advertising. So these lean on the cases where that could happen quietly: a
 * column that moved, a review body full of commas, a neighborhood correction
 * that would otherwise read as a deletion plus an addition.
 */
import { describe, expect, it } from "vitest";

import { compare } from "./diff.mts";
import { mapRow, parseBelowList, parseMoney, slug } from "./map-transaction.mts";
import { parseCsv, parseMarkdownTable, parseWorkbook, WorkbookError } from "./workbook.mts";
import type { WorkbookRow } from "./workbook.mts";
import type { Transaction } from "../../lib/transactions/types";

const HEADER =
  "Client Name,Address,City,State,Closing Price,Closing Month,Closing Year,Sell or Buy," +
  "Property Type,Neighborhood,New Build (Y/N),Builder,Relocation,Concessions," +
  "Left Review (Y/N),Highlights,Reviews";

function csv(...rows: string[]): string {
  return [HEADER, ...rows].join("\n");
}

function row(overrides: Partial<WorkbookRow> = {}): WorkbookRow {
  return {
    lineNumber: 2,
    clientName: "A Client",
    address: "1 Example Street",
    city: "Charlotte",
    state: "NC",
    closingPrice: "$300,000",
    closingMonth: "April",
    closingYear: "2026",
    sellOrBuy: "Buy",
    propertyType: "SFH",
    neighborhood: "Example Park",
    newBuild: "N",
    builder: "N/A",
    relocation: "",
    concessions: "",
    leftReview: "N",
    highlights: "",
    reviews: "",
    ...overrides,
  };
}

describe("parseCsv", () => {
  it("keeps commas inside a quoted review body", () => {
    const [, record] = parseCsv('a,b\n"one, two",three');
    expect(record).toEqual(["one, two", "three"]);
  });

  it("handles doubled quotes and embedded newlines", () => {
    const [, record] = parseCsv('a,b\n"she said ""yes""","line one\nline two"');
    expect(record).toEqual(['she said "yes"', "line one\nline two"]);
  });

  it("strips the BOM Google Sheets exports", () => {
    expect(parseCsv("﻿Client Name,City")[0][0]).toBe("Client Name");
  });
});

describe("parseMarkdownTable", () => {
  /* The Drive connector returns Markdown, so this is the shape you get when the
     sheet is fetched by a tool rather than downloaded. */
  it("reads a pipe table and drops the alignment rule", () => {
    const table = parseMarkdownTable("| A | B |\n| :-: | :-: |\n| one | two |");
    expect(table).toEqual([
      ["A", "B"],
      ["one", "two"],
    ]);
  });

  it("unescapes the characters the converter escapes", () => {
    expect(parseMarkdownTable("| A |\n| great\\! |")[1][0]).toBe("great!");
  });
});

describe("parseWorkbook", () => {
  it("reads a row into the sheet's own vocabulary", () => {
    const [first] = parseWorkbook(
      csv("Jo,1 St,Fort Mill,SC,\"$485,000\",April,2026,Buy,SFH,English Trails,N,N/A,,,,,"),
    );
    expect(first.city).toBe("Fort Mill");
    expect(first.neighborhood).toBe("English Trails");
    expect(first.lineNumber).toBe(2);
  });

  /**
   * The whole reason this is strict. The sheet has been restructured twice, and
   * both times the quiet failure would have been importing under a header
   * nobody checked.
   */
  it("refuses a column it does not recognise", () => {
    expect(() => parseWorkbook("City,State,Mystery Column\nCharlotte,NC,x")).toThrow(WorkbookError);
  });

  it("refuses an export missing a required column", () => {
    expect(() => parseWorkbook("Client Name,City\nJo,Charlotte")).toThrow(/missing required/i);
  });

  it("tolerates the trailing spacer columns the sheet carries", () => {
    expect(() => parseWorkbook(`${HEADER},,\nJo,1 St,Charlotte,NC,$1,April,2026,Buy,SFH,P,N,,,,,,,,`))
      .not.toThrow();
  });
});

describe("mapRow", () => {
  it("maps the mechanical fields", () => {
    const { transaction } = mapRow(row(), new Set());
    expect(transaction).toMatchObject({
      side: "buyer",
      year: 2026,
      month: 4,
      neighborhood: "Example Park",
      city: "Charlotte",
      state: "NC",
      propertyType: "Single Family",
    });
  });

  /** The lever is editorial. The importer must never write one. */
  it("never produces a lever, only raw source text for a human", () => {
    const { transaction, leverSource } = mapRow(
      row({ highlights: "Purchased $15,100 below list price.", concessions: "$15066.91" }),
      new Set(),
    );
    expect(transaction.lever).toBeUndefined();
    expect(leverSource).toContain("15,100");
  });

  it("routes the closing price to metrics, never onto the row", () => {
    const { transaction, metrics } = mapRow(row({ closingPrice: "$707,990" }), new Set());
    expect(metrics.closingPrice).toBe(707990);
    expect(transaction).not.toHaveProperty("closingPrice");
  });

  it("never carries the address or the client name onto the row", () => {
    const { transaction } = mapRow(row(), new Set());
    expect(JSON.stringify(transaction)).not.toContain("Example Street");
    expect(JSON.stringify(transaction)).not.toContain("A Client");
  });

  /* The rule the ledger exists to respect: a buyer-side street address would
     publish where a client lives. */
  it("refuses a street address in the neighborhood column", () => {
    expect(() => mapRow(row({ neighborhood: "123 Main Street" }), new Set())).toThrow(
      /street address/i,
    );
  });

  it("widens a complex-inside-a-neighborhood to the neighborhood, and says so", () => {
    const { transaction, warnings } = mapRow(
      row({ neighborhood: "Piedmont Row in SouthPark" }),
      new Set(),
    );
    expect(transaction.neighborhood).toBe("SouthPark");
    expect(warnings.join(" ")).toMatch(/complex/i);
  });

  it("drops a neighborhood identical to the city", () => {
    const { transaction } = mapRow(
      row({ city: "Tega Cay", neighborhood: "Tega Cay" }),
      new Set(),
    );
    expect(transaction.neighborhood).toBeUndefined();
  });

  it("treats N/A as no builder rather than a builder named N/A", () => {
    expect(mapRow(row({ builder: "N/A" }), new Set()).transaction.builder).toBeUndefined();
  });

  describe("pillars", () => {
    it("tags new construction from the New Build column", () => {
      const { transaction } = mapRow(row({ newBuild: "Y", builder: "Kolter Homes" }), new Set());
      expect(transaction.pillars).toContain("new-construction");
    });

    it("tags sellers from the side", () => {
      expect(mapRow(row({ sellOrBuy: "Sell" }), new Set()).transaction.pillars).toContain("sellers");
    });

    /* Relocation used to be taggable only when a review happened to mention a
       move, which undercounted it. The column is the point. */
    it("tags relocation from the Relocation column", () => {
      const { transaction } = mapRow(row({ relocation: "Yes - From TN" }), new Set());
      expect(transaction.pillars).toContain("relocation");
    });

    it("tags the border pillar for South Carolina", () => {
      const { transaction } = mapRow(row({ state: "SC", city: "Fort Mill" }), new Set());
      expect(transaction.pillars).toContain("carolinas-border");
    });

    /* Waxhaw is the North Carolina half of the same corridor — CLAUDE.md §5. */
    it("tags the border pillar for Waxhaw, which is in NC", () => {
      const { transaction } = mapRow(row({ city: "Waxhaw" }), new Set());
      expect(transaction.pillars).toContain("carolinas-border");
    });
  });

  describe("ids", () => {
    it("derives {year}-{neighborhood}-{nn}", () => {
      expect(mapRow(row(), new Set()).transaction.id).toBe("2026-example-park-01");
    });

    it("falls back to the city when the sheet records no neighborhood", () => {
      expect(mapRow(row({ neighborhood: "N/A" }), new Set()).transaction.id).toBe(
        "2026-charlotte-01",
      );
    });

    it("counts up rather than colliding with an id already shipped", () => {
      const used = new Set(["2026-example-park-01"]);
      expect(mapRow(row(), used).transaction.id).toBe("2026-example-park-02");
    });
  });

  it("refuses input it cannot read rather than guessing", () => {
    expect(() => mapRow(row({ closingYear: "soon" }), new Set())).toThrow(/closing year/i);
    expect(() => mapRow(row({ propertyType: "Yurt" }), new Set())).toThrow(/property type/i);
    expect(() => mapRow(row({ state: "GA" }), new Set())).toThrow(/NC or SC/i);
    expect(() => mapRow(row({ sellOrBuy: "maybe" }), new Set())).toThrow(/Sell or Buy/i);
  });
});

describe("parseMoney and parseBelowList", () => {
  it("reads an amount out of the sheet's freeform concessions text", () => {
    expect(parseMoney("$21,929.70 seller concessions")).toBe(21929.7);
    expect(parseMoney("3500 Seller Concessions")).toBe(3500);
    expect(parseMoney("")).toBeUndefined();
  });

  it("reads a below-list figure, including the k shorthand", () => {
    expect(parseBelowList("Purchased $14,540 below list price")).toBe(14540);
    expect(parseBelowList("$27k off of list price")).toBe(27000);
  });

  /* An above-list figure is a different fact, and belowList would be a lie. */
  it("ignores an above-list figure", () => {
    expect(parseBelowList("Closed for 2k over list price")).toBeUndefined();
  });

  it("ignores highlights that are not about price at all", () => {
    expect(parseBelowList("Buyer possesion before close")).toBeUndefined();
  });
});

describe("compare", () => {
  function tx(overrides: Partial<Transaction> & { id: string }): Transaction {
    return {
      side: "buyer",
      year: 2026,
      month: 4,
      city: "Charlotte",
      state: "NC",
      propertyType: "Single Family",
      pillars: [],
      ...overrides,
    };
  }

  it("reports a genuinely new closing as added", () => {
    const diff = compare([], [tx({ id: "2026-a-01" })]);
    expect(diff.added).toHaveLength(1);
    expect(diff.removed).toHaveLength(0);
  });

  /**
   * The case this whole module exists for. Ids are derived from the
   * neighborhood, so a corrected name mints a different id for the same
   * closing. Matching on the id alone would report one deletion and one
   * addition — the report that gets a real correction thrown away.
   */
  it("sees a renamed neighborhood as a change, not a delete plus an add", () => {
    const before = tx({ id: "2022-montclaire-01", neighborhood: "Montclaire" });
    const after = tx({ id: "2022-oakwood-acres-01", neighborhood: "Oakwood Acres" });
    const diff = compare([before], [after]);

    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(0);
    expect(diff.changed).toHaveLength(1);
    expect(diff.changed[0].changes).toEqual([
      { field: "neighborhood", before: "Montclaire", after: "Oakwood Acres" },
    ]);
  });

  it("keeps the shipped id on a changed row so the metrics join survives", () => {
    const diff = compare(
      [tx({ id: "2022-montclaire-01", neighborhood: "Montclaire" })],
      [tx({ id: "2022-oakwood-acres-01", neighborhood: "Oakwood Acres" })],
    );
    expect(diff.changed[0].incoming.id).toBe("2022-montclaire-01");
    expect(diff.idRemap.get("2022-oakwood-acres-01")).toBe("2022-montclaire-01");
  });

  it("does not flag a hand-written lever as drift", () => {
    const diff = compare(
      [tx({ id: "2026-a-01", lever: "A carefully written line." })],
      [tx({ id: "2026-a-01" })],
    );
    expect(diff.changed).toHaveLength(0);
    expect(diff.unchanged).toBe(1);
  });

  it("pairs two closings in one city and month by neighborhood", () => {
    const existing = [
      tx({ id: "2022-x-01", neighborhood: "X" }),
      tx({ id: "2022-y-01", neighborhood: "Y" }),
    ];
    const diff = compare(existing, [
      tx({ id: "2022-y-01", neighborhood: "Y", propertyType: "Condo" }),
      tx({ id: "2022-x-01", neighborhood: "X" }),
    ]);
    expect(diff.changed).toHaveLength(1);
    expect(diff.changed[0].existing.neighborhood).toBe("Y");
  });

  it("reports a shipped row missing from the export", () => {
    const diff = compare([tx({ id: "2026-a-01" })], []);
    expect(diff.removed.map((r) => r.id)).toEqual(["2026-a-01"]);
  });
});

describe("slug", () => {
  it("handles ampersands and punctuation", () => {
    expect(slug("Clover / Lake Wylie")).toBe("clover-lake-wylie");
    expect(slug("Tim & Julie")).toBe("tim-and-julie");
  });
});
