import type { Metadata } from "next";
import Link from "next/link";

import { BrandPhoto } from "@/components/brand-photo";
import {
  CaseLedger,
  CASE_CONDITION,
  CASE_NEW_CONSTRUCTION,
  CASE_RESALE,
} from "@/components/case-ledger";
import { ContactIntake } from "@/components/contact-intake";
import { PhoneCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { ReviewCard } from "@/components/review-card";
import { PHOTOS } from "@/lib/images";
import { dedupeByTransaction, publishableReviews, reviewById } from "@/lib/reviews";
import { JsonLd, realEstateAgentSchema } from "@/lib/schema";
import { AGENT, PILLARS } from "@/lib/site";
import { GUIDE_TITLE, ITEM_COUNT } from "@/lib/intake";

/*
  The case-study-led home page specified in docs/CONTENT-PLAN.md, ported from the
  Lovable draft (project 389f0bc8, commit bced1f5b).

  Every figure below is documented in docs/CASE-STUDIES.md. Do not round, restate,
  or amplify them — $22,210 stays $22,210. No animated counters, no gradient stat
  badges. These read as evidence; amplification undercuts them. CLAUDE.md §6.
*/

export const metadata: Metadata = {
  description:
    "Negotiation is not just price. Documented outcomes on roofs, concessions, and builder incentives across Charlotte, NC and the NC/SC line. Call (704) 200-9360.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${AGENT.name}, ${AGENT.title} · Charlotte, NC & SC`,
    description:
      "Negotiation is not just price. Documented outcomes across Charlotte and the NC/SC border.",
  },
};

const RECORD = [
  { value: "98.84%", label: "List-to-sale ratio" },
  { value: "73+", label: "Transactions" },
  { value: "105", label: "Five-star reviews" },
];

/**
 * The two reviews below the case studies. One buyer, one seller, chosen because
 * both are specific about what was actually asked for rather than how nice she
 * was to work with.
 *
 * Emily C. itemizes a new-construction negotiation — $12,000 in closing costs, a
 * 2-1 buydown, appliances, blinds — which is the lead magnet demonstrated by a
 * buyer instead of claimed by us. Sharee K. is the seller half: out of state,
 * two years on the market, $20k over the initial offer.
 *
 * Named by id, then put through the same gates as every other surface.
 * `publishableReviews()` means a review later marked `withheld` cannot survive
 * here by virtue of being hardcoded, and `dedupeByTransaction()` means a future
 * edit cannot accidentally seat both halves of a couple side by side — Emily's
 * husband reviewed the same purchase. Never bypass these by reaching into
 * REVIEWS directly.
 */
const HOME_REVIEWS = dedupeByTransaction(
  publishableReviews(
    ["zillow-emily-corbin", "zillow-sharee-khaldi"]
      .map(reviewById)
      .filter((review) => review !== undefined),
  ),
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={realEstateAgentSchema()} />

      {/* ------------------------------------------------------------------ HERO */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-gutter py-20 md:grid-cols-[1.35fr_1fr] md:items-center md:py-32">
          <div>
            <p className="eyebrow">
              Broker / REALTOR&reg; &middot; Charlotte, NC &middot; NC &amp; SC
            </p>
            <div className="mt-6 w-16 rule-gold" aria-hidden="true" />
            <h1 className="mt-6 font-display text-display-sm text-balance sm:text-display md:text-display-lg">
              Most people think negotiating is just about getting the price down.
              <span className="block italic">It&rsquo;s not.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
              Sometimes the biggest savings come from things buyers don&rsquo;t even know to ask
              for.
            </p>

            <PhoneCta
              className="mt-10"
              placement="home-hero"
              secondary={{
                href: "/negotiation",
                label: GUIDE_TITLE,
              }}
            />
          </div>

          {/*
            The only `priority` image on the page: on a desktop viewport this is
            the LCP element. `sizes` is set slightly generous against the measured
            column (~445px inside the 72rem container) rather than exact, so a
            wide monitor never lands on an undersized candidate.
          */}
          <BrandPhoto
            photo={PHOTOS.portraitWarm}
            priority
            sizes="(min-width: 768px) 34vw, calc(100vw - 3.5rem)"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------- CASE STUDIES */}
      <section aria-labelledby="outcomes" className="mx-auto max-w-6xl px-gutter py-section">
        <p className="eyebrow">Three transactions</p>
        <h2 id="outcomes" className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
          Every negotiation has a different shape.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
          Three closed transactions. None of them won the same way.
        </p>

        <div className="mt-14 space-y-12">
          {/*
            Case 2 in docs/CASE-STUDIES.md leads here because it is the most
            surprising, not the biggest — the one where the price never moved. It
            gets the most visual presence: raised ivory plate, gold top rule,
            largest heading.

            The cards are labelled by what they are rather than by number: display
            order is not doc order, and "Case 01" on the page previously meant
            something different from "Case 1" in the doc.
          */}
          <article className="border-t-2 border-accent bg-surface-raised px-7 py-10 md:px-12 md:py-14">
            <div className="grid gap-8 md:grid-cols-[11rem_1fr]">
              <div>
                <p className="eyebrow">Condition, not price</p>
              </div>
              <div>
                <h3 className="max-w-xl font-display text-3xl leading-snug md:text-4xl">
                  No money off the price. All of it in condition.
                </h3>
                <CaseLedger className="mt-8" entries={CASE_CONDITION} />
                <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted">
                  The list price never moved. The house that closed was not the house that was
                  listed.
                </p>
              </div>
            </div>
          </article>

          {/* Case 1 — plain on the page ground. Three ledger figures, nothing else. */}
          <article className="grid gap-8 rule-top pt-10 md:grid-cols-[11rem_1fr]">
            <div>
              <p className="eyebrow">One contract, three wins</p>
            </div>
            <div>
              <h3 className="font-display text-2xl leading-snug md:text-3xl">
                Price, cash, and position in one contract.
              </h3>
              <CaseLedger className="mt-6" entries={CASE_RESALE} />
            </div>
          </article>

          {/* Case 3 — quiet cream inset with a gold left hairline. No dark field. */}
          <article className="grid gap-8 border-l-2 border-accent-soft bg-surface-sunken px-7 py-10 md:grid-cols-[11rem_1fr] md:px-10">
            <div>
              <p className="eyebrow">New construction</p>
            </div>
            <div>
              <h3 className="font-display text-2xl leading-snug md:text-3xl">
                The builder&rsquo;s own money.
              </h3>
              <CaseLedger className="mt-6" entries={CASE_NEW_CONSTRUCTION} />
            </div>
          </article>
        </div>

        <ResultsDisclaimer className="mt-12" />
      </section>

      {/* -------------------------------------------------------------- SPECIALTY */}
      <section
        aria-labelledby="specialty"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <p className="eyebrow">Where it matters most</p>
          <h2 id="specialty" className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Four situations with lopsided information.
          </h2>

          {/* Each card is the entry point to its pillar page. */}
          <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <article key={pillar.n} className="rule-gold pt-6">
                <p className="eyebrow tabular-nums">{pillar.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">
                  <Link
                    href={pillar.href}
                    className="decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
                  >
                    {pillar.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">
                  {pillar.table}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ TRUST STRIP */}
      <section aria-labelledby="record" className="mx-auto max-w-6xl px-gutter py-16">
        <h2 id="record" className="sr-only">
          Track record
        </h2>
        <dl className="grid gap-10 sm:grid-cols-3">
          {RECORD.map((item) => (
            <div key={item.label} className="rule-gold pt-5">
              <dd className="figure-plain text-2xl">{item.value}</dd>
              <dt className="mt-2 text-sm text-ink-muted">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------------ TESTIMONIALS */}
      <section
        aria-labelledby="reviews"
        className="border-y border-border bg-surface-sunken py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <p className="eyebrow">In their words</p>
          <h2 id="reviews" className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            One buyer, one seller.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            Both reproduced exactly as they were posted. Emily itemizes what a builder gave up.
            Sharee sold from another state.
          </p>

          {/*
            Whole reviews, not pull quotes. Both are `quotable` — neither carries a
            material connection — so an excerpt would be permitted here, and the
            answer is still no: these two earn their place by being specific, and
            specificity is the first thing a pull quote cuts.

            Both name dollar figures, so this section carries its own
            <ResultsDisclaimer />. The one in the case-study section above is too
            far up the page to be adjacent to anything down here. CLAUDE.md §7.
          */}
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {HOME_REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <ResultsDisclaimer className="mt-12" />

          <p className="mt-10 text-base">
            <Link
              href="/reviews"
              className="decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
            >
              Read the rest, unedited
            </Link>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CONTACT */}
      <section aria-labelledby="contact" className="mx-auto max-w-6xl px-gutter py-section">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Next step</p>
            <h2 id="contact" className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Ten minutes, before anything is signed.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
              That is usually enough to know which terms are worth asking for on your house.
              Charlotte, the surrounding NC counties, and across the South Carolina line.
            </p>
            <PhoneCta
              className="mt-9"
              placement="home-closing"
              secondary={{ href: "/negotiation", label: `See the ${ITEM_COUNT} things` }}
            />
          </div>
          {/*
            Re-briefed from "Charlotte housing stock — exterior". The section asks
            the reader to pick up a phone, and a person is a better argument for
            calling someone than a streetscape is. No `priority`: this is four
            screens down.
          */}
          <BrandPhoto
            photo={PHOTOS.environmental}
            sizes="(min-width: 768px) 46vw, calc(100vw - 3.5rem)"
          />
        </div>
      </section>

      {/*
        The intake sits below the phone block, not instead of it. docs/CONTACT-STRATEGY.md
        §2: the two capture different people, and the home page is the one page where
        both audiences arrive in volume. Nothing is prefilled — the home page does not
        know which table the reader is at, which is exactly what step 1 asks.
      */}
      <ContactIntake
        source="/"
        heading="What’s on the table for you?"
        body="Five taps and your details. You’ll get the questions worth asking about your own situation before anyone calls you back."
      />
    </>
  );
}
