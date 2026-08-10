/**
 * ============================================================================
 * PLACEHOLDER ROWS. NOT REAL TRANSACTIONS. NEVER RENDERED IN PRODUCTION.
 * ============================================================================
 *
 * These exist so the page can be looked at and judged before the export
 * arrives. The gate is in ./index.ts: production builds get `TRANSACTIONS`
 * (empty) and these are unreachable. In development the page renders them under
 * an unmissable banner.
 *
 * Two rules held while writing them, both from CLAUDE.md §6:
 *
 * 1. NO DOLLAR FIGURES. Not one. A fabricated number is the single most
 *    damaging thing that could leak off this page, so none exist to leak.
 *    The `lever` lines name the KIND of thing negotiated and stop there.
 *
 * 2. The one row carrying a `reviewId` is not invented. Its neighborhood, city,
 *    state, property type, year, and side are copied from that review's own
 *    stated metadata in lib/reviews — a client publicly describing her own
 *    closing. It is here to exercise the review join with something truthful.
 *
 * Markets are drawn from the list in CLAUDE.md §5. Delete this file once
 * data.ts is populated.
 */

import type { Transaction } from "./types";

export const SAMPLE_TRANSACTIONS: readonly Transaction[] = [
  {
    id: "sample-1",
    isSample: true,
    side: "buyer",
    year: 2026,
    neighborhood: "Berewick",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    builder: "Copper Builders",
    pillars: ["new-construction"],
    lever: "Builder incentives and closing costs, plus appliances written into the contract.",
  },
  {
    /**
     * Mirrors zillow-sophie-fox exactly — her own published description of her
     * own sale. Demonstrates the review join without inventing anything.
     */
    id: "sample-2",
    isSample: true,
    side: "seller",
    year: 2026,
    city: "Fort Mill",
    state: "SC",
    propertyType: "Single Family",
    pillars: ["sellers", "carolinas-border"],
    lever: "Multiple offers inside 48 hours; chose the one with the better terms, not the top number.",
    reviewId: "zillow-sophie-fox",
  },
  {
    id: "sample-3",
    isSample: true,
    side: "buyer",
    year: 2025,
    neighborhood: "Baxter Village",
    city: "Fort Mill",
    state: "SC",
    propertyType: "Townhouse",
    pillars: ["relocation", "carolinas-border"],
    lever: "Out-of-state buyer. Rate buydown funded by the seller.",
  },
  {
    id: "sample-4",
    isSample: true,
    side: "both",
    year: 2025,
    neighborhood: "Ayrsley",
    city: "Charlotte",
    state: "NC",
    propertyType: "Townhouse",
    pillars: ["sellers", "relocation"],
    lever: "Sold and bought on the same timeline, so neither closing waited on the other.",
  },
  {
    id: "sample-5",
    isSample: true,
    side: "buyer",
    year: 2024,
    neighborhood: "Tega Cay",
    city: "Tega Cay",
    state: "SC",
    propertyType: "Single Family",
    builder: "David Weekley Homes",
    pillars: ["new-construction", "carolinas-border"],
    lever: "Walkthrough punch list resolved before closing rather than promised after it.",
  },
  {
    id: "sample-6",
    isSample: true,
    side: "seller",
    year: 2024,
    neighborhood: "Steele Creek",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    pillars: ["sellers"],
    lever: "Inspection response negotiated line by line — repairs, credits, and declines.",
  },
];
