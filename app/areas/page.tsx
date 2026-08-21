import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { MARKETS, publishedAreas, sortAreas } from "@/lib/areas";
import type { AreaState } from "@/lib/areas";

/*
  /areas — the hub.

  Three jobs, in the order that matters:

  1. It is the redirect target for the retiring site's /area-guide/, and for
     every /area/{slug}/ whose market this site does not keep. That is roughly
     two thirds of them, so this page has to be worth landing on rather than a
     stub. docs/AREA-GUIDE-MIGRATION.md §9.
  2. It says where she works, which is a §5 fact and is useful on its own.
  3. It links the guides that exist.

  It ships before the guides do, deliberately. docs/AREAS-SPEC.md §11 originally
  said to wait for three markets; the redirect map is why that was wrong.

  What it must never do is link a market that has no page. lib/areas has
  unwrittenMarkets() for bookkeeping and it stays out of the UI — a card
  pointing at a 404, or a page rushed thin to justify a card, is the failure
  the whole area spec exists to prevent. Naming a market in prose is a
  different act from linking one, and §5 documents the roster either way.
*/

export const metadata: Metadata = {
  title: "Areas",
  description:
    "Where Jasmine Garcia works across Charlotte and the South Carolina border, and what tends to be negotiable in each of them.",
  alternates: { canonical: "/areas" },
};

const STATE_LABEL: Record<AreaState, string> = {
  NC: "North Carolina",
  SC: "South Carolina",
};

export default function AreasIndexPage() {
  const areas = sortAreas(publishedAreas());
  const states: AreaState[] = ["NC", "SC"];

  return (
    <>
      <PageHero
        eyebrow="Areas"
        title={
          <>
            Every seller is different.
            <span className="block italic">So is every market they sell in.</span>
          </>
        }
        lede="Charlotte is not one housing market. What is askable on a new-construction contract in the Fort Mill corridor is not what is askable on a house that has not changed hands since the seventies, and the person across the table already knows which one they are sitting in."
      />

      {/* ------------------------------------------------------------ ROSTER */}
      <section aria-labelledby="where" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Where she works" id="where">
          Two states, and the line between them.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          She is licensed in both Carolinas, which most agents here are not. That matters most
          in the corridor along the border, where two houses twenty minutes apart sit under
          different tax rules and different contracts.{" "}
          <Link
            href="/carolinas-border"
            className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
          >
            What the state line does to your monthly payment
          </Link>{" "}
          is its own page.
        </p>

        <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
          {states.map((state) => (
            <article key={state} className="rule-gold pt-6">
              <h3 className="font-display text-2xl md:text-3xl">{STATE_LABEL[state]}</h3>
              <ul className="mt-4 space-y-1 text-base leading-relaxed text-ink-muted">
                {MARKETS.filter((market) => market.state === state).map((market) => (
                  <li key={market.slug}>{market.name}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-base leading-relaxed text-ink-muted">
          She has closed outside this list and will again. This is where she is positioned and
          where the guides get written, not a boundary on what she takes on.
        </p>
      </section>

      {/* ------------------------------------------------------------ GUIDES */}
      <section
        aria-labelledby="guides"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="The guides" id="guides">
            {areas.length === 0
              ? "The first ones are being written."
              : "What is negotiable, market by market."}
          </SectionHeading>

          {areas.length === 0 ? (
            /* No placeholder cards. A market gets a guide when there is something
               true to say about what tends to be askable in it, and not before —
               which is the difference between these and the fourteen interchangeable
               neighborhood pages every agent site in this city already has. */
            <>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
                A market gets a guide when there is something specific to say about what tends
                to be askable in it — not a paragraph of adjectives and a listing feed. That
                takes longer and there are fewer of them. It is the only version worth reading.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
                Until they land, the levers that apply everywhere are on{" "}
                <Link
                  href="/negotiation"
                  className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
                >
                  the negotiation guide
                </Link>
                , and the border markets are covered on{" "}
                <Link
                  href="/carolinas-border"
                  className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
                >
                  the NC/SC page
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
                Housing stock and commute times are on every site in this city. These cover the
                part that is not: which levers tend to exist here, and why.
              </p>

              <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
                {areas.map((area) => (
                  <article key={area.slug} className="rule-top pt-8">
                    <p className="eyebrow">{STATE_LABEL[area.state]}</p>
                    <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
                      <Link
                        href={`/areas/${area.slug}`}
                        className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
                      >
                        {area.name}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
                      {area.lede}
                    </p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <ClosingCta
        heading="Your market is the one you are buying in."
        body="Ten minutes on the phone covers more of it than any page can, because it can be about the specific house rather than the average one."
        placement="closing-areas"
        intake={{
          source: "/areas",
          heading: "Tell me where you are looking.",
          body: "The area, roughly when, and whether you are buying or selling. Then your details.",
        }}
      />
    </>
  );
}
