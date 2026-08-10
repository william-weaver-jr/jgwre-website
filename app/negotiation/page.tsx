import type { Metadata } from "next";
import Link from "next/link";

import { ContactIntake } from "@/components/contact-intake";
import { AGENT } from "@/lib/site";

/*
  The lead magnet landing page. Ported from the Lovable draft.

  docs/CONTENT-PLAN.md specifies this page as the gated guide; for now it is the
  ungated list, which is what the header and footer already link to. The form that
  turns it into a lead magnet lands with the FUB wiring — CLAUDE.md §9.

  Every item below is a real term in an NC or SC purchase contract. Nothing here
  is a claim about outcomes.
*/

export const metadata: Metadata = {
  title: "The 19 Things Besides Price You Can Negotiate",
  description:
    "Price is one line in the contract. Here is the list of everything else on the table in a Charlotte, NC or South Carolina purchase.",
  alternates: { canonical: "/negotiation" },
  openGraph: {
    title: "19 Things Besides Price You Can Negotiate",
    description: "Price is one line in the contract. Here is the list of everything else.",
  },
};

const ITEMS = [
  "Roof replacement",
  "HVAC service or replacement",
  "Home warranty",
  "Appliances, including the refrigerator",
  "Seller-paid closing costs",
  "Interest rate buydown",
  "Repair credits in lieu of repairs",
  "Inspection and due diligence timelines",
  "Due diligence fee amount",
  "Earnest money amount and terms",
  "Closing date",
  "Possession date and post-closing occupancy",
  "Rent-back terms",
  "Survey and its cost",
  "Termite and wood-infestation report",
  "Septic, well, and water testing",
  "Title and attorney fee allocation",
  "Builder incentives and upgrade allowances",
  "Which lender or title company is used",
];

export default function NegotiationPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-gutter py-20">
        <p className="eyebrow">The list</p>
        <h1 className="mt-3 font-display text-display-sm text-balance sm:text-display">
          The 19 Things Besides Price You Can Negotiate
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Price is one line in the contract. Everything below is also on the table. What matters is
          which of these are worth asking for on the specific house you want.
        </p>

        <ol className="mt-10 divide-y divide-border border-t border-border">
          {ITEMS.map((item, i) => (
            <li key={item} className="flex items-baseline gap-4 py-3">
              <span className="figure-plain w-8 shrink-0 text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base">{item}</span>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-base leading-relaxed">
          Every transaction is different. Call{" "}
          <a
            href={AGENT.phoneHref}
            data-cta-placement="negotiation-inline"
            className="font-medium text-accent underline decoration-accent-soft underline-offset-4 hover:decoration-accent"
          >
            <span className="sr-only">Call {AGENT.name} at </span>
            {AGENT.phoneDisplay}
          </a>{" "}
          to talk through which items apply to yours.
        </p>

        <p className="mt-10">
          <Link href="/" className="text-sm font-semibold underline underline-offset-4">
            Back home
          </Link>
        </p>
      </div>

      {/*
        The list stays ungated. What the intake adds is the part the list can't do —
        which of the nineteen are worth asking for on one specific house. That is a
        better reason to submit than a download gate, and it doesn't take the useful
        thing away from someone who won't.

        `leadType` is forced to `guide` regardless of step 1: CONTENT-PLAN.md defines
        this page's lead type by the page, not by the answers.
      */}
      <ContactIntake
        source="/negotiation"
        leadType="guide"
        heading="Which of the nineteen apply to your house?"
        body="A few taps about what you’re looking at, then your details. The list above is everything that can be asked for; this narrows it to what’s plausibly on your table."
      />
    </>
  );
}
