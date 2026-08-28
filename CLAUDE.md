# CLAUDE.md — Jasmine Garcia Real Estate (jasminegarcia.com)

Read this file at the start of every session. It is the source of truth for scope,
brand, and compliance. If a request in chat conflicts with the **Compliance** section,
stop and flag it rather than complying.

**Companion docs — read before writing any copy:**
- `docs/BRAND-VOICE.md` — USP, voice rules, origin story, banned language
- `docs/CASE-STUDIES.md` — the three negotiation case studies + required disclaimer
- `docs/CONTENT-PLAN.md` — page-by-page content direction and the lead magnet spec
- `docs/CONTENT-MARKETING.md` — the blog pipeline: the documented-facts allowlist, AEO post
  structure, the publishing cadence, and what may not be a post

**Where documents live — 2026-08-28.** `docs/` holds specifications: everything in it is
cited from source code, enforced by a test, or both. Strategy, competitive analysis, and
research instruments live in the **JGWRE Website** space in Notion. `docs/README.md` carries
the routing rule, the citation map, and the Notion link. The test for a new document is one
question: *does source code cite this, or does a test enforce it?* Yes → `docs/`. No → Notion.

Never copy §7 compliance rules into Notion. A second copy drifts from the enforced one, and
the drifted copy is the one someone reads.

---

## 1. Project

Personal-brand and lead-generation website for **Jasmine Garcia**, Broker/REALTOR® with
**Stone Realty Group** (Matt Stone Team), Charlotte NC.

- **Domain:** jasminegarcia.com (owned, currently no live site)
- **Repo:** `~/Projects/jgwre-website` · GitHub `william-weaver-jr/jgwre-website`
- **Phone (display everywhere):** (704) 200-9360 — the Follow Up Boss tracking number
  (Locked Decision #6). Confirmed; safe to use in site markup.
- **Replaces:** a Placester-built site (poor service/communication)
- **Not replacing:** mattstoneteam.com — the team site stays as-is on AgentFire

**Goal:** own her personal brand, capture buyer/seller leads directly, and route them
into Follow Up Boss. This is a brand + conversion site, not a property search portal.

---

## 2. The USP — everything on this site serves this

> **The other side of the table does this for a living.
> They know what's askable. Now you do too.**

The core insight, in her own words from an Instagram post:

> "Most people think negotiating is just about getting the price down. It's not.
> Sometimes the biggest savings come from things buyers don't even know to ask for."

**Why this is the direction:** "great negotiator" is a claim every agent makes, so it is
worthless as positioning. This instead names the client's real, unspoken fear — *I don't
know what I don't know, and the professional across the table does* — and answers it with
parity rather than superiority. It is a service posture, not a boast.

**It is evergreen.** Which levers matter shifts with the market (concessions when rates are
high, builder incentives when inventory sits). That a once-in-a-lifetime buyer never knows
the full list of levers does not shift, ever.

**Every page must answer:** what does the other side of *this* table know that our reader
doesn't? See `docs/CONTENT-PLAN.md` for the per-page application.

### Explicitly rejected
- **"Negotiation Queen"** — dropped. Not in use anywhere, no equity to preserve, and a
  self-applied title reads as arrogance. Do not reintroduce it in any form.
- Any bare assertion that she is a skilled negotiator. The case studies say it. She doesn't.

---

## 3. Locked decisions

Settled. Do not re-litigate or propose alternatives unless explicitly asked.

| # | Decision | Rationale |
|---|---|---|
| 1 | **No IDX/MLS integration in Phase 1** | Canopy MLS licenses feeds through MLS Grid, requires Broker-in-Charge approval, and performs a compliance review that locks search/listing page changes. Costly and restricts design freedom. Revisit only if organic traffic justifies it. |
| 2 | "Search Homes" links out to the **existing Stone Realty Group IDX** | Zero compliance surface, ships immediately. |
| 3 | **Hybrid build workflow** | Visual direction generated in Lovable/v0 → exported to GitHub → all subsequent work done in Claude Code against the real repo. |
| 4 | **No consultation booking tool** (no Cal.com) | Clients call her directly. Phone-first CTAs throughout. |
| 5 | **Follow Up Boss is the CRM** | Every lead form must reach FUB. Nothing ships with an unwired form. |
| 6 | **Call tracking is handled inside Follow Up Boss** | Use the FUB-provided tracking number in site markup. Do not add a second call-tracking vendor. |
| 7 | **USP locked** (Section 2) | Derived from her own words; validated against her three documented case studies. |

---

## 4. Stack

- **Framework:** Next.js 15, App Router, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (jasminegarcia.com apex + www redirect)
- **Content:** CMS required — Jasmine must be able to publish and edit without a developer.
  (Sanity or Payload; final pick TBD — see Open Items.)
- **Forms:** Next.js Route Handler → (a) transactional email via Resend, (b) POST to Follow Up Boss
- **Analytics:** Vercel Web Analytics + Vercel Speed Insights + GA4, all mounted in the
  root layout and all production-only. Every vendor here must also be named on
  `/privacy-policy` — a test enforces it.
- **Images:** `next/image`, AVIF/WebP, explicit width/height on everything

### Importing transactions

The closed-transactions workbook is the source of the ledger, and
`npm run import:transactions -- <csv>` diffs it against what is shipped. It
prints new rows ready to paste, flags where the sheet disagrees with the site,
and runs the §7 checks before the code is written rather than after.

It deliberately does **not** write `lib/transactions/data.ts`. The lever line and
the compliance calls are editorial and stay with a person — see
`docs/TRANSACTIONS-SPEC.md` §5.

### Conventions
- Server Components by default; `"use client"` only where interactivity requires it
- No `any` in TypeScript
- No inline styles — Tailwind utilities and design tokens only
- Design tokens live in `tailwind.config.ts`; never hardcode hex values in components
- Commit after each completed page or feature, with a descriptive message
- Run `npm run verify` before declaring any task done — lint, typecheck, test, build

### Testing

`npm run verify` is the gate. CI runs the same four steps on every push and pull
request (`.github/workflows/ci.yml`).

| Suite | Covers |
|---|---|
| `lib/**/*.test.ts` | Pure logic and the datasets: the lead schema, the FUB payload, intake formatting and lever selection, review and transaction queries. Includes integrity checks over the real `REVIEWS` and `TRANSACTIONS` data. |
| `lib/blog/index.test.ts` | The blog registry and the publishing gate. Notably it is the **only** thing that checks a *scheduled* post — one dated forward is invisible to the suites below, which render published pages, so its metadata and raw MDX are scanned here at merge time instead of publishing themselves unwatched. |
| `app/api/lead/route.test.ts` | The §9 contract end to end with FUB and Resend mocked — honeypot, rate limiting, and every failure combination. A lead is never silently dropped. |
| `tests/compliance.test.tsx` | **§7, mechanically.** Renders every page and checks brokerage identification, license numbers, the EHO and REALTOR® marks, verbatim TCPA consent, the results disclaimer beside any dollar figure, banned language, fair-housing framing, guarantee language, and undocumented claims. |
| `tests/accessibility.test.tsx` | §10. axe-core at WCAG 2.1 AA over every page, plus landmark and link-name checks. Contrast still needs Lighthouse — jsdom computes no colours. |
| `scripts/lib/importer.test.ts` | The workbook importer. Its failure mode is not a crash but a plausible wrong import that reaches a licensed broker's advertising, so the tests lean on quiet corruption: a moved column, a review body full of commas, a corrected neighborhood that must read as a change rather than a delete plus an add. |
| `components/analytics-opt-out.test.tsx` + `lib/analytics-consent.test.ts` | The privacy promise. `/privacy-policy` says analytics can be switched off, and that sentence is why there is no consent banner — these keep the control honest, including in a browser that refuses localStorage. `lib/analytics.test.ts` also reads every `track()` call site so no personal field can become a GA4 parameter. |
| `lib/video/index.test.ts` + `components/video-embed.test.tsx` | The video registry and the embed. The registry checks are aimed at a plausible-looking bad entry — a summary pasted from a YouTube description, a duration that disagrees with the asset, a second video on a page that already has one. The component asserts the two properties invisible in a screenshot: nothing is requested from YouTube until the visitor clicks, and the summary is on the page in words for anyone who never does. |
| `components/contact-intake.test.tsx` | The conversion path. The consent box is never pre-checked, no visitor is trapped behind the qualifying questions, and a failed submission always surfaces the phone number. |

Two things follow from this:

- **§7 violations now break the build.** That sentence used to be aspirational.
  Adding a page means adding it to the `PAGES` list in both `tests/` suites, or it
  ships unchecked. Blog posts are the exception and are expanded into both lists
  automatically from `publishedPosts()` — the blog grows on a cadence, and a
  hand-maintained list is one someone eventually forgets to add to.
- **Verbatim testimonials are exempt from our own styleguide**, and the suites
  model that: banned language and the negotiation-queen ban are checked against
  copy outside `<blockquote>`. A client's words are not the site making a claim.

Not covered, deliberately: no browser-level end-to-end suite yet. Worth adding
(Playwright) once the CMS lands and pages stop being static — today the compliance
and a11y suites render the same trees a browser would.

---

## 5. Positioning pillars

Four pillars. Each gets a dedicated page, and each is the USP applied to a specific table.

1. **New construction** — 17 closings with Copper Builders, David Weekley, Vista Homes,
   DRB, Pulte, Meritage, Lennar, DR Horton, Kolter, Hopper Communities.
   *The table:* the builder's sales office negotiates daily; the buyer never has.
2. **Relocation** — 18 relocation transactions.
   *The table:* everyone in the transaction is local except the client.
3. **The NC/SC border** — licensed in both states. Fort Mill, Tega Cay, Indian Land,
   Clover / Lake Wylie, Rock Hill (SC) and Waxhaw (NC). 12 closings in the Fort Mill
   corridor.
   The corridor spans the line, which is the point of the pillar — Waxhaw is a North
   Carolina town in Union County and was listed under SC here in error until 2026-08-17.
   *The table:* two states, two tax regimes, two sets of rules.
4. **Sellers** — the Stone Selling System (reference by name; see Compliance).
   *The table:* the buyer's agent and the inspector both work for the buyer.

**Supporting proof** (use sparingly, never as a stat wall):
73+ career transactions · $30.9M career volume · 98.84% list-to-sale ratio ·
23 transactions / $9.9M in 2024 · top-5 producer at SRG in 2023 and 2024 ·
105 five-star reviews (42 Zillow, 62 Google) · Zillow Premier Agent

**Recognition** — documented here so §6 permits its use. Data in `lib/site.ts`
(`RECOGNITION`). No `/awards` page: these live at the foot of `/reviews` and
nowhere else. Each still needs its issuer and scope confirmed before it ships.

| Year | Recognition | Issuer | Scope |
|---|---|---|---|
| 2023 | Top 3 for most Google reviews | Stone Realty Group | Among agents at the brokerage. Always state the scope — her caption's "the most 5-star Google reviews" is an unbounded superlative and does not ship |
| 2024 | Excellence in Client Satisfaction | Stone Realty Group | Brokerage award |
| 2026 | **Nominated**, Charlotte's Best Real Estate Broker | The Charlotte Observer, Charlotte's Best Awards | Public vote ran July 6–24, 2026; winners announced October 2026. Say "Nominated," never anything warmer. Revisit after the announcement |

Two of the three are internal brokerage awards and must always name Stone Realty
Group as the issuer. An unattributed "Excellence in Client Satisfaction" reads as
an industry award, which it is not.

The Instagram captions announcing these are not copy. "Turning dreams into
reality" is the exact register `BRAND-VOICE.md` bans, and the useful line in the
2024 caption — that teaching taught her to lead and educate — is already on
`/about` in better words.

**Where she taught** — documented here so §6 permits the copy on `/about` and
`/carolinas-border`. Ten years of special education: **six in Charleston, SC** and **four in
Hampton, VA** (Bill, 2026-08-20). Two consequences worth keeping straight:

- Her own bio video says "six years as a teacher" and `/about` says ten. **Both are correct**
  and neither is corrected. The video's on-page summary states neither number, deliberately.
- The Charleston years are the site's only evidence that her South Carolina knowledge predates
  her South Carolina license, which is the pillar `/carolinas-border` rests on. Use it as
  biography, never as a credential — she taught school there, she did not practise real estate
  there.

**Markets served:** Ballantyne, SouthPark, Steele Creek, Myers Park, Dilworth, South End,
LoSo, Uptown, Pineville, Waxhaw (NC) · Fort Mill, Tega Cay, Indian Land, Clover /
Lake Wylie, Rock Hill (SC)

Confirmed 2026-08-17. Lake Wylie is the unincorporated area; Clover is the town, so
both names appear. Closings outside this list happen and belong in the transactions
ledger when they do — Dallas NC is already there. "Markets served" is where she is
positioned and where area pages get built, not a boundary on what she has closed.

---

## 6. Voice

Full rules and banned language in `docs/BRAND-VOICE.md`. The short version:

Her own writing is the model. Short declarative sentences. A reframe, then proof.
No adjectives doing work that numbers should do. Warm, direct, unshowy.

Never claim credentials, awards, designations, or statistics not documented in Section 5
or `docs/CASE-STUDIES.md`. If copy needs a number you don't have, insert `TODO(verify)`
and leave it.

### Brand & voice references
Calibrate voice and visual direction against these. Do not lift stats or claims from them
without verifying against Section 5.

- **Instagram (business):** [@myrealtorjasmine_](https://www.instagram.com/myrealtorjasmine_)
  — note the trailing underscore
- **Instagram (personal):** [@iheartjasz](https://www.instagram.com/iheartjasz)
- **Facebook (business page):** [jgwrealestate](https://www.facebook.com/jgwrealestate)
  — confirmed 2026-08-24. Linked in the footer and on `/contact`, never embedded
- **Zillow profile:** https://www.zillow.com/profile/myrealtorjasmine
- **YouTube (her channel):** [@MyRealtorJasmine](https://www.youtube.com/@MyRealtorJasmine)
  — confirmed 2026-08-20. Two public videos, no Shorts, no playlists, no channel
  description. See `docs/VIDEO-SPEC.md` for how a video reaches the site.
- **Bio video (hers):** "Meet Jasmine Garcia | Charlotte Realtor, Former Teacher & Mom of
  Twins" — https://www.youtube.com/watch?v=EpLuc5n6hHs · 1:42 · published 2026-06-15.
  This is the one that ships, on `/about`.
- **Bio video (Stone Realty Group's):** "Meet Jasmine Garcia – Stone Realty Group" —
  https://youtu.be/J6T4pmDWQ6M · 0:39. **Not on her channel** — it is published by
  @StoneRealtyGroup, and its description carries Matt Stone Team links, a different phone
  number, and a "#2 Agent in Charlotte" claim documented nowhere in §5. A voice reference
  only. It is never embedded here. (This file listed it as her bio video until 2026-08-20.)
- **Placester site content:** available from Bill on request, needed for the 301 map
  before that site is retired

---

## 7. Compliance — non-negotiable

Advertising rules apply to every page. Treat violations as build-breaking.

### Must appear
- **Brokerage name — "Stone Realty Group" — on every page** (footer minimum, prominent).
  North Carolina requires brokerage identification in a broker's advertising; South
  Carolina has an equivalent requirement. She may not present as an independent firm.
- **Brokerage address:** 2459 Wilkinson Blvd, Suite 310, Charlotte, NC 28208
- **License numbers:** NC 334700 · SC 125546
- **Equal Housing Opportunity logo** in the footer
- **Privacy policy** page, linked from footer and every form
- **Results disclaimer** adjacent to every page displaying specific dollar outcomes —
  exact wording in `docs/CASE-STUDIES.md`. Required by the BIC.
- **REALTOR® / MLS trademark usage** — correct symbols, correct capitalization

### Must not appear
- Any implication that jasminegarcia.com is a brokerage or that she operates independently
- Stone Realty Group's registered marks used decoratively. "Stone Selling System," "Stone
  Realty Group," and the stylized hexagon "O" are registered trademarks of Stone Realty
  Group. Reference by name where accurate; do not restyle, recolor, or incorporate the
  logos into her brand system.
- MLS listing data of any kind (see Locked Decision #1)
- Guarantees or implied guarantees of outcome. The case studies are *what happened*, never
  *what will happen*. Ban "I'll get you," "I always," "guaranteed," "every client saves."
- Fair-housing-adjacent language: no references to the racial, religious, ethnic, familial,
  or disability makeup of neighborhoods; no "safe neighborhood," "good schools for families
  like yours," "up-and-coming area." Describe housing stock, amenities, commute, and price.
- Testimonials altered from their original wording

### Forms
Every lead form carries this consent text verbatim, with the Privacy Policy linked:

> I agree to be contacted by Stone Realty Group via call, email, and text for real estate
> services. To opt out, you can reply 'stop' at any time or reply 'help' for assistance.
> You can also click the unsubscribe link in the emails. Message and data rates may apply.
> Message frequency may vary.

TCPA consent language carried over from the team site. Do not reword, shorten, or pre-check
the associated checkbox.

### Approvals
The Broker-in-Charge at Stone Realty Group must approve this site in writing before it goes
live, and must approve material changes after.

**APPROVED 2026-08-10** — reported by Bill. Covers the site as it stands and the results
disclaimer wording. This clears the production-deploy gate.

**Transactions page going public — APPROVED 2026-08-17.** Reported by Bill. `/transactions`
was noindexed and unlinked while its dataset was empty; it now carries closed transactions
from the 2022 workbook and is indexed, linked in the footer, and in the sitemap. Approval
covers the ledger as specified in `docs/TRANSACTIONS-SPEC.md` §1 — neighborhood-level
locations, side always stated, no prices, no client names, no addresses.

It does **not** extend to the pipeline states, which remain blocked (§2 of that spec and
the open item in §12). Nor to displaying dollar figures on the page: closing prices live
in `lib/transactions/internal-metrics.ts`, which no page may import, and putting any of
them on screen is a fresh decision for the BIC.

**The bio video on `/about` — APPROVED 2026-08-20.** Reported by Bill. The BIC funded this
video and posts it on his own channels and Medium, so its use in her advertising is not in
question. Covers `EpLuc5n6hHs` embedded on `/about`, the summary written beside it, and the
`VideoObject` markup. `docs/VIDEO-SPEC.md`.

**The still it ships with is a documented, temporary exception.** YouTube's generated frame
for this video carries the stylized hexagon "O" burned in — the video is watermarked
throughout, so no frame of it is clean — and the "Must not appear" list above forbids using
the brokerage's registered marks decoratively. Bill directed on 2026-08-20 that it ships as-is
and gets swapped during the channel cleanup, on the grounds that the BIC funded the video,
distributes it himself, and it is his mark to object to.

Two things follow. This is an **exception with an owner and an end date**, not a precedent —
no other page may carry the hexagon, and `lib/images.ts` `VIDEO_STILLS` says so at the call
site. And the swap is real work that has to actually happen: a custom thumbnail is on the
channel-cleanup list, and when it lands the exception closes.

**Footer marks, text-only — APPROVED 2026-08-10.** The BIC confirmed a text treatment of the
Equal Housing Opportunity and REALTOR® marks is acceptable; he uses the same on his own site.
So the current footer is an approved state, not a stopgap waiting on artwork. Dropping the
licensed NAR logos in later is an upgrade we may choose, not a defect we must fix — and
because it changes a compliance surface, it goes back to the BIC when it happens.

Two things it does not clear, because neither was in front of the BIC and neither is the
BIC's call to make alone:

- **The privacy policy still needs counsel.** A Broker-in-Charge supervises brokerage
  advertising; they are not the lawyer who signs off on a privacy policy. The page is still
  a working draft, and what it says about Follow Up Boss and Resend has still not been
  checked against those vendors' terms.

  The **consent-mechanism** question inside it is decided, though, on practical grounds
  rather than as a legal opinion — **2026-08-24, Bill: no banner, full disclosure, reachable
  opt-out.** A GA4 install serving one metro with the advertising features off is not what a
  consent interstitial is for. What holds that up in code: Google Signals and ad
  personalization are switched off in `components/google-analytics.tsx` rather than left to
  an account default, no personal information is ever an event parameter (a test reads the
  call sites), and `/privacy-policy` carries an opt-out that all three vendors honour
  (`lib/analytics-consent.ts`). Google Signals is also **confirmed off in the GA4 property
  itself** (Bill, 2026-08-24) — the property toggle is independent of the tag config and no
  test can see it. **Reopen it if** any of Google Signals, remarketing, or a Google Ads link
  is turned on, or the site starts marketing beyond the local area.

  The vendor half of the counsel review is split, and **the Follow Up Boss half is no longer
  parked.** It was parked on 2026-08-24 (Bill) until the CRM was connected, on the grounds
  that nothing had been sent there — no account, no key. **The integration connected and was
  verified on 2026-08-28 (§12), so that condition is met and both follow-ups are now due:**

  1. **Restore the sentence naming Follow Up Boss on `/privacy-policy`.** It was trimmed on
     2026-08-24 because it said submissions were stored in Follow Up Boss while every one of
     them was in fact reaching the notification email and nothing else. That is no longer
     true — real submissions now reach the CRM, so a policy that does not name it is the
     inaccurate version. **The page is a compliance surface: this is a material change and
     goes to the BIC, and the vendor terms are counsel's question, not the BIC's.**
  2. **Run the vendor check.** What the page says about Follow Up Boss now has to be checked
     against Follow Up Boss's terms. Resend is still open and was never parked — and it is
     now also live, carrying the same notification traffic.

  The stakes moved with the connection. Until 2026-08-28 this was a review of what a draft
  said about a vendor receiving nothing. It is now a review of what the page says about two
  vendors receiving real client contact details.
- **The transactions pipeline states are still blocked.** Active / pending / coming-soon
  need their own written BIC approval — `docs/TRANSACTIONS-SPEC.md` §2 and §12 below. A
  general site approval is not that approval. Do not build them on request without it.

"Material changes after" now applies. Anything that alters a compliance surface — the
disclaimer, the consent text, brokerage identification, a new claim or statistic — goes back
to the BIC before it ships. The suite in `tests/compliance.test.tsx` guards the wording that
was approved; it cannot tell you when something new needs approving.

**Client permission for the three case studies has been obtained.** Names remain omitted.

---

## 8. Sitemap

```
/                       Home — USP hero, three case studies, phone CTA
/about                  Her story (see BRAND-VOICE.md — handle with care)
/buyers                 Buyer process
/new-construction       PILLAR — anchored by the $50K builder incentive case
/relocation             PILLAR — out-of-state buyer guide
/carolinas-border       PILLAR — NC vs SC: taxes, schools, commute
/sellers                PILLAR — references Stone Selling System by name
/negotiation            The lead magnet landing page (see CONTENT-PLAN.md)
/home-value             Valuation request form → FUB (manual CMA, not an automated AVM)
/areas/[slug]           Neighborhood pages, one per market in Section 5
/reviews                Testimonials, unedited
/blog                   Evergreen posts. MDX in-repo until the CMS lands.
/blog/[slug]            One post. See docs/CONTENT-MARKETING.md
/contact                Phone-first, form secondary
/privacy-policy
```

---

## 9. Follow Up Boss integration

- Single server-side handler at `app/api/lead/route.ts`; all forms POST to it
- FUB API key in Vercel env vars only — never in client code, never committed
- Payload includes source (page slug), lead type (buyer/seller/valuation/guide), and UTM params
- Honeypot field + rate limiting; no CAPTCHA unless spam becomes a real problem
- On failure, still send the email via Resend and log the error — never silently drop a lead
- [x] Test end-to-end with a real submission before launch — **done 2026-08-28**, both
  channels confirmed live (§12). Re-run it after any change to the env vars or either
  vendor: the failure this caught was invisible to `vercel env ls`.
- **The lead `source` is the brokerage's to set, not ours.** Lead Flow assigns it
  account-side and overrides whatever the API sends. Do not "fix" `lib/fub.ts` to chase it
  — see §12 for the four attempts that ruled this out.

---

## 10. Accessibility & performance

Real estate sites are a common target for ADA demand letters. Legal risk, not a nicety.

- WCAG 2.1 AA: 4.5:1 text contrast, visible focus states, full keyboard navigation
- Semantic HTML, one `<h1>` per page, logical heading order
- Alt text on every image; labels (not placeholders) on every form field
- Lighthouse ≥ 95 accessibility, ≥ 90 performance before launch

---

## 11. SEO

- `RealEstateAgent` + `Person` JSON-LD on the homepage; `LocalBusiness` with the brokerage address
- Unique title + meta description per page; no templated boilerplate across area pages
- Area pages must carry genuinely distinct content — thin duplicated pages will be ignored
- Canonical tags, sitemap.xml, robots.txt
- 301 redirects from any indexed Placester URLs once that site is retired

---

## 12. Open items

- [x] **Origin story — RESOLVED 2026-08-07.** Version A (candid) approved, framed to carry
      her tenacity rather than reading as quitting. See `docs/BRAND-VOICE.md` §3. Shipped.
- [ ] Brand identity: palette, typography, logo — **proposed, pending her review.** Current
      direction and open questions in `docs/brand-decisions.md`. Do not invent an alternative.
      Must be visually distinct from Stone Realty Group's black/hexagon system.
- [x] **"Queen of Negotiations" — RESOLVED 2026-08-07.** It is a self-applied nickname she
      uses on Instagram and in a video, not an identity that competes with the site's
      positioning. **She keeps using it on Instagram; it simply never appears on this site.**
      Instagram and the website do not share an audience, and they do not have to say the
      same thing. §2's rejection stands for the *site* only — the stated premise that the
      title was "not in use anywhere" was wrong, and that reasoning is retired.
- [x] **Stat discrepancy — RESOLVED 2026-08-07.** No reconciliation needed. "Families served"
      and "transactions" are different measures for different audiences, and the two may
      differ without either being wrong. Present her as the top performer she is, using the
      strongest **documented** figures.
      **This does not loosen §6:** only numbers documented in §5 or `docs/CASE-STUDIES.md` may
      ship. The Instagram figures (85+ families, $30M+) are not documented here and are not
      used until someone verifies them.
- [ ] **Refresh the §5 stat block.** The documented counts date from an earlier pull and are
      likely low — she has closed more since. Get current numbers from Follow Up Boss or the
      MLS, including a families-served count if she wants that framing on the site.
- [x] **Vitality Homebuyers — RESOLVED 2026-08-07.** She co-owned it; it is no longer active.
      **Not disclosed on the site.** The investor-side experience still informs how she reads
      a property, so the About page reflects that perspective without naming the company.
      (Her live Placester bio does name it as current — another reason that site should not
      outlive this one.)
- [x] **Transactions page — SHIPPED 2026-08-17.** `docs/TRANSACTIONS-SPEC.md`. Ten closed
      transactions, all 2022, from the closed-transactions workbook. Public, indexed, and
      BIC-approved (§7). Active/pending/coming-soon remain a compliance conflict needing
      separate written approval — do not implement on request without it.
- [x] **Backfill 2023–2026 into the ledger — DONE 2026-08-17.** The workbook grew to 32
      closings spanning 2022–2026, including the first seller-side rows and the first
      2026 closing. Neighborhood and property type now come from the workbook, which is
      the closing record and outranks Zillow's generated location line where they differ.
- [x] **All seven workbook reviews verified 2026-08-19.** Seth Kuhnau, ChaRay Bland,
      Aini A (Nuraini Adams), Amy Hood, Julie Counterman, Cathy Phillips, and Vicki White
      are all on the **Stone Realty Group** Google listing rather than her own profile —
      more evidence the §5 count of 62 Google reviews undercounts her. Six are published
      and linked from the ledger. No `unverified-*` entries remain. Jonathan Fitch left no
      review; the sheet was corrected.
- [ ] **Vicki White's review is verified and deliberately unpublished** — `google-vicki-white`.
      Not a data gap: it attacks the opposing agent in identifiable terms and states the
      client believes she was mistreated because she is a military veteran. §7 forbids
      trimming a testimonial into shape, so it runs whole or not at all. Needs the BIC and
      probably counsel. Her closing stays in the ledger regardless (2022-park-place-01).
- [x] **Brittany Haney's 2026 sale — ADDED 2026-08-20.** `2026-beverly-crest-02`. It is
      the same townhouse as `2022-beverly-crest-01`, sold in the same month she got them
      under contract in Fort Mill. One client, three rows, four years — the strongest
      retention evidence in the dataset.
- [ ] **Humberto Zambrano has a 2025 purchase with no ledger row.** `zillow-humberto-zambrano`
      records a 2025 Rock Hill BUY; the workbook has only his August 2026 Charlotte sale
      (`2026-trinity-park-01`). Either the purchase is missing from the workbook or the
      review's metadata is wrong. It would be the ledger's only 2025 row.
- [ ] **`unverified-john-white` needs a permalink.** Seller side, an estate sale run for an
      out-of-state client — one of very few seller reviews on file, so worth chasing. Its
      row (`2026-charlotte-01`) carries no review link until it clears.
- [ ] **Do not publish the Vicki White review as written.** It is a strong five-star
      review, but it attacks the opposing agent at length ("the poster child for giving
      realtors a bad name") and states the client believes she was mistreated because she
      is a military veteran. Republishing it puts a disparaging claim about an identifiable
      third party on the brokerage's advertising and drags a protected characteristic into
      copy §7 keeps clear of. Her closing is in the ledger; the words need the BIC and
      probably counsel.
- [ ] **Price bands on the transactions ledger — parked idea, not approved.** Deliberately
      not built now. The question it would answer is a real one ("does she work in my
      range?"), and the compliant shape is a coarse band as a filter or a single §5 line,
      never a per-row figure. Blockers to clear first: SC is a non-disclosure state, so no
      SC row may contribute a figure without written per-transaction permission; §7 pulls
      the results disclaimer in alongside any dollar outcome; and it is a material change,
      so it goes to the BIC. The underlying numbers are already recorded in
      `lib/transactions/internal-metrics.ts`, which a test keeps out of `app/` and
      `components/`.
- [ ] CMS final pick: Sanity vs Payload — deferred, non-critical for Phase 1 launch.
      `/blog` ships without it: posts are MDX in `content/blog` with typed metadata in
      `lib/blog/data.ts`, which means a developer publishes for now. The `Post` type is
      shaped to map onto CMS document fields so the migration is mechanical. Whatever
      replaces it must keep `lib/blog/validate.ts` — moving copy into a CMS is how the §6
      discipline gets lost.
- [ ] **First blog batch.** The pipeline is built and the first post is published-eligible:
      `what-you-can-negotiate-besides-price` was read and **approved by Jasmine 2026-08-21**.
      Her two corrections are recorded in `docs/CONTENT-MARKETING.md` §8 and both generalize
      to every future post — the listing agent is the repeat player, not the seller, and
      contract mechanics are named per state. Four or five more still to draft.
- [x] NC and SC license numbers — NC 334700, SC 125546 (§7)
- [x] **Broker-in-Charge approval (site + results disclaimer wording) — RECEIVED 2026-08-10.**
      See §7 Approvals for what it covers and the two things it does not. §7 asks for written
      approval: file the written record if it is not already filed. Material changes from here
      go back to the BIC.
- [ ] Confirm Placester contract term, auto-renewal date, and content/domain ownership
      before giving notice
- [ ] Confirm the Stone Realty Group IDX search URL (the "Search Homes" destination)
- [x] **Follow Up Boss — CONNECTED AND VERIFIED 2026-08-28.** A live submission returns
      `{"ok":true,"delivery":"crm"}` on HTTP 200 with no error lines in the production
      logs, so the lead reached Follow Up Boss *and* the Resend notification sent. Both
      channels are working for the first time since the site went live, which closes the
      Locked Decision #5 launch gate. Resend is verified end to end too: domain verified,
      sender `website@jasminegarcia.com`, destination `jasmine@mattstoneteam.com`.

      **The root cause was not a missing key, and the next person should know why.** All
      four variables had existed in Vercel for nine days holding **empty strings**, seeded
      with the project from the blank right-hand sides of `.env.example`. An empty string
      is falsy, so every `if (!apiKey)` guard fired and *neither* channel ran — there was
      no fallback, because there was no channel. Two signals actively misled: `vercel env
      add` answers "already exists", which reads as "already set", and `vercel env ls`
      prints "Hidden" for a Secret whether it holds a key or nothing. The fix was `env rm`
      then `env add` with real values, and a redeploy. `.env.example` now carries the whole
      trap, including the tell that separates empty from wrong: "is not configured" is the
      falsy guard, while a bad key fails later as a 401.
- [ ] **Two asks to the brokerage, both one sentence, neither fixable in code.** The
      integration works but routes untidily, and both causes are account-side configuration
      only Stone Realty Group can change.

      **The lead source cannot be set by this site.** Four attempts ruled it out — `source`
      on the event, `source` on the person, a direct `PUT /v1/people/:id`, and a registered
      system with `X-System` headers — every one still landing on `<unspecified>`. The
      person payload explains it: `"sourceId": 1, "leadFlowId": 113`. The source is assigned
      by the account's Lead Flow, not by the caller, and `GET /v1/leadFlows` returns "You do
      not have access to this API endpoint" for her Agent-role key. **This is not a defect
      and there is no code fix** — the request already carries the source three ways.

      **Assignment takes a round trip.** The Lead Flow routes the lead to the broker first,
      then `assignedUserId: 13` reassigns it to Jasmine. It lands on her, but the lead is
      his for long enough to fire his notification.

      One entry fixes both: *add a Lead Flow entry for source `jasminegarcia.com` and assign
      it to Jasmine.* It costs him nothing operationally. If he declines, `sourceUrl` still
      records the exact page and `assignedUserId` still lands the lead on her — attribution
      survives in a weaker form. §7 explains why the ask may not be granted.
- [ ] Professional photography and any brand video
- [x] **YouTube on the site — SHIPPED 2026-08-20.** The bio video on `/about` as a
      click-to-load facade, the channel in `sameAs` and the footer, and `VideoObject` on
      `/about` only. The mechanism is a registry (`lib/video/data.ts`), so video three is
      one entry in one file. `docs/VIDEO-SPEC.md`.
- [x] **Video BIC sign-off — RECEIVED 2026-08-20.** See §7 Approvals, including the one
      question it does not answer (the hexagon watermark in the thumbnail).
- [x] **Ten years or six? — RESOLVED 2026-08-20.** Ten total: six in Charleston, SC and four
      in Hampton, VA (Bill). `/about` and the video are both correct and neither changes. The
      video's on-page summary states neither number, deliberately — `docs/VIDEO-SPEC.md` §7.
- [x] **The Charleston tie — SHIPPED 2026-08-20.** Approved for use by Bill. Documented in §5
      and now on `/about` (the ten years, split by state) and `/carolinas-border` (the SC side
      is somewhere she has lived, not only somewhere she is licensed). Biography, not a
      credential: she taught school in South Carolina, she did not practise real estate there.
- [ ] **The channel is being cleaned up.** Bill, 2026-08-20: the YouTube-side conventions in
      `docs/VIDEO-SPEC.md` §3 will be implemented — titles, descriptions carrying brokerage
      identification and the site URL, corrected captions, category, custom thumbnails. A
      custom thumbnail is also what unblocks the poster question above.
