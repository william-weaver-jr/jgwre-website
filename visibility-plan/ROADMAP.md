# Roadmap

Four phases. Every action carries an owner, effort, dependency, impact, and a success metric.

**Owners:** `ENG` engineering · `JG` Jasmine · `BIC` Broker-in-Charge · `BIZ` business/admin (Bill)
**Effort:** S ≤ 2h · M ≤ half day · L ≤ 2 days · XL multi-day
**Impact:** effect on qualified leads and discoverability, 1–5.

Success metrics are deliberately concrete. Several are **binary** (done / not done) rather
than numeric — for a domain with no measured baseline, a target number would be invented, and
`CLAUDE.md` §6 discipline applies to this plan too.

---

## NOW — first 14 days
*Goal: make the site measurable, resolve the duplicate, close the lead loop.*

| # | Action | Owner | Effort | Depends on | Impact | Success metric |
|---|---|---|---|---|---|---|
| N1 | Verify Google Search Console; submit sitemap | ENG | S | Google account | 5 | GSC verified; sitemap "Success"; index-coverage baseline captured |
| N2 | Verify Bing Webmaster Tools; submit sitemap | ENG | S | — | 3 | Verified. Also feeds ChatGPT search |
| N3 | **Confirm Placester contract** — term, auto-renewal, 301 support, content ownership | BIZ | M | Placester login | 5 | Written answer to all four |
| N4 | **Decide and execute** on the old site: redirect to jasminegarcia.com, or take down | BIZ + ENG | M | N3 | 5 | Old URLs 301 or 410. No 200s |
| N5 | Connect Follow Up Boss (API key → Vercel env) | ENG | M | FUB API key | 5 | A live test submission appears in FUB |
| N6 | Add a server-confirmed lead-success event distinct from submit-attempt | ENG | M | N5 | 4 | `generate_lead` fires only on a persisted lead |
| N7 | Configure GA4 key events: `call_click`, lead success | ENG | S | N6, GA4 admin | 4 | Both marked as key events; data flowing |
| N8 | **Audit Google Business Profile** — exists / verified / category / phone / website link | JG | M | Google account | 5 | Written status for each. If none exists, N8b |
| N8b | Create + verify a GBP if absent | JG | L | N8 | 5 | Verification postcard/call completed |
| N9 | Add `Person` schema to the home page | ENG | S | — | 4 | Validates in Rich Results Test |
| N10 | Geography into the seven service-page titles | ENG + JG | M | JG review | 4 | All 7 titles contain a real place name and read naturally |
| N11 | Test the negotiation guide end-to-end; confirm what a requester receives | ENG | S | — | 4 | Documented. Broken → fix logged |
| N12 | Run Lighthouse against production; record baseline | ENG | S | — | 2 | Scores recorded in `MEASUREMENT.md` |
| N13 | Resolve `AGENT.email` `TODO(verify)` | BIZ | S | — | 1 | Decision recorded either way |
| N14 | Ask Stone Realty Group to link her bio → jasminegarcia.com | BIZ | S | — | 4 | Link live on `mattstoneteam.com/jasmine-garcia/` |
| N15 | Ask SRG whether `jasmine.mattstoneteam.com` exists | BIZ | S | — | 3 | Answer received; `SEARCH_HOMES_URL` resolved or confirmed blocked |

**Exit criteria:** GSC reporting · leads reaching FUB · the Placester question answered and
acted on · GBP status known.

**Note:** N3/N4 is the one item with a genuine external dependency and no workaround. Start it
day one — contract terms often carry notice periods measured in months.

---

## NEXT — days 15–45
*Goal: make the pages that already convert machine-readable and quotable.*

| # | Action | Owner | Effort | Depends on | Impact | Success metric |
|---|---|---|---|---|---|---|
| X1 | Interview JG for service-page FAQs (all 7 in 1–2 sittings) | JG + ENG | L | — | 5 | 25–35 genuine Q&As captured |
| X2 | Add answer-first blocks to the 7 service pages | ENG | L | X1 | 5 | Each page answers its core question above the fold |
| X3 | Add `FAQPage` markup to the 7 service pages | ENG | M | X1 | 4 | Validates; compliance suite green |
| X4 | Add `BreadcrumbList` site-wide | ENG | M | — | 3 | Present on all non-home pages |
| X5 | Add `Service` schema to the 4 pillars | ENG | M | — | 3 | Validates |
| X6 | **Fort Mill interview** — the four outstanding answers | JG | M | `docs/FORT-MILL-INTERVIEW.md` | 5 | All four answered |
| X7 | Publish `/areas/fort-mill` | ENG | M | X6 | 5 | Live, in sitemap, tests green |
| X8 | NC vs SC comparison table on `/carolinas-border` | ENG + JG | M | — | 4 | Table live, facts verified |
| X9 | `Review` markup on `/reviews` — **BIC review first** | ENG + BIC | M | BIC | 4 | Approved in writing, then live |
| X10 | GBP optimization: category, service areas, description, photos, posts | JG | M | N8 | 5 | Profile complete |
| X11 | Review-generation routine directed at **her** profile, not the brokerage's | JG | M | N8 | 5 | Written process; first requests sent |
| X12 | Manual citation audit — Realtor.com, Homes.com, Canopy, Bing Places, Apple Maps | BIZ | L | — | 3 | Spreadsheet of profiles + NAP accuracy |
| X13 | Resolve the "Jasmine Garcia Weaver" LinkedIn name variant | JG | S | — | 3 | Consistent across profiles |
| X14 | Add contextual internal links per `CONTENT-MAP.md` §4 | ENG | M | X2 | 3 | Each pillar links ≥2 supports |
| X15 | Blog posts 2 and 3 (new construction agent; NC due diligence) | JG + ENG | L | — | 4 | Published, tests green |

**Exit criteria:** all 7 service pages carry an answer block + FAQ schema · Fort Mill live ·
GBP optimized · review routine running.

---

## BUILD — days 46–90
*Goal: publish the evidence already collected.*

| # | Action | Owner | Effort | Depends on | Impact | Success metric |
|---|---|---|---|---|---|---|
| B1 | Three transaction case-study pages | ENG + JG + BIC | XL | BIC | 5 | Live with disclaimer; compliance green |
| B2 | Interview + publish Indian Land | JG + ENG | L | — | 4 | Live |
| B3 | Interview + publish Ballantyne | JG + ENG | L | — | 4 | Live |
| B4 | Fort Mill vs Indian Land comparison page | ENG + JG | L | X7, B2 | 4 | Live. **Not before both area pages** |
| B5 | `ItemList` on `/areas`; `ContactPoint` on `/contact` | ENG | S | — | 2 | Validates |
| B6 | Expand `/negotiation` — shortest page, highest stated value | ENG + JG | L | — | 4 | Guide flow + FAQ + proof |
| B7 | Blog posts 4–7, two per month | JG + ENG | L | — | 3 | Published on cadence |
| B8 | Refresh the §5 statistics from FUB/MLS (standing §12 item) | JG + BIZ | M | N5 | 3 | §5 updated with verified figures |
| B9 | **First measurement review** against `MEASUREMENT.md` | ENG + BIZ | M | N1, N7 | 5 | Scorecard completed; Option C decision made |
| B10 | Fix sitemap `lastmod` to use real content dates | ENG | S | — | 1 | No build-time dates on static routes |

**Exit criteria:** 4 area pages live · 3 case studies live · ~6 posts · first real measurement.

**Decision gate at B9.** Do not begin Expand until this review runs. If evidence-led pages are
gaining impressions but coverage is the binding constraint → escalate area pages. If the site
still is not indexing → stop content work and fix indexing.

---

## EXPAND — months 4–12
*Goal: authority. Only after B9 says the foundation works.*

| # | Action | Owner | Effort | Depends on | Impact | Success metric |
|---|---|---|---|---|---|---|
| E1 | Remaining area pages, interview-driven, ~1/month | JG + ENG | XL | B9 | 4 | Each passes the levers test |
| E2 | Video programme — registry already supports it | JG + ENG | XL | — | 3 | ≥1 video/quarter with `VideoObject` |
| E3 | Email nurture off the negotiation guide | ENG + JG | L | N5 | 4 | Sequence live; open/reply tracked |
| E4 | Digital PR — local press, podcasts, Observer nomination follow-through | BIZ + JG | XL | — | 4 | ≥3 earned mentions |
| E5 | Partnership content — lenders, inspectors, relocation, builders | JG + BIZ | XL | — | 3 | ≥2 partnerships producing content |
| E6 | **Original annual dataset** — "what was actually negotiable," from her own closings | ENG + JG + BIC | XL | B8, BIC, §12 price-band ruling | 5 | Published with stated methodology |
| E7 | Playwright end-to-end suite | ENG | L | — | 2 | Lead path covered in CI |
| E8 | CMS migration (Sanity vs Payload) | ENG | XL | Publishing volume justifying it | 3 | JG publishes without a developer; validators preserved |
| E9 | Quarterly content audit — prune, consolidate, refresh | ENG + JG | M | — | 3 | Every page reviewed |

**E6 is the highest-ceiling item in this plan.** An original, methodologically-stated,
annually-refreshed statistic from her own transactions is the one asset that earns citations
from AI answers and links from other sites simultaneously. It is also the most compliance-heavy,
which is why it sits last and behind a BIC ruling.

---

## Quick wins vs long-term investments

**Quick wins** — days to weeks, high confidence:
N1, N2, N9, N10, N14 · X3, X4, X5, X8 · B5

Every one is a metadata, schema, or outreach change. None requires new copy from Jasmine, and
several take under two hours.

**Long-term authority** — quarters, lower confidence, higher ceiling:
B1 (case studies) · E1 (area coverage) · E4 (digital PR) · E6 (original dataset)

**Do not judge these by the priority score.** The model in `AUDIT.md` §7 divides by time-to-signal,
which systematically under-rates exactly this category. They are the difference between a site
that ranks and a site that gets cited.

---

## Critical path

```
N3 (contract) ─→ N4 (retire old site) ────────────────┐
                                                       ├─→ brand queries resolve to one site
N1 (GSC) ─────────────────────────────────────────────┘

N5 (FUB) ─→ N6 (success event) ─→ N7 (key events) ─→ B9 (measurement) ─→ Expand decision

X1 (interview) ─→ X2/X3 (answer blocks + FAQ) ─→ organic uplift on existing pages

X6 (Fort Mill answers) ─→ X7 (publish) ─→ B4 (comparison page)

N8 (GBP) ─→ X10 (optimize) ─→ X11 (reviews) ─→ map-pack visibility
```

**Three things gate everything downstream and should start immediately:**
**N3** (contract terms may carry a notice period), **N1** (nothing is measurable without it),
and **X1** (Jasmine's interview time is the scarcest input in the whole plan).
