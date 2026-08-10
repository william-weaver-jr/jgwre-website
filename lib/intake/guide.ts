/**
 * The lead magnet: the published list, and the title derived from it.
 *
 * READ THIS BEFORE TOUCHING THE COUNT. There are two lists in this module and
 * they are not the same thing:
 *
 *   - NEGOTIABLE_ITEMS (below) is what a visitor reads on /negotiation. The
 *     number in the title counts these.
 *   - LEVERS in ./levers.ts is the rule engine that matches intake answers to
 *     the levers plausibly on one specific house. It is longer, because several
 *     entries are branch-specific variants of the same published item.
 *
 * Counting LEVERS and retitling the guide to match would put a number in the
 * title that the page does not deliver. CONTENT-PLAN.md: "The number in the
 * title should match the actual count in the guide... Never inflate to hit a
 * rounder number." A number in a title is a claim (CLAUDE.md §6).
 *
 * The title is computed from NEGOTIABLE_ITEMS so the two can never drift. Add
 * or remove an item and every surface retitles itself. Never hardcode it.
 * tests/compliance.test.tsx asserts the title and the list agree.
 */

export const NEGOTIABLE_ITEMS: readonly string[] = [
  "Roof replacement",
  "HVAC service or replacement",
  "Home warranty",
  "Appliances, including the refrigerator",
  "Seller-paid closing costs",
  "Interest rate buydown",
  "Repair credits in lieu of repairs",
  "Inspection and due diligence timelines",
  "Due diligence fee amount",
  "Earnest money amount and terms",
  "Closing date",
  "Possession date and post-closing occupancy",
  "Rent-back terms",
  "Survey and its cost",
  "Termite and wood-infestation report",
  "Septic, well, and water testing",
  "Title and attorney fee allocation",
  "Builder incentives and upgrade allowances",
  "Which lender or title company is used",
];

export const ITEM_COUNT = NEGOTIABLE_ITEMS.length;

const NUMBER_WORDS: Record<number, string> = {
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
  21: "twenty-one",
  22: "twenty-two",
  23: "twenty-three",
  24: "twenty-four",
  25: "twenty-five",
};

/**
 * Spelled form, for prose. Falls back to the numeral rather than throwing — a
 * missing word should not take a page down, and the test catches it first.
 */
export const ITEM_COUNT_WORD: string = NUMBER_WORDS[ITEM_COUNT] ?? String(ITEM_COUNT);

export const GUIDE_TITLE = `The ${ITEM_COUNT} Things Besides Price You Can Negotiate`;

/** Metadata and compact CTAs, where the leading article reads as clutter. */
export const GUIDE_TITLE_SHORT = `${ITEM_COUNT} Things Besides Price You Can Negotiate`;
