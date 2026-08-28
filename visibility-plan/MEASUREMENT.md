# Measurement

What to measure, how to define it, and how to report it. **No baseline exists yet** — every
target below is expressed as a direction or a binary, not as a number, because inventing a
number would be the same failure `CLAUDE.md` §6 exists to prevent.

---

## 1. Baseline data needed

Nothing here can be answered from the repository. All of it should be captured in the first
14 days so that later work is measured against a real starting point.

| # | Data | Source | Why it matters | Status |
|---|---|---|---|---|
| 1.1 | Index coverage — pages submitted vs indexed | Google Search Console | Whether the site exists to Google at all | **GSC live 2026-08-27; data processing** |
| 1.2 | Impressions, clicks, average position by query and page | GSC | The only reliable ranking data | **Missing** |
| 1.3 | Core Web Vitals field data | GSC / Vercel Speed Insights | Already collecting in Vercel; unread | **Unread** |
| 1.4 | Lighthouse scores against production | PageSpeed Insights | `CLAUDE.md` §10 bar: a11y ≥95, perf ≥90 | **Not run** |
| 1.5 | Sessions, source/medium, landing pages | GA4 (`G-DHYEFNYELD`) | Live and collecting | **Live, unreviewed** |
| 1.6 | Key events configured | GA4 admin | Without these GA4 shows activity, not outcomes | **Missing** |
| 1.7 | GBP: exists? verified? views, searches, calls, direction requests | Google Business Profile | Largest local-search factor for an agent | **Unknown** |
| 1.8 | Review counts and locations — her profile vs the brokerage listing | GBP + Zillow | §12 records reviews landing on the brokerage listing | **Partially known** |
| 1.9 | Current backlinks and referring domains | Any backlink tool, or GSC Links | Authority baseline | **Missing** |
| 1.10 | Old-site index footprint | GSC (if accessible) or `site:` check | Sizes the duplicate problem | **Missing** |
| 1.11 | Lead volume and source, last 90 days | Follow Up Boss | Not connected — no history exists | **Blocked on N5** |
| 1.12 | Call volume by source | FUB call tracking on (704) 200-9360 | Phone is the primary CTA | **Unknown** |

**Capture 1.1–1.10 before any content work ships**, so the effect of that work is separable
from the effect of simply becoming indexed.

### 1.6b The first Search Console reading — what to record, and how to read it

GSC went live 2026-08-27 and `Indexing → Pages` showed "Processing data, please check again in
a day or so". Come back after ~48 hours and record four numbers:

| Record | Where |
|---|---|
| Pages **indexed** vs **not indexed** | Indexing → Pages |
| The top reasons under "not indexed" | Indexing → Pages, the table below the chart |
| Impressions and clicks | Performance, last 28 days |
| Any query at all with an impression | Performance → Queries |

**Read it against a six-month-old domain, not against a mature site.** All four numbers being
near zero on the first reading is the expected result and is the baseline, not a problem.

Two rows in "not indexed" are normal and are **not** defects here:

- **"Discovered – currently not indexed"** — Google knows the URL and has not got to it. On a
  new low-authority domain this is ordinary and resolves on its own. It is only worth acting on
  if it persists across months on pages that matter.
- **"Crawled – currently not indexed"** — Google fetched it and declined to index it. Worth
  watching, because sustained on a substantial page it is a quality signal rather than a queue.

Rows that **would** be defects, and are worth raising immediately: anything mentioning
`noindex`, a redirect, a canonical pointing somewhere unexpected, or a 4xx/5xx. Pre-flight on
2026-08-27 found none of these — all sampled pages returned `index, follow` with
self-referencing canonicals — so their appearance later means something changed.

---

## 2. Metrics

### 2.1 Search visibility
| Metric | Source | Cadence | Direction |
|---|---|---|---|
| Pages indexed / pages submitted | GSC | Monthly | → 100% of the 17 |
| Total impressions | GSC | Monthly | Up |
| Clicks | GSC | Monthly | Up |
| Queries with ≥1 impression | GSC | Monthly | Up — breadth matters more than position early |
| Average position, non-brand | GSC | Monthly | Up over quarters |
| Brand-query position ("Jasmine Garcia Realtor Charlotte") | GSC | Monthly | → position 1 |
| Pages with ≥1 impression | GSC | Monthly | Up |

**Watch breadth before rank.** For a new domain, a rise in the number of distinct queries
earning impressions is the earliest real signal that content is being understood — it moves
before position does.

### 2.2 Local
| Metric | Source | Cadence | Direction |
|---|---|---|---|
| GBP profile views | GBP | Monthly | Up |
| GBP searches: discovery vs direct | GBP | Monthly | Discovery share up |
| Calls from GBP | GBP | Monthly | Up |
| Website clicks from GBP | GBP | Monthly | Up |
| Reviews on **her** profile | GBP | Monthly | Up — the point of X11 |
| NAP-accurate citations | Manual audit | Quarterly | Up |

### 2.3 Engagement
| Metric | Source | Cadence | Note |
|---|---|---|---|
| Sessions by landing page | GA4 | Monthly | Which pages actually pull |
| Engagement rate by page | GA4 | Monthly | Low rate on a long page = wrong intent match |
| Scroll depth on service pages | GA4 | Monthly | Whether the answer block changes behaviour |
| `intake_start` → `intake_submit` rate | GA4 | Monthly | Form friction |
| Guide requests | GA4 + FUB | Monthly | Lead-magnet health |

### 2.4 Leads
| Metric | Source | Cadence | Note |
|---|---|---|---|
| Total leads | FUB | Weekly | — |
| Leads by source page | FUB (`source`) | Monthly | §9 already sends the page slug |
| Leads by type (buyer/seller/valuation/guide) | FUB | Monthly | — |
| Calls by placement | GA4 `call_click` | Monthly | Which CTA position works |
| Qualified leads (§4.1) | FUB + JG | Monthly | The metric that actually matters |
| Organic → qualified rate | GA4 + FUB | Quarterly | Needs volume before it means anything |

---

## 3. Conversion-event specification

### 3.1 Already implemented — verified in the repository

| Event | Fires | Parameters | File |
|---|---|---|---|
| `call_click` | Any `tel:` click | `placement`, `page` | [components/tel-tracking.tsx](../components/tel-tracking.tsx) |
| `intake_start` | Sticky-bar CTA | `placement` | [components/sticky-contact-bar.tsx](../components/sticky-contact-bar.tsx) |
| `intake_step` | Qualifying step advance | `step`, `side`, `page` | [components/contact-intake.tsx](../components/contact-intake.tsx) |
| `intake_submit` | Submission **attempt** | `side`, `lead_type`, `page` | contact-intake.tsx:153 |

Constraint, already enforced by `lib/analytics.test.ts`: **no personal data may ever become a
GA4 parameter.** Any new event must respect this. Do not add name, email, phone, or address.

### 3.2 To add

| Event | Fires when | Parameters | Why |
|---|---|---|---|
| `generate_lead` | Lead **persisted** (FUB accepted, or Resend confirmed) | `lead_type`, `page`, `delivery` | The current `intake_submit` counts attempts, including failures. This is the true conversion |
| `lead_failed` | Both delivery paths fail | `page`, `reason` | §9 says never silently drop a lead. Today a total failure is invisible in analytics |
| `guide_request` | Negotiation guide requested | `page` | Lead magnet has its own funnel |
| `video_play` | Facade clicked | `video_slug`, `page` | Video is a real engagement signal and the facade already gates the click |

**Mark as GA4 key events:** `generate_lead` and `call_click`. Those two are the business.

### 3.3 GA4 admin configuration

Code sends the events; the property has to be told what they mean. Neither of the
following is a code change, and until both are done GA4 collects the data without being
able to report on it.

**Key events — DONE 2026-08-27.** Property `551224515` (JGWRE Website), under the
`admin@jasminegarcia.com` Google account.

| Event | Counting method | Why |
|---|---|---|
| `generate_lead` | Once per event | Each submission is a distinct lead record. |
| `call_click` | **Once per session** | A `tel:` tap opens a confirm dialog, so cancel-and-retry is two events and one intent. Counting each tap would inflate the number. GA4 nudges toward "Once per event" here; the nudge is declined deliberately. |

> **The path is not what Google's own documentation says.** Their help pages describe
> `Admin → Data display → Key events → New key event`. **That screen no longer exists.** In the
> current UI, `Key events` is a *tab listing* on the Events page, and creation happens at:
>
> `Admin → Data display → Events → Create event`
>
> Two traps in that dialog, both of which bite by default:
>
> 1. **"Create without code" is pre-selected and demands a URL.** That is the tell that it is
>    the wrong choice — it derives a *new* event from existing traffic, and pointed at
>    `generate_lead` it would manufacture a second event of the same name and double-count
>    every lead. Choose **"Create with code"**: the name is all it needs, because the site
>    already sends the event.
> 2. **"Set a default key event value — US Dollar, 1" is pre-selected.** That stamps $1 of
>    fabricated revenue onto every lead and populates GA4's revenue reports with a number
>    nobody chose. Select **"Don't set a default key event value"**. §6 governs structured
>    data and analytics configuration the same way it governs copy: a figure nobody can
>    document does not ship.
>
> Then toggle **Mark as key event** on.

Requires **Marketer or above** at the property level.

**Also present, and not ours:** `close_convert_lead`, `qualify_lead`, and `purchase` were
pre-created by Google's Lead Gen industry template. This site sends none of them and they will
read zero forever. Harmless, but they clutter the key-events list — worth deleting once
somebody is certain nothing else depends on them.

**Custom dimensions — DONE 2026-08-27.** All six below are registered, Event-scoped.

`Admin → Custom definitions → Create custom dimension`, scope **Event**, parameter name in
*Event parameter* — which accepts free text, so a parameter that has never been received can
still be registered. Standard properties allow 50, so scarcity is not a reason to leave any out.

| Parameter | Sent on | Answers |
|---|---|---|
| `delivery` | `generate_lead` | Did the lead reach the CRM or only the inbox? **Register this one first** — a run of `email` means the Follow Up Boss integration has stopped working. |
| `lead_type` | `intake_submit`, `generate_lead` | buyer / seller / valuation / guide / relocation |
| `page` | every event | Which page produced it. The page-to-lead map. |
| `side` | intake events | buying / selling |
| `placement` | `call_click`, `intake_start` | Which CTA position works. |
| `reason` | `lead_failed` | rate_limited / invalid / delivery / network |

`step` (on `intake_step`) is the seventh parameter the code sends and is deliberately left
unregistered: the intake is three steps, so the drop-off is already legible from the raw event
counts and a dimension would add a report nobody reads.

**Not retroactive.** A dimension reports only on data collected after it is registered, and
takes 24–48 hours to appear. The parameters are collected either way, so registering late
loses reporting rather than data — but it loses it permanently for the gap.

### 3.4 Testing the events, and the one thing that will look like a bug

> **✅ Pipeline verified end to end 2026-08-27.** `call_click` was fired from the live site and
> appeared in Realtime. That single observation clears the whole chain: the delegated listener,
> `track()`, the gtag dialect fixed in `5d3fa35`, the measurement ID, and the property binding.
>
> It also produced the lesson below the hard way. The event fired correctly for some time while
> appearing nowhere, because `Admin → Data display → Events` is a **24-hour aggregate** and was
> being refreshed in the expectation of a live feed. **`Reports → Realtime` is the only
> immediate view, and it holds just 30 minutes** — fire the event with the report already open.

Events fire **only when `NODE_ENV === "production"`** (`components/google-analytics.tsx`), so
nothing is sent from `npm run dev`. Test against the deployed site.

**The trap:** `/privacy-policy` carries a working analytics opt-out that writes
`jg-analytics-opt-out = "1"` to `localStorage` (`lib/analytics-consent.ts`). Anyone who has
tried that control — likely whoever tested the privacy page — has a browser that sends
**nothing**, silently and by design. A test lead from that browser produces no events at all
and looks exactly like a broken install.

Check before concluding anything is wrong, in the browser console on jasminegarcia.com:

```js
localStorage.getItem("jg-analytics-opt-out")
```

`null` is fine. `"1"` means opted out — clear it with `localStorage.removeItem("jg-analytics-opt-out")` and reload.

Then watch `Reports → Realtime → Event count by Event name` while submitting.

### 3.5 Attribution note
UTM capture already exists (`readUtm()` in [lib/analytics.ts](../lib/analytics.ts)) and §9
specifies UTMs in the FUB payload. Once FUB is connected, source attribution works end to end.
Until then, no lead is attributable — which is the strongest practical argument for N5 first.

---

## 4. Definitions

Agreeing these now prevents arguing about them later.

### 4.1 Qualified lead
A contact who meets **all four**:
1. Real contact details (name + at least one of email/phone that connects),
2. A real property intent — buying, selling, or valuing, not a vendor pitch or a job enquiry,
3. Within her service area or relocating into it,
4. A timeframe she can work with, or none stated (an undated buyer is still qualified).

**Not qualified:** spam, recruiters, vendors, other agents, out-of-area with no relocation
intent, and anyone who cannot be reached after a reasonable follow-up sequence.

Judged by Jasmine in FUB, not inferred by analytics. Tag it in FUB so it becomes reportable.

### 4.2 Organic conversion
A qualified lead whose **first recorded session** came from organic search, per GA4's
default attribution model.

Stated plainly: this systematically **under-counts phone calls**, because someone who finds
her organically, reads two pages, and calls the tracking number produces a `call_click` but
not a form record. Cross-reference FUB call records against GA4 `call_click` volume monthly
rather than trusting either alone.

### 4.3 Assisted conversion
A qualified lead whose journey **touched** organic search at any point without organic being
the last click — for example: found on Google, left, returned via Instagram, then called.

Real and worth counting. Requires GA4 attribution reporting and a minimum of volume before it
is anything but noise. **Do not report this before ~30 leads exist**; below that it is
storytelling.

### 4.4 Content success
A page is succeeding if it meets **two of three** at 90 days post-publication:
1. Earns impressions for queries beyond its exact title,
2. Engagement rate at or above the site median for its page type,
3. Has produced at least one lead or call, directly or as an assist.

A page failing all three at 180 days is a candidate for consolidation or rewrite — **not
automatic deletion.** Some pages exist to be evidence for a human who is already convinced
(`/transactions`, `/reviews`) and should never be judged on search performance at all.

---

## 5. Reporting cadence

| Cadence | Who | Contents | Time |
|---|---|---|---|
| **Weekly** | BIZ | Lead count and source. Nothing else | 5 min |
| **Monthly** | ENG + BIZ | Full scorecard §6. Index coverage, impressions, GBP, leads, content published | 45 min |
| **Quarterly** | ENG + BIZ + JG | Content audit, competitive re-check, option re-evaluation, §5 stat refresh | 2 h |
| **Annually** | All + BIC | Compliance re-review of every claim, disclaimer, and testimonial on the site | Half day |

**Do not report search metrics weekly.** The variance is meaningless at this volume and it
drives reactive decisions. Leads weekly, search monthly.

---

## 6. Scorecard template

```
JASMINE GARCIA — VISIBILITY SCORECARD
Month: ____________            Prepared: ____________

SEARCH                          This month   Last month   Δ
  Pages indexed / submitted        __ / 17      __ / 17    __
  Impressions                      _______      _______    __
  Clicks                           _______      _______    __
  Distinct queries w/ impressions  _______      _______    __
  Brand query avg position         _______      _______    __
  Non-brand avg position           _______      _______    __

LOCAL
  GBP views                        _______      _______    __
  GBP calls                        _______      _______    __
  GBP website clicks               _______      _______    __
  Reviews on HER profile           _______      _______    __

ENGAGEMENT
  Organic sessions                 _______      _______    __
  Top 3 organic landing pages      1. ______________________
                                   2. ______________________
                                   3. ______________________
  intake_start → submit rate       ______%      ______%     __

LEADS
  Total leads                      _______      _______    __
  Qualified leads                  _______      _______    __
  Calls (call_click)               _______      _______    __
  Leads from organic               _______      _______    __
  Top lead source page             ________________________

CONTENT SHIPPED
  Area pages live                  __ / 15
  Case studies live                _______
  Posts published                  _______
  Pages w/ structured data         __ / 17

FLAGS  (unresolved compliance, broken paths, blockers)
  ______________________________________________________

DECISION FOR NEXT MONTH
  ______________________________________________________
```

---

## 7. What not to measure

Listed because tracking them wastes attention and invites bad decisions:

- **Keyword rank trackers on a handful of head terms.** "Charlotte Realtor" position is
  volatile, personalized, and location-dependent. GSC average position across many queries
  is the honest version.
- **Domain Authority / Domain Rating.** Third-party inventions, not Google metrics.
- **Bounce rate.** GA4 does not use it as a primary metric; engagement rate replaced it.
- **Word count as a goal.** `/reviews` is 12,273 words and needs no more; `/negotiation` is
  1,226 and is the most valuable page to expand. Length is an output, not a target.
- **Social follower counts.** Instagram and the website do not share an audience, and §12
  settled that they need not say the same thing.
- **Anything from an SEO tool that cannot be traced to GSC, GA4, GBP, or FUB.**
