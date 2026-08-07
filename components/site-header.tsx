import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AGENT, SEARCH_HOMES_URL } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-gutter py-4">
        <Link
          href="/"
          className="mr-auto flex flex-col gap-1"
          aria-label={`${AGENT.name}, ${AGENT.title} — home`}
        >
          <span className="font-display text-2xl leading-none font-medium tracking-tight">
            {AGENT.name}
          </span>
          <span className="eyebrow hidden sm:inline">{AGENT.title}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <Link
            href="/about"
            className="text-sm decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
          >
            About
          </Link>
          <Link
            href="/negotiation"
            className="text-sm decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
          >
            Negotiation
          </Link>
          <a
            href={SEARCH_HOMES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
          >
            Search Homes
            <span className="sr-only"> (opens an external site)</span>
          </a>
        </nav>

        {/* Shares the Button so the header CTA cannot drift from the hero CTA. */}
        <Button asChild variant="phone" className="ml-2">
          <a href={AGENT.phoneHref}>
            <span className="sr-only">Call {AGENT.name} at </span>
            {AGENT.phoneDisplay}
          </a>
        </Button>
      </div>
    </header>
  );
}
