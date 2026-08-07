# Placester Site Inventory — jasminegarcia.myrealestateplatform.com

Captured 2026-08-07. Full crawl of every URL in the site's own sitemaps (50 pages).
This closes the CLAUDE.md open item "Placester site content: needed for the 301 map."

**Contents of this directory**
- `urls.txt` — all 50 indexed URLs
- `text/*.txt` — extracted text, one file per page
- `meta.json` — title, meta description, canonical, and `<h1>`s per page
- `html-raw.tar.gz` — raw HTML of record (loose `html/` and `css/` are gitignored)

**Access note:** the site is fully public. No login was required — the Sign In / Sign Up
links are a Placester lead-capture account feature, not a gate.

---

## 1. Platform

| | |
|---|---|
| CMS | WordPress 6.7.1 |
| Theme | Placester "Valhalla" (`static.myrealestateplatform.com/Valhalla/…`) |
| IDX | **Live.** Canopy MLS via MLS GRID, on 22 of 50 pages |
| Fonts | Playfair Display (400/500/700) headings · Open Sans (400/500/600/700) body — Google Fonts |
| Contact email in markup | `info@jasminegarcia.com` |
| Social linked | IG [@myrealtorjasmine_](https://www.instagram.com/myrealtorjasmine_/) · **Facebook [/jgwrealestate](https://www.facebook.com/jgwrealestate)** · [Zillow](https://www.zillow.com/profile/myrealtorjasmine) |

The Facebook page is not recorded in CLAUDE.md §6 and should be added to the brand references.

### Design system (computed from the live page)

| Token | Value |
|---|---|
| accent | `#000000` |
| accent tone (hover) | `#333333` |
| text on accent | `#FFFFFF` |
| alternative | `rgb(239,233,233)` ≈ `#EFE9E9` |
| dark bg / dark text | `rgb(45,45,55)` ≈ `#2D2D37` |
| light bg | `#FFFFFF` |
| button radius | `0px` (square, black fill, white text, no letterspacing) |
| h1 | Playfair Display 500, 48px / 66px |

Header lockup is the **Stone Realty Group hexagon logo** set beside a letterspaced serif
"JASMINE GARCIA" wordmark. The whole palette is SRG's black system. CLAUDE.md's open item
requiring the new brand to be "visually distinct from Stone Realty Group's black/hexagon
system" is a real departure from what exists today, not a refinement of it.

---

## 2. URL inventory (50)

**Pages (9)** — `/` · `/meet-jasmine/` · `/for-buyers/` · `/for-sellers/` ·
`/how-much-is-your-house-worth/` · `/testimonials/` · `/area-guide/` · `/blog/` · `/contact-2/`

**Area pages (22)** — NC: ballantyne, belmont, charlotte-2, cornelius, davidson, harrisburg,
huntersville, indian-trail, loso, marvin, matthews, mint-hill, noda, pineville, southpark,
steele-creek, waxhaw, weddington · SC: fort-mill, indian-land, lake-wylie, tega-cay

**Blog posts (5)** — all dated 2026-03-12: Charlotte seller prep · Matthews vs Huntersville ·
Belmont first-time buyers · Gastonia older homes · Relocating to Charlotte

**Testimonial pages (14)** — one indexed URL per review

**Not in sitemap but live:** `/search-results` (IDX search — `Disallow`ed in robots.txt),
`/property/*`, `/sold/*`

---

## 3. Content findings

### The current site does not carry the USP at all
No page mentions negotiation as positioning. The homepage promise is "Find Your Charlotte
Home With Confidence" and the differentiator claimed is "an educational, client-focused
approach" / "the heart of a teacher." Nothing about knowing what's askable.

**But the proof is already there in the reviews.** One indexed testimonial is titled
*"when it comes to negotiations she's the best of the best"* (Sharee, Zillow) and another
(C. Brown, Zillow) says she "was able to get us a closer deal with no seller"
[concessions — text truncated on the card]. These are usable evidence for the locked USP.

### `/meet-jasmine/` — the current bio, verbatim
Three paragraphs. Key claims, none of which appear in CLAUDE.md §5:
- "didn't leave teaching — she simply brought her classroom skills into the world of real estate"
- based in Southwest Charlotte's **Ayrsley** neighborhood
- **"co-owner of Vitality Homebuyers"** — an investor-side business. This is a material
  disclosure not mentioned anywhere in the project docs, and it interacts with the About page
  and with brokerage compliance. Raise with Jasmine before writing `/about`.

### `/for-buyers/` and `/for-sellers/` are Placester stock copy
Generic, non-local, no first-person voice ("Our team of professionals is eager to support
you…", advice about listing on Thursdays). Nothing here is worth migrating. Both are pure
boilerplate that any Placester agent site ships with.

### Blog
5 posts, all published the same day (2026-03-12), all with SEO-shaped titles and no byline
voice. Two target **Gastonia** and **Belmont** — markets not in CLAUDE.md §5. Treat as
disposable content with retained URLs, not as an archive to migrate.

### Area coverage vs. CLAUDE.md §5
- **On the site but not in §5:** Belmont, Cornelius, Davidson, Harrisburg, Huntersville,
  Indian Trail, Marvin, Matthews, Mint Hill, NoDa, Weddington (+ Gastonia in blog only)
- **In §5 but not on the site:** Myers Park, Dilworth, South End, Uptown

Decide which set the new site commits to before the `/areas/[slug]` build — this drives the
301 map.

### Area page quality
Each is one generic paragraph plus an auto-generated stats block plus an MLS listing grid.
The stats are unreliable: **Fort Mill shows "Number of Active Listings: 27,485" and "Homes
Sold (last 30 days): 3,478"** — those are metro-wide figures rendered under a town heading.
Steele Creek by contrast shows 4 active listings. This is exactly the thin-content problem
CLAUDE.md §11 warns about.

---

## 4. Compliance gaps in the current site

Recorded because the replacement must not inherit them, and because some are live risk today.

| Gap | Detail |
|---|---|
| **License numbers not displayed anywhere** | Required by NC and SC advertising rules per CLAUDE.md §7 |
| **License number conflict** | The `Person` JSON-LD publishes `"license":"NC 330176"`. CLAUDE.md §7 records **NC 334700**. One of these is wrong and it is published on 50 pages. Verify with Jasmine/the BIC. |
| **No phone number in visible content** | (704) 200-9360 appears only inside JSON-LD. No `tel:` link anywhere. CLAUDE.md Locked Decision #4 makes the site phone-first — the current site is the opposite. |
| **No privacy policy page** | Required by §7; none exists, and the four lead forms link to nothing |
| **No Equal Housing Opportunity logo** | Required by §7 |
| **No TCPA consent text on any form** | Contact, home-value, and search-signup forms collect phone with no consent language. The §7 verbatim block is absent. |
| **No results disclaimer** | Not needed today (no dollar-outcome claims are made), but required the moment the case studies ship |
| Testimonials attributed inconsistently | One review names "**Jasmine Weaver**"; homepage cards label two Zillow reviews as "Google" |
| `aggregateRating` says 5.0 / **14 reviews** | CLAUDE.md §5 documents 105 (42 Zillow + 62 Google). The structured data understates her badly. |

Everything above is the Placester site's problem, not the new build's — but the license
number conflict and the missing TCPA consent are live now and worth flagging to Jasmine
regardless of launch timing.

---

## 5. Forms on the current site (all must be re-pointed at FUB)

1. `/contact-2/` — first, last, email, phone, message
2. `/how-much-is-your-house-worth/` — complete address, first, last, email, phone, message
3. Sign In / Sign Up account modal — sitewide, Placester-native lead capture
4. Property search saved-search prompts — Placester-native

None of these survive the migration. Per CLAUDE.md §9 all four collapse into
`app/api/lead/route.ts` with lead types `buyer` / `seller` / `valuation` / `guide`.

---

## 6. Proposed 301 map (draft — needs the area-list decision first)

| Old | New |
|---|---|
| `/` | `/` |
| `/meet-jasmine/` | `/about` |
| `/for-buyers/` | `/buyers` |
| `/for-sellers/` | `/sellers` |
| `/how-much-is-your-house-worth/` | `/home-value` |
| `/testimonials/` | `/reviews` |
| `/area-guide/` | `/areas` |
| `/blog/` | `/blog` |
| `/contact-2/` | `/contact` |
| `/area/{slug}/` | `/areas/{slug}` where the market is retained; otherwise `/areas` |
| `/testimonial/{slug}/` | `/reviews` (no per-review pages planned) |
| `/2026/03/12/{slug}/` | `/blog/{slug}` if migrated; otherwise `/blog` |
| `/search-results`, `/property/*`, `/sold/*` | Stone Realty Group IDX (Locked Decision #2) |

**Caveat before relying on this:** these are the URLs on the
`*.myrealestateplatform.com` staging host. Whether Google indexed *these* or a set under
`jasminegarcia.com` depends on how the Placester site was published — confirm in Search
Console before writing the redirect table.

---

## 7. Things to raise with Jasmine

1. **Vitality Homebuyers co-ownership** — currently published in her bio. Keep, drop, or disclose differently?
2. **NC 330176 vs NC 334700** — which license number is correct?
3. **Area list** — the current site covers 22 markets, CLAUDE.md §5 names 14, and only 11 overlap.
4. **Facebook page** `/jgwrealestate` — add to the brand references, or retire it?
5. **"Heart of a teacher" / educator framing** — it is the entire current positioning and it is
   compatible with the USP ("now you do too" is a teaching posture). Worth keeping as voice
   even though the headline claim changes.
