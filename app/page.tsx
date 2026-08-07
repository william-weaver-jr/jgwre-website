import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { JsonLd, realEstateAgentSchema } from "@/lib/schema";
import { AGENT, RESULTS_DISCLAIMER } from "@/lib/site";

/*
  The case-study-led home page specified in docs/CONTENT-PLAN.md, ported from the
  Lovable draft (project 389f0bc8, commit bced1f5b).

  Every figure below is documented in docs/CASE-STUDIES.md. Do not round, restate,
  or amplify them — $22,210 stays $22,210. No animated counters, no gradient stat
  badges. These read as evidence; amplification undercuts them. CLAUDE.md §6.
*/

export const metadata: Metadata = {
  description:
    "Negotiation is not just price. Documented outcomes on roofs, concessions, and builder incentives in Charlotte, NC and across the NC/SC border. Call (704) 200-9360.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${AGENT.name}, ${AGENT.title} — Charlotte, NC & SC`,
    description:
      "Negotiation is not just price. Documented outcomes across Charlotte and the NC/SC border.",
  },
};

function PhotoPlaceholder({
  label,
  note,
  className = "",
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder for photography: ${label}`}
      className={`flex flex-col items-start justify-end gap-1 border border-accent-soft/70 bg-surface-sunken p-6 ${className}`}
    >
      <span className="eyebrow">Photo placeholder</span>
      <span className="text-sm font-medium text-ink">{label}</span>
      {note ? <span className="text-sm text-ink-muted">{note}</span> : null}
    </div>
  );
}

/** Shared ledger row. The `<dl>` markup is deliberate: these are term/value pairs. */
function LedgerRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3.5">
      <dt className="text-base">{term}</dt>
      <dd className="figure-plain text-lg">{value}</dd>
    </div>
  );
}

const CASE_01 = [
  { term: "Roof", value: "Brand new" },
  { term: "HVAC", value: "Serviced" },
  { term: "Home warranty", value: "Included" },
  { term: "Refrigerator", value: "Included" },
];

const CASE_02 = [
  { term: "Below list price", value: "$20,000" },
  { term: "Seller-paid concessions", value: "$22,210" },
  { term: "Immediate equity at closing", value: "$34,000" },
];

const CASE_03 = [
  { term: "Builder incentives", value: "$50,000" },
  { term: "Closing costs paid", value: "3%" },
  { term: "Refrigerator", value: "Included" },
];

const SPECIALTIES = [
  {
    n: "01",
    title: "New construction",
    body: "The builder’s sales office negotiates daily. The buyer never has.",
  },
  {
    n: "02",
    title: "Sellers",
    body: "The buyer’s agent works for the buyer. So does the inspector.",
  },
  {
    n: "03",
    title: "Relocation",
    body: "Everyone in the transaction is local except you.",
  },
  {
    n: "04",
    title: "The NC/SC border",
    body: "Two states, two tax regimes, two rulebooks.",
  },
];

const RECORD = [
  { value: "98.84%", label: "List-to-sale ratio" },
  { value: "73+", label: "Transactions" },
  { value: "105", label: "Five-star reviews" },
];

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

            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="phone" size="xl" className="w-full sm:w-auto">
                <a href={AGENT.phoneHref}>
                  <span className="sr-only">Call {AGENT.name} at </span>
                  {AGENT.phoneDisplay}
                </a>
              </Button>
              <Button asChild variant="outlineInk" size="xl" className="w-full sm:w-auto">
                <Link href="/negotiation">The 19 Things Besides Price You Can Negotiate</Link>
              </Button>
            </div>
          </div>

          <PhotoPlaceholder
            label="Jasmine — vertical portrait"
            note="Working, not posed. 4:5 crop."
            className="min-h-[24rem] md:min-h-[32rem]"
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
            Case 01 leads because it is the most surprising, not the biggest — the
            one where the price never moved. It gets the most visual presence:
            raised ivory plate, gold top rule, largest heading.
          */}
          <article className="border-t-2 border-accent bg-surface-raised px-7 py-10 md:px-12 md:py-14">
            <div className="grid gap-8 md:grid-cols-[11rem_1fr]">
              <div>
                <p className="eyebrow tabular-nums">Case 01</p>
                <p className="mt-2 text-sm text-ink-muted">Condition, not price</p>
              </div>
              <div>
                <h3 className="max-w-xl font-display text-3xl leading-snug md:text-4xl">
                  No money off the price. All of it in condition.
                </h3>
                <dl className="mt-8 divide-y divide-border border-y border-border">
                  {CASE_01.map((row) => (
                    <LedgerRow key={row.term} {...row} />
                  ))}
                </dl>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted">
                  The list price never moved. The house that closed was not the house that was
                  listed.
                </p>
              </div>
            </div>
          </article>

          {/* Case 02 — plain on the page ground. Three ledger figures, nothing else. */}
          <article className="grid gap-8 rule-top pt-10 md:grid-cols-[11rem_1fr]">
            <div>
              <p className="eyebrow tabular-nums">Case 02</p>
              <p className="mt-2 text-sm text-ink-muted">One contract, three wins</p>
            </div>
            <div>
              <h3 className="font-display text-2xl leading-snug md:text-3xl">
                Price, cash, and position in one contract.
              </h3>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {CASE_02.map((row) => (
                  <LedgerRow key={row.term} {...row} />
                ))}
              </dl>
            </div>
          </article>

          {/* Case 03 — quiet cream inset with a gold left hairline. No dark field. */}
          <article className="grid gap-8 border-l-2 border-accent-soft bg-surface-sunken px-7 py-10 md:grid-cols-[11rem_1fr] md:px-10">
            <div>
              <p className="eyebrow tabular-nums">Case 03</p>
              <p className="mt-2 text-sm text-ink-muted">New construction</p>
            </div>
            <div>
              <h3 className="font-display text-2xl leading-snug md:text-3xl">
                The builder&rsquo;s own money.
              </h3>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {CASE_03.map((row) => (
                  <LedgerRow key={row.term} {...row} />
                ))}
              </dl>
            </div>
          </article>
        </div>

        {/*
          Required by the BIC adjacent to any block showing dollar outcomes. Body
          weight, body color, immediately below — never a footnote, never small gray
          type. CLAUDE.md §7 and docs/CASE-STUDIES.md.
        */}
        <p className="mt-12 max-w-3xl border-l-2 border-accent pl-5 text-base leading-relaxed text-ink">
          {RESULTS_DISCLAIMER}
        </p>
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

          <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {SPECIALTIES.map((c) => (
              <article key={c.n} className="rule-gold pt-6">
                <p className="eyebrow tabular-nums">{c.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">{c.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">{c.body}</p>
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
            Client reviews
          </h2>

          {/*
            TODO(content): replace with two real reviews, quoted verbatim. CLAUDE.md
            §7 forbids altering testimonial wording. docs/placester-archive/text/
            holds the 14 indexed reviews from the old site as candidates — the
            Zillow review titled "when it comes to negotiations she's the best of
            the best" is the strongest match for this page's argument.
          */}
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {[1, 2].map((i) => (
              <figure key={i} className="border-t border-accent-soft pt-6">
                <blockquote className="font-display text-2xl leading-snug italic">
                  [REAL CLIENT REVIEW &mdash; DO NOT FABRICATE]
                </blockquote>
                <figcaption className="mt-5 text-sm text-ink-muted">
                  Placeholder {i} of 2 &middot; name, city, and transaction type to be added from a
                  verified review.
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CONTACT */}
      <section aria-labelledby="contact" className="mx-auto max-w-6xl px-gutter py-section">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Next step</p>
            <h2 id="contact" className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Call before you write an offer.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
              Ten minutes on the phone tells you which terms are worth asking for on your house.
              Charlotte, the surrounding NC counties, and across the South Carolina line.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="phone" size="xl">
                <a href={AGENT.phoneHref}>
                  <span className="sr-only">Call {AGENT.name} at </span>
                  {AGENT.phoneDisplay}
                </a>
              </Button>
              <Button asChild variant="outlineInk" size="xl">
                <Link href="/negotiation">See the 19 things</Link>
              </Button>
            </div>
          </div>
          <PhotoPlaceholder
            label="Charlotte housing stock — exterior"
            note="Streetscape or new-construction site. 3:2 crop."
            className="min-h-[18rem]"
          />
        </div>
      </section>
    </>
  );
}
