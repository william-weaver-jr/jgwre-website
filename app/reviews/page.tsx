import type { Metadata } from "next";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { ReviewCard } from "@/components/review-card";
import { publishableReviews } from "@/lib/reviews";
import { RECOGNITION } from "@/lib/site";

/*
  /reviews — the archive.

  Reproduced verbatim, per docs/CONTENT-PLAN.md and CLAUDE.md §7. Nothing here
  is trimmed, tidied, or excerpted. Typos stay.

  THREE decisions worth knowing before editing this page:

  1. Reviews naming a dollar figure are grouped first, which is what
     CONTENT-PLAN.md asks for, and <ResultsDisclaimer /> sits directly under
     that heading — above the reviews it governs, not below them. §7 requires it
     adjacent to any page showing specific dollar outcomes.

  2. No transaction dedupe here, deliberately. Four couples reviewed the same
     closing from both sides and `dedupeByTransaction()` exists to drop the
     second — but this is the archive, not a curated pull. Two people who bought
     one house both having written something is the truth of that page. Use the
     dedupe helper on the home page and the pillar pages instead.

  3. No Review or AggregateRating JSON-LD. Google's structured data policy
     excludes reviews an entity collects and republishes about itself, and
     marking these up would be exactly that. The reviews earn trust by being
     readable, not by being markup. CLAUDE.md §11 scopes schema to
     RealEstateAgent + Person on the home page, and that stays true.

  Nothing on this page is filtered by hand. `publishableReviews()` is the gate:
  it drops anything carrying an unresolved `openQuestion` or a settled
  `withheld`. Never reach into REVIEWS directly from a page.
*/

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Client reviews for Jasmine Garcia, Broker/REALTOR® with Stone Realty Group in Charlotte, NC — reproduced exactly as they were posted to Zillow and Google.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const reviews = publishableReviews().sort((a, b) => b.date.localeCompare(a.date));
  const withFigures = reviews.filter((review) => review.statesDollarOutcome);
  const rest = reviews.filter((review) => !review.statesDollarOutcome);

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title={
          <>
            She doesn’t call herself a negotiator.
            <span className="block italic">Her clients do.</span>
          </>
        }
        lede={
          <>
            Every review below is reproduced exactly as it was posted to Zillow or Google —
            spelling, punctuation, and all. Nothing is shortened, and nothing is arranged to say
            something the client didn’t. All of them are five stars.
          </>
        }
      />

      {/* ------------------------------------------------- THE ONES WITH NUMBERS */}
      <section
        aria-labelledby="figures"
        className="border-b border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="Where a number was named" id="figures">
            Some of them counted.
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            These {withFigures.length} clients put a figure in writing. Every one of those numbers
            came out of a different house, a different seller, and a different market.
          </p>

          <ResultsDisclaimer className="mt-8" />

          <div className="mt-14 gap-x-14 md:columns-2 [&>figure]:mb-12">
            {withFigures.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- THE REST */}
      <section aria-labelledby="rest" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The rest" id="rest">
          Everything else, unedited.
        </SectionHeading>

        <div className="mt-14 gap-x-14 md:columns-2 [&>figure]:mb-12">
          {rest.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- RECOGNITION */}
      {/*
        The only place on the site these appear. No /awards page — CLAUDE.md §5
        says supporting proof goes in sparingly and never as a stat wall, and
        BRAND-VOICE.md §1 is blunt that listing awards does not convert. They sit
        at the foot of the reviews because two of the three measure client
        satisfaction, which is what the {reviews.length} reviews above already
        demonstrate at greater length.

        Issuers are printed, always. An unattributed "Excellence in Client
        Satisfaction" reads as an industry award; it is the brokerage's own.
      */}
      <section
        aria-labelledby="recognition"
        className="border-y border-border bg-surface-sunken py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="Recognition" id="recognition">
            Other people have counted too.
          </SectionHeading>

          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {RECOGNITION.map((item) => (
              <div key={`${item.year}-${item.label}`} className="rule-gold pt-5">
                <dd className="figure-plain text-2xl">{item.year}</dd>
                <dt className="mt-3 text-base leading-relaxed">{item.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {item.issuer}
                  <span className="block">{item.scope}</span>
                  {item.detail ? <span className="block">{item.detail}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ClosingCta
        heading="Ask them what they asked for."
        body="Most of the people above did not know what was negotiable when they started. That is the normal place to begin. Ten minutes on the phone is usually enough to know what is on the table for your house."
        secondary={{ href: "/negotiation", label: "The 19 Things Besides Price You Can Negotiate" }}
      />
    </>
  );
}
