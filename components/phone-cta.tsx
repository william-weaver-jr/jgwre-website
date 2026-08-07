import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AGENT } from "@/lib/site";

/**
 * The conversion path on every page. Phone first — CLAUDE.md Locked Decision #4:
 * there is no booking tool, clients call her directly.
 *
 * `secondary` is optional and must point at a route that exists. Do not link to
 * pages that have not shipped; mackenziesiek.com advertises six neighborhood URLs
 * that 404, and it is the first thing you notice.
 */
export function PhoneCta({
  secondary,
  className = "",
}: {
  secondary?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center ${className}`}
    >
      <Button asChild variant="phone" size="xl" className="w-full sm:w-auto">
        <a href={AGENT.phoneHref}>
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
 * Closing block for interior pages. Phone-first, no form — lead forms land with the
 * FUB wiring in CLAUDE.md §9, and nothing ships with an unwired form.
 */
export function ClosingCta({
  heading,
  body,
  secondary,
}: {
  heading: string;
  body: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section aria-labelledby="next-step" className="mx-auto max-w-6xl px-gutter py-section">
      <p className="eyebrow">Next step</p>
      <h2 id="next-step" className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
        {heading}
      </h2>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">{body}</p>
      <PhoneCta className="mt-9" secondary={secondary} />
    </section>
  );
}
