import type { Metadata } from "next";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { BROKERAGE } from "@/lib/site";

/*
  PILLAR — sellers.

  The table: the buyer's agent works for the buyer. So does the inspector.

  "Stone Selling System" is a registered mark of Stone Realty Group and is
  referenced by name only — never restyled, recolored, or absorbed into her brand
  system. CLAUDE.md §7.

  98.84% list-to-sale is documented in CLAUDE.md §5. It is presented as evidence in
  a sentence, not as a badge in a stat wall.
*/

export const metadata: Metadata = {
  title: "Sellers",
  description:
    "The buyer’s agent works for the buyer. So does the inspector. Pricing strategy, inspection-response negotiation, and a 98.84% list-to-sale ratio in Charlotte, NC.",
  alternates: { canonical: "/sellers" },
};

const STAGES = [
  {
    n: "01",
    title: "Pricing is the first negotiation",
    body: "It happens before a buyer ever sees the house. Price too high and the listing goes stale, which hands every later negotiation to the other side. Price it correctly and the market argues on your behalf.",
  },
  {
    n: "02",
    title: "The inspection response is the second one",
    body: "This is where most seller money is lost, and it is almost never about the price. A repair request is a list, and lists are negotiable line by line — repair, credit, decline, or split.",
  },
  {
    n: "03",
    title: "The appraisal is the third",
    body: "If it comes in under contract price, there are more options than reducing. Which one applies depends on the buyer’s financing and how much room the contract left you.",
  },
  {
    n: "04",
    title: "Terms are not the same as price",
    body: "Closing date, possession, rent-back, what conveys, who pays for the survey. A slightly lower number with terms that fit your move can be the better outcome.",
  },
];

export default function SellersPage() {
  return (
    <>
      <PageHero
        eyebrow="Pillar · The other side of this table"
        title={
          <>
            The buyer’s agent works for the buyer. The inspector works for the buyer.
            <span className="block italic">Somebody should be working for you.</span>
          </>
        }
        lede={
          <>
            By the time an offer arrives, the other side has two professionals reading your house
            for leverage. Both are doing their jobs correctly. Neither one is doing yours.
          </>
        }
      />

      {/* ------------------------------------------------------------ THE EVIDENCE */}
      <section aria-labelledby="evidence" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The record" id="evidence">
          Listings have closed at 98.84% of list price.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          That figure is a career average across 73+ transactions. It is not a promise about your
          house — no one can make that promise honestly — but it is what the record shows.
        </p>

        <ResultsDisclaimer className="mt-8" />
      </section>

      {/* ------------------------------------------------------- THE FOUR MOMENTS */}
      <section
        aria-labelledby="stages"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="Where it is decided" id="stages">
            A sale is four negotiations, not one.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            Most sellers plan for the offer. The other three are where the money usually moves.
          </p>

          <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {STAGES.map((stage) => (
              <article key={stage.n} className="rule-gold pt-6">
                <p className="eyebrow tabular-nums">{stage.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">{stage.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">
                  {stage.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- MARKETING */}
      <section aria-labelledby="system" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Marketing" id="system">
          Exposure is the brokerage’s job.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Listings are marketed through the Stone Selling System, {BROKERAGE.name}’s listing
          program. That side of the work is a team operation and it is genuinely good at getting a
          house seen.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          What happens after a buyer is interested is the part this page is about. Exposure brings
          offers. It does not read an inspection report for you.
        </p>
      </section>

      {/*
        TODO(route): docs/CONTENT-PLAN.md specifies the CTA here as /home-value, a
        manual CMA request. That route has not shipped, so the secondary CTA is
        omitted rather than pointing at a 404. Wire it when /home-value lands.
      */}
      <ClosingCta
        heading="Call before you set a price."
        body="Pricing is the one negotiation you cannot redo. Ten minutes on the phone before the listing goes live is worth more than any adjustment after it does."
        placement="closing-sellers"
        intake={{
          source: "/sellers",
          heading: "Three questions before you price it.",
          body: "Where, when, and whether anyone has valued it yet. Then your details. That is enough to know which conversation to have.",
          prefill: { side: "selling" },
        }}
      />
    </>
  );
}
