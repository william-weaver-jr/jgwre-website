import type { Metadata } from "next";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";

/*
  PILLAR — relocation.

  The table: everyone in the transaction is local except the client.

  18 relocation transactions is documented in CLAUDE.md §5.

  TODO(content): docs/CONTENT-PLAN.md and BRAND-VOICE.md §5 both call for the Kathy
  Hannan testimonial here (Phoenix buyers, Hurricane Ian showing) as direct evidence
  for this exact claim. It is not in docs/placester-archive/ and I will not
  paraphrase a review — CLAUDE.md §7 requires verbatim reproduction. Ask Jasmine for
  the original text. A verified out-of-state seller review is archived at
  docs/placester-archive/text/testimonial_cristinamaria-lopez5.txt if a second is wanted.

  TODO(feature): the downloadable relocation guide (FUB lead type `relocation`) lands
  with the form work in CLAUDE.md §9. Nothing ships with an unwired form.

  Fair housing: describe commute, cost, housing stock, and geography. Never the
  people who live somewhere. CLAUDE.md §7.
*/

export const metadata: Metadata = {
  title: "Relocation",
  description:
    "Moving to Charlotte from out of state? Everyone else in the transaction is local except you. 18 relocation transactions across the Charlotte metro and into South Carolina.",
  alternates: { canonical: "/relocation" },
};

const GAPS = [
  {
    n: "01",
    title: "Geography you cannot learn from a map",
    body: "Charlotte is a set of submarkets that price very differently within a few miles of each other. Which side of a given road you land on changes the number, and no listing site explains why.",
  },
  {
    n: "02",
    title: "The state line is a real decision",
    body: "Part of this metro is in South Carolina. That changes your tax picture, your vehicle registration, and your closing process — not just your address.",
  },
  {
    n: "03",
    title: "Commute is measured at the wrong hour",
    body: "A drive-time estimate at 2pm on a Sunday is not the drive you will make on a Tuesday morning. This is knowable in advance, and it is worth knowing before you choose a street.",
  },
  {
    n: "04",
    title: "You cannot walk the house",
    body: "Which means someone has to, and has to tell you the unflattering version. Grade and drainage, road noise, what the back of the lot actually backs up to, whether the photos were taken wide.",
  },
];

const ON_THE_GROUND = [
  "Walk homes on video, unedited, including the parts a listing photo crops out",
  "Drive the commute at the hour you would actually drive it",
  "Run the NC versus SC comparison on the specific homes you are weighing",
  "Attend inspections, appraisals, and final walkthroughs in person",
  "Coordinate a remote closing so the trip you take is the one you want to take",
];

export default function RelocationPage() {
  return (
    <>
      <PageHero
        eyebrow="Pillar · The other side of this table"
        title={
          <>
            You’re two thousand miles out.
            <span className="block italic">Everyone else at the table is twenty minutes away.</span>
          </>
        }
        lede={
          <>
            The listing agent, the seller, the inspector, the appraiser, the attorney — all local,
            all fluent in a market you are reading about on a screen. That gap is the thing to
            close first.
          </>
        }
      />

      {/* ------------------------------------------------------------- THE RECORD */}
      <section aria-labelledby="record" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The record" id="record">
          18 relocation transactions.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Buyers arriving from out of state, and sellers leaving it. Both directions have the same
          problem in reverse: the person with the most at stake is the one who cannot be in the
          room.
        </p>
      </section>

      {/* ------------------------------------------------------------------ GAPS */}
      <section
        aria-labelledby="gaps"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="What they know" id="gaps">
            Four things local buyers never have to ask.
          </SectionHeading>

          <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {GAPS.map((gap) => (
              <article key={gap.n} className="rule-gold pt-6">
                <p className="eyebrow tabular-nums">{gap.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">{gap.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">{gap.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- ON THE GROUND */}
      <section aria-labelledby="ground" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="On the ground" id="ground">
          What happens when you can’t be here.
        </SectionHeading>

        <ol className="mt-10 max-w-3xl divide-y divide-border border-t border-border">
          {ON_THE_GROUND.map((item, i) => (
            <li key={item} className="flex items-baseline gap-5 py-4">
              <span className="figure-plain w-8 shrink-0 text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <ClosingCta
        heading="Call from wherever you are."
        body="Most relocation calls start months before the move. Earlier is better — the questions that matter are the ones asked before a neighborhood is chosen."
        secondary={{ href: "/carolinas-border", label: "NC or SC: what changes" }}
        placement="closing-relocation"
        intake={{
          source: "/relocation",
          heading: "Tell me where you are moving from.",
          body: "Four questions, then your details. Which parts of this process will feel unfamiliar depends almost entirely on where you have bought before.",
          prefill: { side: "relocating" },
        }}
      />
    </>
  );
}
