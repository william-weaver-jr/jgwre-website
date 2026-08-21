import type { Metadata } from "next";

import { CaseLedger, CASE_NEW_CONSTRUCTION } from "@/components/case-ledger";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { GUIDE_TITLE } from "@/lib/intake";

/*
  PILLAR — the strongest of the four and the one with the best case study.
  docs/CONTENT-PLAN.md build order puts it immediately after the revenue path.

  The table: the builder's sales office negotiates every day of the week. The buyer
  has never negotiated with one.

  Builder list and the 17 closings are documented in CLAUDE.md §5. Case 3 figures
  come from docs/CASE-STUDIES.md and are not restated or rounded anywhere below.
*/

export const metadata: Metadata = {
  title: "New Construction",
  description:
    "The builder’s sales office negotiates every day. Most buyers negotiate with one once. 17 new-construction closings across Charlotte and the NC/SC border.",
  alternates: { canonical: "/new-construction" },
};

/** CLAUDE.md §5. Do not add a builder to this list without documentation. */
const BUILDERS = [
  "Copper Builders",
  "David Weekley",
  "Vista Homes",
  "DRB",
  "Pulte",
  "Meritage",
  "Lennar",
  "DR Horton",
  "Kolter",
  "Hopper Communities",
];

const LEVERS = [
  {
    n: "01",
    title: "The on-site agent is not your agent",
    body: "The person who greets you in the model home is paid by the builder and represents the builder. They are good at their job. Their job is not to get you the best terms.",
  },
  {
    n: "02",
    title: "Incentives are rarely volunteered",
    body: "Builders protect the published base price because it sets the comp for every remaining home in the community. They will often move on closing costs, upgrades, and rate buydowns instead, but usually only when asked, and usually only at certain points in the sales cycle.",
  },
  {
    n: "03",
    title: "The lender tie-in is a negotiation, not a rule",
    body: "Preferred-lender incentives are real money. Whether they are worth taking depends on the rate and fees behind them, which is a comparison worth running before you sign anything.",
  },
  {
    n: "04",
    title: "Upgrade pricing is not fixed",
    body: "The design center is where a large share of the budget quietly goes. Some upgrades are structural and have to be decided early. Others can wait, and waiting is usually cheaper.",
  },
  {
    n: "05",
    title: "Registration rules bind early",
    body: "Most builders require your agent to be present the first time you walk in. Walk in alone and you can lose representation for that community entirely, before you have asked a single question.",
  },
];

export default function NewConstructionPage() {
  return (
    <>
      <PageHero
        eyebrow="Pillar · The other side of this table"
        title={
          <>
            The builder’s rep has negotiated a hundred of these this year.
            <span className="block italic">You’ve negotiated none.</span>
          </>
        }
        lede={
          <>
            A builder’s sales office does this every day, with a contract they wrote, on terms
            they set. Most buyers walk into that room once in their lives. That gap is the whole
            problem, and it is fixable.
          </>
        }
      />

      {/* ------------------------------------------------------------- THE RECORD */}
      <section aria-labelledby="record" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The record" id="record">
          17 new-construction closings.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Across ten builders in the Charlotte market and across the South Carolina line. Each
          one runs its contracts, its incentive structure, and its design center differently.
        </p>

        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUILDERS.map((builder) => (
            <li key={builder} className="rule-top pt-3 text-base">
              {builder}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- CASE 3 */}
      <section
        aria-labelledby="case"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="One transaction" id="case">
            The builder’s own money.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            One new-construction purchase. The base price was not the lever.
          </p>

          <div className="mt-10 max-w-2xl">
            <CaseLedger entries={CASE_NEW_CONSTRUCTION} />
          </div>

          <ResultsDisclaimer className="mt-10" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- LEVERS */}
      <section aria-labelledby="levers" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="What they know" id="levers">
          Five things the sales office already understands.
        </SectionHeading>

        <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
          {LEVERS.map((lever) => (
            <article key={lever.n} className="rule-gold pt-6">
              <p className="eyebrow tabular-nums">{lever.n}</p>
              <h3 className="mt-3 font-display text-2xl md:text-3xl">{lever.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">{lever.body}</p>
            </article>
          ))}
        </div>
      </section>

      <ClosingCta
        heading="Your first visit is the one that counts."
        body="Representation has to be in place before your first visit at most builders. One call first is the whole difference."
        secondary={{ href: "/negotiation", label: GUIDE_TITLE }}
        placement="closing-new-construction"
        intake={{
          source: "/new-construction",
          heading: "Which builder are you looking at?",
          body: "Four questions about the community you’re considering. The answers decide which incentives are even on the table before you walk into the sales office.",
          // The page is about one table. Nobody who read it should have to tell us
          // they are buying new construction — they just did, by reading it.
          prefill: { side: "buying", answers: { propertyType: "new-construction" } },
        }}
      />
    </>
  );
}
