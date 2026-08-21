/**
 * Checks that run over the dataset as it stands, plus anything about to join it.
 *
 * These overlap the vitest suites on purpose, and the difference is WHEN they
 * speak. The tests fail after the code is written; these run before it is, on
 * rows that only exist in the importer's memory, so a problem is caught while
 * it is still a line in a spreadsheet rather than a diff to unpick.
 */

import { REVIEWS } from "../../lib/reviews/data.ts";
import { TRANSACTION_METRICS } from "../../lib/transactions/internal-metrics.ts";
import type { Transaction } from "../../lib/transactions/types.ts";

export type Problem = { level: "error" | "warning"; message: string };

/** Reviews cleared to appear on the site — mirrors publishableReviews(). */
const PUBLISHABLE = new Set(
  REVIEWS.filter((review) => !review.openQuestion && !review.withheld).map((r) => r.id),
);
const ALL_REVIEWS = new Set(REVIEWS.map((review) => review.id));

export function checkDataset(rows: readonly Transaction[]): Problem[] {
  const problems: Problem[] = [];

  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.id)) problems.push({ level: "error", message: `duplicate id "${row.id}".` });
    seen.add(row.id);

    /* §7: no dollar figure on a lever without the results disclaimer beside it,
       which this page does not carry. */
    if (row.lever && /\$\s?[\d,]/.test(row.lever)) {
      problems.push({ level: "error", message: `${row.id}: lever contains a dollar figure.` });
    }

    /* The street-address rule. A buyer-side row would publish where a client lives. */
    if (row.neighborhood && /^\d+\s/.test(row.neighborhood)) {
      problems.push({
        level: "error",
        message: `${row.id}: neighborhood "${row.neighborhood}" looks like a street address.`,
      });
    }

    if (row.reviewId) {
      if (!ALL_REVIEWS.has(row.reviewId)) {
        problems.push({
          level: "error",
          message: `${row.id}: reviewId "${row.reviewId}" matches no review.`,
        });
      } else if (!PUBLISHABLE.has(row.reviewId)) {
        /* Not an error — publishableReviewById() suppresses the link, so the
           page is correct. But a reviewId that renders nothing is usually a
           surprise to whoever wrote it. */
        problems.push({
          level: "warning",
          message:
            `${row.id}: reviewId "${row.reviewId}" is gated, so no link renders. ` +
            `Intentional on some rows — check the comment.`,
        });
      }
    }

    if (row.builder && !row.pillars.includes("new-construction")) {
      problems.push({
        level: "warning",
        message: `${row.id}: names a builder but is not tagged new-construction.`,
      });
    }
  }

  /* Every metrics row must point at a transaction that exists, or the numbers
     behind the §5 stat block are quietly orphaned. */
  for (const metric of TRANSACTION_METRICS) {
    if (!seen.has(metric.transactionId)) {
      problems.push({
        level: "error",
        message: `internal-metrics references unknown transaction "${metric.transactionId}".`,
      });
    }
  }
  for (const row of rows) {
    if (!TRANSACTION_METRICS.some((m) => m.transactionId === row.id)) {
      problems.push({ level: "warning", message: `${row.id}: no closing price recorded.` });
    }
  }

  return problems;
}

/**
 * Suggests a reviewId by matching a client name against review bylines.
 *
 * Only a suggestion. The bylines and the workbook names disagree constantly and
 * for good reasons — a couple buys and one of them writes ("Cha'Ray & Calvin
 * Bland" posts as "ChaRay Bland"), platforms generate handles, and one reviewer
 * deliberately shortened her own name. Every match still wants a human.
 */
export function suggestReview(clientName: string): string[] {
  const surnames = clientName
    .split(/[,&]|\band\b/i)
    .flatMap((part) => part.trim().split(/\s+/).slice(-1))
    .map((name) => name.toLowerCase())
    .filter((name) => name.length > 2);

  return REVIEWS.filter((review) => {
    const author = review.author.toLowerCase();
    return surnames.some((surname) => author.includes(surname));
  }).map((review) => review.id);
}
