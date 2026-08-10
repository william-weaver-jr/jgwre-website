/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";

import {
  REVIEWS,
  dedupeByTransaction,
  displayName,
  needsResultsDisclaimer,
  publishableReviews,
  quotableReviews,
  reviewById,
} from "./index";
import type { Review } from "./types";

/**
 * Two suites here, and they answer different questions.
 *
 * The first tests the query functions against fixtures. The second tests the
 * real dataset — the publication gates in CLAUDE.md §7 are only as good as the
 * data behind them, and a testimonial that ships when it should not is a
 * compliance failure, not a rendering bug.
 */

function review(overrides: Partial<Review> & { id: string }): Review {
  return {
    author: "Test Client",
    rating: 5,
    platform: "google",
    postedOn: "Google",
    date: "2024-01-01",
    datePrecision: "day",
    body: "She was great.",
    statesDollarOutcome: false,
    ...overrides,
  };
}

describe("displayName", () => {
  it("shortens to first name and last initial", () => {
    expect(displayName(review({ id: "a", author: "Brittany Turner" }))).toBe("Brittany T.");
  });

  it("title-cases a lowercase first name", () => {
    expect(displayName(review({ id: "a", author: "brittany turner" }))).toBe("Brittany T.");
  });

  it("uses the last token for the initial on a three-part name", () => {
    expect(displayName(review({ id: "a", author: "Ana Maria Reyes" }))).toBe("Ana R.");
  });

  it("tolerates extra whitespace", () => {
    expect(displayName(review({ id: "a", author: "  Ana   Reyes  " }))).toBe("Ana R.");
  });

  it("returns a single-token byline unchanged", () => {
    expect(displayName(review({ id: "a", author: "jazzyb1990" }))).toBe("jazzyb1990");
  });

  it("never emits the full surname", () => {
    expect(displayName(review({ id: "a", author: "Brittany Turner" }))).not.toContain("Turner");
  });
});

describe("publishableReviews", () => {
  it("keeps a cleared review", () => {
    expect(publishableReviews([review({ id: "ok" })]).map((r) => r.id)).toEqual(["ok"]);
  });

  it("filters out a review with an unresolved open question", () => {
    const set = [review({ id: "ok" }), review({ id: "blocked", openQuestion: "Is this her?" })];
    expect(publishableReviews(set).map((r) => r.id)).toEqual(["ok"]);
  });

  it("filters out a withheld review", () => {
    const set = [review({ id: "ok" }), review({ id: "no", withheld: "Client asked us not to" })];
    expect(publishableReviews(set).map((r) => r.id)).toEqual(["ok"]);
  });
});

describe("quotableReviews", () => {
  it("excludes a review carrying a material connection, since an excerpt drops the disclosure", () => {
    const set = [review({ id: "ok" }), review({ id: "cousin", materialConnection: "Her cousin" })];
    expect(quotableReviews(set).map((r) => r.id)).toEqual(["ok"]);
  });

  it("still applies the publication gates", () => {
    const set = [review({ id: "blocked", openQuestion: "?" })];
    expect(quotableReviews(set)).toEqual([]);
  });
});

describe("needsResultsDisclaimer", () => {
  it("is true when any review in the set states a dollar outcome", () => {
    expect(
      needsResultsDisclaimer([review({ id: "a" }), review({ id: "b", statesDollarOutcome: true })]),
    ).toBe(true);
  });

  it("is false for a set with none", () => {
    expect(needsResultsDisclaimer([review({ id: "a" })])).toBe(false);
    expect(needsResultsDisclaimer([])).toBe(false);
  });
});

describe("dedupeByTransaction", () => {
  it("drops the second account of a transaction already represented", () => {
    const set = [review({ id: "a", sameTransactionAs: ["b"] }), review({ id: "b" })];
    expect(dedupeByTransaction(set).map((r) => r.id)).toEqual(["a"]);
  });

  it("prefers whichever came first in the input", () => {
    const set = [
      review({ id: "b", sameTransactionAs: ["a"] }),
      review({ id: "a", sameTransactionAs: ["b"] }),
    ];
    expect(dedupeByTransaction(set).map((r) => r.id)).toEqual(["b"]);
    expect(dedupeByTransaction([...set].reverse()).map((r) => r.id)).toEqual(["a"]);
  });

  /**
   * The filter only claims ids the reviews it has already kept point at, so a
   * one-sided link drops the pair only in one input order. The dataset declares
   * both directions — asserted below — which is what makes this order-independent.
   */
  it("needs the link declared on both reviews to work in either order", () => {
    const oneSided = [review({ id: "b" }), review({ id: "a", sameTransactionAs: ["b"] })];
    expect(dedupeByTransaction(oneSided)).toHaveLength(2);
  });

  it("leaves unrelated reviews alone", () => {
    const set = [review({ id: "a" }), review({ id: "b" }), review({ id: "c" })];
    expect(dedupeByTransaction(set)).toHaveLength(3);
  });
});

describe("reviewById", () => {
  it("finds a review in the real dataset", () => {
    expect(reviewById(REVIEWS[0].id)?.id).toBe(REVIEWS[0].id);
  });

  it("returns undefined for an unknown id", () => {
    expect(reviewById("nope")).toBeUndefined();
  });
});

/* -------------------------------------------------------------------------- */

describe("the reviews dataset", () => {
  it("is not empty", () => {
    expect(REVIEWS.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = REVIEWS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a non-empty verbatim body on every entry", () => {
    for (const r of REVIEWS) expect(r.body.trim().length).toBeGreaterThan(0);
  });

  it("has a parseable ISO date on every entry", () => {
    for (const r of REVIEWS) {
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(r.date))).toBe(false);
    }
  });

  it("points every sameTransactionAs at a review that exists", () => {
    const ids = new Set(REVIEWS.map((r) => r.id));
    for (const r of REVIEWS) {
      for (const id of r.sameTransactionAs ?? []) expect(ids).toContain(id);
    }
  });

  /**
   * Both halves of a pair must name each other, or `dedupeByTransaction` drops
   * the duplicate in one input order and not the other — and the failure mode is
   * two accounts of one closing on one page.
   */
  it("declares every sameTransactionAs link in both directions", () => {
    const byId = new Map(REVIEWS.map((r) => [r.id, r]));
    for (const r of REVIEWS) {
      for (const id of r.sameTransactionAs ?? []) {
        expect(
          byId.get(id)?.sameTransactionAs ?? [],
          `${id} does not link back to ${r.id}`,
        ).toContain(r.id);
      }
    }
  });

  it("gives every publishable review a byline that shortens to two tokens", () => {
    for (const r of publishableReviews()) {
      expect(displayName(r).split(/\s+/)).toHaveLength(2);
    }
  });

  it("blocks every review that is not cleared, for a stated reason", () => {
    const blocked = REVIEWS.filter((r) => !publishableReviews([r]).length);
    for (const r of blocked) {
      expect((r.openQuestion ?? r.withheld ?? "").trim().length).toBeGreaterThan(0);
    }
  });

  /**
   * §7: reviewer photos are recorded for provenance and must never render.
   * The renderer honours that today; this asserts nothing in the data invites
   * a future component to reach for it as if it were a local asset.
   */
  it("never stores a reviewer photo as anything but an external provenance URL", () => {
    for (const r of REVIEWS) {
      if (r.photoSourceUrl) expect(r.photoSourceUrl).toMatch(/^https?:\/\//);
    }
  });
});
