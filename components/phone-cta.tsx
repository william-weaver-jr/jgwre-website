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
}: {
  secondary?: { href: string; label: string };
  placement: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center ${className}`}
    >
      <Button asChild variant="phone" size="xl" className="w-full sm:w-auto">
        <a href={AGENT.phoneHref} data-cta-placement={placement}>
          <span className="sr-only">Call {AGENT.name} at </span>
          {AGENT.phoneDisplay}
        </a>
      </Button>
      {secondary ? (
        <Button asChild variant="outlineInk" size="xl" className="w-full sm:w-auto">
          <Link href={secondary.href}>{secondary.label}</Link>
        </Button>
      ) : null}
    </div>
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
