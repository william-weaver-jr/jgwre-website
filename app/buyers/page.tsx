import type { Metadata } from "next";
import Link from "next/link";

import { CaseLedger, CASE_RESALE } from "@/components/case-ledger";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { GUIDE_TITLE } from "@/lib/intake";
import { routeMetadata } from "@/lib/seo";

/*
  The buyer process end to end, framed as where the leverage points are —
  docs/CONTENT-PLAN.md. Case 1 from docs/CASE-STUDIES.md sits here.

  The table: the listing agent negotiates for a living and works for the seller.
  The buyer is doing this once.

  The organising idea is that leverage is perishable. Each stage below says where
  it exists and when it expires, because the thing a first-time buyer does not
  know is not "negotiate harder" — it is that the moment to ask has a deadline.

  Figures come from components/case-ledger.tsx so they cannot drift from the
  home page. $22,210 stays $22,210 — CASE-STUDIES.md. The dollar figures mean
  this page must carry the results disclaimer adjacent. CLAUDE.md §7.
*/

export const metadata: Metadata = {
  title: "Buyers",
  description:
    "The listing agent works for the seller. Where a buyer's leverage actually sits at each stage of a Charlotte or South Carolina purchase, and when it expires.",
  ...routeMetadata({ path: "/buyers" }),
};

/** Each stage: where the leverage is, and the moment it stops being available. */
const STAGES = [
  {
    n: "01",
    title: "Before you look at anything",
    body: "A fully underwritten pre-approval beats a pre-qualification letter, and it costs the same. It is what lets a seller take a slightly lower number from you over a higher one from someone who might not close.",
    expires: "Once you are writing an offer, this is already fixed.",
  },
  {
    n: "02",
    title: "The showing",
    body: "The agent at the open house works for the seller, and anything you say in the kitchen about how much you love the place is information they are paid to use. Being pleasant and being unguarded are different things.",
    expires: "Nothing said out loud can be taken back.",
  },
  {
    n: "03",
    title: "Writing the offer",
    body: "Price is one line. Closing date, possession, what conveys, who pays for the survey, how much due diligence money is at risk and for how long: every one of those is negotiable. Several are worth more than a price reduction.",
    expires: "This is the widest the table ever gets. It narrows from here.",
  },
  {
    n: "04",
    title: "Due diligence",
    body: "The inspection is the second negotiation, and it is rarely one question. A repair list can be repaired, credited, declined, or split line by line. A credit at closing is often worth more to a buyer than the repair itself.",
    expires: "When the due diligence period ends, so does this.",
  },
  {
    n: "05",
    title: "Appraisal and the run to closing",
    body: "If the appraisal comes in under contract price there is more than one move, and which ones exist depends on how the contract was written weeks earlier. This is where offer-stage decisions either help or cost.",
    expires: "Whatever the contract left you is what you have.",
  },
];

export default function BuyersPage() {
  return (
    <>
      <PageHero
        eyebrow="The other side of this table"
        title={
          <>
            The listing agent negotiates for a living.
            <span className="block italic">You are doing this once.</span>
          </>
        }
        lede={
          <>
            That asymmetry isn&rsquo;t a reason to be anxious. It&rsquo;s a reason to know
            where a buyer actually has leverage, and to use it while the window is still
            open. Most of it closes quietly.
          </>
        }
      />

      <section aria-labelledby="stages" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="The process" id="stages">
          Five stages. Each has a moment where asking still works.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Leverage is perishable. The list below is less about what happens than about when
          it is still possible to change it.
        </p>

        <ol className="mt-14 space-y-10">
          {STAGES.map((stage) => (
            <li key={stage.n} className="grid gap-6 rule-top pt-8 md:grid-cols-[11rem_1fr]">
              <div>
                <p className="eyebrow tabular-nums">Stage {stage.n}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl leading-snug md:text-3xl">{stage.title}</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {stage.body}
                </p>
                <p className="mt-4 max-w-2xl border-l-2 border-accent-soft pl-4 text-base leading-relaxed">
                  {stage.expires}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="worked"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-6xl px-gutter">
          <SectionHeading eyebrow="One transaction" id="worked">
            Price, cash, and position in one contract.
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            A resale purchase where three separate things were negotiated into a single
            contract. None of them would have been available a week later.
          </p>

          <CaseLedger className="mt-10 max-w-2xl" entries={CASE_RESALE} />

          <ResultsDisclaimer className="mt-8" />
        </div>
      </section>

      <section aria-labelledby="asking" className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow="What is actually askable" id="asking">
          The part nobody hands you.
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Most of what a buyer can ask for is not price, and it is not obvious from the
          outside which items exist on any given house. The full list is written out on{" "}
          <Link
            href="/negotiation"
            className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
          >
            {GUIDE_TITLE}
          </Link>
          , ungated. Read it before you write an offer rather than after.
        </p>
      </section>

      <ClosingCta
        heading="Call before you write the offer."
        body="The offer is the widest the table ever gets. Talking it through beforehand does more than any conversation after it is signed."
        placement="closing-buyers"
        secondary={{ href: "/negotiation", label: GUIDE_TITLE }}
        intake={{
          source: "/buyers",
          heading: "A few things about what you are looking at.",
          body: "Property type, where, and roughly when. That’s enough to tell which levers are plausibly on your table.",
          prefill: { side: "buying" },
        }}
      />
    </>
  );
}
