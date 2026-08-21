import type { Metadata } from "next";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { BROKERAGE } from "@/lib/site";

/*
  PILLAR — the NC/SC border.

  The table: two states, two tax regimes, two rulebooks.

  FAIR HOUSING (CLAUDE.md §7): this page discusses tax treatment, registration,
  closing process, commute, and cost. It does not rate schools, does not describe
  who lives anywhere, and does not use "safe," "good schools," or "up-and-coming."
  The school section deliberately declines to rate anything and points the reader at
  the district. Keep it that way.

  ACCURACY: every specific rate, ratio, and bracket is marked TODO(verify) rather
  than stated. Tax figures change by legislative session and by county, and this
  site cannot publish a number it has not verified — docs/BRAND-VOICE.md §2. The
  mechanisms below are stable; the numbers attached to them are not. A CPA or the
  BIC should review this page before launch.

  Waxhaw is in Union County, NORTH Carolina. CLAUDE.md §5 lists it in the "(SC)"
  group, which is an error in that document — flagged, not silently propagated.
*/

export const metadata: Metadata = {
  title: "The NC/SC Border",
  description:
    "Fort Mill, Tega Cay, Indian Land, Lake Wylie, Waxhaw. Two states, two tax regimes, two rulebooks, and a state line running through your monthly payment.",
  alternates: { canonical: "/carolinas-border" },
};

const DIFFERENCES = [
  {
    n: "01",
    title: "Property tax is calculated differently",
    body: "Both states tax real property at the local level, but they get to the number by different routes. South Carolina assesses an owner-occupied primary residence at a different ratio than a second home or a rental, and the gap between those two is large enough to change whether a house is affordable. Confirm your specific situation before you rely on any estimate.",
  },
  {
    n: "02",
    title: "Vehicles are taxed as property",
    body: "Both Carolinas levy an annual property tax on vehicles, collected alongside registration. If you are moving from a state that does not do this, it is a recurring line item you have not budgeted for, and it lands per vehicle.",
  },
  {
    n: "03",
    title: "Income tax is structured differently",
    body: "North Carolina and South Carolina take different approaches to individual income tax, one flat and one graduated. Which costs you more depends entirely on your income and your deductions, so it is worth an actual calculation rather than a rule of thumb.",
  },
  {
    n: "04",
    title: "The closing process is not identical",
    body: "Both states involve an attorney in a residential closing, but the timelines, the due diligence structure, and what the buyer forfeits at which stage are not the same. A contract term that is standard on one side of the line can be unusual on the other.",
  },
];

const MARKETS = [
  { name: "Fort Mill", state: "SC", note: "York County" },
  { name: "Tega Cay", state: "SC", note: "York County" },
  { name: "Indian Land", state: "SC", note: "Lancaster County" },
  { name: "Lake Wylie", state: "SC", note: "York County" },
  { name: "Waxhaw", state: "NC", note: "Union County" },
];

export default function CarolinasBorderPage() {
  return (
    <>
      <PageHero
        eyebrow="Pillar · The other side of this table"
        title={
          <>
            Two states, two tax regimes, two rulebooks.
            <span className="block italic">The state line runs through your monthly payment.</span>
          </>
        }
        lede={
          <>
            Two houses fifteen minutes apart can carry very different annual costs and close under
            different rules. Buyers comparing them on list price alone are comparing the wrong
            number.
          </>
        }
      />

      {/* --------------------------------------------------------- DUAL LICENSURE */}
      <section aria-labelledby="licensed" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="Both sides" id="licensed">
          Licensed in North Carolina and South Carolina.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Most agents in this market hold one license and can only work one side of the line. So
          the comparison you most need, this house in NC against that house in SC, is the one
          they cannot run for you.
        </p>
        <p className="mt-6 max-w-2xl tabular-nums text-base text-ink-muted">
          {BROKERAGE.licenses.map((l) => `License ${l.state} ${l.number}`).join(" · ")}
        </p>
        <p className="mt-8 max-w-2xl text-base leading-relaxed">
          12 closings in the Fort Mill corridor.
        </p>
      </section>

      {/* ----------------------------------------------------------- DIFFERENCES */}
      <section
        aria-labelledby="differences"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="What changes at the line" id="differences">
            Four things that are not the same on both sides.
          </SectionHeading>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
            None of these show up in a listing price.
          </p>

          <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {DIFFERENCES.map((item) => (
              <article key={item.n} className="rule-gold pt-6">
                <p className="eyebrow tabular-nums">{item.n}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          {/*
            Not the results disclaimer — this is a separate accuracy disclaimer for
            tax content, which is not real estate advice and changes by session and
            county. Keep both distinct.
          */}
          <p className="mt-14 max-w-3xl border-l-2 border-accent pl-5 text-base leading-relaxed text-ink">
            Tax treatment changes by legislative session, by county, and by your own
            circumstances. Nothing here is tax or legal advice. Confirm the numbers for your
            specific situation with a CPA or attorney licensed in the relevant state.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------- MARKETS */}
      <section aria-labelledby="markets" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The corridor" id="markets">
          The markets on either side of the line.
        </SectionHeading>

        <ul className="mt-10 max-w-3xl divide-y divide-border border-y border-border">
          {MARKETS.map((market) => (
            <li key={market.name} className="flex items-baseline justify-between gap-6 py-4">
              <span className="text-base">{market.name}</span>
              <span className="text-sm text-ink-muted">
                {market.note} &middot;{" "}
                <span className="figure-plain text-sm">{market.state}</span>
              </span>
            </li>
          ))}
        </ul>

        {/*
          Schools: structure only, never quality. CLAUDE.md §7 bans rating schools or
          characterizing who attends them. This says where to look and nothing else.
        */}
        <h3 className="mt-14 font-display text-2xl md:text-3xl">On schools</h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          Assignment is by address, and the two states organize their districts differently, so a
          move across the line changes which system an address falls under. This site does not
          rate schools. That is not a real estate question, and you should not take a
          broker&rsquo;s word for it. Ask the district for current assignment before you write an
          offer, and I will point you at the right office.
        </p>
      </section>

      <ClosingCta
        heading="Run the numbers before you pick a side."
        body="The comparison is worth running on the specific homes you are weighing, not in the abstract. It usually takes one phone call and it changes what people shortlist."
        secondary={{ href: "/relocation", label: "Moving from out of state" }}
        placement="closing-carolinas-border"
        intake={{
          source: "/carolinas-border",
          heading: "Run the comparison on your actual shortlist.",
          body: "A few questions about what you’re weighing. What the state line changes depends on which of those you’re answering.",
          prefill: { side: "buying", answers: { markets: ["carolinas-border"] } },
        }}
      />
    </>
  );
}
