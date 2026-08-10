import Link from "next/link";

import { EqualHousingMark, RealtorMark } from "@/components/compliance-marks";
import { AGENT, BROKERAGE, PILLARS, SEARCH_HOMES_URL } from "@/lib/site";
import { TRANSACTIONS } from "@/lib/transactions";

/**
 * Required on every page. Carries brokerage identification, both license
 * numbers, the Equal Housing Opportunity mark, and the REALTOR® mark.
 *
 * Treat changes here as compliance changes, not design changes. CLAUDE.md §7.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      {/* Extra bottom padding on mobile clears the sticky contact bar, so the
          license numbers and the Equal Housing mark are never sitting under it
          at the end of the document. CLAUDE.md §7. */}
      <div className="mx-auto max-w-6xl px-gutter py-14 pb-28 md:pb-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl leading-tight font-medium">{AGENT.name}</p>
            <p className="eyebrow mt-1">{AGENT.title}</p>
            <a
              href={AGENT.phoneHref}
              data-cta-placement="footer"
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
                <Link href="/about" className="underline-offset-4 hover:underline">
                  About Jasmine
                </Link>
              </li>
              {PILLARS.map((pillar) => (
                <li key={pillar.href}>
                  <Link href={pillar.href} className="underline-offset-4 hover:underline">
                    {pillar.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/reviews" className="underline-offset-4 hover:underline">
                  Reviews
                </Link>
              </li>
              {/* Appears when lib/transactions/data.ts has rows. Linking an empty
                  page from every page on the site advertises the gap. */}
              {TRANSACTIONS.length > 0 ? (
                <li>
                  <Link href="/transactions" className="underline-offset-4 hover:underline">
                    Transactions
                  </Link>
                </li>
              ) : null}
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
                <Link href="/contact" className="underline-offset-4 hover:underline">
                  Contact
                </Link>
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
  The marks live in components/compliance-marks.tsx. They render as text until
  the licensed artwork is in public/marks/ — see that file and
  public/marks/README.md for why, and for how to turn the artwork on.
*/
