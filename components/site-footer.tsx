import Link from "next/link";

import { AGENT, BROKERAGE, SEARCH_HOMES_URL } from "@/lib/site";

/**
 * Required on every page. Carries brokerage identification, both license
 * numbers, the Equal Housing Opportunity mark, and the REALTOR® mark.
 *
 * Treat changes here as compliance changes, not design changes. CLAUDE.md §7.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-gutter py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl leading-tight font-medium">{AGENT.name}</p>
            <p className="eyebrow mt-1">{AGENT.title}</p>
            <a
              href={AGENT.phoneHref}
              className="mt-5 inline-block text-2xl font-medium tracking-tight tabular-nums underline decoration-accent-soft decoration-1 underline-offset-4 hover:decoration-accent"
            >
              <span className="sr-only">Call {AGENT.name} at </span>
              {AGENT.phoneDisplay}
            </a>
          </div>

          <address className="text-sm leading-relaxed not-italic">
            <span className="block font-semibold">{BROKERAGE.name}</span>
            {BROKERAGE.street}
            <br />
            {BROKERAGE.city}, {BROKERAGE.state} {BROKERAGE.zip}
            <p className="mt-4 tabular-nums text-ink-muted">
              {BROKERAGE.licenses.map((l) => `License ${l.state} ${l.number}`).join(" · ")}
            </p>
            <p className="mt-2 text-ink-muted">
              Licensed in North Carolina and South Carolina.
            </p>
          </address>

          <nav aria-label="Footer" className="text-sm">
            <ul className="space-y-2">
              <li>
                <Link href="/negotiation" className="underline-offset-4 hover:underline">
                  The 19 Things Besides Price You Can Negotiate
                </Link>
              </li>
              <li>
                <a
                  href={SEARCH_HOMES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  Search Homes
                  <span className="sr-only"> (opens an external site)</span>
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <EqualHousingMark />
            <RealtorMark />
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
            {AGENT.name} is a licensed real estate broker affiliated with {BROKERAGE.name}. All
            real estate services are provided through {BROKERAGE.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}

/*
  TODO(assets): both marks below are placeholder line art, NOT the official
  registered artwork. Replace with the licensed EHO logo and the NAR REALTOR®
  mark before launch. Trademark exposure, not a design preference.
  Tracked in docs/brand-decisions.md.
*/

function EqualHousingMark() {
  return (
    <div className="flex items-center gap-2">
      <svg
        role="img"
        aria-label="Equal Housing Opportunity"
        viewBox="0 0 48 48"
        className="h-10 w-10 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <title>Equal Housing Opportunity</title>
        <path d="M4 22 24 7l20 15" strokeLinejoin="round" />
        <path d="M9 22v19h30V22" strokeLinejoin="round" />
        <path d="M17 27h14M17 34h14" />
      </svg>
      <span className="max-w-[7rem] text-[0.6875rem] leading-tight font-semibold tracking-wide uppercase">
        Equal Housing Opportunity
      </span>
    </div>
  );
}

function RealtorMark() {
  return (
    <div className="flex items-center gap-2">
      <svg
        role="img"
        aria-label="REALTOR® mark"
        viewBox="0 0 48 48"
        className="h-10 w-10 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <title>REALTOR®</title>
        <rect x="5" y="5" width="38" height="38" rx="3" />
        <path d="M15 34V15h8a5.5 5.5 0 0 1 0 11h-8l10 8" strokeLinejoin="round" />
      </svg>
      <span className="text-[0.6875rem] leading-tight font-semibold tracking-wide uppercase">
        REALTOR&reg;
      </span>
    </div>
  );
}
