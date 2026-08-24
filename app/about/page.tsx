import type { Metadata } from "next";

import { BrandPhoto } from "@/components/brand-photo";
import { VideoEmbed } from "@/components/video-embed";
import { ClosingCta } from "@/components/phone-cta";
import { SectionHeading } from "@/components/page-hero";
import { PHOTOS } from "@/lib/images";
import { JsonLd, videoObjectSchema } from "@/lib/schema";
import { isPrimaryPlacement, videoForRoute } from "@/lib/video";
import { BROKERAGE, PILLARS } from "@/lib/site";
import Link from "next/link";
import { GUIDE_TITLE } from "@/lib/intake";
import { routeMetadata } from "@/lib/seo";

/*
  /about — unblocked 2026-08-07.

  Version A (candid) approved, with the adjustment that the copy must carry her
  tenacity rather than reading as quitting. docs/BRAND-VOICE.md §3.

  Two rules govern the opening section and both are easy to break:

  1. Keep "why she left" and "what she brought" SEPARATE. Collapsing them produces
     the sanded-down version every ex-teacher agent in America writes — which is
     exactly what her live Placester bio does ("didn't leave teaching — she simply
     brought her classroom skills into the world of real estate").

  2. She left a career because it didn't pay, then became a top-five producer.
     DO NOT STATE THIS. The record sits further down the page, separated by two
     sections, so the reader does the math themselves. Writing the sentence kills it.

  Tenacity is carried structurally — ten years, "I didn't leave early," and the fact
  that the work continued — never by adjective and never by claim.

  No credentials in the opening. docs/CONTENT-PLAN.md.

  Vitality Homebuyers is deliberately unnamed: she co-owned it, it is no longer
  active, and the decision is not to disclose it. The investor-side perspective it
  gave her is reflected without the company. CLAUDE.md §12.
*/

export const metadata: Metadata = {
  title: "About",
  description:
    "Ten years teaching special education, then real estate. Same job: make sure the person with the most at stake isn’t the least prepared. Charlotte, NC.",
  ...routeMetadata({ path: "/about" }),
};

/** Documented in CLAUDE.md §5. See the open item there about refreshing these. */
const RECORD = [
  { value: "Top 5", label: "Producer at Stone Realty Group, 2023 and 2024" },
  { value: "73+", label: "Transactions closed" },
  { value: "105", label: "Five-star client reviews" },
];

export default function AboutPage() {
  /*
    Registered in lib/video/data.ts, not hard-coded here. A second video, or a
    different one, is an entry in that file — this page does not change again.
  */
  const featured = videoForRoute("/about");

  return (
    <>
      {featured && isPrimaryPlacement(featured.placement) ? (
        <JsonLd data={videoObjectSchema(featured.video)} />
      ) : null}

      {/* ------------------------------------------------------------ THE STORY */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-14 px-gutter py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <p className="eyebrow">About</p>
            <div className="mt-6 w-16 rule-gold" aria-hidden="true" />

            <h1 className="mt-6 max-w-3xl font-display text-display-sm text-balance sm:text-display">
              I taught special education for ten years.
            </h1>

            <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed">
              <p>
                I left because I was burned out and underpaid. That&rsquo;s the honest answer,
                and I&rsquo;ll give it to anyone who asks. Ten years is a long time to do that
                job for that money. I didn&rsquo;t leave early.
              </p>
              <p>
                Six of those years were in Charleston and four were in Hampton, Virginia. I
                have moved states and started over in one, which is its own education: every
                single thing is slightly different from the way you learned it, and nobody
                thinks to tell you which things.
              </p>
              <p>
                What I left was the job. I didn&rsquo;t leave the work.
              </p>
              <p>
                I spent those ten years in rooms where one parent, frightened and outnumbered
                and there for the first time, sat across from a table of people who did this
                every week and spoke a language nobody had taught them. My job was to make sure
                the person with the most at stake wasn&rsquo;t the least prepared.
              </p>
              <p className="font-display text-2xl leading-snug italic md:text-3xl">
                I do the same thing now. The room changed. The job didn&rsquo;t.
              </p>
            </div>
          </div>

          {/*
            Deliberately NOT the home page portrait. Two large frames of the same
            photograph, one click apart and in the same grid position, reads as a
            stock template.
          */}
          <BrandPhoto
            photo={PHOTOS.portraitStudio}
            priority
            sizes="(min-width: 768px) 38vw, calc(100vw - 3.5rem)"
          />
        </div>
      </section>

      {/* --------------------------------------------------------------- VIDEO */}
      {/*
        Placed here on purpose: after the story, before the argument that follows
        from it. The copy does the work and the video corroborates it — a reader
        who arrives and presses play immediately has skipped the part of this
        page that is actually persuasive.

        One video per page, always. lib/video/index.ts returns at most one.
      */}
      {featured ? (
        <VideoEmbed
          video={featured.video}
          placement={featured.placement}
          className="border-b border-border"
        />
      ) : null}

      {/* --------------------------------------------------------- THE PARALLEL */}
      <section
        aria-labelledby="parallel"
        className="border-b border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="Why it transfers" id="parallel">
            It is the same room every time.
          </SectionHeading>

          <div className="mt-12 grid max-w-4xl gap-10 md:grid-cols-2">
            <p className="rule-gold pt-6 text-lg leading-relaxed">
              One party has everything at stake and has done this once.
            </p>
            <p className="rule-gold pt-6 text-lg leading-relaxed">
              The other party does this every week and knows the vocabulary.
            </p>
          </div>

          <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink-muted">
            An IEP meeting. A builder&rsquo;s sales office. A listing negotiation. Same
            asymmetry, different room. Once you have sat on the outnumbered side of that table
            for ten years, you stop being able to unsee it.
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            So I explain things. This is the largest purchase most people will ever make, and
            most people make it once or twice in a lifetime. Being nervous about that is the
            correct response. Not understanding what you are signing doesn&rsquo;t have to be
            part of it.
          </p>

          <p className="mt-8 max-w-2xl font-display text-xl leading-snug italic md:text-2xl">
            You should be able to explain your own contract back to me. That is the bar.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- WHAT NOW */}
      <section aria-labelledby="now" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="What that looks like" id="now">
          Most people think negotiating is just about getting the price down.
        </SectionHeading>

        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-ink-muted">
          <p>
            It isn&rsquo;t. Sometimes the biggest savings come from things buyers don&rsquo;t
            even know to ask for: a roof, a rate buydown, a closing date that lets you move
            once instead of twice. Which of those exist depends entirely on the house and the
            seller in front of you.
          </p>
          <p>
            I have owned and evaluated property as an investor, not just as an agent.
            That is a different way of looking at a house: what it will cost to hold, what the
            repairs actually run, what the number needs to be for it to make sense.
          </p>
          <p>
            I am licensed in both North Carolina and South Carolina, which matters more in this
            market than it sounds like it should. The state line runs through your monthly
            payment.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-14 gap-y-8 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <li key={pillar.href} className="rule-gold pt-5">
              <Link
                href={pillar.href}
                className="font-display text-2xl decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
              >
                {pillar.title}
              </Link>
              <p className="mt-2 max-w-md text-base leading-relaxed text-ink-muted">
                {pillar.table}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------------- RECORD */}
      <section
        aria-labelledby="record"
        className="border-y border-border bg-surface-sunken py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="The record" id="record">
            Where that has landed so far.
          </SectionHeading>

          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {RECORD.map((item) => (
              <div key={item.label} className="rule-gold pt-5">
                <dd className="figure-plain text-3xl">{item.value}</dd>
                <dt className="mt-3 text-sm leading-relaxed text-ink-muted">{item.label}</dt>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink-muted">
            All of it with {BROKERAGE.name}, across Charlotte and over the South Carolina line.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------- TEXTURE */}
      <section aria-labelledby="outside" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Outside the transaction" id="outside">
          Rooms I sit in when I&rsquo;m not doing this.
        </SectionHeading>

        <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-ink-muted">
          <p>
            I served four years as board president of my 105-unit townhome community in
            Ayrsley. That job is mostly mediating between neighbors who have to keep living
            next to each other after the meeting ends. It is good practice.
          </p>
          <p>
            I started a mastermind book club in 2018 and still lead it. It reads
            self-development. I read well past what the club assigns.
          </p>
          <p>
            My husband and I travel when the calendar allows it. The gym is not optional. Neither
            is the first walk of the day with my dog, Layla.
          </p>
          <p>I have twin daughters. I buy and sell in the market I live in.</p>
        </div>
      </section>

      <ClosingCta
        heading="Call me before you need me."
        body="The most useful conversations happen months before anyone writes an offer, when there is still time to change the plan. You don’t need a house picked out to have one."
        secondary={{ href: "/negotiation", label: GUIDE_TITLE }}
        placement="closing-about"
        intake={{
          source: "/about",
          heading: "Start the conversation early.",
          body: "Nothing here is prefilled. This page isn’t about one side of the table, so the first question is which one you’re on.",
        }}
      />
    </>
  );
}
