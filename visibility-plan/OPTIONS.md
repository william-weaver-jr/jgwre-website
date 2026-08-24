# Options — Three Investment Levels

Each option is cumulative: B includes A, C includes B. Effort is stated in **working
sessions** (a focused half-day) rather than calendar time, and split between engineering and
Jasmine's own time, because her time is the real constraint — most of what makes this site
distinctive can only come from her.

"Time to signal" means the point at which measurement starts telling you something, not the
point of peak return.

---

## Option A — Essential foundation

**The premise:** you cannot improve what you cannot see, and the site currently has an
unresolved identity problem and a live duplicate.

### What it includes

| # | Work | Effort |
|---|---|---|
| A1 | Google Search Console + Bing Webmaster Tools verification, sitemap submission | 0.5 eng |
| A2 | Resolve the Placester site — confirm contract, then redirect or take down | 0.5 eng + business |
| A3 | `Person` schema on the home page; extend `sameAs`; resolve the LinkedIn name variant | 0.5 eng |
| A4 | Geography into title tags on the seven service pages | 0.5 eng + 0.5 Jasmine (review) |
| A5 | Connect Follow Up Boss; add a server-confirmed lead success event | 1 eng |
| A6 | Configure GA4 key events for `call_click` and lead success | 0.5 eng |
| A7 | Google Business Profile audit — exists / verified / categorized / linked | 0.5 Jasmine |
| A8 | Verify what a guide requester actually receives; fix if broken | 0.5 eng |
| A9 | Run Lighthouse against production; record a baseline | 0.5 eng |

**Total: ~4.5 engineering sessions, ~1.5 of Jasmine's.**

### Expected benefits
- The site becomes measurable. Every later decision improves.
- Brand-name searches stop being split between two properties.
- Leads reach the CRM and become attributable.
- Entity disambiguation begins — the slowest-moving signal, so starting it early matters.

### Limitations
- **This produces very little new traffic on its own.** It removes obstacles; it does not
  create demand. Treat A as a prerequisite, not a growth programme.
- GBP work may reveal a much larger job (unverified or duplicate listings).

### Dependencies
Placester account access · Vercel env access for the FUB key · GA4 admin · Google account for GBP.

### Time to useful signal
**2–4 weeks** for indexing and lead measurement. Entity signals take **3–6 months**.

---

## Option B — Focused growth ✅ **RECOMMENDED**

**The premise:** the site's scarcest resource is not pages — it is *published evidence*. A
great deal of original, documented, permissioned material is already sitting in the repository
unpublished. Publish that before commissioning anything new.

### What it includes — everything in A, plus:

| # | Work | Effort |
|---|---|---|
| B1 | Extend `FAQPage` + `BreadcrumbList` to the seven service pages, using the existing tested helpers | 2 eng + 1.5 Jasmine (the answers must be hers) |
| B2 | Add an answer-first block to each service page, mirroring the blog `answer` field | 1.5 eng + 1.5 Jasmine |
| B3 | `Service` schema on the four pillar pages | 0.5 eng |
| B4 | `Review` structured data on `/reviews` — **BIC review first**; `AggregateRating` decided separately | 1 eng + BIC |
| B5 | Publish **Fort Mill** — the draft exists, blocked on four interview answers | 0.5 eng + 1 Jasmine (interview) |
| B6 | Publish **two more markets** — recommend Indian Land and Ballantyne | 1 eng + 2 Jasmine |
| B7 | Three transaction case-study pages, drawn from the 44-row ledger | 2 eng + 1.5 Jasmine + BIC |
| B8 | Comparison table on `/carolinas-border` (NC vs SC) | 0.5 eng + 0.5 Jasmine |
| B9 | GBP optimization + a review-generation routine that sends clients to *her* profile | 0.5 eng + ongoing Jasmine |
| B10 | Get the brokerage bio to link to jasminegarcia.com | 0.25 business |
| B11 | Resolve `SEARCH_HOMES_URL` to an agent-attributed IDX subdomain | 0.25 business |
| B12 | Blog cadence at **two posts per month**, from her real transactions | ongoing: 1 eng + 1 Jasmine per post |

**Total beyond A: ~11 engineering sessions, ~9 of Jasmine's, plus an ongoing cadence.**

### Expected benefits
- The seven pages that already target high-intent queries become machine-readable and
  quotable — the largest single uplift available from work already done.
- Fort Mill directly contests the query The Longleaf Group currently owns, with evidence they
  do not have (12 documented closings) and structured data they do not emit.
- Case-study pages create the one content type no competitor can replicate.
- Review markup and GBP work address local search where it actually resolves.
- A sustainable cadence that does not outrun her review capacity or the compliance system.

### Limitations
- **Gated on Jasmine's availability.** ~9 sessions of her time over roughly three months. If
  that is not realistic, B7 (case studies) and B12 (cadence) are the items to cut — B1–B6
  deliver most of the value.
- Review and case-study work needs BIC sign-off; build the wait into the schedule.
- Two posts a month will not out-publish a team-scale competitor, and is not trying to.

### Dependencies
All of A · Jasmine's interview time · BIC availability · Stone Realty Group for B10/B11.

### Time to useful signal
**6–10 weeks** for structured-data and title effects. **3–5 months** for area and case-study
pages to mature. GBP and review work can move faster — weeks, not months.

---

## Option C — Authority expansion

**The premise:** once the foundation is measurable and the evidence is published, the
remaining lever is off-site authority and formats the competitive set is not using.

### What it includes — everything in B, plus:

| # | Work | Effort |
|---|---|---|
| C1 | All 15 markets published as genuine pages, interview-driven | 5 eng + 10 Jasmine |
| C2 | Video programme — the YouTube pipeline exists and takes one registry entry per video | 2 eng + ongoing Jasmine |
| C3 | Digital PR: local press, podcasts, Charlotte Observer follow-through on the 2026 nomination | ongoing |
| C4 | Partnership content — lenders, inspectors, relocation and builder contacts | 3 eng + ongoing |
| C5 | An email nurture sequence off the negotiation guide | 2 eng + 2 Jasmine |
| C6 | A genuine original dataset — e.g. an annual, methodologically-stated "what was actually negotiable" report from her own closings | 3 eng + 3 Jasmine + BIC |
| C7 | Playwright end-to-end suite (`CLAUDE.md` §4 flags this as the deliberate testing gap) | 2 eng |
| C8 | CMS migration (Sanity vs Payload, §12) so Jasmine publishes without a developer | 5 eng |

**Total beyond B: ~22 engineering sessions, ~15 of Jasmine's, plus sustained outreach.**

### Expected benefits
- C6 is the strongest AI-visibility asset available to her: an original, citable, annually
  refreshed statistic nobody else can produce. It is also the most defensible link magnet.
- Full area coverage makes her the obvious answer for the border corridor.
- The CMS removes the developer bottleneck permanently.

### Limitations
- **Materially outruns current capacity**, and the ROI on several items is genuinely uncertain
  before B's measurement lands.
- C6 needs careful compliance work — a dataset from her own closings is an advertising claim
  and touches the price-band question §12 already parked.
- C1 risks reintroducing exactly the thin-page failure the codebase is built to prevent, if
  interview capacity does not keep pace.
- C8 must preserve `lib/blog/validate.ts` and the area validators, or the §6 discipline is lost.

### Dependencies
All of B, **plus demonstrated results from B**. Do not start C on faith.

### Time to useful signal
**6–12 months.** C3 and C6 are quarters-long investments.

---

## Recommendation

**Option B — Focused growth.**

Three reasons, in order of weight:

**1. The evidence is already collected and unpublished.** Fort Mill is drafted. Forty-four
transactions are in a typed, validated ledger. Fifty-four reviews are structured and
permissioned. Three case studies have client permission. Seven substantial service pages are
live with no structured data. The cheapest available uplift is to publish and mark up what
already exists — not to commission new material.

**2. The constraint is Jasmine's time, and B respects it.** Every genuinely distinctive page
on this site requires her actual knowledge. B asks for roughly nine sessions over three months
with a clear stopping rule. C asks for fifteen more on top, with weaker evidence that they pay
back.

**3. A high-volume blog is the wrong instrument for this specific problem.** The site's
problems are entity ambiguity, a live duplicate, an unconnected CRM, and unmarked-up pages.
None of those is solved by publishing more posts. Two posts a month keeps the pipeline warm
and the domain fresh without outrunning the compliance review that makes this site safer than
its competitors.

### What to defer, and revisit when
| Deferred | Revisit when |
|---|---|
| C1 (all 15 markets) | Fort Mill and two others show measurable search traction |
| C6 (original dataset) | The ledger is refreshed and the BIC has ruled on price bands |
| C8 (CMS) | Publishing volume actually makes the developer a bottleneck — it is not yet |
| IDX / MLS (Locked Decision #1) | Organic traffic justifies the compliance cost. Not close. |
| `AggregateRating` | BIC signs off separately from `Review` markup |

### The honest downside of choosing B
If The Longleaf Group and similar team-scale operations keep publishing at their current pace,
two posts a month will not close the coverage gap on relocation and border queries. B accepts
that trade deliberately: it competes on evidence and machine-readability rather than volume,
because volume is the one axis where a single agent cannot beat a team.

If after ~4 months the measurement in `MEASUREMENT.md` shows the evidence-led pages gaining
impressions while coverage remains the binding constraint, **that** is the trigger to escalate
to C1 — not a decision to make now.
