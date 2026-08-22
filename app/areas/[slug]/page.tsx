import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { areaBySlug, publishedAreas } from "@/lib/areas";
import { showsDollarFigure } from "@/lib/areas/validate";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { GUIDE_TITLE } from "@/lib/intake";

/*
  /areas/[slug] — one page per market that has real content, and no page at all
  for the markets that do not. lib/areas/data.ts is empty, so today every one of
  these 404s. That is the specified behaviour, not an unfinished state:
  docs/CONTENT-PLAN.md says "if there isn't real content for a market, don't
  publish the page."

  generateStaticParams is the gate. A market reaches the router only by being
  authored in data.ts, which also gives it a sitemap entry and a footer link.

  The levers section is why these pages exist. Housing stock and commute are
  table stakes that any portal can render from a feed; which negotiation levers
  tend to exist in this submarket is the USP applied locally, and is the part
  nobody can copy.

  Fair housing: describe housing stock, amenities, commute, and price. Never who
  lives somewhere. lib/areas/validate.ts enforces that over the data itself, so
  a violation fails the build rather than reaching a page. CLAUDE.md §7.
*/

export function generateStaticParams() {
  return publishedAreas().map((area) => ({ slug: area.slug }));
}

/** Only authored slugs resolve; anything else 404s before a page is rendered. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) return {};

  return {
    /* The market name leads, because that is the word people search. The rest
       states the angle so the result is not interchangeable with the dozen
       other "{market} real estate" titles on the same page of results. */
    title: `${area.name}, ${area.state} — what is negotiable here`,
    description: area.lede,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: {
      title: `${area.name}, ${area.state} — what is negotiable here`,
      description: area.lede,
      url: `/areas/${area.slug}`,
      type: "article",
    },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = areaBySlug(slug);
  if (!area) notFound();

  const sections = [
    { id: "housing-stock", eyebrow: "What is built here", body: area.housingStock },
    { id: "price", eyebrow: "How price behaves", body: area.priceContext },
    { id: "commute", eyebrow: "Getting out of it", body: area.commute },
    { id: "what-trades", eyebrow: "What changes hands", body: area.whatTrades },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${area.name}, ${area.state}`}
        title={
          <>
            {area.name}
            <span className="block italic">and what is negotiable in it.</span>
          </>
        }
        lede={area.lede}
      >
        {/* The AEO answer, directly under the h1 and before anything else.
            docs/CONTENT-MARKETING.md §3: this is what an answer engine lifts,
            and burying it under six paragraphs is why most agent pages are
            never quoted. It is also just the courteous order to write in. */}
        <div className="mt-10 max-w-2xl rule-gold pt-6">
          <p className="eyebrow">The short answer</p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">{area.answer}</p>
        </div>
      </PageHero>

      <section aria-labelledby="market" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The market" id="market">
          What this one is actually like.
        </SectionHeading>

        <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
          {sections.map((section) => (
            <article key={section.id} className="rule-gold pt-6">
              <h3 className="font-display text-2xl md:text-3xl">{section.eyebrow}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        {showsDollarFigure(area) ? <ResultsDisclaimer className="mt-12" /> : null}
      </section>

      <section
        aria-labelledby="levers"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="The other side of this table" id="levers">
            What tends to be askable in {area.name}.
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            Which levers exist depends on what is being sold and who is selling it, and that
            differs by submarket. These are the ones that come up here.
          </p>

          <div className="mt-14 space-y-10">
            {area.levers.map((lever) => (
              <article key={lever.title} className="grid gap-6 rule-top pt-8 md:grid-cols-[11rem_1fr]">
                <p className="eyebrow">Lever</p>
                <div>
                  <h3 className="font-display text-2xl leading-snug md:text-3xl">{lever.title}</h3>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                    {lever.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-base leading-relaxed text-ink-muted">
            The full list, not specific to any one market, is on{" "}
            <Link
              href="/negotiation"
              className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
            >
              {GUIDE_TITLE}
            </Link>
            .
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Asked and answered" id="faq">
          The questions that come up first.
        </SectionHeading>

        <dl className="mt-14 space-y-10">
          {area.faq.map((entry) => (
            <div key={entry.question} className="rule-top pt-8">
              <dt className="font-display text-2xl leading-snug md:text-3xl">{entry.question}</dt>
              <dd className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <ClosingCta
        heading={`Thinking about ${area.name}?`}
        body="One call is enough to tell you which of these apply to the specific house you are looking at, and which do not."
        placement={`closing-area-${area.slug}`}
        intake={{
          source: `/areas/${area.slug}`,
          heading: "Tell me what you are looking at.",
          body: "Property type, timing, and which side of the table you’re on.",
        }}
      />

      {/* Every answer below is rendered above in the same words. Emitting one a
          visitor cannot see is a structured-data violation and, on a licensed
          broker's site, an advertising claim nobody reviewed. */}
      <JsonLd data={faqSchema(area.faq)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "" },
          { name: "Areas", path: "/areas" },
          { name: area.name, path: `/areas/${area.slug}` },
        ])}
      />
    </>
  );
}
