import type { IntakeQuestion, Side } from "./types";

/**
 * Step 1. Five options, one tap, no personal information.
 *
 * Deliberately first: the visitor commits before being asked for anything they'd
 * hesitate over, and a drop-off here still tells us intent. Name-and-email-first
 * inverts that and is what every sibling site does.
 */
export const SIDES: readonly { value: Side; label: string; note: string }[] = [
  { value: "buying", label: "Buying", note: "A first home, a next one, or an investment" },
  { value: "selling", label: "Selling", note: "Listing a home you own" },
  { value: "both", label: "Both", note: "Selling one and buying the next" },
  { value: "relocating", label: "Relocating here", note: "Moving to Charlotte from out of state" },
  { value: "deciding", label: "Still deciding", note: "Working out whether this is the year" },
];

/**
 * Market groups rather than the fourteen individual markets in CLAUDE.md §5 — a
 * fourteen-chip row is a scroll, not a tap. The specific names ride along as help
 * text so the reader still sees their own town.
 *
 * The border group repeats §5's line verbatim. Waxhaw sits in that list there and
 * stays in it here; the group is named for the pillar, not for a state, so nothing
 * on screen asserts which side of the line it falls on.
 */
const MARKET_OPTIONS = [
  {
    value: "in-town-charlotte",
    label: "In-town Charlotte",
  },
  {
    value: "south-charlotte",
    label: "South Charlotte",
  },
  {
    value: "carolinas-border",
    label: "The NC/SC border",
  },
  { value: "unsure", label: "Not sure yet" },
] as const;

const MARKET_HELP =
  "In-town: Uptown, South End, LoSo, Dilworth, Myers Park · South Charlotte: Ballantyne, SouthPark, Pineville, Steele Creek · Border: Fort Mill, Tega Cay, Indian Land, Lake Wylie, Waxhaw";

const TIMELINE_OPTIONS = [
  { value: "30-days", label: "Within 30 days" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "researching", label: "6+ months, still researching" },
] as const;

const markets: IntakeQuestion = {
  id: "markets",
  label: "Where are you looking?",
  help: MARKET_HELP,
  multi: true,
  options: MARKET_OPTIONS,
};

const timelineBuy: IntakeQuestion = {
  id: "timeline",
  label: "When would you want to be in it?",
  options: TIMELINE_OPTIONS,
};

const timelineSell: IntakeQuestion = {
  id: "timeline",
  label: "When would you want it on the market?",
  options: TIMELINE_OPTIONS,
};

const propertyType: IntakeQuestion = {
  id: "propertyType",
  label: "New construction or resale?",
  help: "Different table, different levers. Builders negotiate every day of the week.",
  options: [
    { value: "new-construction", label: "New construction" },
    { value: "resale", label: "Resale" },
    { value: "both", label: "Open to either" },
    { value: "unsure", label: "Not sure yet" },
  ],
};

const lender: IntakeQuestion = {
  id: "lender",
  label: "Where are you on financing?",
  options: [
    { value: "pre-approved", label: "Pre-approved" },
    { value: "talking", label: "Talking to lenders" },
    { value: "not-yet", label: "Haven’t started" },
    { value: "cash", label: "Paying cash" },
  ],
};

const sellerMarket: IntakeQuestion = {
  id: "markets",
  label: "Where is the home?",
  help: MARKET_HELP,
  multi: true,
  options: MARKET_OPTIONS,
};

const valuation: IntakeQuestion = {
  id: "valuation",
  label: "Have you had it valued?",
  options: [
    { value: "recent", label: "Yes, recently" },
    { value: "old", label: "A while ago" },
    { value: "none", label: "Not yet" },
    { value: "avm", label: "Only an online estimate" },
  ],
};

const fromWhere: IntakeQuestion = {
  id: "movingFrom",
  label: "Where are you moving from?",
  help: "Optional. It changes which parts of the process will feel unfamiliar.",
  text: true,
};

/**
 * Step 2, per branch. Three or four questions each — every one is something she
 * would ask on the call anyway, and every one is skippable in the UI.
 */
export const BRANCHES: Readonly<Record<Side, readonly IntakeQuestion[]>> = {
  buying: [propertyType, markets, timelineBuy, lender],
  selling: [sellerMarket, timelineSell, valuation],
  both: [sellerMarket, timelineSell, propertyType, lender],
  relocating: [fromWhere, markets, timelineBuy, lender],
  deciding: [markets, timelineBuy],
};

/**
 * Lead type sent to Follow Up Boss. `leadSchema` owns the enum; this maps the
 * visitor's own words onto it so the CRM stays filterable.
 */
export const SIDE_TO_LEAD_TYPE = {
  buying: "buyer",
  selling: "seller",
  both: "seller",
  relocating: "relocation",
  deciding: "general",
} as const satisfies Record<Side, string>;

/** Human-readable answer text, for the FUB note and the notification email. */
export function labelFor(question: IntakeQuestion, value: string): string {
  return question.options?.find((o) => o.value === value)?.label ?? value;
}
