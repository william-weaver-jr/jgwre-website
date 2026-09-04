import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ContactIntake } from "@/components/contact-intake";
import type { Side } from "@/lib/intake";
import type { Lead } from "@/lib/lead";
import { AGENT } from "@/lib/site";

/**
 * The conversion path on every page. Phone first — CLAUDE.md Locked Decision #4:
 * there is no booking tool, clients call her directly.
 *
 * `secondary` is optional and must point at a route that exists. Do not link to
 * pages that have not shipped; mackenziesiek.com advertises six neighborhood URLs
 * that 404, and it is the first thing you notice.
 *
 * `placement` tags the `tel:` click for analytics. Every phone link on the site
 * carries one — docs/CONTACT-STRATEGY.md §5.3 compares them, and an unlabeled link
 * is a hole in that comparison.
 */
export function PhoneCta({
  secondary,
  placement,
  className = "",
  sms = true,
}: {
  secondary?: { href: string; label: string };
  placement: string;
  className?: string;
  /** The text affordance beneath the buttons. On by default; see SmsLine. */
  sms?: boolean;
}) {
  return (
    <div className={className}>
      {/*
        A grid, and it lays out on `lg` rather than `sm`. Both are about one
        thing: the secondary label is a real sentence — "The 19 Things Besides
        Price You Can Negotiate" — and it wraps.

        Centred in a flex row, each button took its own natural height, so the
        phone rendered 56px beside a 78px neighbour and the pair looked broken.
        Stretching fixes that but is not enough on its own: side by side at
        768px the label wrapped to four lines, both buttons became 150px tall,
        and a phone number floating in the middle of a 150px slab is worse than
        the mismatch was. So the row waits for `lg`, where there is room for the
        sentence on two lines.

        `auto-rows-fr` is what equalises them while STACKED, which flexbox
        cannot do — `items-stretch` on a column stretches width, not height.
        Below `lg` both buttons are the height of the taller one; at `lg` and up
        the grid flows into columns and stretches them to the row height.

        The result is equal heights at every width, which is the whole point.
      */}
      <div className="grid auto-rows-fr gap-3 lg:auto-rows-auto lg:grid-flow-col lg:auto-cols-max lg:justify-start">
        <Button asChild variant="phone" size="xl">
          <a href={AGENT.phoneHref} data-cta-placement={placement}>
            <span className="sr-only">Call {AGENT.name} at </span>
            {AGENT.phoneDisplay}
          </a>
        </Button>
        {secondary ? (
          <Button asChild variant="outlineInk" size="xl">
            <Link href={secondary.href}>{secondary.label}</Link>
          </Button>
        ) : null}
      </div>
      {sms ? <SmsLine placement={placement} /> : null}
    </div>
  );
}

/**
 * "Or text her" — a line of copy, not a third button.
 *
 * It is deliberately quieter than the two buttons above it. Locked Decision #4
 * makes the phone the primary path, and a third equal-weight control is how a
 * clear choice becomes a menu. What this fixes is narrower: /contact has told
 * visitors "calls and texts both work" since launch, and until 2026-08-31 there
 * was no `sms:` link anywhere on the site — the copy was writing a cheque the
 * interface did not honour.
 *
 * The number is visible rather than implied. On a desktop an `sms:` link
 * usually does nothing useful, so the reader needs to be able to read the
 * number and pick up their own phone.
 */
export function SmsLine({
  placement,
  className = "mt-4",
}: {
  placement: string;
  className?: string;
}) {
  return (
    <p className={`text-base leading-relaxed text-ink-muted ${className}`}>
      Or text her at{" "}
      <a
        href={AGENT.smsHref}
        // Suffixed rather than replaced, so §5.3 can still group every
        // affordance that belongs to one placement.
        data-cta-placement={`${placement}-sms`}
        /*
          `aria-label`, not the `sr-only` prefix the phone buttons use, and the
          difference is the sentence around it. Those buttons contain nothing
          but the number, so a hidden "Call Jasmine Garcia at" in front of it
          reads correctly. Here the visible copy already says "Or text her at",
          so the same trick announced "Or text her at Text Jasmine Garcia at
          (704) 200-9360."

          Replacing the name outright gives the link a good one out of context —
          a number alone is a poor link purpose under WCAG 2.4.4 — without
          repeating the words next to it.
        */
        aria-label={`Text ${AGENT.name} at ${AGENT.phoneDisplay}`}
        className="font-medium tabular-nums text-ink underline decoration-accent-soft decoration-1 underline-offset-4 hover:decoration-accent"
      >
        {AGENT.phoneDisplay}
      </a>
      .
    </p>
  );
}

/**
 * Closing block for interior pages. Phone first, then the intake.
 *
 * The order is the argument: the visitor who is ready to talk sees the number
 * before anything else, and the one who isn't gets a way to start that doesn't
 * require phoning a stranger. Both capture people the other misses —
 * docs/CONTACT-STRATEGY.md §2.
 *
 * `intake` is optional only so a page can opt out deliberately. It should be the
 * rare case: sending a persuaded reader to `/contact` costs a navigation at exactly
 * the moment intent peaks, which is the mistake mattstoneteam.com makes.
 */
export function ClosingCta({
  heading,
  body,
  secondary,
  placement,
  intake,
}: {
  heading: string;
  body: string;
  secondary?: { href: string; label: string };
  placement: string;
  intake?: {
    /** Page slug, for `source` on the lead. */
    source: string;
    heading: string;
    body: string;
    leadType?: Lead["leadType"];
    prefill?: { side?: Side; answers?: Record<string, string | string[]> };
  };
}) {
  return (
    <>
      <section aria-labelledby="next-step" className="mx-auto max-w-6xl px-gutter py-section">
        <p className="eyebrow">Next step</p>
        <h2 id="next-step" className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
          {heading}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">{body}</p>
        <PhoneCta className="mt-9" secondary={secondary} placement={placement} />
      </section>

      {intake ? <ContactIntake {...intake} /> : null}
    </>
  );
}
