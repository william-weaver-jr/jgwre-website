import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { routeMetadata } from "@/lib/seo";

/*
  Manual CMA request. CONTENT-PLAN.md: "a real person looking at real comps, not
  an instant algorithm."

  This page must never behave like an automated valuation. No estimate widget, no
  address field that returns a number, no MLS data — Locked Decision #1 and §7.
  The differentiator is that it is slower and done by hand, so the copy says so
  plainly rather than apologizing for it.

  The table: a buyer's agent will run comps on this house too, and will choose
  the ones that argue for a lower number. An automated estimate cannot see the
  things that move a price either way.

  No dollar figures here on purpose. The page argues about method, not outcomes,
  so it carries no results disclaimer — add one with any figure that lands here.
*/

export const metadata: Metadata = {
  title: "What is your home worth?",
  description:
    "A written comparative market analysis from a broker who has actually seen the house, not an automated estimate. Charlotte, NC and the South Carolina line.",
  ...routeMetadata({ path: "/home-value" }),
};

/** What an automated estimate cannot see, and a buyer's agent will. */
const UNSEEN = [
  {
    title: "Condition",
    body: "A model knows the year the roof was built, not whether it was replaced. It cannot tell an original kitchen from one redone last spring, and those two houses are not worth the same.",
  },
  {
    title: "What is behind the house",
    body: "Backing to a road, a retention pond, a treeline, or the rear of a shopping center changes what a buyer will pay. So does the opposite. None of it is in the record.",
  },
  {
    title: "Layout",
    body: "Two houses with identical square footage can live very differently. A model counts the number. A person walks the floor plan.",
  },
  {
    title: "Unpermitted work",
    body: "A finished basement or an addition that never made it onto the permit record can raise a number automatically and cost you during due diligence. Better to know before a buyer's inspector does.",
  },
  {
    title: "Which comparable sales get used",
    body: "This is the part that decides the number. A model takes what is nearby and recent. A person asks which of those houses a buyer would genuinely have considered instead of yours, and adjusts for the differences between them.",
  },
];

/** What actually happens after the form. Stated so nobody expects a number in a popup. */
const PROCESS = [
  {
    n: "01",
    title: "You send the address and a little context",
    body: "When you are thinking of moving, what you have done to the house, and anything a record would not show. That is enough to start.",
  },
  {
    n: "02",
    title: "She looks at the house",
    body: "In person where that is possible, and in detail where it is not. This is the step an automated estimate skips, and it is the step the number depends on.",
  },
  {
    n: "03",
    title: "You get a written analysis and a conversation",
    body: "The comparable sales she used, what she adjusted and why, and a range rather than a single confident number. Then a call to talk through what it means for your timing.",
  },
];

export default function HomeValuePage() {
  return (
    <>
      <PageHero
        eyebrow="The other side of this table"
        title={
          <>
            An algorithm has never been inside your house.
            <span className="block italic">The buyer’s agent will be.</span>
          </>
        }
        lede={
          <>
            Every automated estimate is working from public records and nearby sales. It has
            not seen your kitchen, your roof, or what is behind your back fence. The agent
            representing your buyer will see all three, and will price accordingly.
          </>
        }
      />

      <section aria-labelledby="unseen" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="What a model misses" id="unseen">
          Five things that move a price and never reach the data.
        </SectionHeading>

        <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
          {UNSEEN.map((item) => (
            <article key={item.title} className="rule-gold pt-6">
              <h3 className="font-display text-2xl md:text-3xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="process"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="How this one works" id="process">
            It is done by hand, which is why it is not instant.
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            There is no widget on this page that returns a number. A comparative market
            analysis is a person choosing comparable sales and adjusting for the differences
            between them, and that takes a day or two rather than a second.
          </p>

          <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-3">
            {PROCESS.map((step) => (
              <article key={step.n} className="rule-gold pt-6">
                <p className="eyebrow tabular-nums">{step.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="why-first" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Why the number comes first" id="why-first">
          Pricing is the one negotiation you cannot redo.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          A listing that starts too high goes stale, and a stale listing hands every later
          negotiation to the other side. The price you choose before anyone sees the house
          shapes what you can ask for afterwards, which is the argument the{" "}
          <Link
            href="/sellers"
            className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
          >
            sellers page
          </Link>{" "}
          picks up.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          Knowing the number early is also useful when you are not selling yet. Plenty of
          these end with “not this year,” and that is a fine outcome.
        </p>
      </section>

      <ClosingCta
        heading="Ask what it is actually worth."
        body="Send the address and what you have done to the house. You will get comparable sales, the adjustments behind them, and a range rather than a single number from a model that has never been inside."
        placement="closing-home-value"
        intake={{
          source: "/home-value",
          leadType: "valuation",
          heading: "Start with the house.",
          body: "The address, roughly when you’re thinking of moving, and whether it’s been valued before. She takes it from there.",
          prefill: { side: "selling" },
        }}
      />
    </>
  );
}
