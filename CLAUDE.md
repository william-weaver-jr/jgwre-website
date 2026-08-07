# CLAUDE.md — Jasmine Garcia Real Estate (jasminegarcia.com)

Read this file at the start of every session. It is the source of truth for scope,
brand, and compliance. If a request in chat conflicts with the **Compliance** section,
stop and flag it rather than complying.

---

## 1. Project

Personal-brand and lead-generation website for **Jasmine Garcia**, Broker/REALTOR® with
**Stone Realty Group** (Matt Stone Team), Charlotte NC.

- **Domain:** jasminegarcia.com (owned, currently no live site)
- **Agent phone (direct):** (704) 200-9360 — per Locked Decision #6, site markup should
  display the FUB tracking number once confirmed; use this direct line until then.
- **Repo:** `~/Projects/jgwre-website`
- **Replaces:** a Placester-built site (poor service/communication)
- **Not replacing:** mattstoneteam.com — the team site stays as-is on AgentFire

**Goal:** own her personal brand, capture buyer/seller leads directly, and route them
into Follow Up Boss. This is a brand + conversion site, not a property search portal.

---

## 2. Locked decisions

These are settled. Do not re-litigate them or propose alternatives unless explicitly asked.

| # | Decision | Rationale |
|---|---|---|
| 1 | **No IDX/MLS integration in Phase 1** | Canopy MLS licenses feeds through MLS Grid, requires Broker-in-Charge approval, and performs a compliance review that locks search/listing page changes. Costly and restricts design freedom. Revisit only if organic traffic justifies it. |
| 2 | "Search Homes" links out to the **existing Stone Realty Group IDX** | Zero compliance surface, ships immediately. |
| 3 | **Hybrid build workflow** | Visual direction generated in Lovable/v0 → exported to GitHub → all subsequent work done in Claude Code against the real repo. |
| 4 | **No consultation booking tool** (no Cal.com) | Clients call her directly. Phone-first CTAs. |
| 5 | **Follow Up Boss is the CRM** | Every lead form must reach FUB. Nothing ships with an unwired form. |
| 6 | **Call tracking is handled inside Follow Up Boss** | Use the FUB-provided tracking number in site markup. Do not add a second call-tracking vendor. |

---

## 3. Stack

- **Framework:** Next.js 15, App Router, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel (jasminegarcia.com apex + www redirect)
- **Content:** CMS is planned but **non-critical for Phase 1** — the site can launch with
  content in the repo. Long-term, Jasmine must be able to publish and edit without a
  developer (Sanity or Payload; final pick TBD — see Open Items). Structure content
  (blog posts, area pages) so a CMS can be slotted in later without rewrites.
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

## 4. Positioning

Do **not** write generic agent copy. "Your trusted Charlotte REALTOR®" and equivalents are
banned. Her record is unusually specific and the specificity is the differentiator.

**Four pillars, each gets a dedicated page + lead magnet + form:**

1. **New construction** — 17 closings with Copper Builders, David Weekley, Vista Homes,
   DRB, Pulte, Meritage, Lennar, DR Horton, Kolter, Hopper Communities. Angle: buyers
   negotiate once; builder sales offices negotiate daily. She has sat at those tables 17 times.
2. **Relocation** — 18 relocation transactions. Out-of-state buyer guide, Charlotte
   orientation, NC vs SC decision framework.
3. **The NC/SC border** — licensed in both states. Fort Mill, Tega Cay, Indian Land,
   Lake Wylie, Waxhaw. 12 closings in the Fort Mill corridor. Dual licensure is a real moat.
4. **The teaching background** — a decade in special education before real estate. A
   career spent explaining complex processes to anxious people is a stronger trust signal
   than any award badge.

**Supporting proof points** (use sparingly, never as a wall of stats):
73+ career transactions · $30.9M career volume · 98.84% list-to-sale ratio ·
23 transactions / $9.9M in 2024 · top-5 producer at SRG in 2023 and 2024 ·
105 five-star reviews (42 Zillow, 62 Google) · Zillow Premier Agent

**Markets served:** Ballantyne, SouthPark, Steele Creek, Myers Park, Dilworth, South End,
LoSo, Uptown, Pineville (NC) · Fort Mill, Tega Cay, Indian Land, Lake Wylie, Waxhaw (SC)

---

## 5. Voice

- Direct, concrete, specific. Numbers over adjectives.
- Warm but not saccharine. She is a mother of twins and an HOA board president — competent
  and human, not luxury-aloof.
- Short sentences. No stacked superlatives. No "nestled," "boasts," "dream home," "passionate
  about helping."
- Never claim credentials, awards, designations, or statistics that are not in Section 4.
  If copy needs a number you do not have, insert `TODO(verify)` and leave it.

---

## 6. Compliance — non-negotiable

Advertising rules apply to every page. Treat violations as build-breaking.

### Must appear
- **Brokerage name — "Stone Realty Group" — on every page** (footer minimum, prominent).
  North Carolina requires brokerage identification in a broker's advertising; South
  Carolina has an equivalent requirement. She may not present as an independent firm.
- **Brokerage address:** 2459 Wilkinson Blvd, Suite 310, Charlotte, NC 28208
- **License numbers:** NC 334700 · SC 125546
- **Equal Housing Opportunity logo** in the footer
- **Privacy policy** page, linked from footer and every form
- **REALTOR® / MLS trademark usage** — correct symbols, correct capitalization

### Must not appear
- Any implication that jasminegarcia.com is a brokerage or that she operates independently
- Stone Realty Group's registered marks used decoratively. "Stone Selling System," "Stone
  Realty Group," and the stylized hexagon "O" are registered trademarks of Stone Realty Group.
  Reference by name where accurate; do not restyle, recolor, or incorporate the logos into
  her brand system.
- MLS listing data of any kind (see Locked Decision #1)
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

This is TCPA consent language carried over from the team site. Do not reword, shorten, or
pre-check the associated checkbox.

### Approvals
The Broker-in-Charge at Stone Realty Group must approve this site in writing before it goes
live, and must approve material changes after. Do not deploy to the production domain until
that approval is confirmed.

---

## 7. Sitemap

```
/                       Home — positioning, proof, primary CTA (call)
/about                  Her story: special ed → real estate, twins, HOA presidency
/buyers                 Buyer process
/new-construction       PILLAR — builder negotiation + guide download
/relocation             PILLAR — out-of-state buyer guide download
/carolinas-border       PILLAR — NC vs SC: taxes, schools, commute
/sellers                Seller process, references Stone Selling System by name
/home-value             Valuation request form → FUB (manual CMA, not an automated AVM)
/areas/[slug]           Neighborhood pages, one per market in Section 4
/reviews                Testimonials, unedited
/blog                   CMS-driven
/contact                Phone-first, form secondary
/privacy-policy
```

---

## 8. Follow Up Boss integration

- Single server-side handler at `app/api/lead/route.ts`; all forms POST to it
- FUB API key in Vercel env vars only — never in client code, never committed
- Payload includes source (page slug), lead type (buyer/seller/valuation/guide), and UTM params
- Honeypot field + rate limiting; no CAPTCHA unless spam becomes a real problem
- On failure, still send the email via Resend and log the error — never silently drop a lead
- Test end-to-end with a real submission before launch

---

## 9. Accessibility & performance

Real estate sites are a common target for ADA demand letters. This is a legal risk, not a nicety.

- WCAG 2.1 AA: 4.5:1 text contrast, visible focus states, full keyboard navigation
- Semantic HTML, one `<h1>` per page, logical heading order
- Alt text on every image; labels (not placeholders) on every form field
- Lighthouse ≥ 95 accessibility, ≥ 90 performance before launch

---

## 10. SEO

- `RealEstateAgent` + `Person` JSON-LD on the homepage; `LocalBusiness` with the brokerage address
- Unique title + meta description per page; no templated boilerplate across area pages
- Area pages must carry genuinely distinct content — thin duplicated pages will be ignored or penalized
- Canonical tags, sitemap.xml, robots.txt
- 301 redirects from any indexed Placester URLs once that site is retired

---

## 11. Open items

- [ ] Brand identity: palette, typography, logo — **not yet decided.** Do not invent one.
      Her brand must be visually distinct from Stone Realty Group's black/hexagon system.
- [ ] CMS final pick: Sanity vs Payload — deferred, non-critical for Phase 1 launch
- [x] NC and SC license numbers — NC 334700, SC 125546 (in Section 6)
- [ ] Broker-in-Charge written approval
- [ ] Confirm Placester contract term, auto-renewal date, and content/domain ownership
      before giving notice
- [ ] Follow Up Boss API credentials + confirm the call-tracking number to display
- [ ] Professional photography and any brand video
