# Audit — Evidence

**Method.** Repository read at commit `0574973`. Live site crawled 2026-08-24 over all 17
sitemap URLs. External profiles fetched where accessible. Every finding below is labelled:

- **[VERIFIED]** — observed directly in the repository or in an HTTP response captured today.
- **[LIKELY]** — a well-supported inference from observed evidence, but not directly measured.
- **[NEEDS DATA]** — cannot be determined without Google Search Console, Google Analytics,
  Google Business Profile, the CRM, or the Placester account.

**Severity:** Critical / High / Medium / Low. **Confidence:** High / Medium / Low.

No traffic figures, rankings, search volumes, backlink counts, or conversion rates are
asserted anywhere in this document. Where such a number would normally appear, the finding
is marked **[NEEDS DATA]** instead.

---

## 1. What is already correct

Recorded first and deliberately. These do not need rebuilding, and several are better than
the competitive set.

| # | Finding | Evidence |
|---|---|---|
| 1.1 | **All 17 sitemap URLs return 200.** No broken links, no redirect chains, no orphaned sitemap entries. | Crawled 2026-08-24. Contrast: the migration review found mackenziesiek.com advertises 14 URLs of which 4 resolve. |
| 1.2 | **Canonicalization is correct and self-referencing on every page.** | Each page's `<link rel="canonical">` matched its own URL exactly. Built once in [lib/seo.ts](../lib/seo.ts) `routeMetadata()` from the same path that produces `og:url`. |
| 1.3 | **`www` 308s to the apex.** | `curl -I https://www.jasminegarcia.com` → `308`, `location: https://jasminegarcia.com/`. Matches the assertion in `lib/seo.ts`. |
| 1.4 | **robots.txt and sitemap.xml are correct and generated from real routes.** | [app/robots.ts](../app/robots.ts), [app/sitemap.ts](../app/sitemap.ts). The sitemap is derived from `publishedAreas()` / `publishedPosts()`, so it structurally cannot advertise a 404. |
| 1.5 | **Every page has exactly one `<h1>`, in logical heading order.** | Counted on all 17 live pages. Enforced by `tests/compliance.test.tsx`. |
| 1.6 | **Unique, human-written meta descriptions, 98–161 characters.** | No templating, no duplicates. A test fails any description under 50 characters or duplicated across routes. |
| 1.7 | **Open Graph and Twitter cards are complete and per-route.** | `og:url`, `og:type`, `og:image` (1200×630 committed JPEG), `twitter:card: summary_large_image`. Fixed deliberately in `70a9032`. |
| 1.8 | **Performance is strong.** | Home page TTFB **0.223s**, 80,411 bytes, `x-nextjs-prerender: 1`, `x-vercel-cache: HIT`. |
| 1.9 | **Images are correctly optimized.** | `next/image` throughout, AVIF/WebP configured, explicit width/height, responsive `srcSet`, blur placeholders, LCP image preloaded, below-fold images `loading="lazy"`. |
| 1.10 | **Every `<img>` on every page has alt text.** | Zero images missing `alt` across all 17 pages. |
| 1.11 | **Fonts are self-hosted and preloaded.** | `next/font/google` → `.woff2` on the app origin with `display: swap`. No render-blocking third-party font request. |
| 1.12 | **No JavaScript rendering risk.** | All content is server-rendered in the initial HTML. Verified by parsing the raw response — headings, copy, and JSON-LD are all present without executing JS. |
| 1.13 | **Accessibility is tested, not assumed.** | `tests/accessibility.test.tsx` runs axe-core at WCAG 2.1 AA over every page plus landmark and link-name checks. Skip link present. |
| 1.14 | **GA4 is live and events fire correctly.** | `G-DHYEFNYELD` in the live HTML. `call_click`, `intake_start`, `intake_step`, `intake_submit` at real call sites. A real bug here (Tag Manager vs gtag.js dataLayer shape) was found and fixed in `5d3fa35`. |
| 1.15 | **Analytics has a working opt-out and no PII.** | [lib/analytics-consent.ts](../lib/analytics-consent.ts); `lib/analytics.test.ts` reads every `track()` call site to prove no personal field becomes a GA4 parameter. |
| 1.16 | **Compliance is mechanically enforced.** | Brokerage identification, both license numbers, EHO/REALTOR® marks, verbatim TCPA consent, results disclaimer beside any dollar figure, fair-housing patterns, undocumented figures — all build-breaking. |
| 1.17 | **The content pipelines are finished and proven.** | `/areas/[slug]` and `/blog/[slug]` both render `FAQPage` + `BreadcrumbList` in production today. Adding a page is a data edit. |

**Implication:** essentially none of the recommended work in this plan is infrastructure
work. It is identity, distribution, and content-entry work on top of infrastructure that
already functions.

---

## 2. Technical search visibility — findings

### 2.1 The retired site was live and competing — ✅ RESOLVED 2026-08-24
**Severity: Critical → Closed · Confidence: High · [VERIFIED]**

> **UPDATE, same day.** Placester has been deactivated. Re-checked after the takedown: every
> archived URL now returns **302 → `https://placester.com/site-unavailable`**, which itself
> returns **403**. The duplicate content is gone and the competing-site risk is closed.
>
> **One residual item, low severity.** The takedown uses a *302 (temporary)* rather than a
> 410 or 404, so Google is told these URLs may return. They will most likely be dropped as
> soft-404s, but more slowly than a 410 would achieve. This is Placester's platform behaviour
> on deactivation and is **not controllable from this repository or her account** — so the
> remediation is a removal request in Search Console once T1 is verified, not a code change.
> No redirect map is needed or possible.

The original finding, retained for context:

`https://jasminegarcia.myrealestateplatform.com/` returned **200** as of 2026-08-24, as did
`/area/fort-mill/` and `/area-guide/`. The archive in [docs/placester-archive/urls.txt](../docs/placester-archive/urls.txt)
records **50 URLs**, including 22 area pages and five blog posts, all Charlotte-targeted.

Three consequences:

- **Brand-query competition.** Two properties describe the same licensed broker. The old one
  has age and existing index presence; the new one has neither.
- **Live compliance exposure on a property she does not editorially control.**
  [docs/AREA-GUIDE-MIGRATION.md](../docs/AREA-GUIDE-MIGRATION.md) concluded "no copy, no image, and no statistic
  survives the migration," citing fair-housing exposure and imagery of the wrong cities. That
  content is still published under her license today.
- **The redirect map cannot be built in this repository.** The old URLs are on *Placester's*
  domain, not hers. `next.config.ts` cannot redirect them. This is a vendor action.

Note this corrects a reasonable assumption embedded in `CLAUDE.md` §11 ("301 redirects from
any indexed Placester URLs once that site is retired") — on a third-party subdomain, the
inherited-equity case is much weaker than a same-domain migration, and the *takedown* matters
more than the redirect map.

**Needs:** Placester contract term, auto-renewal date, whether the platform supports 301s,
and content/domain ownership. Already open in `CLAUDE.md` §12.

### 2.2 Index coverage is unknown and probably minimal
**Severity: High · Confidence: Medium · [NEEDS DATA]**

A web search for the exact string `"jasminegarcia.com"` returned no result belonging to her.
That is suggestive, not conclusive — the search tool used is not Google, and absence from one
index is weak evidence.

**This cannot be resolved without Google Search Console.** There is no evidence in the
repository of a GSC verification token, a Bing verification token, or an IndexNow key.

**Do not** act on this by adding indexing "tricks." The correct action is verification plus a
sitemap submission, then measurement.

### 2.3 Title tags carry no geography — ✅ FIXED 2026-08-24 (T3)
**Severity: High · Confidence: High · [VERIFIED]**

> **RESOLVED for five of the seven pages.** `/home-value` and `/negotiation` were deliberately
> left alone: the first is already question-shaped, and the second is the lead magnet's actual
> name. New titles are listed in `IMPLEMENTATION-BACKLOG.md` T3. **Still needs Jasmine's
> review** — that was an acceptance criterion and has not happened yet.

Live titles:

| Route | Title |
|---|---|
| `/buyers` | `Buyers · Jasmine Garcia` |
| `/sellers` | `Sellers · Jasmine Garcia` |
| `/new-construction` | `New Construction · Jasmine Garcia` |
| `/relocation` | `Relocation · Jasmine Garcia` |
| `/carolinas-border` | `The NC/SC Border · Jasmine Garcia` |
| `/home-value` | `What is your home worth? · Jasmine Garcia` |

Only the home page title contains "Charlotte." For local search these titles do two things
badly at once: they omit the geography a local searcher scans for, and — because her name is
contested (§4.1) — the brand half of the title does not disambiguate either.

This is a metadata change only. The `title` values come from each page's `metadata` export
and the template in [app/layout.tsx](../app/layout.tsx); page copy is untouched.

**Caution:** the goal is a natural, accurate title, not keyword stuffing. `Buyer's agent in
Charlotte, NC · Jasmine Garcia` is accurate and readable. `Charlotte Buyers Agent | Charlotte
Real Estate | Charlotte Realtor` is not, and would also read as exactly the generic register
`BRAND-VOICE.md` bans.

### 2.4 Structured data is absent from the seven highest-intent pages
**Severity: High · Confidence: High · [VERIFIED]**

Measured by parsing `application/ld+json` from each live page:

| Route | Words | JSON-LD types emitted |
|---|---:|---|
| `/` | 2,687 | RealEstateAgent, Organization, PostalAddress, EducationalOccupationalCredential |
| `/about` | 2,667 | Person, RealEstateAgent, VideoObject, PostalAddress |
| `/areas/steele-creek` | 4,413 | FAQPage, Question, Answer, BreadcrumbList, ListItem |
| `/blog/what-you-can-negotiate-besides-price` | 3,332 | BlogPosting, FAQPage, Person, RealEstateAgent, WebPage |
| **`/negotiation`** | **1,226** | **none** |
| **`/new-construction`** | **1,801** | **none** |
| **`/sellers`** | **1,723** | **none** |
| **`/relocation`** | **1,765** | **none** |
| **`/carolinas-border`** | **2,158** | **none** |
| **`/buyers`** | **2,055** | **none** |
| **`/home-value`** | **2,018** | **none** |
| **`/reviews`** | **12,273** | **none** |
| **`/transactions`** | **3,537** | **none** |
| **`/areas`** | **1,405** | **none** |
| **`/blog`** | **1,042** | **none** |

These are not thin pages — they are substantial, original, well-argued pages that emit no
machine-readable signal about what they are.

The pattern to extend already exists and is production-proven: `faqSchema()` and
`breadcrumbSchema()` in [lib/schema.tsx](../lib/schema.tsx) are already used by area pages
and posts. This is application, not invention.

### 2.5 `/reviews` has no Review or AggregateRating markup
**Severity: High · Confidence: High · [VERIFIED]** *(compliance gate — see §6.3)*

12,273 words of verbatim, attributed, permissioned testimonial with zero review structured
data. [lib/reviews/data.ts](../lib/reviews/data.ts) holds 54 entries, all `rating: 5`, split
43 Zillow / 11 Google, each with author, date, date-precision, platform, and — for Google —
a verified permalink.

This is the single richest unexploited structured-data asset on the site. It is also the one
with the most compliance surface: self-serving `AggregateRating` on a broker's own site is a
recognized abuse pattern, Google's review-snippet guidelines restrict self-serving reviews
for `LocalBusiness`/`Organization` types, and `CLAUDE.md` §7 makes any new advertising claim
a material change requiring BIC review.

**Recommendation:** implement `Review` markup for individually attributed reviews and treat
`AggregateRating` as a separate decision requiring BIC sign-off. Do not implement either as a
purely technical task. See `IMPLEMENTATION-BACKLOG.md` for the split.

### 2.6 No `Person` entity anywhere on the site — ✅ FIXED 2026-08-24 (T2)
**Severity: High · Confidence: High · [VERIFIED]**

**Correction to an earlier draft of this finding.** It originally read that `Person` "appears
only on `/about` and on the blog post's `author` field," which implied `/about` carried a
Person entity of its own. It did not. Reading [app/about/page.tsx](../app/about/page.tsx),
the only schema it emits is `videoObjectSchema()` — and the `Person` detected in its JSON-LD
is that schema's nested `author`. The same was true of the blog post.

So there was **no top-level `Person` entity anywhere on the site**, only Persons nested inside
other objects as attribution. Given §4.1 that made the omission more significant, not less.

> **RESOLVED.** `realEstateAgentSchema()` now emits a single node typed
> `["Person", "RealEstateAgent"]` with a stable `@id`, plus `description`, `image`,
> `knowsAbout`, and `worksFor`. A second Person node was deliberately *not* added — two nodes
> sharing a name and a phone number assert that two entities exist, which is the opposite of
> the goal. The blog and video `author` fields now carry the same `@id`, so attribution across
> the site resolves to one person. `award` is deliberately excluded — see the comment in
> `lib/schema.tsx` for why a nomination must not become one.

### 2.7 Redirects array is empty
**Severity: Low · Confidence: High · [VERIFIED]**

[next.config.ts](../next.config.ts) `redirects()` returns `[]` with a TODO comment. Given §2.1,
this is correctly empty — the URLs needing redirection are not on this domain. It becomes
relevant only if `jasminegarcia.com` URLs are ever restructured. Recorded so it is not
mistaken for an oversight.

### 2.8 Sitemap `lastmod` is build time for all static routes
**Severity: Low · Confidence: High · [VERIFIED]**

Every static route reports `lastModified: new Date()`. Blog posts correctly carry their own
dates. A `lastmod` that changes on every deploy without the content changing is a signal
crawlers learn to discount — the same reasoning `lib/schema.tsx` already applies to
`dateModified` on `BlogPosting`, applied inconsistently one level up.

**Low priority.** Worth fixing when content dates exist to use.

### 2.9 Mobile and Core Web Vitals
**Severity: Low · Confidence: Medium · [LIKELY / NEEDS DATA]**

The construction predicts good vitals: prerendered HTML, 0.22s TTFB, preloaded LCP image with
responsive `srcSet`, self-hosted preloaded fonts with `display: swap`, explicit image
dimensions (protecting CLS), and a sticky contact bar that is the only always-mounted client
component.

**Not measured.** Field data requires Chrome UX Report via Search Console or PageSpeed
Insights; the repository has Vercel Speed Insights mounted, so real-user data should already
be accumulating in the Vercel dashboard. `CLAUDE.md` §10 sets a Lighthouse ≥95 / ≥90 bar that
has not been run against production. Colour contrast in particular is untested — jsdom
computes no colours, which the accessibility suite says explicitly.

---

## 3. Local SEO — findings

### 3.1 Google Business Profile status is unknown
**Severity: Critical · Confidence: High (that it matters) · [NEEDS DATA]**

Nothing in the repository references a GBP, a place ID, or a Maps listing. For an individual
licensed agent, GBP is typically the single largest determinant of appearing in "Charlotte
Realtor" / "realtor near me" style searches, because those queries resolve to the map pack
before they resolve to a website.

Unknown and required: does a profile exist; is it verified; is it categorized as *Real Estate
Agent*; does it use the tracking number `(704) 200-9360`; does it link to jasminegarcia.com;
does it carry the brokerage address; and which of the 11 Google reviews in
`lib/reviews/data.ts` sit on her profile versus the Stone Realty Group listing.

That last point is already documented as a live issue: `CLAUDE.md` §12 records that all seven
workbook reviews were found on the **Stone Realty Group** listing rather than her own. Reviews
on the brokerage's profile build the brokerage's local authority, not hers.

### 3.2 NAP is internally consistent and externally verified — with one gap
**Severity: Low · Confidence: High · [VERIFIED]**

Name, brokerage, address, and phone are single-sourced in [lib/site.ts](../lib/site.ts) and
cannot drift between pages. Cross-checked against her Stone Realty Group bio at
`mattstoneteam.com/jasmine-garcia/`: phone `704-200-9360` matches exactly, brokerage matches,
title matches.

**Gap:** `AGENT.email` is `"TODO(verify)"` in `lib/site.ts`, while her brokerage bio publicly
displays `jasmine@mattstoneteam.com`. The site therefore offers no email contact path at all.
Whether to publish it is a business decision (Locked Decision #4 is phone-first, deliberately),
but the `TODO` should be resolved either way.

### 3.3 The brokerage bio does not link back to her site — and probably will not
**Severity: High · Confidence: High · [VERIFIED]**

> **Context added 2026-08-24 (Bill), and it changes the recommendation.** Stone Realty Group
> takes a **materially higher share of Jasmine's commission when the brokerage sources the
> lead**, and the BIC intends to keep sourcing them. That is the commercial reason this site
> exists at all. A link from his site to hers moves leads out of his column at his own expense,
> so it is unlikely to be granted.
>
> **This has a wider consequence than one backlink.** Any part of this plan that assumed brokerage
> cooperation needs re-reading with that assumption removed — see T6b in
> `IMPLEMENTATION-BACKLOG.md` on where "Search Homes" sends her organic traffic, which is the
> live example and is currently in her primary navigation. The authority T6 was meant to supply
> now has to come from sources with no stake in her lead flow: REALTOR® association
> directories, local press, partnership content, and her own third-party profiles.
>
> **What does not change:** §7. She may not present as independent, and brokerage
> identification stays on every page. The objective is her own *pipeline*, not her own *firm*.

`mattstoneteam.com/jasmine-garcia/` carries her full §5 statistics, her phone, her email, and
a Zillow link — and **no link to jasminegarcia.com**. This is a relevant, topically-aligned page
on an established domain that is one email away from linking to her. It is the single
easiest legitimate authority signal available, and it also reinforces entity identity (§4.1).

### 3.4 Service-area coverage is one market of fifteen
**Severity: High · Confidence: High · [VERIFIED]**

[lib/areas/markets.ts](../lib/areas/markets.ts) rosters 14 markets; Rock Hill was added later
(`b60cdc0`), making 15. [lib/areas/data.ts](../lib/areas/data.ts) publishes **one**: Steele
Creek. Fort Mill exists as a draft in `lib/areas/drafts/fort-mill.ts`, blocked pending four
interview answers.

The restraint is correct and should not be abandoned — the file's own header explains why
fourteen thin pages would be the most damaging possible addition, and the top5charlotteagents.com
review found exactly that pattern carrying fair-housing violations.

But **one published market of fifteen** is the largest single content gap on the site, and
Fort Mill is both the strongest candidate (12 documented closings) and the one already drafted.
It is also directly contested: The Longleaf Group publishes a ~2,500-word "Fort Mill vs Indian
Land" comparison today (§5).

### 3.5 The IDX destination is a placeholder — and may be worse than a placeholder
**Severity: Medium → High · Confidence: Medium · [VERIFIED / NEEDS DATA]**

> **Reassessed 2026-08-24** in light of §3.3. The recommendation below — copy mackenziesiek.com
> and point at an agent subdomain — assumed the only question was attribution to her. Given the
> commission split, there is a prior question: **when a visitor arrives here from organic
> search, clicks "Search Homes", and converts on a brokerage-hosted IDX, whose lead is it and at
> which split?**
>
> If it is the brokerage's, then the most prominent outbound link on the site converts her own
> organic traffic into brokerage-sourced leads at the worse rate — which would make "Search
> Homes" the most expensive link on the site, and it currently sits in primary navigation.
> **Get this answered in writing before resolving the URL.** T6b.

`SEARCH_HOMES_URL = "https://mattstoneteam.com"` with a `TODO(verify)`. "Search Homes" —
a primary nav item — currently sends visitors to the brokerage home page rather than to a
search experience attributed to her.

The competitive review already found the answer: mackenziesiek.com points at
`mackenzie.mattstoneteam.com`. A `jasmine.mattstoneteam.com` subdomain very likely exists or
can be provisioned. This is a question for Stone Realty Group, and it also affects lead
attribution — an agent-specific IDX subdomain routes those leads to her.

### 3.6 Local citations and directories
**Severity: Medium · Confidence: Medium · [NEEDS DATA]**

Verified present: Zillow profile, Stone Realty Group bio, LinkedIn, Instagram, Facebook,
YouTube. `sameAs` in the home-page schema names four of these.

Not verified and worth auditing manually: Realtor.com agent profile, Homes.com, Canopy
Realtor® Association / NC REALTORS® directory listings, Apple Maps, Bing Places, and the
third-party aggregators that already surfaced in search (Agent Pronto, FastExpert,
listwithclever, U.S. News). Several of these generate profiles without the agent's
involvement, which means they may already carry stale or wrong data.

**On the LinkedIn name variant — ✅ RESOLVED 2026-08-24, and the original framing was wrong.**
Her LinkedIn displays **"Jasmine Garcia Weaver"** (Weaver is her married name) while every other
surface uses "Jasmine Garcia." This draft originally called that a consistency risk that had to
be fixed before the profile could be linked. On examination it is not a risk at all:

- `sameAs` asserts that a URL refers to the same entity. It does not assert that names match,
  and married, maiden, and professional variants are common enough that entity resolution
  expects them.
- The profile independently states Stone Realty Group, Charlotte, and Broker/REALTOR® — which
  is precisely the corroboration §4.1 needs. She is one of several public Jasmine Garcias and
  the only one at this brokerage.
- **The variant is in the index whether or not this site links it.** Linking does not create
  the inconsistency; it supplies the means to resolve two records into one person.

So the profile is now named in `sameAs` (`lib/site.ts` `SOCIAL.linkedin`, URL confirmed by
Bill). It is deliberately **not** linked from any page — there is no LinkedIn audience to send
anywhere, and its only job is corroboration. `alternateName` is deliberately **not** set: that
would put her married name into her own advertising, which is her branding decision, not one to
infer from a third-party display name.

**Renaming the LinkedIn profile is therefore optional**, not a prerequisite. It would tidy the
brand; it does not unblock anything.

---

## 4. AI and answer-engine visibility — findings

### 4.1 Her name is heavily contested, and the site does little to disambiguate
**Severity: Critical · Confidence: High · [VERIFIED]**

A search for `"jasminegarcia.com"` returned: a Miami/LA dancer and model
(`@jasminegarcia.official`), an author (`facebook.com/authorjasminegarcia`), a designer
(`jasminegarcia.net`), and several unrelated public figures. None of the first-page results
belonged to the Charlotte broker.

This is the most consequential finding in the audit for AI visibility specifically, because
answer engines resolve *entities* before they retrieve documents. An assistant asked "who is
Jasmine Garcia" has several strong, well-linked candidates and one thin one.

What actually helps, in order:
1. `Person` schema on the home page with `sameAs`, `worksFor`, `hasCredential` (the license
   numbers are the strongest disambiguator available — they are unique and verifiable).
2. Consistent naming across every third-party profile (resolve the LinkedIn variant).
3. Inbound links from pages that already establish the association — starting with the
   brokerage bio (§3.3).
4. Geography in titles (§2.3), so the document-level signal matches the entity.

**What does not help:** repeating her name more often on the page. This is a graph problem,
not a density problem.

### 4.2 The answer-first pattern is excellent — and confined to two pages
**Severity: High · Confidence: High · [VERIFIED]**

[lib/blog/types.ts](../lib/blog/types.ts) defines an `answer` field — "two to four sentences
that fully answer `targetQuery`, rendered directly under the h1" — and `docs/CONTENT-MARKETING.md`
§3 correctly identifies it as the highest-leverage field for citation. The area pages have an
equivalent AEO surface added in `142a9e5`.

This is a genuinely good design, better than what most agency SEO produces. It runs on exactly
**two live pages**. The seven service pages lead with argument and narrative — excellent for a
human reader, but they do not offer a liftable, self-contained answer block, and they carry no
FAQ.

### 4.3 Authorship signals are strong on posts, absent elsewhere
**Severity: Medium · Confidence: High · [VERIFIED]**

`blogPostingSchema()` names her as `author` with `jobTitle`, `url`, and `worksFor`, and the
brokerage as `publisher` — a split made for compliance reasons that happens to be exactly
right for authorship signals too. `VideoObject` follows the same pattern.

Service pages have no byline, no author markup, and no dates of any kind. For "who says this
and why should I believe them," a page with 2,000 words of specific claims and no attributable
author is weaker than it needs to be.

**Caution on dates:** `lib/seo.ts` deliberately omits `article` dates from area pages because
"an area page is evergreen market knowledge with no publication moment, and stamping one on
would be a freshness claim nobody can support." That reasoning is sound and should be extended,
not overridden. A *reviewed-on* date is only honest if someone actually reviews it.

### 4.4 Original statistics are abundant, attributable, and under-surfaced
**Severity: High · Confidence: High · [VERIFIED]**

The site holds what most competitors fabricate: 44 closed transactions with side, year,
neighborhood, and property type; 54 attributed reviews; three permissioned case studies with
exact figures; 17 new-construction closings across ten named builders; 18 relocations; 12 in
the Fort Mill corridor.

`/transactions` renders 3,537 words of this and emits no structured data. There are no
per-transaction case-study pages. `docs/CASE-STUDIES.md` explicitly permits the three
documented cases and its backlog already asks for one or two more.

**This is the strongest AEO asset the site has**, because it is the one thing an answer engine
cannot get from a competitor: specific, dated, attributable outcomes.

### 4.5 Comparison tables are missing where they would fit naturally
**Severity: Medium · Confidence: Medium · [LIKELY]**

`/carolinas-border` (2,158 words) argues NC vs SC across tax treatment, contract mechanics,
and process. This is inherently tabular content presented as prose. Comparison tables are
disproportionately quoted by answer engines and are genuinely easier to read.

The blog post already demonstrates the underlying fact well — NC due-diligence period vs SC's
three contingencies — in prose. A table would not change the argument, only its legibility.

---

## 5. Competitive review

Selected for genuine overlap with her positioning, geography, or query set. National portals
are noted for context only, not treated as beatable targets.

| Site | Type | Positioning | Depth | Structured data | Notable |
|---|---|---|---|---|---|
| **thelongleafgroup.com** (Steve Jarrell, eXp) | **Direct content competitor** | Relocation specialist for Charlotte in-migration | Deep. ~2,500-word Fort Mill vs Indian Land guide with a 6-question FAQ, SC 4%/6% assessment-ratio detail, commute analysis | **None visible** | The sharpest threat. Occupies relocation *and* the border — two of her four pillars — with more published content and a 26-page relocation lead magnet. |
| **mackenziesiek.com** | **Direct comparable** | Same brokerage, personal brand, in-town Charlotte geographic niche | Shallow. 4 real pages; 2 are brokerage content | Not reviewed | Sitemap advertises 14 URLs, 4 resolve. Market-insights figures appear to be hardcoded placeholders. No license number, no TCPA consent on a phone-collecting form. |
| **thefinigangroup.com** | Content competitor | "Voted Charlotte's Best" team | Charlotte relocation guide, Fort Mill / Indian Land coverage | Not reviewed | Team-scale content operation. Awards-led positioning. |
| **savvyandcompany.com** | Content competitor | Boutique Charlotte brokerage, relocation content | Relocation hub | Not reviewed | Brokerage-scale, not agent-scale. |
| **mattstoneteam.com** | **Her own brokerage** | 30+ agent team flagship, full IDX | Large, ~30-item nav | Not reviewed | Not a competitor — an *asset* she is under-using (§3.3). Also: no license numbers in its footer. |
| **top5charlotteagents.com** | Lead-gen play | Ranks five SRG agents by an "Agent Clout Score™" | Medium | Not reviewed | **Jasmine is not among the five.** Its area pages carry explicit fair-housing violations (school ratings, resident characterizations) — do not use as a content model. |
| **kendraconyersandassociates.com** | Content competitor | Relocation + virtual/remote closing services | Medium | Not reviewed | Competes on the remote-buyer angle specifically. |
| Zillow / Realtor.com / Homes.com | National portals | Aggregators | — | — | Not beatable on their terms and not worth targeting. **Her Zillow profile is an asset within them** — 43 of her 54 reviews live there. |

### What the competitive set tells us

**1. Nobody else is making an argument.** Longleaf leads with relocation expertise, Finigan
with awards, Mackenzie with geography and biography, top5 with a proprietary ranking. Only
this site leads with a claim about how negotiation actually works, backed by documented
outcomes. That ground is genuinely unoccupied.

**2. Structured data is a wide-open lane.** The two competitor sites examined closely emit
little or none. Given how much of local and AI discovery now runs through machine-readable
signals, extending the FAQ/breadcrumb/Review pattern is unusually high-leverage here.

**3. But they beat her decisively on published coverage.** Longleaf has a deep, FAQ-bearing
Fort Mill vs Indian Land page live today. She has 12 documented Fort Mill closings and an
*unpublished draft*. The evidence advantage is hers; the publication advantage is theirs.

**4. Compliance is a real differentiator.** None of the three sibling sites reviewed displays
license numbers. None carries TCPA consent on forms collecting phone numbers. top5's area
pages carry live fair-housing exposure. Following §7 puts her ahead — worth stating to the BIC
directly.

**5. Stat inconsistency is endemic across the family** (mattstoneteam: 20 years/$2B/2,500
families; mackenziesiek: 18 years/2,500 homes/$1.5B; top5 footer: 671 Google reviews vs
Mackenzie's own 559). Her `TODO(verify)` discipline is the right call and produces a more
citable site, which matters more for AI answers than for classic ranking.

---

## 6. Conversion and traction — findings

### 6.1 Follow Up Boss is not connected
**Severity: Critical · Confidence: High · [VERIFIED]**

[lib/fub.ts](../lib/fub.ts) throws when `FUB_API_KEY` is unset. `CLAUDE.md` §12 records it as
unconnected as of 2026-08-24 — today. Every submission therefore falls back to the Resend
notification email.

Three problems, in order of severity:
1. **The site is live and taking leads into a fallback path.** Locked Decision #5 puts the
   integration before launch; launch happened first.
2. **A Resend failure loses the lead outright.** §9's "never silently drop a lead" holds only
   while one of two paths works; right now there is one path.
3. **No lead is attributable.** Source, lead type, and UTM parameters are collected and sent
   nowhere durable, so no campaign or page can be evaluated.

### 6.2 No conversion event marks a *successful* lead — ✅ FIXED 2026-08-24 (T16)
**Severity: High · Confidence: High · [VERIFIED]**

**Correction to the original finding.** It read that `intake_submit` "marks the submission
*attempt*." That was wrong — it fired *after* the ok-check, so it already only counted
successes. The real defect was the opposite of the one described: an attempt that failed
fired **nothing at all**, so a form that was tried and refused looked in GA4 exactly like a
form nobody touched. The gap was failure visibility, not success measurement.

> **RESOLVED.** `intake_submit` now fires before the request, so it means what its name says
> and gives `generate_lead` a denominator. `generate_lead` (GA4's own recommended name) fires
> only on a response confirming persistence, and carries a `delivery` dimension of `crm` or
> `email` — the route now reports which channel actually took the lead. `lead_failed` fires on
> refusal or network failure with a `reason` of `rate_limited`, `invalid`, `delivery`, or
> `network`.
>
> `delivery: "email"` is the operationally important one: it means the lead exists only in an
> inbox, and a run of them is how anyone finds out the Follow Up Boss integration has quietly
> stopped working.
>
> **Still outstanding:** marking `generate_lead` and `call_click` as **key events** in the GA4
> admin. That is a console setting, not code, and until it happens GA4 records the events
> without treating them as conversions.

Combined with **[NEEDS DATA]**: whether any GA4 *key events* (conversions) are configured in
the property. Without them, GA4 records activity but not outcomes, and no channel can be
compared on lead production.

### 6.3 The conversion path itself is well built
**Severity: n/a — positive · Confidence: High · [VERIFIED]**

Worth stating plainly so it is not "improved" unnecessarily. Phone-first per Locked Decision
#4, `tel:` links instrumented by placement, a progressive intake that never traps a visitor
behind qualifying questions, consent never pre-checked, a honeypot field, and a failure path
that always resurfaces the phone number. `components/contact-intake.test.tsx` asserts the
last three. The sticky contact bar keeps a CTA in reach on mobile.

### 6.4 The lead magnet is described but not delivered
**Severity: Medium · Confidence: Medium · [VERIFIED / LIKELY]**

`/negotiation` is the landing page for "The 19 Things Besides Price You Can Negotiate" and is
the **shortest** of the service pages at 1,226 words. `docs/CONTENT-PLAN.md` calls it "the
highest-converting asset on the site." `lib/intake/guide.ts` exists and drives `GUIDE_TITLE`
and `ITEM_COUNT`.

What could not be verified from the repository is what the requester actually receives after
submitting — whether a PDF or page is delivered, and by what mechanism. **Needs confirmation.**
If the guide is not actually delivered, this is the highest-value conversion fix on the site.

### 6.5 Home-value is honestly positioned
**Severity: n/a — positive · Confidence: High · [VERIFIED]**

A manual CMA request rather than an automated AVM, positioned as such. This is both truthful
and a genuine differentiator against every Zestimate-style competitor tool — and it converts a
different, higher-intent visitor. Do not replace it with an instant-estimate widget.

---

## 7. Prioritization model

Every recommendation in `IMPLEMENTATION-BACKLOG.md` is scored 1–5 on:

- **Business Impact** — effect on qualified leads
- **Search Opportunity** — realistic discovery upside
- **Confidence** — how sure we are it works here
- **Distinctiveness** — how specific it is to Jasmine (a 5 cannot be copied by any Charlotte agent)
- **Effort** — 1 = trivial, 5 = major *(divisor)*
- **Time to Signal** — 1 = days, 5 = many months *(divisor)*

```
Priority = (Impact × Search Opportunity × Confidence × Distinctiveness) ÷ (Effort × Time to Signal)
```

**This score is a sorting aid, not a measurement.** It systematically favours cheap, fast,
confident work, which is appropriate at this stage but will under-rate authority investments
that only pay back over quarters. Those are tracked separately in `ROADMAP.md` under
*Expand*, and should not be dropped because they score low here.

---

## 8. Findings requiring external data — consolidated

| # | Question | Source needed | Blocks |
|---|---|---|---|
| 8.1 | Is the site indexed? What does it rank for? | Google Search Console | All ranking claims |
| 8.2 | Does a Google Business Profile exist and is it verified? | GBP account | The largest local-search lever |
| 8.3 | Which reviews sit on her profile vs the brokerage's? | GBP + Google Maps | Review strategy |
| 8.4 | Placester contract term, auto-renew, 301 support | Placester account | The takedown decision |
| 8.5 | Are GA4 key events configured? | GA4 admin | All conversion reporting |
| 8.6 | Real Core Web Vitals field data | Vercel Speed Insights (already collecting) / CrUX | Performance sign-off |
| 8.7 | Does `jasmine.mattstoneteam.com` exist? | Stone Realty Group | `SEARCH_HOMES_URL` |
| 8.8 | What does a guide requester actually receive? | Test submission | §6.4 |
| 8.9 | Current review counts and profile URLs | Zillow (403 to automated fetch) + Google | §5 stat refresh, already open in §12 |
| 8.10 | Existing backlinks and third-party profiles | Any backlink tool; manual audit | Citation cleanup |
