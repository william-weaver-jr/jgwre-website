import Link from "next/link";

import { AreaGuidesStrip } from "@/components/area-guide-links";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta, PhoneCta } from "@/components/phone-cta";
import { Button } from "@/components/ui/button";
import { areaBySlug } from "@/lib/areas";
import { GUIDE_TITLE } from "@/lib/intake";
import type { Area, AreaCta, AreaGuide, AreaNote } from "@/lib/areas";

/*
  The diligence layout for /areas/[slug]. lib/areas/types.ts AreaGuide.

  Same components, same rhythm, same closing block as the negotiation layout
  beside it in app/areas/[slug]/page.tsx. The difference is structural: a
  condo buyer's worry is the building rather than the price, so the page is
  ordered as the questions arrive — what is here, what differs a few blocks
  apart, what it costs to own, what to ask — with a way to reach her after
  each one rather than only at the foot.

  Every important answer is plain rendered text. No accordions: the FAQ below
  is also FAQPage JSON-LD, and markup must describe what a visitor can see.
*/

const link = "decoration-accent-soft decoration-1 underline-offset-4 hover:underline";

/** Prose fields carry paragraph breaks as blank lines. */
function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).filter(Boolean);
}

function Prose({ text, className = "mt-5" }: { text: string; className?: string }) {
  return (
    <div className={`max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted ${className}`}>
      {paragraphs(text).map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/**
 * A mid-page CTA. `#start` is a plain anchor carrying its placement, for the
 * same reason PhoneCta's secondary is: components/contact-link-tracking.tsx
 * reads `data-cta-placement` off it as an intake start.
 */
function InlineCta({ cta, placement }: { cta: AreaCta; placement: string }) {
  return (
    <div className="mt-12 flex max-w-3xl flex-col gap-5 rule-gold pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-display text-2xl leading-snug">{cta.prompt}</p>
      <Button asChild variant="outlineInk" size="lg" className="shrink-0">
        {cta.href.startsWith("#") ? (
          <a href={cta.href} data-cta-placement={placement}>
            {cta.label}
          </a>
        ) : (
          <Link href={cta.href} data-cta-placement={placement}>
            {cta.label}
          </Link>
        )}
      </Button>
    </div>
  );
}

function CheckList({ items, className = "mt-4" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`space-y-2 text-base leading-relaxed text-ink-muted ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A qualified explainer with the authority's own link under it. Used for the
 * schools block and for anything else a reader has to confirm at the source
 * rather than take from this page — see AreaNote in lib/areas/types.ts.
 */
function Note({
  note,
  id,
  band = "",
}: {
  note: AreaNote;
  id: string;
  /** Band styling for the full-width section; the inner column is fixed. */
  band?: string;
}) {
  return (
    <section aria-labelledby={id} className={band || undefined}>
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow={note.eyebrow} id={id}>
          {note.heading}
        </SectionHeading>
        <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted">
          {note.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {note.link ? (
          <p className="mt-6 text-base">
            <a href={note.link.href} target="_blank" rel="noopener noreferrer" className={link}>
              {note.link.label}
              <span className="sr-only"> (opens an external site)</span>
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** Splits "Lead clause — emphasis." into the site's two-line hero treatment. */
function Headline({ text }: { text: string }) {
  const [lead, emphasis] = text.split(" — ");
  if (!emphasis) return <>{text}</>;
  /* The dash stays in the text, not only the line break: a block span adds no
     whitespace, so without it crawlers and screen readers get "blockand". */
  return (
    <>
      {lead} —{" "}
      <span className="block italic">{emphasis}</span>
    </>
  );
}

export function AreaGuidePage({ area, guide }: { area: Area; guide: AreaGuide }) {
  const placement = (where: string) => `${where}-area-${area.slug}`;

  return (
    <>
      <PageHero
        variant="landing"
        eyebrow={`${area.name}, ${guide.city}, ${area.state}`}
        title={<Headline text={guide.headline} />}
        lede={
          <>
            {area.lede}
            <span className="mt-4 block text-ink">{guide.heroCloser}</span>
          </>
        }
      >
        {/* Phone first, Locked Decision #4; the intake is the secondary. */}
        <PhoneCta
          className="mt-7"
          placement={placement("hero")}
          sms={false}
          secondary={{ href: "#start", label: guide.heroCta }}
        />
      </PageHero>

      {/* ------------------------------------------------------ QUICK ANSWER */}
      <section aria-labelledby="short-answer" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The short answer" id="short-answer">
          {guide.answerHeading}
        </SectionHeading>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Prose text={area.answer} className="" />
          <dl className="grid content-start gap-5 rule-gold pt-6">
            {guide.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-1 text-base leading-relaxed text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------ ORIENTATION */}
      {guide.orientation ? (
        <section
          aria-labelledby="orientation"
          className="border-t border-border bg-surface-sunken py-section"
        >
          <div className="mx-auto max-w-6xl px-gutter">
            <SectionHeading eyebrow={guide.orientation.eyebrow} id="orientation">
              {guide.orientation.heading}
            </SectionHeading>
            <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted">
              {guide.orientation.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------- HOUSING */}
      <section
        aria-labelledby="housing"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="What is built here" id="housing">
            {guide.housingHeading}
          </SectionHeading>
          <Prose text={area.housingStock} />

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {guide.propertyTypes.map((type) => (
              <article key={type.name} className="rule-gold pt-6">
                <h3 className="font-display text-2xl md:text-3xl">{type.name}</h3>
                {type.checks ? (
                  <>
                    <p className="mt-4 text-base leading-relaxed text-ink">
                      <span className="eyebrow block">Good for</span>
                      <span className="mt-1 block">{type.goodFor}</span>
                    </p>
                    <p className="eyebrow mt-6">Check before offering</p>
                    <CheckList items={type.checks} className="mt-3" />
                  </>
                ) : (
                  <p className="mt-4 text-base leading-relaxed text-ink-muted">{type.goodFor}</p>
                )}
              </article>
            ))}
          </div>

          <InlineCta cta={guide.housingCta} placement={placement("housing")} />
        </div>
      </section>

      {/* ----------------------------------------------------------- LAYERS */}
      <section aria-labelledby="layers" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The other side of this table" id="layers">
          {guide.layersHeading}
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          {guide.layersIntro}
        </p>

        <ol className="mt-14 space-y-10">
          {area.levers.map((layer, i) => (
            <li key={layer.title} className="grid gap-4 rule-top pt-8 md:grid-cols-[11rem_1fr]">
              <p className="eyebrow">
                {guide.layersLabel ?? "Level"} {i + 1}
              </p>
              <div>
                <h3 className="font-display text-2xl leading-snug md:text-3xl">{layer.title}</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {layer.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
          {guide.layersClosing}
        </p>
      </section>

      {/* ------------------------------------------------------------ NOTES */}
      {guide.notes?.map((note, i) => (
        <Note
          key={note.heading}
          note={note}
          id={`note-${i + 1}`}
          band="border-t border-border bg-surface-sunken"
        />
      ))}

      {/* ---------------------------------------------------------- TRANSIT */}
      <section
        aria-labelledby="walkability"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow={guide.transitEyebrow} id="walkability">
            {guide.transitHeading}
          </SectionHeading>
          <Prose text={area.commute} />

          <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-3">
            {guide.transitColumns.map((column) => (
              <div key={column.heading} className="rule-gold pt-6">
                <h3 className="font-display text-2xl">{column.heading}</h3>
                <CheckList items={column.items} />
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-3xl border-l-2 border-accent pl-6 font-display text-2xl leading-snug italic md:text-3xl">
            {guide.transitCallout}
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- CHANGE */}
      <section aria-labelledby="changing" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="What is coming" id="changing">
          {guide.changeHeading}
        </SectionHeading>
        <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted">
          {guide.changeBody.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {/* Each entry states whether it is open, being built, or only planned.
            A list that does not say so reads as a promise about all of it. */}
        {guide.changeItems ? (
          <ul className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {guide.changeItems.map((item) => (
              <li key={item.name} className="rule-top pt-6">
                <p className="eyebrow">{item.status}</p>
                <h3 className="mt-3 font-display text-2xl leading-snug">{item.name}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* ------------------------------------------------------------- COST */}
      <section
        aria-labelledby="cost"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="Beyond the purchase price" id="cost">
            {guide.costHeading}
          </SectionHeading>
          <Prose text={area.priceContext} />
          <CheckList items={guide.costChecks} className="mt-8 max-w-3xl sm:columns-2 sm:gap-10 [&>li]:break-inside-avoid" />
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink">{guide.costClosing}</p>
          <InlineCta cta={guide.costCta} placement={placement("cost")} />
        </div>
      </section>

      {/* ---------------------------------------------------------- SCHOOLS */}
      {guide.schools ? (
        <Note note={guide.schools} id="schools" />
      ) : null}

      {/* ----------------------------------------------------------- BUYERS */}
      <section aria-labelledby="buying" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="For buyers" id="buying">
          {guide.buyerHeading}
        </SectionHeading>
        <ol className="mt-10 grid max-w-4xl gap-x-12 gap-y-4 md:grid-cols-2">
          {guide.buyerQuestions.map((question, i) => (
            <li key={question} className="flex gap-4 rule-top pt-4 text-base leading-relaxed text-ink">
              <span className="eyebrow mt-1 w-6 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{question}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink-muted">
          {guide.buyerClosing} How the rest of a purchase runs is on{" "}
          <Link href="/buyers" className={link}>
            the buyers page
          </Link>
          , and what is negotiable besides price is in{" "}
          <Link href="/negotiation" className={link}>
            {GUIDE_TITLE}
          </Link>
          .
        </p>
        <InlineCta cta={guide.buyerCta} placement={placement("buyers")} />
      </section>

      {/* ---------------------------------------------------------- SELLERS */}
      <section
        aria-labelledby="selling"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="For sellers" id="selling">
            {guide.sellerHeading}
          </SectionHeading>
          <Prose text={area.whatTrades} />
          <CheckList items={guide.sellerChecks} className="mt-6 max-w-3xl sm:columns-2 sm:gap-10 [&>li]:break-inside-avoid" />
          <p className="mt-10 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
            {guide.sellerClosing}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            How a listing gets positioned against that competition is on{" "}
            <Link href="/sellers" className={link}>
              the sellers page
            </Link>
            .
          </p>
          <InlineCta cta={guide.sellerCta} placement={placement("sellers")} />
        </div>
      </section>

      {/* ----------------------------------------------------------- NEARBY */}
      <section aria-labelledby="nearby" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Comparing neighborhoods" id="nearby">
          {guide.nearbyHeading}
        </SectionHeading>
        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {guide.nearby.map((place) => {
            /* Linked only once that market's own guide is published. */
            const target = place.slug ? areaBySlug(place.slug) : undefined;
            return (
              <article key={place.name} className="rule-gold pt-6">
                <h3 className="font-display text-2xl">
                  {target ? (
                    <Link href={`/areas/${target.slug}`} className={link}>
                      {place.name}
                    </Link>
                  ) : (
                    place.name
                  )}
                </h3>
                <p className="eyebrow mt-3">Choose it when</p>
                <p className="mt-2 text-base leading-relaxed text-ink-muted">{place.chooseWhen}</p>
              </article>
            );
          })}
        </div>
        <p className="mt-12 max-w-2xl text-base leading-relaxed text-ink-muted">
          None of these is the better choice in general. Moving to Charlotte and weighing more
          than one?{" "}
          <Link href="/relocation" className={link}>
            The relocation guide
          </Link>{" "}
          covers the rest of the move, and{" "}
          <Link href="/areas" className={link}>
            the area guides
          </Link>{" "}
          cover the other markets she works.
        </p>
      </section>

      {/* -------------------------------------------------------------- FAQ */}
      <section
        aria-labelledby="faq"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="Asked and answered" id="faq">
            {guide.faqHeading}
          </SectionHeading>
          <dl className="mt-14 grid gap-x-14 gap-y-10 lg:grid-cols-2">
            {area.faq.map((entry) => (
              <div key={entry.question} className="rule-top pt-8">
                <dt className="font-display text-2xl leading-snug">{entry.question}</dt>
                <dd className="mt-4 text-base leading-relaxed text-ink-muted">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <AreaGuidesStrip
        id="more-guides"
        eyebrow="Other area guides"
        heading="Weighing more than one part of Charlotte?"
        exclude={area.slug}
        className="py-section"
      />

      <ClosingCta
        heading={guide.closingHeading}
        body={guide.closingBody}
        placement={placement("closing")}
        intake={{
          source: `/areas/${area.slug}`,
          heading: guide.intakeHeading,
          body: guide.intakeBody,
          prefill: { answers: { markets: [guide.intakeMarket] } },
        }}
      />
    </>
  );
}
