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
import { Button } from "@/components/ui/button";
import { PHOTOS } from "@/lib/images";
import { dedupeByTransaction, publishableReviews, reviewById } from "@/lib/reviews";
import { JsonLd, realEstateAgentSchema } from "@/lib/schema";
import { AGENT, PILLARS } from "@/lib/site";
import { GUIDE_TITLE, ITEM_COUNT, SIDES } from "@/lib/intake";
import { routeMetadata } from "@/lib/seo";

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
  ...routeMetadata({
    path: "/",
    ogTitle: `${AGENT.name}, ${AGENT.title} · Charlotte, NC & SC`,
    ogDescription:
      "Negotiation is not just price. Documented outcomes across Charlotte and the NC/SC border.",
  }),
};

const RECORD = [
  { value: "98.84%", label: "List-to-sale ratio" },
  { value: "73+", label: "Transactions" },
  { value: "105", label: "Five-star reviews" },
];

/**
 * The three hero pathways, and the reason they are derived rather than typed.
 *
 * Each label is read out of SIDES — the same list that renders step 1 of the
 * intake — so the word a visitor picks here is the word they meet on arrival.
 * Typing "Relocating" by hand would drift from "Relocating here" the first time
 * either is edited, and the drift would be invisible: two plausible labels for
 * one choice, on two pages nobody diffs side by side.
 *
 * Three, not the full five. "Both" and "Still deciding" are real answers to a
 * form question and have no page of their own; a hero that offers five doors is
 * a form, and both of those readers are served by the intake below.
 */
const PATHWAYS = [
  { side: "buying", href: "/buyers" },
  { side: "selling", href: "/sellers" },
  { side: "relocating", href: "/relocation" },
].map(({ side, href }) => {
  const match = SIDES.find((s) => s.value === side);
  // Throwing beats rendering a blank link: a renamed Side should fail the build,
  // not ship a pathway with no text in the most valuable space on the site.
  if (!match) throw new Error(`Home pathway references unknown intake side: ${side}`);
  return { href, label: match.label };
});

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
        {/*
          `md:py-20`, down from `md:py-32` on 2026-08-31, and the reason is a
          measurement rather than a taste: at 1440×800 — an ordinary laptop —
          the hero phone button's bottom edge sat at 859px, below the fold. The
          primary conversion control on a phone-first site (Locked Decision #4)
          was off screen on arrival for anyone not on a tall monitor, and had
          been since launch. 128px of padding above a display-scale headline is
          what put it there.

          What did NOT change is the headline's type scale. It is the USP in her
          own words and the best thing on the page; the fold is worth 48px of
          padding, not a smaller h1.
        */}
        <div className="mx-auto grid max-w-6xl gap-12 px-gutter py-20 md:grid-cols-[1.35fr_1fr] md:items-center">
          <div>
            <p className="eyebrow">
              Broker / REALTOR&reg; &middot; Charlotte, NC &middot; NC &amp; SC
            </p>
            <div className="mt-6 w-16 rule-gold" aria-hidden="true" />
            <h1 className="mt-6 font-display text-display-sm text-balance sm:text-display md:text-display-lg">
              Most people think negotiating is just about getting the price down.
              <span className="block italic">It&rsquo;s not.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Sometimes the biggest savings come from things buyers don&rsquo;t even know to ask
              for.
            </p>

            {/*
              The one PhoneCta on the site with the text line switched off. The
              hero already carries the number, the guide, and three pathways;
              a fourth line here would push the pathways further below the fold
              to say something the closing block and /contact both say properly.
            */}
            <PhoneCta
              className="mt-8"
              placement="home-hero"
              sms={false}
              secondary={{
                href: "/negotiation",
                label: GUIDE_TITLE,
              }}
            />

            {/*
              The three pathways, above the fold and deliberately plain.

              The problem they solve is narrow and real: everything else this
              high on the page speaks to a buyer. The headline is her own line
              about what buyers don't know to ask for, and the secondary CTA is
              the buyer's guide — so a seller could reasonably read the first
              screen and conclude the site is not for them. It sits four screens
              above anything that says otherwise.

              THE HEADLINE AND LEDE ARE NOT THE PLACE TO FIX THAT. Both are her
              own words, quoted in CLAUDE.md §2 as the origin of the USP.
              Rewriting them to be side-neutral would sand down the one sentence
              the whole site is built on. A visible choice does the same job
              without touching it.

              They are links to the three service pages rather than a control
              that prefills the intake down the page. Those pages already open
              their own intake at step 2 with the side filled in
              (docs/CONTACT-STRATEGY.md §6), so a seller who picks "Selling"
              lands on selling copy and a form that has stopped asking what it
              can already see. Reaching the intake without the argument would be
              the weaker half of that.

              Labels are SIDES in lib/intake/questions.ts, verbatim. The reader
              picks "Selling" here and meets the same word as the selected chip
              on arrival; two names for one choice reads as two choices.

              No question header — BRAND-VOICE.md §2 bans them.
            */}
            {/*
              One line, no rule above it, label inline with the choices. It began
              as a bordered block with its own heading and cost 99px of hero
              height for three words and three links — which pushed itself, and
              more importantly the phone button above it, below the fold.
            */}
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-1">
              <p className="eyebrow">Start where you are</p>
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-1">
                {PATHWAYS.map((path) => (
                  <li key={path.href}>
                    <Link
                      href={path.href}
                      data-cta-placement="home-hero-pathway"
                      // min-h-11 for the 44px target on a phone. CLAUDE.md §10.
                      className="inline-flex min-h-11 items-center text-base font-medium underline decoration-accent-soft decoration-1 underline-offset-[6px] hover:decoration-accent"
                    >
                      {path.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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

      {/*
        ------------------------------------------------------- INTAKE SHORTCUT

        A jump to the intake, immediately under the hero.

        The gap it closes is larger than "the form is a long way down". Until
        2026-08-31 the only two links to #start on the whole site were the mobile
        sticky bar — which is `md:hidden` — and a button on /contact. So a
        DESKTOP visitor had no path to the questionnaire at all: not on this
        page, not on any pillar page. They could call, or they could scroll
        6,788px. docs/CONTACT-STRATEGY.md §2 is explicit that the form exists for
        the reader who will not phone a stranger, and that reader was being
        offered the phone or nothing.

        It links to #start rather than mounting a second ContactIntake. Two live
        forms on one page would split the funnel between two instances of the
        same events and double the §7 surface — the consent text, the
        disclaimer, and the confirmation copy are all advertising, and reviewing
        them once is the point of there being one.

        Quiet on purpose. It sits between the hero and the case studies, which
        are the argument; a loud band here would interrupt the reader on their
        way into the thing that persuades them.
      */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-gutter py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">Not ready to call?</span> Answer five
            questions and see which terms are worth asking for on your house.
          </p>
          <Button asChild variant="outlineInk" className="w-full shrink-0 sm:w-auto">
            <a href="#start" data-cta-placement="home-band">
              Start here
            </a>
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------------- CASE STUDIES */}
      <section aria-labelledby="outcomes" className="mx-auto max-w-6xl px-gutter py-section">
        {/*
          The standfirst under this heading used to read "Three closed
          transactions. None of them won the same way." Every fact in it was
          already on screen — "three" in the eyebrow, "no two the same" in the
          heading — so the eyebrow absorbed the one word that was not ("closed",
          which is the load-bearing one) and the sentence went. Condensing this
          section starts with the copy that repeats itself, not with the figures.
        */}
        <p className="eyebrow">Three closed transactions</p>
        <h2 id="outcomes" className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
          Every negotiation has a different shape.
        </h2>

        <div className="mt-10 space-y-8">
          {/*
            Case 2 in docs/CASE-STUDIES.md leads here because it is the most
            surprising, not the biggest — the one where the price never moved. It
            gets the most visual presence: raised ivory plate, gold top rule,
            largest heading.

            The cards are labelled by what they are rather than by number: display
            order is not doc order, and "Case 01" on the page previously meant
            something different from "Case 1" in the doc.
          */}
          <article className="border-t-2 border-accent bg-surface-raised px-7 py-9 md:px-12 md:py-11">
            <div className="grid gap-8 md:grid-cols-[11rem_1fr]">
              <div>
                <p className="eyebrow">Condition, not price</p>
              </div>
              <div>
                <h3 className="max-w-xl font-display text-3xl leading-snug md:text-4xl">
                  No money off the price. All of it in condition.
                </h3>
                <CaseLedger className="mt-6" entries={CASE_CONDITION} />
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted">
                  The list price never moved. The house that closed was not the house that was
                  listed.
                </p>
              </div>
            </div>
          </article>

          {/*
            Cases 1 and 3 sit SIDE BY SIDE from `md` up, and that is where most of
            this section's height went.

            Stacked, the three cases spent 1,822px of a page the audit already
            called too long, while the widest thing in any of them was a
            three-row ledger sitting in a 1,100px column. The saving is entirely
            in unused horizontal space — every case, every term, and every figure
            is still on the page, which is what CASE-STUDIES.md requires and what
            makes this a trim rather than a cut.

            The lead case keeps the full width above them. It was already the one
            with the most visual presence, so a 1-plus-2 arrangement reinforces
            the hierarchy the section had rather than inventing one — and the
            framing that matters ("three different shapes of win", not three
            wins) is carried by the labels and the ledgers, which are untouched.

            Their eyebrow moves above the heading instead of into an 11rem left
            column: at half width that column is no longer a margin note, it is a
            squeeze.
          */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Case 1 — plain on the page ground. Three ledger figures, nothing else. */}
            <article className="rule-top pt-8">
              <p className="eyebrow">One contract, three wins</p>
              <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
                Price, cash, and position in one contract.
              </h3>
              <CaseLedger className="mt-5" entries={CASE_RESALE} />
            </article>

            {/* Case 3 — quiet cream inset with a gold left hairline. No dark field. */}
            <article className="border-l-2 border-accent-soft bg-surface-sunken px-7 py-8 md:px-8">
              <p className="eyebrow">New construction</p>
              <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
                The builder&rsquo;s own money.
              </h3>
              <CaseLedger className="mt-5" entries={CASE_NEW_CONSTRUCTION} />
            </article>
          </div>
        </div>

        {/* Still immediately below the last figure, which is the whole
            requirement — §7 and docs/CASE-STUDIES.md. Side-by-side cards do not
            change that; there is one disclaimer under all three, as before. */}
        <ResultsDisclaimer className="mt-10" />
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
