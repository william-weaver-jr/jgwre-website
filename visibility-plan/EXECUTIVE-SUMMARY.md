# Executive Summary — Visibility & Traction Plan

**Prepared:** 2026-08-24 · **Status:** for approval. Nothing in this plan has been implemented.
**Scope:** jasminegarcia.com (live on Vercel), the repository, and the surrounding profile
ecosystem.

---

## 1. Where visibility stands today

**The site is built well and is almost invisible. Those are not in conflict — it is new.**

The engineering is genuinely above the standard of its competitive set. Every one of the
17 URLs in the sitemap returns 200, carries a self-referencing canonical, has exactly one
`<h1>`, and has a unique meta description. The apex is canonical and `www` returns a clean
308. Time-to-first-byte on the home page measured **0.22s** against a prerendered, CDN-cached
document. GA4 is live and firing real events. A compliance test suite fails the build on
fair-housing language and undocumented figures — which is not something any competitor
reviewed here can say.

What the site does not yet have is *reach*. Three things explain almost all of it:

1. **The domain is effectively new.** A search for `"jasminegarcia.com"` surfaced nothing
   belonging to her. That is a signal, not a measurement — confirming actual index coverage
   requires Google Search Console, which we do not have.
2. **The old site is still live and still competing.** `jasminegarcia.myrealestateplatform.com`
   returns **200** today, with 50 URLs of Charlotte-targeted content. Two sites for one
   person, and the old one has the age.
3. **Her name is contested.** "Jasmine Garcia" returns a Miami-based dancer, an author, and
   a designer at `jasminegarcia.net` before it returns a Charlotte broker. She cannot win a
   brand-name query by default the way most agents can.

Only 4 of 17 pages emit any structured data at all, and the seven highest-intent
service pages — buyers, sellers, new construction, relocation, the NC/SC border,
negotiation, home value — emit **none**.

---

## 2. Strongest existing assets

These are real advantages, and the plan is built to spend them rather than replace them.

| Asset | Why it matters |
|---|---|
| **A defensible position** | "The other side of the table does this for a living" is an argument, not a credential. Of the competitors reviewed, only this site leads with one. It cannot be copied from a data feed. |
| **Documented, permissioned outcomes** | Three case studies with client permission, plus a 44-row transaction ledger and 54 structured reviews. This is original evidence — the scarcest input in real-estate content. |
| **Dual NC/SC licensure** | NC 334700 and SC 125546. Most Charlotte agents work one side of the line. The border is a genuine moat and a genuine search category. |
| **Technical foundation** | Fast, accessible, correctly canonicalized, correctly sitemapped. New pages inherit all of it automatically. |
| **A compliance system that actually runs** | `tests/compliance.test.tsx` and `lib/blog/validate.ts` make fair-housing and undocumented-figure violations build failures. This is what makes it safe to publish at pace. |
| **Working content machinery** | `/areas/[slug]` and `/blog/[slug]` are finished, tested pipelines with FAQ and breadcrumb schema already proven in production. Publishing is a data-entry problem, not an engineering one. |

---

## 3. The five most important opportunities

Ranked by the prioritization model in `AUDIT.md` §7. Full scoring in `IMPLEMENTATION-BACKLOG.md`.

### 1. Retire or redirect the Placester site — *risk removal, not growth*
It is live, it duplicates her identity, its bio has historically carried claims this site
deliberately omits, and the migration review found fair-housing exposure on its area pages.
Every day it stays up it competes with the real site for her own name. This is a vendor and
contract action, not an engineering one, and `CLAUDE.md` §12 already flags the contract terms
as unconfirmed.

### 2. Fix entity identification — *the highest-leverage technical work available*
Because her name is contested, generic identity signals are worth far more here than they
would be for an agent with an unusual name. Concretely: `Person` schema on the home page
(there is currently no top-level `Person` entity anywhere on the site), geography in title
tags (only the home page contains "Charlotte"), and her LinkedIn named in `sameAs`.

> **Status: shipped 2026-08-24.** The schema, the titles, and the LinkedIn corroboration are
> done. A fourth component — a reciprocal link from her Stone Realty Group bio — was originally
> listed here and has been **removed from the recommendation**: the brokerage's commission
> incentives run against it (see Risks, and `AUDIT.md` §3.3).

### 3. Extend the structured-data pattern that already works to the pages that convert
`/areas/steele-creek` and the one blog post already emit `FAQPage` + `BreadcrumbList`.
Seven service pages emit nothing. The mechanism is built, tested, and compliance-checked —
this is applying an existing pattern, not building one.

### 4. Publish the evidence that is already collected
Fort Mill is drafted and unpublished. Thirteen more markets are rostered with no content.
44 closed transactions sit in a ledger with no case-study pages. 54 reviews render as a
12,000-word page with no `Review` or `AggregateRating` markup. The scarce input — original,
documented, permissioned evidence — is already in the repository.

### 5. Close the lead loop
Follow Up Boss is not connected, so every submission currently reaches a notification email
and nothing else. Locked Decision #5 puts that before launch, and the site is already live.
Client-side events fire correctly, but nothing marks a *successful* lead, and no GA4 key
events are configured.

---

## 4. Major risks

| Risk | Severity | Note |
|---|---|---|
| **Two live sites under one licensed identity** | High | Brand-query competition plus live compliance exposure on a property she no longer controls editorially. |
| **Lead loss** | High | FUB unconnected. A Resend failure loses the lead outright; §9's fallback is a fallback, not the integration. |
| **Name ambiguity suppresses brand search** | Medium-High | Cannot be fixed by content volume — only by entity signals and third-party consistency. |
| **Publishing pressure vs. §6 discipline** | Medium | The instinct to fill 14 area pages fast is exactly what `lib/areas/data.ts` warns against. The guardrails work; the risk is someone routing around them. |
| **Compliance drift on new surfaces** | Medium | Review and aggregate-rating schema is a §7 advertising surface. It needs BIC review, not just a code change. |
| **The brokerage's incentives run against hers** | High | Added 2026-08-24. SRG takes a materially higher commission share on brokerage-sourced leads and intends to keep sourcing them — which is why this site exists. Assume no cooperation: the bio backlink is unlikely, and any link that routes her organic traffic into a brokerage-hosted funnel may convert cheap leads into expensive ones. See `AUDIT.md` §3.3 and §3.5, and T6b. **This never licenses weakening §7** — brokerage identification stays on every page. The goal is her own pipeline, not her own firm. |
| **Single-author bottleneck** | Medium | Every distinctive page needs Jasmine's actual knowledge. Interview capacity, not writing capacity, is the constraint. |
| **Expecting fast results** | Medium | A new domain in a competitive local market realistically shows meaningful organic movement in 3–6 months. Anything promising faster is guessing. |

---

## 5. Recommended strategic direction

**Adopt "Focused growth" (Option B in `OPTIONS.md`).** This matches the direction you
proposed, and the evidence supports it.

The reasoning is that this site's constraint is not content volume — it is **proof of
existence and proof of identity**. A high-volume blog program would add pages to a domain
that search engines have barely acknowledged and that cannot yet reliably win its owner's
own name. The sequence that makes sense:

1. **Make the site verifiably discoverable.** Search Console, Bing Webmaster, the Placester
   decision, entity schema, geography in titles. Cheap, fast, and everything downstream
   depends on it.
2. **Deepen the seven pages that already target high-intent queries** rather than adding new
   ones. They are 1,200–2,150 words of genuinely original argument with zero structured data
   and no geography in their titles. That is unrealized value sitting in the repository.
3. **Publish the evidence already collected** — Fort Mill, two or three more markets, and
   three transaction case studies drawn from the 44-row ledger.
4. **Fix Google Business Profile and reviews**, which is where "Charlotte Realtor" traffic
   actually resolves for a local practitioner, and where 105 five-star reviews are currently
   doing nothing for her.
5. **Instrument the lead path** so the next decision is made on data instead of argument.

A modest content cadence — roughly two substantial pieces a month, drawn from her real
transactions — is part of this. A weekly publishing commitment is not, and should not be
made until the measurement from step 5 shows what is working.

**What this explicitly does not do:** no mass city-page generation, no market-stat posts, no
review widgets, no IDX. Each is ruled out by an existing locked decision or by the compliance
system, and each is what the competitive set does instead of having an argument.

---

## 6. What would raise confidence

Several conclusions here are inferences that external data would settle in minutes.
Listed in `MEASUREMENT.md` §1. The three that matter most:

- **Google Search Console** — actual index coverage, impressions, and query data. Without it,
  every statement about what the site currently ranks for is an inference.
- **Google Business Profile** — whether one exists, is verified, and is claimed. This is the
  single largest local-search factor for an individual agent and it is entirely invisible from
  the repository.
- **The Placester contract** — term, auto-renewal date, and whether the platform supports
  301 redirects. This determines whether opportunity #1 is a redirect map or a takedown.

---

**Read next:** `AUDIT.md` for the evidence · `OPTIONS.md` for the three investment levels ·
`ROADMAP.md` for sequencing · `IMPLEMENTATION-BACKLOG.md` for the tasks to approve first.
