/**
 * @vitest-environment node
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { SAMPLE_TRANSACTIONS } from "./sample";
import {
  TRANSACTIONS,
  filterByPillar,
  groupByYear,
  locationLabel,
  sideLabel,
  sortTransactions,
  visibleTransactions,
} from "./index";
import type { Transaction } from "./types";

function transaction(overrides: Partial<Transaction> & { id: string }): Transaction {
  return {
    side: "buyer",
    year: 2024,
    city: "Fort Mill",
    state: "SC",
    propertyType: "Single Family",
    pillars: [],
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("visibleTransactions", () => {
  /**
   * The gate that matters: sample rows are fabricated transactions on a licensed
   * broker's site. They may never reach production. lib/transactions/index.ts
   * and docs/TRANSACTIONS-SPEC.md.
   */
  it("returns nothing and flags nothing in production while the export is missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(visibleTransactions()).toEqual({ rows: [], isSample: false });
  });

  it("returns the placeholders in development, always marked as samples", () => {
    vi.stubEnv("NODE_ENV", "development");
    const { rows, isSample } = visibleTransactions();
    expect(isSample).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it("marks every placeholder row isSample in the data itself", () => {
    for (const row of SAMPLE_TRANSACTIONS) expect(row.isSample).toBe(true);
  });

  it("still returns nothing in test, which is neither development nor a real export", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(visibleTransactions().rows).toEqual([]);
  });
});

describe("sortTransactions", () => {
  it("puts the newest year first", () => {
    const rows = [transaction({ id: "a", year: 2022 }), transaction({ id: "b", year: 2025 })];
    expect(sortTransactions(rows).map((r) => r.id)).toEqual(["b", "a"]);
  });

  it("breaks ties on month, newest first", () => {
    const rows = [
      transaction({ id: "jan", year: 2024, month: 1 }),
      transaction({ id: "nov", year: 2024, month: 11 }),
    ];
    expect(sortTransactions(rows).map((r) => r.id)).toEqual(["nov", "jan"]);
  });

  it("sorts a row with no month below one that has one in the same year", () => {
    const rows = [
      transaction({ id: "unknown", year: 2024 }),
      transaction({ id: "march", year: 2024, month: 3 }),
    ];
    expect(sortTransactions(rows).map((r) => r.id)).toEqual(["march", "unknown"]);
  });

  it("does not mutate its input", () => {
    const rows = [transaction({ id: "a", year: 2022 }), transaction({ id: "b", year: 2025 })];
    sortTransactions(rows);
    expect(rows.map((r) => r.id)).toEqual(["a", "b"]);
  });
});

describe("groupByYear", () => {
  it("buckets rows into years, newest year first", () => {
    const groups = groupByYear([
      transaction({ id: "a", year: 2023 }),
      transaction({ id: "b", year: 2025 }),
      transaction({ id: "c", year: 2023 }),
    ]);

    expect(groups.map((g) => g.year)).toEqual([2025, 2023]);
    expect(groups[1].rows.map((r) => r.id)).toEqual(["a", "c"]);
  });

  it("returns an empty list for no rows", () => {
    expect(groupByYear([])).toEqual([]);
  });
});

describe("filterByPillar", () => {
  const rows = [
    transaction({ id: "nc", pillars: ["new-construction"] }),
    transaction({ id: "border", pillars: ["carolinas-border", "relocation"] }),
    transaction({ id: "none", pillars: [] }),
  ];

  it("returns every row when no pillar is selected", () => {
    expect(filterByPillar(rows, null)).toHaveLength(3);
  });

  it("matches a row carrying the pillar among several", () => {
    expect(filterByPillar(rows, "relocation").map((r) => r.id)).toEqual(["border"]);
  });

  it("returns nothing when no row matches", () => {
    expect(filterByPillar(rows, "sellers")).toEqual([]);
  });
});

describe("sideLabel", () => {
  /** Always stated, never inferred — implying she listed a home she did not is misleading. */
  it("states the side she represented in plain words", () => {
    expect(sideLabel("buyer")).toBe("Represented the buyer");
    expect(sideLabel("seller")).toBe("Represented the seller");
    expect(sideLabel("both")).toBe("Represented both sides");
  });
});

describe("locationLabel", () => {
  it("renders neighborhood, city, state", () => {
    expect(
      locationLabel(transaction({ id: "a", neighborhood: "Baxter Village" })),
    ).toBe("Baxter Village, Fort Mill, SC");
  });

  it("degrades to city and state when there is no neighborhood", () => {
    expect(locationLabel(transaction({ id: "a" }))).toBe("Fort Mill, SC");
  });

  it("drops a neighborhood identical to the city", () => {
    expect(
      locationLabel(transaction({ id: "a", city: "Tega Cay", neighborhood: "Tega Cay" })),
    ).toBe("Tega Cay, SC");
  });

  it("compares case-insensitively", () => {
    expect(
      locationLabel(transaction({ id: "a", city: "Tega Cay", neighborhood: "tega cay" })),
    ).toBe("Tega Cay, SC");
  });
});

describe("the transactions dataset", () => {
  it("has unique ids", () => {
    const ids = TRANSACTIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * §7 and the spec: no dollar figures on a lever unless the transaction is
   * documented in docs/CASE-STUDIES.md and the page carries the disclaimer.
   * This catches a figure pasted straight out of an MLS export.
   */
  it("carries no dollar figures on any lever line", () => {
    for (const row of [...TRANSACTIONS, ...SAMPLE_TRANSACTIONS]) {
      expect(row.lever ?? "").not.toMatch(/\$\s?[\d,]/);
    }
  });

  it("never records a street address in the neighborhood field", () => {
    for (const row of [...TRANSACTIONS, ...SAMPLE_TRANSACTIONS]) {
      expect(row.neighborhood ?? "").not.toMatch(/^\d+\s/);
    }
  });

  it("uses only NC and SC", () => {
    for (const row of [...TRANSACTIONS, ...SAMPLE_TRANSACTIONS]) {
      expect(["NC", "SC"]).toContain(row.state);
    }
  });

  it("has no status field, which is blocked pending BIC approval", () => {
    for (const row of [...TRANSACTIONS, ...SAMPLE_TRANSACTIONS]) {
      expect(row).not.toHaveProperty("status");
    }
  });
});
