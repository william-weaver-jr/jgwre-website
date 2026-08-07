# Competitive Landscape

Captured 2026-08-07. Compares the Lovable direction against the Placester site being
replaced and the three Stone Realty Group properties. Companion to
`docs/placester-archive/INVENTORY.md`.

Sites reviewed: `mattstoneteam.com` · `mackenziesiek.com` · `top5charlotteagents.com`

---

## 1. Lovable vs. Placester

### Visual

| | Placester (current) | Lovable (proposed) |
|---|---|---|
| Ground | White / full-bleed photo | Ivory `#FCFAF6`, cream bands `#F4EFE6` |
| Accent | `#000000` — SRG's black | Antique gold `#8A6A2F`, hairlines only, never a fill |
| Ink | `rgb(45,45,55)` | Charcoal-navy `#1B2230` |
| Display | Playfair Display 500 | Cormorant Garamond 400/500/600 |
| Body | Open Sans | Libre Franklin |
| Buttons | Black fill, square, white text | Navy fill, square + gold outline secondary |
| Hero | Full-bleed stadium stock photo, centered text, IDX search bar | Left-aligned type-led, labeled photo placeholder, no search |
| Identity | SRG hexagon + "JASMINE GARCIA" wordmark | Own wordmark, "BROKER / REALTOR®" in gold small caps |

Both are serif-display over sans-body with square buttons — the same formula. The real
moves are **off black onto ivory/navy/gold** and **off centered-photo onto left type-led**.
The second matters more than the first: the Placester hero says "here is a city," the
Lovable hero says "here is an argument."

### Structural

| | Placester | Lovable draft | Next.js repo today |
|---|---|---|---|
| Pages | 50 indexed | 1 | 2 (`/`, `/privacy-policy`) |
| IDX | Live, 22 pages | None — links out | None |
| Forms | 4 + account signup | 0 by design | `/api/lead` handler, no UI yet |
| Phone | JSON-LD only, no `tel:` | Header + hero + contact block | Header, footer, hero |
| Leads to | Placester native | — | Follow Up Boss |

The homepage argument inverts completely. Placester leads with a property search box and
"an educational, client-focused approach." Lovable leads with the locked headline, then
three case studies as evidence. Nothing on the Placester site sells negotiation.

**The gap to close is content volume, not design.** The repo is a scaffold. Placester has
50 indexed URLs today; CLAUDE.md §8 specifies ~13 routes plus area pages. That decision is
still open — see §4.

---

## 2. The three Stone properties

### mattstoneteam.com — the brokerage flagship

- **AgentFire on WordPress 4.9.29.** Full IDX, ~30-item nav, Matomo + Facebook Pixel + Google Ads
- **Type:** `Baskerville-Old` display serif, Poppins body, Montserrat accents
- **Buttons:** transparent with 1px white borders, `0px` radius, 1px letterspacing
- Stats claimed: 20 years · ~$2B closed · 1,000+ reviews · 2,500 families · RealTrends #2 large team
- Footer: EHO + the trademark notice + privacy policy. **No license numbers.**

Note it is *not* pure black — it runs a display serif and ghost buttons. The "black system"
CLAUDE.md warns about is the hexagon mark and the agent-site treatment more than this page.

### mackenziesiek.com — the direct comparable

This is the closest analogue to what we're building: one SRG broker, own domain, personal brand.

**Build:** React/Vite SPA, GA4 + Cloudflare. Home page nav is one link (Contact) plus a
hamburger; the other routes are reached from in-page CTAs and the footer.

**Four real pages plus a privacy policy:**

| Route | What it is |
|---|---|
| `/` | Personal brand page (~8,450px) — the one analyzed below |
| `/sell` | **"The Stone Selling System."** Almost entirely brokerage content: professional photography, "$2M annually on marketing," precision pricing, then the same 18 years / 2,500 homes / $1.5B / 1,000 reviews block. Very little of it is hers |
| `/reviews` | Client testimonials, own `<h1>`, clean |
| `/market-insights` | Charlotte stats — $425K avg price, 28 DOM, 1,247 active listings. Appear to be **hardcoded placeholders**: top5charlotteagents.com publishes $439,945 and 47 days from Canopy MLS for the same market |

Her sitemap also lists six `/neighborhood/*` URLs plus `/agent`, `/data`, and `/compare` —
**all of which 404** — and one junk entry reading `Melovoye, Kharkov Region`. So the sitemap
advertises 14 URLs and 4 resolve.

This sharpens the comparison rather than softening it: two of her four pages are brokerage
content or generic market stats, and neither makes an argument for her specifically.

**Design:** **no custom typography at all** — the OS system font stack throughout, bold weights,
Tailwind defaults (`8px` radius, `slate-950` ink). Glassmorphic card over a stock skyline photo.
**Emoji inside the primary CTAs** — "🏠 Access Listings", "⭐ Your Home's Value". A floating
agent-photo chat bubble and a cookie consent banner.

**Structure:** hero → bio → four capability chips → "Meet Our Agent" personal Q&A (favorite
restaurant, weekend vibes, fun fact) → **"The Stone Standard"** team block → 8 neighborhood
cards with median price + Walk Score → 7 testimonials + "5.0/5 based on 559 Google Reviews"
→ contact form.

**Positioning:** geographic niche — "Your Guide to In-Town Charlotte Living," specializing in
SouthEnd condos, NoDa townhomes, Dilworth historic, Fourth Ward luxury. Personal story does
the differentiating (builder father, 18 years competitive equestrian, UNCC finance degree).

**Two things worth copying, one worth avoiding:**
- ✅ **IDX links out.** "Access Listings" → `mackenzie.mattstoneteam.com`, "Your Home's Value" →
  `mackenziesiek.mattstoneteam.com/seller`. This is Locked Decision #2 already working in
  production, and it suggests the URL shape for the `SEARCH_HOMES_URL` TODO in `lib/site.ts` —
  worth asking SRG whether a `jasmine.mattstoneteam.com` subdomain exists.
- ✅ A small page count is house-normal at SRG — four pages, not fifty.
- ❌ An entire homepage section *and* the whole `/sell` page are handed over to Stone Realty
  Group. It satisfies brokerage identification, but the page stops being hers for a full
  screen and the seller page never really becomes hers at all.

**Compliance:** EHO, trademark notice, privacy policy, SRG address, `tel:` links — all present.
**No license number. No TCPA consent on a form that collects phone.** Her social links point
to Matt Stone Team's Facebook/Instagram/LinkedIn, not her own.

### top5charlotteagents.com — an SEO lead-gen play

Not a personal brand. Ranks five SRG agents #1–#5 using an "Agent Clout Score™" and a
"Verified Ranking Methodology" with percentage weights — a ranking of the brokerage's own
roster, published as objective and "not paid placement." Same system-font Tailwind look as
mackenziesiek.com; same builder. Calendly booking, Canopy MLS market data, white papers.

**Jasmine is not among the five** (Michelle Kleven, Hasty Millen, Josh Stone, Mackenzie Siek,
Matthew Coles). Mackenzie is #4 with 32 recent sales / $410K average — against Jasmine's
documented 73+ transactions and $30.9M career volume in CLAUDE.md §5.

**Fair-housing exposure.** The neighborhood cards characterize residents and rate schools:
"Young professionals, established families," "Artists, young professionals," "Myers Park High
School (A+ rated)," "Growing area," "affordable." CLAUDE.md §7 bans exactly this pattern. Do
not treat this site as a content model for `/areas/[slug]`.

---

## 3. Where Jasmine's direction lands

**1. Only one of the four leads with an argument.** The other three lead with credentials
(mattstoneteam), geography plus biography (mackenziesiek), or rankings (top5). Jasmine's leads
with a claim about how negotiation actually works, then evidence. The USP survives contact
with the family — nobody else occupies that ground.

**2. Typography is a free win.** Two of the three Stone sites use the OS default font stack.
Cormorant Garamond + Libre Franklin will read as more considered than any sibling site by a
wide margin. The bar is genuinely low.

**3. But the palette question in `brand-decisions.md` Q2 is real, and this sharpens it.**
The brief explicitly banned "the gold-serif 'luxury agent' cliché" and asked for "warm,
competent, direct. Approachable expert, not luxury-aloof." Round 2 landed on antique gold and
Cormorant Garamond. Gold is restricted to hairlines and Cormorant is set at 500 rather than
a hairline weight, so it is not the worst version of that cliché — but it is in the
neighborhood, and it is the register mackenziesiek.com reaches for with "Luxury Specialist"
and "Curating exceptional properties." Cormorant is formal before it is warm. Press this one
with Jasmine rather than letting it pass by default.

**4. Restraint is the actual differentiator, and it is fragile.** Against emoji CTAs, Walk
Scores, ™ scoring systems, glassmorphism, and chat bubbles, plain wins by contrast alone. The
"no animated counters, numbers as evidence" rule is doing more work than it looks like. Every
future request to "make the stats pop" is a request to look like the siblings.

**5. Compliance: Jasmine's site is on track to be the most compliant of the four.** None of
the three displays license numbers. None carries TCPA consent on forms that collect phone.
top5's area pages carry fair-housing risk. Following CLAUDE.md §7 puts her ahead — worth
saying to the BIC directly, because "the team site doesn't do that" will come up.

**6. Stat inconsistency is endemic across the family.** mattstoneteam: 20 years / ~$2B / 2,500
families. mackenziesiek: 18 years / 2,500 homes / $1.5B / 1,000 reviews. top5 footer: 671
Google Reviews, while Mackenzie's own page says 559. This is the same disease as the open item
about her Instagram bio disagreeing with §5 — it just proves the `TODO(verify)` discipline is
the right call, not an over-correction.

**7. The brokerage-identification pattern is a real choice.** Mackenzie's site gives Matt Stone
a full section. Jasmine's footer does it in one line — "All real estate services are provided
through Stone Realty Group." Leaner, and it keeps the page hers. It is a deliberate divergence
from house pattern, so put it in front of the BIC explicitly rather than hoping it passes.

---

## 4. Open decision this surfaces

**How many pages at launch?** Mackenzie ships four, and only two of them are really about
her. A lean launch is house-normal. But the four pillar pages in CLAUDE.md §5 are the USP
applied to four specific tables — they are the whole reason to build more than a landing page,
and they are the only thing on the roadmap no sibling site has. Recommendation: ship the
homepage plus `/negotiation` plus the four pillars, and defer area pages and blog until after
launch. Six pages that are all hers, against Mackenzie's four of which two are the brokerage's
— and it avoids recreating Placester's 22 thin area pages to preserve URLs that were never
ranking on their merits.

Also worth noting for our own build: her `/neighborhood/*` routes are in the sitemap and
return 404. Whatever we ship, `app/sitemap.ts` should be generated from the routes that
actually exist.
