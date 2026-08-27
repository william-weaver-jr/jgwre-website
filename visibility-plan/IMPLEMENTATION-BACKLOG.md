# Implementation Backlog

Concrete tasks with acceptance criteria, affected files, and priority scores.

**Nothing here has been implemented.** This is a proposal awaiting approval.

**Score** = `(Impact × Search Opportunity × Confidence × Distinctiveness) ÷ (Effort × Time to Signal)`
— a sorting aid, not a measurement. See the two documented exceptions in §3.

Every task inherits three non-negotiables:
- `npm run verify` passes (lint, typecheck, tests, build).
- A new page is added to the `PAGES` lists in both `tests/` suites, or auto-enrolled.
- Anything touching a compliance surface (§7) goes to the BIC **before** it ships.

---

## 1. Ranked backlog

| ID | Task | Imp | Srch | Conf | Dist | Eff | Time | **Score** |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| T1 | Google Search Console + Bing verification | 5 | 5 | 5 | 1 | 1 | 1 | **125.0** |
| T2 | `Person` schema on the home page | 4 | 4 | 4 | 4 | 1 | 3 | **85.3** |
| T3 | Geography into service-page titles | 4 | 5 | 4 | 2 | 1 | 2 | **80.0** |
| T4 | NC vs SC comparison table | 3 | 4 | 4 | 5 | 1 | 3 | **80.0** |
| T5 | Retire / redirect the Placester site | 5 | 5 | 4 | 3 | 2 | 2 | **75.0** |
| T6 | Brokerage bio → link to her site | 4 | 4 | 4 | 3 | 1 | 3 | **64.0** |
| T7 | Publish `/areas/fort-mill` | 5 | 5 | 4 | 5 | 2 | 4 | **62.5** |
| T8 | GBP audit + optimization | 5 | 5 | 5 | 2 | 2 | 2 | **62.5** |
| T9 | Answer-first blocks on 7 service pages | 4 | 5 | 4 | 5 | 3 | 3 | **44.4** |
| T10 | `FAQPage` on 7 service pages | 4 | 5 | 4 | 4 | 3 | 3 | **35.6** |
| T11 | Review-generation routine → her profile | 4 | 4 | 4 | 2 | 2 | 2 | **32.0** |
| T12 | Three transaction case studies | 5 | 4 | 4 | 5 | 4 | 4 | **25.0** |
| T13 | `Review` markup on `/reviews` | 3 | 4 | 3 | 4 | 2 | 3 | **24.0** |
| T14 | `Service` schema on 4 pillars | 3 | 3 | 3 | 2 | 1 | 3 | **18.0** |
| T15 | Connect Follow Up Boss | 5 | 1 | 5 | 1 | 2 | 1 | **12.5** ⚠ |
| T16 | `generate_lead` + `lead_failed` events | 5 | 1 | 5 | 1 | 2 | 1 | **12.5** ⚠ |
| T17 | Two more area pages (Indian Land, Ballantyne) | 4 | 4 | 3 | 5 | 3 | 4 | **20.0** |
| T18 | Expand `/negotiation` + guide delivery | 4 | 3 | 3 | 4 | 3 | 3 | **16.0** |
| T19 | Original annual negotiation dataset | 5 | 5 | 2 | 5 | 5 | 5 | **10.0** ⚠ |
| T20 | `BreadcrumbList` site-wide | 2 | 3 | 4 | 1 | 2 | 3 | **4.0** |

⚠ **Score is misleading — see §3.**

---

## 2. Task detail

### T1 — Search Console + Bing verification
**Files:** `app/layout.tsx` (only if meta-tag verification is chosen; DNS is cleaner)
**Do:** Verify jasminegarcia.com in GSC (DNS TXT preferred — survives redeploys) and Bing
Webmaster Tools. Submit `https://jasminegarcia.com/sitemap.xml` in both.
**Acceptance:**
- [ ] GSC verified, ownership persists after a deploy
- [ ] Sitemap shows "Success" with 17 discovered URLs
- [ ] Index-coverage baseline screenshotted into `MEASUREMENT.md`
- [ ] Bing verified and sitemap submitted
**Risk:** none. **Note:** Bing feeds ChatGPT search — this is an AEO task, not just a Bing one.

### T2 — `Person` schema on the home page ✅ DONE 2026-08-24
**Shipped as:** one node typed `["Person", "RealEstateAgent"]` with `@id`
`https://jasminegarcia.com/#jasmine-garcia`, rather than a second Person node — two nodes
sharing a name and phone number would assert two entities. Blog and video `author` fields now
reference the same `@id`; `publisher` and `worksFor` reference a shared `#brokerage` node that
was previously written out four times.
**Also added:** `imageObject()` in `lib/images.ts`. A static image import is a
`StaticImageData` object under Next and a bare **string** under Vite, so `.width` was a number
in production and `undefined` in every test — a divergence that would have shipped a malformed
image URL invisibly.
**Verified:** 744 tests green; rendered JSON-LD inspected in a browser with real dimensions
(1600×2000); no console errors.
**Outstanding:** the "validates in Rich Results Test" criterion needs a public URL and can only
be confirmed after deploy.
**LinkedIn added 2026-08-24**, URL confirmed by Bill — see X13 below, which closes differently
than this backlog originally assumed.

<details><summary>Original task specification</summary>

**Files:** [lib/schema.tsx](../lib/schema.tsx), [app/page.tsx](../app/page.tsx)
**Do:** Add `personSchema()` emitting `Person` with `name`, `jobTitle`, `url`, `image`,
`worksFor` → `RealEstateAgent` (Stone Realty Group), `hasCredential` (both licences),
`sameAs` (Instagram, Facebook, Zillow, YouTube, LinkedIn), `areaServed`. Emit on `/` alongside
the existing `realEstateAgentSchema()`.
**Acceptance:**
- [ ] Validates in Google's Rich Results Test with no errors
- [ ] `worksFor` names the brokerage — never asserts an independent firm (§7)
- [ ] License numbers present as `hasCredential.identifier`
- [ ] LinkedIn added to `SOCIAL` in `lib/site.ts` **only after** the name variant is resolved
- [ ] Compliance suite green
**Why it scores high:** her name is contested (`AUDIT.md` §4.1). The licence numbers are the
strongest unique identifier available and are currently only in `RealEstateAgent`.
</details>

### T3 — Geography into service-page titles ✅ DONE 2026-08-24
**Shipped:**

| Route | Was | Now |
|---|---|---|
| `/buyers` | Buyers | Buying a home in Charlotte |
| `/sellers` | Sellers | Selling a home in Charlotte |
| `/new-construction` | New Construction | Buying new construction in Charlotte |
| `/relocation` | Relocation | Relocating to Charlotte |
| `/carolinas-border` | The NC/SC Border | Buying in North Carolina vs South Carolina |
| `/home-value` | *(unchanged — already question-shaped)* | What is your home worth? |
| `/negotiation` | *(unchanged — it is the asset's name)* | The 19 Things Besides Price… |

`/carolinas-border` takes the state names rather than "Charlotte" deliberately: its meta
description already carries Fort Mill, Tega Cay, Indian Land, Lake Wylie, and Waxhaw, which is
more specific and more useful geography for that page than the metro name.

**Verified:** all titles unique, all ≤ 60 characters rendered including the ` · Jasmine Garcia`
template, `og:title` inherits correctly, canonicals and single-`h1` unaffected.
**✅ Approved by Jasmine 2026-08-24.** The acceptance criterion is met; these are cleared to
deploy.

<details><summary>Original task specification</summary>

**Files:** the `metadata` export in each of the seven service pages
**Do:** Rewrite `title` to include a real place name, naturally. Suggested — for review, not
prescription:

| Route | From | To |
|---|---|---|
| `/buyers` | Buyers | Buying a home in Charlotte |
| `/sellers` | Sellers | Selling a home in Charlotte |
| `/new-construction` | New Construction | New construction in Charlotte, NC & SC |
| `/relocation` | Relocation | Relocating to Charlotte |
| `/carolinas-border` | The NC/SC Border | Buying across the NC/SC line |
| `/home-value` | What is your home worth? | *(keep — already question-shaped)* |
| `/negotiation` | The 19 Things… | *(keep — it is the asset's name)* |

**Acceptance:**
- [ ] Jasmine has reviewed every title
- [ ] Each reads as a sentence a person would say — no pipe-stuffing, no repeated city names
- [ ] All titles still unique (test enforces)
- [ ] Rendered length ≤ ~60 chars before the ` · Jasmine Garcia` template
**Risk:** drifting into the generic register `BRAND-VOICE.md` bans. Two titles are deliberately
left alone above for that reason.
</details>

### T4 — NC vs SC comparison table
**Files:** [app/carolinas-border/page.tsx](../app/carolinas-border/page.tsx)
**Do:** Add a comparison table — property tax treatment, contract mechanics (NC due-diligence
period vs SC's financing / appraisal / wood-destroying-insect contingencies), closing process,
vehicle registration. Must scroll inside its own container on mobile.
**Acceptance:**
- [ ] Every row factually verified; anything unverified is `TODO(verify)` and omitted
- [ ] No school-quality, safety, or demographic framing (§7 — this page is fair-housing-adjacent)
- [ ] Accessible table markup (`<th scope>`, caption); a11y suite green
- [ ] Horizontally scrollable on mobile without the page scrolling
**Why:** comparison tables are disproportionately quoted by answer engines, and the facts are
already on the page in prose.

### T5 — Retire or redirect the Placester site ✅ DONE 2026-08-24
**Outcome:** the site was deactivated by Bill. Verified: every archived URL now returns
**302 → `placester.com/site-unavailable`** (itself a 403). Duplicate content gone.
**Residual, low severity:** it is a *302*, not a 410 — so the URLs will linger in the index
longer than a hard removal would allow. Not controllable from her account. Fold a Search
Console removal request into T1 rather than treating it as separate work. No redirect map is
needed or possible.

<details><summary>Original task specification</summary>

**Files:** none in this repo (see `AUDIT.md` §2.1 — the URLs are on Placester's subdomain)
**Do:** Confirm contract term, auto-renewal date, 301 support, and content ownership. Then
either map 301s to the closest equivalent on jasminegarcia.com, or take the site down.
**Acceptance:**
- [ ] Contract questions answered in writing
- [ ] No Placester URL returns 200
- [ ] If redirects are supported: `/area/{slug}` → `/areas/{slug}` where published, else
      `/areas`; `/area-guide/` → `/areas`; blog posts → `/blog`; home → `/`
- [ ] If not supported: taken down, then request removal via GSC where indexed
**Risk:** notice periods can be long. **Start this first.**
**Note:** `docs/AREA-GUIDE-MIGRATION.md` §9 already sketches the redirect map, and correctly
notes it is blocked on deciding which markets the new site commits to.
</details>

### T6 — Brokerage bio backlink ⚠ RESCORED — expect a no
**Files:** none
**Do:** Ask Stone Realty Group to add a link to jasminegarcia.com from
`mattstoneteam.com/jasmine-garcia/`.
**Acceptance:** [ ] Asked. [ ] Link live *(unlikely — see below)*.

> **Context added 2026-08-24 (Bill).** The BIC takes a **materially higher share of Jasmine's
> commission when the brokerage sources the lead**, and intends to keep sourcing them. A link
> from his site to hers moves leads from his column to hers at his own expense. He is unlikely
> to grant it, and the ask may draw attention to a pipeline that is better left unremarked.
>
> **Revised guidance:** keep it as a low-cost, low-expectation ask — ideally framed as agent
> profile completeness rather than as marketing — and **do not build any plan on it**. Its
> original score (64.0) assumed a cooperative counterparty. Treat Confidence as 2 rather than
> 4, which drops it to **32.0** and out of the "approve first" tier.
>
> **What replaces it.** The authority it was meant to supply has to come from sources with no
> stake in her lead flow: the Canopy Realtor® Association and NC REALTORS® directories, local
> press and the Charlotte Observer nomination follow-through (ROADMAP E4), partnership content
> with lenders and inspectors (E5), and her own third-party profiles (T13, X12). None of those
> require the brokerage's cooperation, which is now a design requirement rather than a
> preference.

**Why it was scored high originally:** an established, topically-aligned page carrying her full
statistics that does not link to her site. That remains true — it is just not obtainable.

### T6b — ⚠ NEW: audit where "Search Homes" sends her traffic *(raised by the same context)*
**Files:** [lib/site.ts](../lib/site.ts) `SEARCH_HOMES_URL`
**Severity: High · Confidence: Medium**

`SEARCH_HOMES_URL` is a `TODO(verify)` pointing at `mattstoneteam.com`, and N15 proposed
resolving it to an agent-attributed IDX subdomain such as `jasmine.mattstoneteam.com`, copying
what mackenziesiek.com does.

**Given the commission split, that proposal needs a question answered before it is
implemented:** when a visitor arrives on jasminegarcia.com from organic search, clicks "Search
Homes", registers on a brokerage-hosted IDX, and becomes a lead — **whose lead is it, and at
which split?**

If the answer is "the brokerage's," then the site's most prominent outbound link converts her
own hard-won organic traffic into brokerage-sourced leads at the worse rate. That would make
"Search Homes" the single most expensive link on the site, and it is currently in the primary
navigation.

**Do:** Ask Stone Realty Group, in writing, how leads originating on an agent IDX subdomain are
attributed and split.
**Acceptance:**
- [ ] Written answer on attribution and split
- [ ] If leads route to the brokerage at the higher split: reconsider the placement. Options
      include demoting it out of primary nav, or keeping it but ensuring her own intake is the
      more prominent path on every page it appears
- [ ] `SEARCH_HOMES_URL` resolved either way — it currently points at a brokerage home page,
      which serves nobody
**Note:** Locked Decision #2 (link out, no IDX on this domain) is not in question — that is a
compliance decision and it stands. This is about *where* the link points and how prominent it
is, not whether to build IDX here.

### T7 — Publish `/areas/fort-mill`
**Files:** [lib/areas/drafts/fort-mill.ts](../lib/areas/drafts/fort-mill.ts) → [lib/areas/data.ts](../lib/areas/data.ts)
**Do:** Run the interview in `docs/FORT-MILL-INTERVIEW.md`, get the four outstanding answers,
move the draft into `AREAS`.
**Acceptance:**
- [ ] All six required fields authored, each ≥80 chars, none shared with Steele Creek
- [ ] ≥2 levers genuinely specific to Fort Mill — the pasteable-elsewhere test fails the build
- [ ] No fair-housing language (validator enforces)
- [ ] Appears in sitemap, footer, `/areas` hub, and both test suites automatically
- [ ] FAQ + breadcrumb schema render (inherited from the template)
**Why:** 12 documented corridor closings, a finished draft, and a competitor
(thelongleafgroup.com) currently owning the query with a ~2,500-word guide.

### T8 — Google Business Profile audit + optimization
**Files:** none
**Do:** Establish whether a profile exists and is verified. Then: category *Real Estate Agent*,
tracking number `(704) 200-9360`, website → jasminegarcia.com, brokerage address, service
areas matching the §5 roster, real photos, a description in her voice.
**Acceptance:**
- [ ] Verified and owned by her
- [ ] NAP matches `lib/site.ts` exactly
- [ ] Website links to the apex
- [ ] Service areas match the roster — no invented coverage
- [ ] Baseline metrics captured
**Why:** the largest single local-search factor for an individual agent, and entirely
unaddressed. **Compliance:** the description is advertising — apply §6 and §7.

### T9 — Answer-first blocks on the seven service pages
**Files:** the seven service pages; possibly a shared component
**Do:** Add a 2–4 sentence block directly under the `<h1>` that fully answers the page's core
question — mirroring the `answer` field pattern in [lib/blog/types.ts](../lib/blog/types.ts).
**Acceptance:**
- [ ] Each block stands alone if quoted with nothing around it
- [ ] Written or approved by Jasmine
- [ ] No figure outside the `docs/CONTENT-MARKETING.md` §2 allowlist
- [ ] Does not duplicate the meta description
- [ ] Voice matches `BRAND-VOICE.md` — reframe, then evidence
**Why:** the highest-leverage AEO field on the site, currently used on two pages out of
seventeen.

### T10 — `FAQPage` on the seven service pages
**Files:** the seven service pages; `faqSchema()` already exists in `lib/schema.tsx`
**Do:** 3–5 real questions per page, rendered on the page and emitted as `FAQPage`.
**Acceptance:**
- [ ] Every answer visible on the page in the same words as the markup
- [ ] Answers are Jasmine's, captured by interview — not researched
- [ ] Each ≥80 chars and self-contained
- [ ] **No dollar figures inside an FAQ answer** — the §7 disclaimer cannot travel with a
      quoted snippet (the rule `lib/blog/validate.ts` already enforces for posts)
- [ ] One `FAQPage` per page, validates cleanly
**Consider:** extending `lib/blog/validate.ts`'s `findIncompleteFields()` rules to service-page
FAQs so the same guarantees apply.

### T11 — Review-generation routine
**Files:** none (process), possibly a `/reviews` prompt later
**Do:** A written routine for requesting reviews at closing, directing clients to **her** GBP
profile rather than the brokerage listing (`CLAUDE.md` §12 records reviews landing on the
wrong one).
**Acceptance:**
- [ ] Written process with a direct review link
- [ ] Never incentivized, never gated on sentiment (FTC + Google policy)
- [ ] Monthly count on her profile becomes a tracked metric

### T12 — Three transaction case studies
**Files:** new routes under `app/`; data from [lib/transactions/data.ts](../lib/transactions/data.ts) + `docs/CASE-STUDIES.md`
**Do:** One page per documented case study, at greater depth than the home-page ledger.
**Acceptance:**
- [ ] **BIC approval in writing before shipping**
- [ ] `RESULTS_DISCLAIMER` adjacent to every figure, body-weight (§7)
- [ ] Figures exact — `$22,210` never becomes "over $22K"
- [ ] No names, addresses, or identifying property details
- [ ] Never framed as what she *will* do
- [ ] Added to both test suites
- [ ] Linked to and from the pillar each proves
**Risk:** highest compliance surface in this backlog. **Do not add a fourth case study** —
that needs fresh client permission and separate BIC review.

### T13 — `Review` markup on `/reviews`
**Files:** [lib/schema.tsx](../lib/schema.tsx), [app/reviews/page.tsx](../app/reviews/page.tsx)
**Do:** `Review` per published review — `author`, `datePublished`, `reviewRating`,
`reviewBody`, `publisher` (Google/Zillow). Treat `AggregateRating` as a **separate decision**.
**Acceptance:**
- [ ] Only `publishableReviews()` — withheld and open-question entries excluded
- [ ] `reviewBody` verbatim, matching what renders (§7 forbids altered testimonials)
- [ ] `itemReviewed` names her as `RealEstateAgent`, never the domain as a firm
- [ ] Reviews stating dollar outcomes keep the disclaimer adjacent
- [ ] **`AggregateRating` NOT included in this task**
**Why the split:** self-serving `AggregateRating` on a broker's own site is a recognized abuse
pattern and Google restricts self-serving review snippets for `LocalBusiness`/`Organization`.
`Review` markup for individually attributed, verifiable reviews is materially safer. Both are
new advertising claims and need the BIC either way.

### T14 — `Service` schema on the four pillars
**Files:** `lib/schema.tsx` + the four pillar pages
**Do:** `Service` with `serviceType`, `provider` → her, `areaServed` from the roster.
**Acceptance:** [ ] Validates · [ ] `provider` names her with the brokerage as parent ·
[ ] `areaServed` derived from `MARKETS`, not hand-listed (the drift `lib/schema.tsx` already warns about)

### T15 — Connect Follow Up Boss ⚠
**Files:** Vercel env only; [lib/fub.ts](../lib/fub.ts) and [app/api/lead/route.ts](../app/api/lead/route.ts) are already written
**Do:** Add `FUB_API_KEY` to Vercel. Submit a real test lead. Verify it lands with source,
lead type, and UTMs.
**Acceptance:**
- [ ] Test lead appears in FUB with correct source page and lead type
- [ ] UTM parameters present
- [ ] Resend fallback still fires on FUB failure (`route.test.ts` already covers this)
- [ ] Key committed to Vercel env only, never to the repo
**Why the score understates it:** Search Opportunity = 1 because it affects no ranking. But
Locked Decision #5 gates launch on it, the site is already live, and today a Resend failure
loses the lead outright. **Do this first regardless of score.**

### T16 — `generate_lead` and `lead_failed` events ✅ CODE DONE 2026-08-24
**Shipped:** `/api/lead` now returns `delivery: "crm" | "email"` on success, so the client
reports which channel took the lead rather than guessing. `intake_submit` moved to fire on the
*attempt* (it previously fired after the ok-check, making it a second name for success);
`generate_lead` fires only on confirmed persistence; `lead_failed` fires on refusal or network
error with a grouped `reason`.
**Verified:** the PII guard in `lib/analytics.test.ts` was proven against the new call sites by
temporarily adding `email: payload.email` and confirming the build fails.
**⚠ Outstanding — not code:** mark `generate_lead` and `call_click` as **key events** in the
GA4 admin. Until that is done GA4 collects them but does not treat them as conversions, and no
channel can be compared on lead production.

<details><summary>Original task specification</summary>

**Files:** [components/contact-intake.tsx](../components/contact-intake.tsx), `app/api/lead/route.ts`, [lib/analytics.ts](../lib/analytics.ts)
**Do:** Fire `generate_lead` only on confirmed persistence; `lead_failed` when both paths fail.
Mark `generate_lead` and `call_click` as GA4 key events.
**Acceptance:**
- [ ] `generate_lead` fires only on success — never on an attempt
- [ ] `lead_failed` fires when both delivery paths fail
- [ ] **No personal data in any parameter** (`lib/analytics.test.ts` enforces)
- [ ] Both key events visible in GA4
**Why the score understates it:** same reason as T15 — no search effect, but nothing downstream
can be evaluated without it.
</details>

### T17 — Indian Land and Ballantyne area pages
As T7. Indian Land completes the border corridor; Ballantyne is a major NC market with ledger
rows. **Gated on interview capacity — do not publish either without real levers.**

### T18 — Expand `/negotiation` and verify guide delivery
**Files:** [app/negotiation/page.tsx](../app/negotiation/page.tsx), [lib/intake/guide.ts](../lib/intake/guide.ts)
**Do:** First establish what a requester actually receives today (`AUDIT.md` §6.4). Then expand
the shortest service page: the full lever taxonomy, Case 2 as proof, an FAQ.
**Acceptance:** [ ] Delivery verified end to end · [ ] Item count matches `ITEM_COUNT` ·
[ ] Case 2 used (no dollar figure → no disclaimer needed) · [ ] FAQ + answer block added

### T19 — Original annual negotiation dataset ⚠
**Files:** new; sources [lib/transactions/internal-metrics.ts](../lib/transactions/internal-metrics.ts) + the ledger
**Do:** An annual, methodologically-stated report on what was actually negotiated across her
own closings — categories and frequencies, not per-transaction figures.
**Acceptance:**
- [ ] **BIC approval, and the §12 price-band question resolved first**
- [ ] Methodology stated plainly, including sample size and its limits
- [ ] No per-transaction dollar figures; SC non-disclosure respected
- [ ] Never aggregated into an implied average (`CASE-STUDIES.md` forbids it)
- [ ] `internal-metrics.ts` stays out of `app/` and `components/` (a test enforces this)
**Why the score understates it:** Confidence 2 and Effort/Time 5 crush the ratio. But this is
the **highest-ceiling item in the plan** — an original, citable, annually refreshed statistic
is the one asset that earns AI citations and inbound links simultaneously, and no competitor
can produce it. Long-term investment, not a quick win.

### T20 — `BreadcrumbList` site-wide
**Files:** `lib/schema.tsx` (helper exists), all non-home pages
**Do:** Extend the existing `breadcrumbSchema()` beyond area pages.
**Acceptance:** [ ] Every non-home page emits one · [ ] Trail matches real IA · [ ] Validates
**Low priority, near-zero effort** — bundle it with T10.

---

## 3. Where the score misleads

The model divides by effort and time-to-signal, so it systematically favours cheap, fast work.
Three documented exceptions:

1. **T15 / T16 (FUB + events, 12.5).** Score low only because they have no search effect.
   They are prerequisites for evaluating everything else, and T15 closes a live risk of losing
   leads. **Do them first.**
2. **T19 (dataset, 10.0).** Lowest score, highest ceiling. Judge it on distinctiveness (5) and
   search opportunity (5), not on the ratio.
3. **T12 (case studies, 25.0).** Suppressed by effort and BIC lead time. It produces the one
   content type no competitor can replicate.

Conversely, **T1 (125.0) is not "the most important task"** — it is the cheapest useful one.
A high score means good value for effort, not high stakes.

---

## 4. Recommended sequence

**Status, 2026-08-24:** ✅ T5 (Placester down) · ✅ T2 · ✅ T3 — pending Jasmine's title review
and a deploy.

**Approve first (days 1–14) — no new copy required from Jasmine:**
~~T15 → T16 → T1 → T5~~ → **remaining: T15 → T16 → T1 → T6 → T8**

**Then (days 15–45) — needs her interview time:**
T9 → T10 → T4 → T7 → T14 → T20 → T11

**Then (days 46–90) — needs BIC:**
T12 → T13 → T17 → T18

**Later, gated on measurement:** T19 and the rest of `ROADMAP.md` Expand.

---

## 5. Explicitly not recommended

| Not doing | Why |
|---|---|
| Mass city-page generation | `lib/areas/data.ts` explains exactly why fourteen thin pages are the most damaging possible addition |
| Market-update / stat posts | `CONTENT-PLAN.md` rules them out; `lib/blog/validate.ts` fails the build |
| IDX / MLS integration | Locked Decision #1. Compliance cost is not close to justified |
| Instagram / Facebook / Zillow embeds | `lib/site.ts` explains it: an embed puts unreviewed copy on BIC-approved advertising |
| `AggregateRating` as a technical task | Needs a separate BIC decision — see T13 |
| Buying links, directory blasts, fake reviews | Non-starters, and would put a licensed broker at risk |
| Keyword-stuffed titles or copy | Would destroy the one thing that differentiates this site |
| A weekly blog cadence | Two a month matches her review capacity. Revisit at the T-B9 measurement gate |
