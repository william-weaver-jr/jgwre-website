import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { TransactionRow } from "@/components/transaction-row";
import { AGENT, CAREER_TRANSACTIONS, PILLARS } from "@/lib/site";
import { routeMetadata } from "@/lib/seo";
import {
  filterByPillar,
  groupByYear,
  isTransactionsPageIndexable,
  visibleTransactions,
  type TransactionPillar,
} from "@/lib/transactions";

/*
  /transactions — closed transactions, as a ledger.

  THE TEMPLATE IS FINISHED; THE DATA IS NOT. lib/transactions/data.ts is empty
  and stays empty until the Follow Up Boss or MLS export arrives (CLAUDE.md §6
  forbids inventing entries). Everything below — filters, year grouping, the row
  component, the empty state — works against real rows the moment they land.

  In development the page falls back to lib/transactions/sample.ts and says so in
  a banner. Production cannot reach those rows; see visibleTransactions().

  NOT ON THIS PAGE: active, pending, or coming-soon listings. That half is a
  compliance conflict, flagged rather than built — docs/TRANSACTIONS-SPEC.md §2.
  It needs written BIC approval, and it reinstates the exact surface Locked
  Decision #1 exists to avoid. Do not add it on request alone.

  Filtering is a plain URL parameter read on the server. No client JS, no state,
  and every filtered view is a real crawlable URL that survives the back button.
*/

const PILLAR_KEYS = PILLARS.map((pillar) => pillar.href.replace("/", "") as TransactionPillar);

function isPillar(value: string | undefined): value is TransactionPillar {
  return !!value && (PILLAR_KEYS as string[]).includes(value);
}

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "Closed transactions for Jasmine Garcia, Broker/REALTOR® with Stone Realty Group: new construction, relocation, and both sides of the NC/SC line.",
  ...routeMetadata({ path: "/transactions" }),
  /*
    Noindex until the ledger is substantial — TRANSACTIONS_INDEX_THRESHOLD, not
    merely non-empty. A page carrying two closings is as thin as one carrying
    none, and it competes with her real pages while making a weaker version of
    their argument. Crossing the threshold removes the tag, adds the sitemap
    entry, and reveals the footer link — one dataset, three effects.
  */
  ...(isTransactionsPageIndexable() ? {} : { robots: { index: false, follow: true } }),
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ pillar?: string }>;
}) {
  const { pillar } = await searchParams;
  const active = isPillar(pillar) ? pillar : null;

  const { rows, isSample } = visibleTransactions();
  const filtered = filterByPillar(rows, active);
  const years = groupByYear(filtered);

  return (
    <>
      <PageHero
        eyebrow="Transactions"
        title={
          <>
            Every one of these was a different table.
            <span className="block italic">Here is what was on them.</span>
          </>
        }
        lede={
          <>
            Closed transactions, both sides, grouped by year. Where something other than price
            moved, it says so. That is usually where the money was.
            {/*
              Why this page counts fewer than the home page does.

              The home page and /about both state {CAREER_TRANSACTIONS} career
              transactions; the filter below reads "All ({rows.length})". A
              visitor comparing the two sees a discrepancy and has no way to tell
              that the numbers measure different things.

              The ledger is NOT a curated selection — every row in the closed
              transactions workbook is here. It is simply not the whole career
              yet, because the workbook is still being filled in from the closing
              records. An earlier proposal to label these "featured transactions"
              would have been inaccurate in exactly the direction that matters:
              it implies the rest were judged and left out.

              Derived from `rows`, never typed. The workbook grows.
            */}
            {rows.length > 0 ? (
              <span className="mt-5 block">
                {rows.length} of them are documented here so far, out of {CAREER_TRANSACTIONS}{" "}
                in her career. This is the whole ledger, not a selection from it — the rest
                are still being entered from the closing records.
              </span>
            ) : null}
          </>
        }
      />

      {isSample ? (
        <div className="border-b-2 border-accent bg-surface-sunken">
          <p className="mx-auto max-w-6xl px-gutter py-5 text-base leading-relaxed">
            <span className="eyebrow">Development only</span>
            <span className="mt-2 block">
              These rows are placeholders for judging the layout. They are not real
              transactions, they carry no dollar figures, and a production build cannot render
              them. Populate <code className="font-sans">lib/transactions/data.ts</code> to
              replace them.
            </span>
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------- FILTERS */}
      {rows.length > 0 ? (
        <nav
          aria-label="Filter transactions"
          className="border-b border-border bg-surface-raised"
        >
          <div className="mx-auto max-w-6xl px-gutter py-5">
            {/*
              Horizontally scrollable on a phone rather than wrapped into three
              rows. Filters by PILLAR, not property type — the pillars are the
              argument this page is making.
            */}
            <ul className="-mx-gutter flex gap-3 overflow-x-auto px-gutter pb-1">
              <li className="shrink-0">
                <FilterChip href="/transactions" label="All" count={rows.length} active={!active} />
              </li>
              {PILLARS.map((item) => {
                const key = item.href.replace("/", "") as TransactionPillar;
                const count = filterByPillar(rows, key).length;
                if (count === 0) return null;
                return (
                  <li key={key} className="shrink-0">
                    <FilterChip
                      href={`/transactions?pillar=${key}`}
                      label={item.title}
                      count={count}
                      active={active === key}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      ) : null}

      {/* -------------------------------------------------------------- LEDGER */}
      {/* Tighter above the first year on a phone — the filters already gave the
          eye a break, and a full section gap there reads as a broken page. */}
      <section
        aria-labelledby="ledger"
        className="mx-auto max-w-6xl px-gutter pt-14 pb-section md:pt-section"
      >
        <h2 id="ledger" className="sr-only">
          Closed transactions
        </h2>

        {years.length === 0 ? (
          <div className="max-w-2xl">
            <p className="eyebrow">In progress</p>
            <p className="mt-4 font-display text-2xl leading-snug md:text-3xl">
              This page is being built from her closing records.
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Rather than round numbers up or reconstruct transactions from memory, it stays
              empty until the records are in hand. In the meantime the three documented
              negotiations on the home page are the detailed version, and the reviews are the
              clients&rsquo; own account.
            </p>
            <p className="mt-6 text-base">
              <Link
                href="/reviews"
                className="decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
              >
                Read the reviews
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {years.map((group) => (
              <section key={group.year} aria-labelledby={`year-${group.year}`}>
                <h3
                  id={`year-${group.year}`}
                  className="figure-plain border-b border-border pb-3 text-sm"
                >
                  {group.year}
                  <span className="sr-only">
                    , {group.rows.length} transaction{group.rows.length === 1 ? "" : "s"}
                  </span>
                </h3>

                {/* One column on a phone; two from md up. */}
                <div className="mt-10 grid gap-x-14 gap-y-12 md:grid-cols-2">
                  {group.rows.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <ClosingCta
        heading="Ask what moved on a house like yours."
        body={`Every one of these started with a call. ${AGENT.phoneDisplay} reaches her directly, and one conversation is usually enough to know which levers exist on the house you are looking at.`}
        secondary={{ href: "/reviews", label: "What those clients said" }}
        placement="closing-transactions"
        intake={{
          source: "/transactions",
          heading: "Ask about the house you are actually looking at.",
          body: "The levers above existed because someone asked about that specific property. Yours will be different, which is what the questions are for.",
        }}
      />
    </>
  );
}

function FilterChip({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      // py-3 rather than py-2.5: at 2.5 the chip lands at 42px, under the 44px
      // touch-target minimum. These are the page's only controls and the phone
      // is the primary device.
      className={`inline-flex items-center gap-2 rounded-sm border px-4 py-3 text-sm whitespace-nowrap transition-colors ${
        active
          ? "border-border-strong bg-primary text-primary-foreground"
          : "border-border hover:border-accent-soft"
      }`}
    >
      {label}
      <span className={`figure-plain text-xs ${active ? "text-primary-foreground" : "text-ink-muted"}`}>
        {count}
      </span>
    </Link>
  );
}
