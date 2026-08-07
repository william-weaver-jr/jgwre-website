# CLAUDE.md — Jasmine Garcia Real Estate (jasminegarcia.com)

Read this file at the start of every session. It is the source of truth for scope,
brand, and compliance. If a request in chat conflicts with the **Compliance** section,
stop and flag it rather than complying.

**Companion docs — read before writing any copy:**
- `docs/BRAND-VOICE.md` — USP, voice rules, origin story, banned language
- `docs/CASE-STUDIES.md` — the three negotiation case studies + required disclaimer
- `docs/CONTENT-PLAN.md` — page-by-page content direction and the lead magnet spec

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
- **Analytics:** Vercel Analytics + GA4
- **Images:** `next/image`, AVIF/WebP, explicit width/height on everything

### Conventions
- Server Components by default; `"use client"` only where interactivity requires it
- No `any` in TypeScript
- No inline styles — Tailwind utilities and design tokens only
- Design tokens live in `tailwind.config.ts`; never hardcode hex values in components
- Commit after each completed page or feature, with a descriptive message
- Run `npm run build` before declaring any task done

---

## 5. Positioning pillars

Four pillars. Each gets a dedicated page, and each is the USP applied to a specific table.

1. **New construction** — 17 closings with Copper Builders, David Weekley, Vista Homes,
   DRB, Pulte, Meritage, Lennar, DR Horton, Kolter, Hopper Communities.
   *The table:* the builder's sales office negotiates daily; the buyer never has.
2. **Relocation** — 18 relocation transactions.
   *The table:* everyone in the transaction is local except the client.
3. **The NC/SC border** — licensed in both states. Fort Mill, Tega Cay, Indian Land,
   Lake Wylie, Waxhaw. 12 closings in the Fort Mill corridor.
   *The table:* two states, two tax regimes, two sets of rules.
4. **Sellers** — the Stone Selling System (reference by name; see Compliance).
   *The table:* the buyer's agent and the inspector both work for the buyer.

**Supporting proof** (use sparingly, never as a stat wall):
73+ career transactions · $30.9M career volume · 98.84% list-to-sale ratio ·
23 transactions / $9.9M in 2024 · top-5 producer at SRG in 2023 and 2024 ·
105 five-star reviews (42 Zillow, 62 Google) · Zillow Premier Agent

**Markets served:** Ballantyne, SouthPark, Steele Creek, Myers Park, Dilworth, South End,
LoSo, Uptown, Pineville (NC) · Fort Mill, Tega Cay, Indian Land, Lake Wylie, Waxhaw (SC)

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
- **Zillow profile:** https://www.zillow.com/profile/myrealtorjasmine
- **Bio video:** "Meet Jasmine Garcia – Stone Realty Group" — https://youtu.be/J6T4pmDWQ6M
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
live, and must approve material changes after. Do not deploy to the production domain until
that approval is confirmed.

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
/blog                   CMS-driven
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
- Test end-to-end with a real submission before launch

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

- [ ] **Confirm Jasmine's comfort with the candid origin story** — see `docs/BRAND-VOICE.md`
      §3. This gates the About page. Do not write it either way until she has answered.
- [ ] Brand identity: palette, typography, logo — **proposed, pending her review.** Current
      direction and open questions in `docs/brand-decisions.md`. Do not invent an alternative.
      Must be visually distinct from Stone Realty Group's black/hexagon system.
- [ ] **"Queen of Negotiations" is live in her Instagram bio.** §2 rejects the title on the
      stated grounds that it is "not in use anywhere, no equity to preserve" — that premise is
      factually wrong. The decision may still be right, but retiring a title she actively uses
      is a conversation with her, not a silent omission. Raise before the About page.
- [ ] **Stat discrepancy.** Her IG bio reads "Top 5 producer | 85+ families served | $30M+ in
      sales"; §5 documents 73+ transactions / $30.9M. Both may be true (families ≠
      transactions), but her bio and her site must not visibly disagree. Reconcile with her —
      the site's numbers may be understating her.
- [ ] CMS final pick: Sanity vs Payload — deferred, non-critical for Phase 1 launch
- [x] NC and SC license numbers — NC 334700, SC 125546 (§7)
- [ ] Broker-in-Charge written approval (site + results disclaimer wording)
- [ ] Confirm Placester contract term, auto-renewal date, and content/domain ownership
      before giving notice
- [ ] Confirm the Stone Realty Group IDX search URL (the "Search Homes" destination)
- [ ] Follow Up Boss API credentials (tracking number confirmed: (704) 200-9360)
- [ ] Professional photography and any brand video
