# Content Map

Page inventory, query mapping, clusters, internal linking, and a twelve-month backlog.

**Word counts** are from the live pages, 2026-08-24. **Query themes** are the intent each page
should own — no search volumes are asserted anywhere, because none have been measured
(`MEASUREMENT.md` §1).

---

## 1. Current page inventory

| Route | Words | Audience | Intent | Conversion goal | Structured data | Verdict |
|---|---:|---|---|---|---|---|
| `/` | 2,687 | All | Brand / evaluative | Call | RealEstateAgent | **Keep.** Add `Person` (§AUDIT 2.6) |
| `/about` | 2,667 | Evaluating her | Trust | Call | Person, VideoObject | **Keep as-is.** Best-marked-up page |
| `/negotiation` | 1,226 | Buyers + sellers | Informational → lead | Guide download | **None** | **Expand.** Shortest page, highest stated value |
| `/new-construction` | 1,801 | New-construction buyers | Commercial | Call | **None** | **Expand.** Add FAQ + Service |
| `/sellers` | 1,723 | Sellers | Commercial | `/home-value` | **None** | **Expand.** Add FAQ + Service |
| `/relocation` | 1,765 | Out-of-state buyers | Commercial | Call / guide | **None** | **Expand.** Directly contested |
| `/carolinas-border` | 2,158 | NC/SC cross-border | Informational → commercial | Call | **None** | **Expand + table.** Strongest moat |
| `/buyers` | 2,055 | Buyers, first-time | Informational | Call | **None** | **Expand.** Add FAQ |
| `/home-value` | 2,018 | Sellers | Transactional | CMA request | **None** | **Keep + FAQ.** Honest AVM alternative |
| `/reviews` | 12,273 | Evaluating her | Trust | Call | **None** | **Mark up.** Biggest unexploited asset |
| `/transactions` | 3,537 | Evaluating her | Trust / proof | Call | **None** | **Keep + spawn case studies** |
| `/areas` | 1,405 | Local searchers | Navigational | To area pages | **None** | **Keep + `ItemList`** |
| `/areas/steele-creek` | 4,413 | Steele Creek | Local commercial | Call | FAQ, Breadcrumb | **Model page.** Replicate |
| `/blog` | 1,042 | Researchers | Navigational | To posts | **None** | **Keep.** Grows with cadence |
| `/blog/what-you-can-negotiate-besides-price` | 3,332 | Buyers | Informational | Guide / call | BlogPosting, FAQ | **Model page.** Replicate |
| `/contact` | 1,209 | Ready to act | Transactional | Call / form | **None** | **Keep + `ContactPoint`** |
| `/privacy-policy` | 1,683 | — | — | — | — | **Keep.** Still needs counsel (§7) |

**No thin pages. No duplicate pages. No cannibalization.** This is unusual and is a direct
result of the discipline in `lib/areas/data.ts` and `docs/CONTENT-MARKETING.md`. Protect it.

### Cannibalization watch
The only live risk is structural and already governed: **area pages vs blog posts vs pillar
pages** could collide on the same market or topic. Current rules — neighborhood content goes
to `lib/areas`, never `/blog`; posts are negotiation or process only; pillars own the service
query — resolve it. **The one rule to enforce going forward:** a case-study page must target a
*transaction-shaped* query ("what can a seller concession actually cover"), never a
*market-shaped* one, or it will compete with the relevant area page.

---

## 2. Page-to-query mapping

Query themes, not keyword targets. The test for each is `BRAND-VOICE.md` §1: *what does the
other side of this table know that our reader doesn't?*

| Page | Primary theme | Secondary / long-tail |
|---|---|---|
| `/` | Charlotte realtor · Charlotte real estate agent | negotiation-led agent, dual NC/SC broker |
| `/buyers` | buyer's agent in Charlotte | first-time homebuyer Charlotte, do I need my own agent, what does a buyer's agent do |
| `/sellers` | listing agent in Charlotte | selling a home in Charlotte, inspection response, offer evaluation |
| `/new-construction` | new construction realtor Charlotte | do I need an agent for new construction, builder incentives, is the on-site agent my agent |
| `/relocation` | Charlotte relocation realtor | moving to Charlotte from out of state, buying remotely |
| `/carolinas-border` | NC vs SC real estate | Fort Mill vs Charlotte taxes, buying in SC vs NC, dual-licensed agent |
| `/negotiation` | what is negotiable when buying a house | seller concessions, what to ask for besides price |
| `/home-value` | what is my Charlotte home worth | home valuation vs Zestimate, CMA |
| `/reviews` | Jasmine Garcia reviews | Charlotte realtor reviews |
| `/transactions` | — (proof, not acquisition) | — |
| `/areas/[slug]` | `{market}` real estate · homes for sale in `{market}` | what's negotiable in `{market}` |

### Queries nothing currently targets

| Gap | Where it should live | Why it matters |
|---|---|---|
| "Fort Mill vs Indian Land" / "Fort Mill vs Charlotte" | New comparison page under `/carolinas-border` or `/areas` | **Longleaf owns this today.** Her 12 corridor closings are better evidence |
| "how much can you negotiate off a new build" | `/new-construction` FAQ + a post | Highest commercial intent she has |
| "do I need a realtor for new construction" | `/new-construction` answer block | Classic answer-engine question, directly her pillar |
| "what is due diligence in NC real estate" | `/buyers` FAQ + a post | NC-specific, high volume of confusion, already correctly explained in the blog post |
| "seller concessions" as a standalone concept | Case-study page | She has documented, permissioned figures |
| "realtor near me" / map-pack intent | **Google Business Profile, not a page** | No page fixes this |

---

## 3. Content clusters

Four clusters. Each has one pillar, supporting pages, and evidence.

### Cluster 1 — Negotiation (the brand cluster)
**Pillar:** `/negotiation`
**Supports:** the blog `negotiation` category · case-study pages · `/buyers` · `/sellers`
**Evidence:** three permissioned case studies; reviews that itemize outcomes
**Note:** this is the cluster no competitor can enter. Weight it accordingly.

### Cluster 2 — New construction
**Pillar:** `/new-construction`
**Supports:** builder-incentive FAQ · Case 3 study page · relevant area pages
**Evidence:** 17 closings, ten named builders, $50,000 / 3% documented

### Cluster 3 — Relocation & the border *(most contested)*
**Pillars:** `/relocation` + `/carolinas-border`
**Supports:** Fort Mill, Indian Land, Tega Cay, Lake Wylie, Rock Hill area pages · NC-vs-SC
comparison table · a Fort Mill vs Indian Land comparison page
**Evidence:** 18 relocations, 12 corridor closings, dual licensure, the Charleston years
**Note:** Longleaf, Finigan, Savvy, and Kendra Conyers all compete here. Win on evidence and
structured data, not volume.

### Cluster 4 — Local markets
**Hub:** `/areas`
**Supports:** `/areas/[slug]`, one per genuinely-known market
**Evidence:** the 44-row ledger by neighborhood; her own residence in Steele Creek
**Rule:** a market ships only when the `levers` field says something true and specific to it.

---

## 4. Internal-linking plan

**Current state:** footer links every published area and the pillars; the blog post links its
pillar; area pages link `/negotiation`. Functional but sparse — most linking is navigational
(footer/header) rather than contextual (in-body).

Contextual links carry far more weight, and are what tells a crawler which pages are the
cluster's centre.

### Rules to adopt

1. **Every page links up to its cluster pillar** in body copy, once, in a full sentence.
2. **Every pillar links down** to at least two supporting pages.
3. **Case studies link to the pillar they prove** and back — bidirectional and explicit.
4. **Area pages link to the pillar matching their dominant transaction type** — Fort Mill →
   `/carolinas-border`; a new-construction-heavy market → `/new-construction`.
5. **`/reviews` and `/transactions` link into the pillars**, not just to `/contact`. They are
   high-trust pages currently terminating in a CTA.
6. **Descriptive anchor text.** "What is negotiable besides price," never "click here" or a
   bare "learn more."
7. **A cap, deliberately:** no more than 3–4 contextual internal links per page. `BRAND-VOICE.md`
   is calm and direct; a page dense with links reads like SEO filler and undercuts the voice.

### Specific links to add now
| From | To | Anchor idea |
|---|---|---|
| `/buyers` | `/negotiation` | the full list of what is askable |
| `/buyers` | `/new-construction` | if the house has not been built yet |
| `/sellers` | `/home-value` | *(exists — keep)* |
| `/sellers` | `/transactions` | closings on the seller side |
| `/new-construction` | `/carolinas-border` | builders on the South Carolina side |
| `/relocation` | `/carolinas-border` | the state-line decision |
| `/relocation` | `/areas` | the markets she works |
| `/carolinas-border` | `/areas/fort-mill` | *(once published)* |
| `/reviews` | `/transactions` | the closings behind the reviews |
| `/transactions` | `/negotiation` | what was actually asked for |
| Each case study | its pillar + `/negotiation` | bidirectional |

---

## 5. Recommended new and expanded pages

Ordered by priority score (`AUDIT.md` §7). **Not all of these should be produced** — items
below the line in §6 are a backlog to draw from, not a commitment.

### 5.1 Expand: the seven service pages *(highest priority)*
- **Audience / intent:** as mapped in §2 — unchanged.
- **Work:** add an answer-first block under the `<h1>` (2–4 sentences fully answering the
  page's core question, mirroring the blog `answer` field); add 3–5 genuine FAQ entries with
  `FAQPage` markup; add `Service` schema to the four pillars; add geography to titles.
- **Evidence needed:** Jasmine's answers to the FAQs. These must be hers — the value is that
  they are answers a practitioner gives, not answers a writer researches.
- **Internal links:** per §4.
- **CTA:** unchanged (phone-first).
- **Priority: Very high.** Highest ratio of value to effort on the site.

### 5.2 New: Fort Mill area page
- **Audience:** buyers considering the SC side · relocating buyers
- **Intent:** local commercial
- **Theme:** Fort Mill SC real estate · living in Fort Mill · Fort Mill vs Charlotte
- **Questions:** How do SC property taxes actually work for an owner-occupier? What is being
  built and what resells? What is negotiable here that is not negotiable in Charlotte? What
  does the commute really cost?
- **Evidence:** 12 documented corridor closings; her SC licence; the four outstanding
  interview answers in `docs/FORT-MILL-INTERVIEW.md`
- **Format:** existing area template (already carries FAQ + breadcrumb)
- **CTA:** call · **Priority: Very high** — drafted, and directly contested by Longleaf

### 5.3 New: three transaction case-study pages
- **Audience:** evaluative, late-stage
- **Intent:** commercial investigation
- **Themes:** what a seller concession can cover · what a builder will actually give · what
  you can get when the price will not move
- **Evidence:** the three permissioned case studies; the 44-row ledger for context
- **Format:** short, plain, numbers unamplified. `RESULTS_DISCLAIMER` adjacent. **BIC review.**
- **Links:** to and from the pillar each proves · **Priority: High**
- **Caution:** `docs/CASE-STUDIES.md` forbids a fourth case study without fresh written client
  permission and BIC review. These three pages present the *existing* three at greater depth —
  they do not add a fourth.

### 5.4 New: Fort Mill vs Indian Land comparison
- **Intent:** informational → commercial · **Format:** comparison table + FAQ
- **Evidence:** closings in both; both are rostered markets
- **Priority: High** — but **only after both area pages exist**, or it cannibalizes them.

### 5.5 Expand: `/carolinas-border` comparison table
- NC vs SC on property tax treatment, contract mechanics (due-diligence period vs the three
  SC contingencies), closing process, vehicle registration.
- **Evidence:** already largely written in prose on the page and in the blog post.
- **Priority: High** — cheap, and comparison tables are disproportionately quoted.

### 5.6 New: two more area pages — Indian Land, Ballantyne
- Indian Land completes the border corridor; Ballantyne is a major NC market with ledger rows.
- **Priority: Medium-high**, gated on interview capacity.

### 5.7 Mark up: `/reviews`
- `Review` markup per individually attributed review. `AggregateRating` **separately**, and
  only with BIC sign-off (`AUDIT.md` §2.5).
- **Priority: High** for `Review`; **Hold** for `AggregateRating`.

---

## 6. Twelve-month editorial backlog

**This is a menu, not a plan.** At two posts a month, roughly 24 slots exist; there are more
items here than slots, deliberately, so selection is driven by what she actually has evidence
for. Anything without real evidence should be dropped rather than researched into existence.

Legend — **N** negotiation · **P** process *(the only two categories `lib/blog/types.ts` allows)*

| # | Working title | Cat | Audience | Intent | Evidence needed | Priority |
|---|---|---|---|---|---|---|
| 1 | *(published)* What can you negotiate besides price? | N | Buyers | Info | — | — |
| 2 | Do you need your own agent for new construction? | P | NC buyers | Info | Her builder experience | Very high |
| 3 | What is a due diligence fee in North Carolina? | P | NC buyers | Info | NC contract mechanics | Very high |
| 4 | What can a seller concession actually pay for? | N | Buyers | Info | Case 1 figures | Very high |
| 5 | Buying in NC vs SC: what actually changes | P | Border buyers | Info | Dual licensure | High |
| 6 | What builders will negotiate, and what they won't | N | NC buyers | Info | 17 closings | High |
| 7 | How to respond to an inspection report as a seller | N | Sellers | Info | Seller-side closings | High |
| 8 | What happens between offer and closing | P | First-time buyers | Info | Process knowledge | High |
| 9 | Why your Zestimate and your list price disagree | P | Sellers | Info | CMA practice | High |
| 10 | Buying a house from 2,000 miles away | P | Relocating | Info | 18 relocations | High |
| 11 | What a home warranty covers, and when to ask for one | N | Buyers | Info | Case 2 | Medium |
| 12 | Who pays what at a Carolina closing | P | Both | Info | Both states | Medium |
| 13 | What "as-is" actually means in a contract | P | Buyers | Info | Contract knowledge | Medium |
| 14 | The appraisal gap, and who absorbs it | N | Both | Info | Transaction experience | Medium |
| 15 | Questions to ask at a builder's sales office | N | NC buyers | Info | Builder experience | Medium |
| 16 | What a listing agent does that you never see | P | Sellers | Info | Seller practice | Medium |
| 17 | Timing: does the closing date matter to a seller? | N | Both | Info | Negotiation experience | Medium |
| 18 | Earnest money vs due diligence money | P | NC buyers | Info | NC mechanics | Medium |
| 19 | What survives an HOA review, and what doesn't | P | Both | Info | 4 yrs HOA president | Medium — distinctive |
| 20 | Reading a seller's disclosure | P | Buyers | Info | Practice | Medium |
| 21 | When walking away is the negotiation | N | Buyers | Info | Transaction experience | Medium |
| 22 | What an investor notices that a buyer doesn't | N | Buyers | Info | Investor background (§12: do not name the company) | Medium — distinctive |
| 23 | Upgrades: what to buy from the builder, what not to | N | NC buyers | Info | Builder experience | Low-medium |
| 24 | What changes when you're selling and buying at once | P | Both | Info | Ledger: repeat clients | Low-medium |

### Explicitly excluded
- **Market updates, stat roundups, "state of the market."** Ruled out by `CONTENT-PLAN.md`;
  `lib/blog/validate.ts` fails the build on them.
- **Neighborhood posts.** They belong in `lib/areas/data.ts`.
- **Anything requiring an undocumented number.** `TODO(verify)` and stop.
- **Holiday/seasonal filler, "top 10 reasons to love Charlotte."** Belongs on a competitor's site.

---

## 7. Repurposing what already exists

Material already collected that could become search content with no new research:

| Existing asset | Becomes | Effort | Note |
|---|---|---|---|
| 44-row transaction ledger | 3 case-study pages; evidence throughout | Medium | BIC review for figures |
| 54 structured reviews | `Review` markup; pull-quotes on matching pillar pages | Low | `ReviewTransaction` already supports matching a review to a page's argument |
| The bio video (`EpLuc5n6hHs`) | Already on `/about` + `/contact` with `VideoObject` | Done | Model for future videos |
| `docs/FORT-MILL-INTERVIEW.md` | The Fort Mill page | Low | Needs four answers |
| `lib/intake/guide.ts` (the 19 levers) | Blog posts 4, 6, 11, 14, 17 — one lever each | Low | Guide already structured |
| Her Instagram captions | Voice reference only — **never copy** | — | `lib/site.ts` explains why |
| Steele Creek interview | Published | Done | Model for the interview process |
| HOA presidency (4 yrs, 105 units) | Post 19 | Low | Genuinely distinctive, no competitor has it |
| Ten years teaching special education | Already on `/about` | Done | Origin of the whole USP |

**The pattern worth noticing:** almost every high-priority content item on this list is a
*publication* problem, not a *creation* problem. That is the argument for Option B.
