import Link from "next/link";

import { PrimaryNav } from "@/components/primary-nav";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/nav";
import { AGENT } from "@/lib/site";

/**
 * The structure of the nav is data, in lib/nav.ts, and both of its renderings
 * are in components/primary-nav.tsx. This file stays a Server Component: it
 * resolves the nav model — which reads the areas, transactions, and blog
 * datasets to decide what may be linked — and hands it down.
 *
 * The phone button is not in that model, deliberately. It is the conversion
 * path, not a section of the site, and CLAUDE.md Locked Decision #4 keeps it
 * visible at every width including the one where the rest of the nav collapses.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      {/* Three things now compete for 319px on a 375px phone: her name, the menu
          trigger, and the phone button. The name and the button both step down a
          size below `sm` rather than either one being dropped — the number stays
          on screen at every width, which is the whole posture of the site. */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-gutter py-4 sm:gap-4">
        <Link
          href="/"
          className="mr-auto flex flex-col gap-1"
          aria-label={`${AGENT.name}, ${AGENT.title}, home`}
        >
          <span className="font-display text-xl leading-none font-medium tracking-tight sm:text-2xl">
            {AGENT.name}
          </span>
          <span className="eyebrow hidden sm:inline">{AGENT.title}</span>
        </Link>

        <PrimaryNav items={primaryNav()} />

        {/* Shares the Button so the header CTA cannot drift from the hero CTA. */}
        <Button asChild variant="phone" className="px-3 sm:px-5">
          <a href={AGENT.phoneHref} data-cta-placement="header">
            <span className="sr-only">Call {AGENT.name} at </span>
            {AGENT.phoneDisplay}
          </a>
        </Button>
      </div>
    </header>
  );
}
