import type { Area } from "../types";

/**
 * Fort Mill — the page, drafted and typed, deliberately unpublished.
 *
 * WHY THIS IS NOT IN data.ts
 *
 * Four of the six fields are her market knowledge and nobody has asked her yet.
 * data.ts is explicit that this content is "not something to be researched into
 * existence", and the research confirms why: the public sources for Fort Mill's
 * housing stock and price behaviour are competitor agent blogs, and the figures
 * they carry (entry-level "high 400s", and so on) are exactly what
 * docs/AREAS-SPEC.md §3 keeps off this site. Publishing a competitor's estimate
 * under NC 334700 and SC 125546 is worse than publishing nothing.
 *
 * So every field carrying a TODO(verify) is a question for her, phrased so she
 * can react to a draft rather than answer a blank. The sentences that are
 * already written are sourced in this repo and are hers to correct, not invent.
 *
 * HOW IT SHIPS
 *
 * Answer the TODOs, delete them, move this object into the AREAS array in
 * data.ts. Nothing else changes — the route, sitemap entry, footer, hub card,
 * and both audit suites all follow from that one edit. A test in
 * lib/areas/index.test.ts holds the door shut until the TODOs are gone, and
 * tests/compliance.test.tsx would fail on a rendered TODO( anyway.
 *
 * SOURCES for what is already written, all in this repo:
 *   - York County, and the corridor framing — app/carolinas-border/page.tsx
 *   - 12 closings in the Fort Mill corridor — CLAUDE.md §5
 *   - Masons Bend, English Trails — lib/transactions/data.ts
 *   - The Opendoor purchase, the builder including appliances and blinds, and
 *     the client who volunteered that she understands SC contracts —
 *     lib/reviews/data.ts, all four Fort Mill reviews, verified 2026-08-19
 */
export const FORT_MILL_DRAFT: Area = {
  slug: "fort-mill",
  name: "Fort Mill",
  state: "SC",

  targetQuery: "what should i know before buying a house in fort mill sc",

  /* The AEO surface. Written as far as the sourced material allows; the rest
     waits on the same four answers everything else here waits on. */
  answer:
    "Fort Mill is in York County, South Carolina, across the state line from Charlotte, which makes it a different transaction rather than just a different address: different forms, a different due-diligence structure, and different deadlines. Jasmine Garcia is licensed in both states and has closed twelve in this corridor. TODO(verify): add what the housing stock and the drive are actually like, once she has described them.",

  lede:
    "Fort Mill is in York County, South Carolina, across the state line from Charlotte, and a different transaction because of it. Twelve of her closings are in this corridor.",

  /* The lede runs 170 characters, which a result listing cuts mid-clause. The
     closing count is the part that survives being dropped, because the corridor
     record is already made on /carolinas-border. */
  metaDescription:
    "Fort Mill is in York County, South Carolina, across the state line from Charlotte. That makes it a different transaction, not just a different address.",

  /* Written from her own closings, which is honest and narrow. The market-level
     picture is the part she has to supply. */
  housingStock:
    "What she has closed here is single-family and townhouse, a real share of it new construction from national builders. TODO(verify): which eras and housing types dominate, roughly where, and what a buyer should expect structurally from the construction that is most common here.",

  /* Behaviour, never figures. No area-level price is on the documented-facts
     allowlist in docs/CONTENT-MARKETING.md §2, and the numbers circulating on
     competitor blogs are not a source. docs/AREAS-SPEC.md §3. */
  priceContext:
    "TODO(verify): how price behaves here compared with south Charlotte, whether it moves faster or slower, and what it responds to. Describe the movement, not the number. No area price figure may ship without a documented source.",

  /* I-77 is plain geography and safe to state. Everything with a clock on it is
     hers. */
  commute:
    "I-77 is the spine of this corridor, and it is the reason a South Carolina address still reaches Charlotte's southern job centres. TODO(verify): the routes she actually uses, what the drive runs off-peak against in it, and what relocating buyers consistently get wrong about it before they arrive.",

  /* The two sentences of evidence are from the ledger; the market claim is not
     something two rows can support. */
  whatTrades:
    "Both sides, and sometimes quickly: a 2026 listing in Masons Bend drew multiple offers inside forty-eight hours, and the one accepted was chosen on its terms rather than its number. TODO(verify): what typically comes to market here and in what condition, beyond her own book of business.",

  /* Two entries is the floor and these clear it, but a page aiming at answer
     engines wants four. The two missing ones are the two most-asked questions
     about any market — what it costs and how long the drive is — and both are
     blocked on her. */
  faq: [
    {
      question: "Is buying in Fort Mill different from buying in Charlotte?",
      answer:
        "Yes, and not only because of the tax bill. Fort Mill is in South Carolina, so the contract forms differ from North Carolina's, the due-diligence structure differs, and what a given deadline obliges you to do differs. A buyer who does not know the timeline gives away options they were entitled to use.",
    },
    {
      question: "Can one agent handle both sides of the North Carolina / South Carolina line?",
      answer:
        "Only if they are licensed in both states, and most Charlotte agents are licensed in North Carolina alone. Jasmine Garcia holds licenses in both, NC 334700 and SC 125546, which is what makes it possible to shop Fort Mill and Ballantyne in the same search rather than choosing a side first.",
    },
  ],

  levers: [
    {
      /* Grounded in the 2024 townhouse purchase from an Opendoor-owned property.
         The strongest lever on the page: specific, genuinely non-obvious, and
         absent from every templated neighbourhood page in this city. */
      title: "The seller across the table may not be a person",
      body: "Some of what is for sale here is held by a company rather than a household: an iBuyer that bought from the last owner, or a builder still carrying finished product. That changes the negotiation completely. A company has no attachment to the house and no feelings about your offer, but it also has a pricing model it will not argue with, and an internal list of which concessions are pre-approved and which need a person to sign. Price is usually the hardest thing to move. Cost items are usually the easiest. Knowing which is which before you write is most of the work.",
    },
    {
      /* Grounded in the 2024 Fort Mill new-construction purchase where the
         builder included appliances and blinds, plus the 17 new-construction
         closings in CLAUDE.md §5. Deliberately about what a builder will ADD;
         the Steele Creek draft covers what a builder will PAY. */
      title: "What the builder will include instead of discounting",
      body: "A builder resists cutting the base price, because that price sheet is what the next buyer sees and what the appraisals behind it are built on. What a builder will often do is add. Appliances, window treatments, a lender credit, an upgrade allowance, a closing date that suits you. None of it is volunteered, because the agent in the sales office works for the builder and answers the questions you ask rather than the ones you do not know to ask. Asking the right ones is not a talent. It is a list.",
    },
    {
      /* Grounded in the 2026 seller review naming SC contracts specifically,
         and in dual licensure. The last sentence is the deliberate hand-off to
         /carolinas-border — that page owns the comparison, this one owns the
         place. docs/AREA-GUIDE-MIGRATION.md §5. */
      title: "The contract changes at the state line",
      body: "Most people shopping Fort Mill are also shopping Ballantyne or Waxhaw, and the paperwork is not the same on both sides of the line. The forms differ, the due-diligence structure differs, and what a given deadline obliges you to do differs. That is leverage in both directions: a buyer who does not know the timeline gives away optionality, and a seller who does not know it takes a worse offer because it looked cleaner. What the line does to your monthly payment is a separate question, and it has its own page.",
    },
  ],
};
