import type { IntakeAnswers, LeverRule, Side } from "./types";

/**
 * The confirmation screen. docs/CONTACT-STRATEGY.md §3.
 *
 * Every other agent's form ends with "thanks, we'll be in touch." This one ends by
 * naming two or three things worth asking about the situation the visitor just
 * described — the USP performing instead of asserting, and useful even to the
 * person who never picks up the phone.
 *
 * COMPLIANCE — CLAUDE.md §7. Read every line here as advertising, because it is:
 *
 *   - Questions and possibilities only. Never "you'll get," "typically saves,"
 *     "I always," or any figure. A lever that survives being read as a promise is
 *     written wrong.
 *   - No dollar amounts. The ResultsDisclaimer renders adjacent regardless.
 *   - Nothing touching schools, safety, demographics, or who lives where.
 *   - This is a static table. Nothing here is generated at request time.
 *
 * The BIC approval covering the site covers this copy too.
 */
export const LEVERS: readonly LeverRule[] = [
  // — New construction ————————————————————————————————————————————————
  {
    id: "nc-lender-tie",
    group: "new-construction",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "new-construction" },
    text: "Whether the incentive is tied to using the builder’s lender, and what it’s still worth if you don’t.",
  },
  {
    id: "nc-base-vs-design",
    group: "new-construction",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "new-construction" },
    text: "What’s actually in the base price, and what gets priced at the design center later.",
  },
  {
    id: "nc-standing-inventory",
    group: "new-construction",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "new-construction" },
    text: "What that builder has been doing on standing inventory this quarter, which is rarely the same as their posted incentive.",
  },
  {
    id: "nc-representation",
    group: "new-construction",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "new-construction" },
    text: "Who the agent in the model home works for. It isn’t you, and representation usually has to be in place before your first visit.",
  },

  // — Resale ——————————————————————————————————————————————————————————
  {
    id: "resale-seller-timeline",
    group: "resale",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "resale" },
    text: "What the seller’s own timeline is. It is often worth more to them than the last few thousand dollars.",
  },
  {
    id: "resale-credit-vs-repair",
    group: "resale",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "resale" },
    text: "Which inspection items are worth asking to have fixed, and which are worth asking for as a credit instead.",
  },
  {
    id: "resale-inclusions",
    group: "resale",
    sides: ["buying", "both", "relocating"],
    requires: { question: "propertyType", value: "resale" },
    text: "What conveys with the house that never made it into the listing: appliances, mounts, the things nobody thinks to write down.",
  },

  // — Financing ————————————————————————————————————————————————————————
  {
    id: "lender-rate-lock",
    group: "financing",
    sides: ["buying", "both", "relocating"],
    requires: { question: "lender", value: "pre-approved" },
    text: "What happens to your rate lock if closing slips, and who is expected to absorb it.",
  },
  {
    id: "lender-not-started",
    group: "financing",
    sides: ["buying", "both", "relocating", "deciding"],
    requires: { question: "lender", value: "not-yet" },
    text: "What a pre-approval actually commits you to, which is worth knowing before it becomes the reason an offer isn’t taken seriously.",
  },
  {
    id: "lender-cash",
    group: "financing",
    sides: ["buying", "both", "relocating"],
    requires: { question: "lender", value: "cash" },
    text: "What paying cash is worth to this particular seller, since the answer is a number and it is negotiable like any other.",
  },

  // — Timeline ————————————————————————————————————————————————————————
  {
    id: "timeline-compressed",
    group: "timeline",
    sides: ["buying", "selling", "both", "relocating"],
    requires: { question: "timeline", value: "30-days" },
    text: "What in the timeline can be compressed without giving up your inspection window, and what can’t.",
  },

  // — The border ——————————————————————————————————————————————————————
  {
    id: "border-line",
    group: "border",
    sides: ["buying", "selling", "both", "relocating", "deciding"],
    requires: { question: "markets", value: "carolinas-border" },
    text: "Which side of the state line an address falls on, and what that changes about property tax treatment, vehicle registration, and how the closing itself runs.",
  },

  // — Relocation ——————————————————————————————————————————————————————
  {
    id: "relo-in-person",
    group: "relocation",
    sides: ["relocating"],
    text: "What has to happen in person and what doesn’t. Everyone else in the transaction is local. You’re the only one who isn’t.",
  },
  {
    id: "relo-order",
    group: "relocation",
    sides: ["relocating"],
    text: "What order to do things in when you’re buying remotely, because the sequence is different and it’s where remote purchases usually go sideways.",
  },

  // — Selling ——————————————————————————————————————————————————————————
  {
    id: "sell-comps",
    group: "selling",
    sides: ["selling", "both"],
    requires: { question: "valuation", value: "avm" },
    text: "What comparable homes actually closed at, as opposed to what an automated estimate produced from what they listed at.",
  },
  {
    id: "sell-inspection-response",
    group: "selling",
    sides: ["selling", "both"],
    text: "Which inspection requests to answer with work, which with a credit, and which not at all.",
  },
  {
    id: "sell-terms-not-price",
    group: "selling",
    sides: ["selling", "both"],
    text: "What an offer says about appraisal gap, financing, and possession: the terms that decide whether the price on the front page survives to closing.",
  },
  {
    id: "sell-pricing-once",
    group: "selling",
    sides: ["selling", "both"],
    text: "How the first two weeks are priced. It is the one negotiation in a sale you don’t get to run twice.",
  },

  // — Generic buying, and the floor for every path ————————————————————
  {
    id: "buy-closing-costs",
    group: "general",
    sides: ["buying", "both", "relocating", "deciding"],
    text: "What the other side would consider covering in closing costs, which is a separate conversation from the price and is not always volunteered.",
  },
  {
    id: "buy-warranty",
    group: "general",
    sides: ["buying", "both", "relocating", "deciding"],
    text: "Whether a home warranty is on the table, and who’s expected to pay for the first year of it.",
  },
  {
    id: "deciding-market-first",
    group: "general",
    sides: ["deciding"],
    text: "What’s happening where you’re looking before it’s about any one house. Inventory and days on market move which levers exist at all.",
  },
];

/**
 * Group precedence, most distinctive first. Two states and two rulebooks is the one
 * thing most Charlotte agents cannot say at all (CLAUDE.md §5 pillar 3), so a border
 * answer outranks a financing answer when both matched and only three slots exist.
 */
const GROUP_ORDER: readonly LeverRule["group"][] = [
  "border",
  "new-construction",
  "relocation",
  "selling",
  "resale",
  "timeline",
  "financing",
  "general",
];

/**
 * Pick the levers to show. Answer-specific rules rank above generic ones so a new
 * construction buyer sees builder questions rather than the fallbacks.
 *
 * Returns at most three. Two is fine; a list of six stops reading as considered.
 */
export function selectLevers(side: Side, answers: IntakeAnswers, limit = 3): LeverRule[] {
  const matched = LEVERS.filter((lever) => {
    if (!lever.sides.includes(side)) return false;
    if (!lever.requires) return true;

    const answer = answers[lever.requires.question];
    if (Array.isArray(answer)) return answer.includes(lever.requires.value);
    return answer === lever.requires.value;
  });

  const byGroup = (a: LeverRule, b: LeverRule) =>
    GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);

  const ranked = [
    ...matched.filter((l) => l.requires).sort(byGroup),
    ...matched.filter((l) => !l.requires).sort(byGroup),
  ];

  // First pass caps each group at two, so three questions span the situation rather
  // than restating one corner of it. Second pass fills any remaining slots, because
  // two well-matched questions beat a short list on principle.
  const perGroup = new Map<LeverRule["group"], number>();
  const picked: LeverRule[] = [];

  for (const lever of ranked) {
    if (picked.length === limit) break;

    const seen = perGroup.get(lever.group) ?? 0;
    if (seen >= 2) continue;

    perGroup.set(lever.group, seen + 1);
    picked.push(lever);
  }

  for (const lever of ranked) {
    if (picked.length === limit) break;
    if (!picked.includes(lever)) picked.push(lever);
  }

  return picked;
}
