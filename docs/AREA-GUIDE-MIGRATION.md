# The Placester Area Guide — what transfers, and in what order

A design and content review of `/area-guide/` and its 22 child pages on the site being
retired, against what `docs/AREAS-SPEC.md` specifies for the replacement.

Sources: `docs/placester-archive/` (crawled 2026-08-07) and the live pages, re-checked
2026-08-21. Read `AREAS-SPEC.md` first — this document says what to take from the old site
and what to leave; that one says how the new pages get authored.

**The short version.** The information architecture is sound and should be copied almost
exactly. **No copy, no image, and no statistic survives the migration** — not because the
new site is precious about voice, but because the old pages carry live fair-housing
exposure and imagery of the wrong cities. The two findings are independent and either one
alone would be disqualifying.

---

## 1. What is actually there

### The hub — `/area-guide/`

Hero image, one intro paragraph, then three headed sections of cards:

| Section | Cards |
|---|---|
| Featured Areas in NC | 12 |
| Featured Areas in SC | 4 |
| Featured Charlotte Neighborhoods | 12 |

Each card: area name (linked), a snippet hard-truncated at ~125 characters with an ellipsis,
a "View Area" button, and a background image.

### A child page — `/area/{slug}/`

`<h1>` · auto-generated stats block · **one paragraph of prose** · map · IDX listing grid.

Steele Creek's stats block, as an example of the whole pattern:

> Average List Price $517,600 · Average Price per Sqft $200 · Number of Active Listings 4 ·
> New Listings (last 30 days) 2 · Average Year Build 2009 · Homes Sold (last 30 days) 1 ·
> Average Sale Price (last 30 days) $435,000

That block is the page. The authored content is a single paragraph beneath it.

---

## 2. What it gets right, and what we should take

Four things, and they are worth taking seriously rather than dismissing because the
execution around them is poor.

**1. The hub-and-spoke structure is correct.** A parent page that introduces the coverage
area and links to one child per market is the right information architecture for this
content, it is what users expect, and it distributes internal link equity to pages that
would otherwise be reachable only from the footer. **Copy this.**

**2. Grouping by state is the right first cut.** It matches her dual licensure, which is a
genuine differentiator, and it front-loads the NC/SC decision that `/carolinas-border` is
built around. Pleasingly, `sortAreas()` in `lib/areas/index.ts` already sorts NC before SC
and alphabetically within each — the existing code independently arrived at the same
grouping.

**3. The card shape is right.** Name, one line, a consistent CTA, an image. There is nothing
to improve about that pattern; the problem is entirely what got poured into it.

**4. One paragraph, covering the right topics.** Steele Creek's prose is the best of the 22
and it is instructive:

> "Steele Creek is a rapidly growing area in southwest Charlotte, offering a mix of newer
> communities, established neighborhoods, and convenient access to Lake Wylie. Homebuyers
> appreciate the variety of housing options, proximity to shopping and dining, and easy
> commutes via major highways."

Strip the adjectives and the topic coverage is: geography → housing stock → amenities →
commute. That is four of the six fields in `lib/areas/types.ts`, arrived at independently.
**The checklist transfers. The sentences do not.** Not one clause survives contact with
`BRAND-VOICE.md` — "rapidly growing," "homebuyers appreciate," "value and accessibility" are
filler, and the page never mentions the airport, which is the single most consequential fact
about buying in Steele Creek.

---

## 3. Structural defects — fix rather than inherit

**The third section is wrong twice over.** "Featured Charlotte Neighborhoods" contains
Weddington, Indian Trail, Harrisburg, Mint Hill, and Marvin. None of those is a Charlotte
neighborhood — they are separate municipalities in Union, Cabarrus, and Mecklenburg counties.
And all five are duplicates of cards already shown in the NC section above. So the page
renders 28 cards for 22 areas, with a heading that is factually false and a second set of
internal links pointing at URLs already linked higher up the same page.

**Pineville is orphaned.** `/area/pineville/` is live and indexed but is not linked from the
hub — 21 of the 22 area pages are reachable, and the missing one is a `CLAUDE.md` §5 market.
An indexed page with no internal link from its own hub is the clearest possible signal that
the section was assembled by hand and not checked.

**Snippets truncate mid-word.** "…and strong business…" is a hard character cut, not an
authored summary. Every card ends in an ellipsis mid-thought.

**The intro paragraph names the wrong markets.** It cites "Charlotte, Belmont, Gastonia,
Matthews, and Huntersville." Three of those five are not in §5 at all, and it omits Fort
Mill — the corridor where she has 12 closings and the strongest evidence on the site.

---

## 4. Copy — the disqualifying finding

**17 of the 22 area pages carry banned or fair-housing-adjacent language.** Scanned across
the archived text:

| Language | Pages |
|---|---|
| `family-friendly` | Harrisburg, Huntersville, Indian Trail, Marvin, Matthews, Mint Hill, Waxhaw |
| `excellent` / `top-rated` schools | Huntersville, Matthews, Marvin, Cornelius, Charlotte |
| `families are drawn to` / `families…attracted to` | Marvin, Matthews, Belmont, Waxhaw |
| `prestigious` · `sought-after` · `desirable` · `nestled` · `charming` · `vibrant` | 14 pages |

In context:

> "Families are also drawn to Marvin for its top-rated schools and family-friendly
> environment."

> "Known for its family-friendly neighborhoods, excellent schools, and easy access to major
> highways…" *(Huntersville)*

This is the familial-status problem in `CLAUDE.md` §7 in its most recognizable form, and
`lib/areas/validate.ts` fails the build on nearly every phrase above. It is also **live
exposure today**, on a licensed broker's advertising, and it does not become safe by being
Placester's stock copy rather than hers — it is published under her name and her license.

Worth raising with Jasmine independently of launch timing, alongside the license-number
conflict already recorded in `placester-archive/INVENTORY.md` §4.

One page also shows template bleed: `/area/charlotte-2/` opens *"Nestled in the heart of
Charlotte, **this property** offers…"* — listing-description copy pasted into an area page.

---

## 5. Images — the second disqualifying finding

Each area has its own hero image, all uploaded in one batch in April 2026 and served from
Placester's CDN under hashed filenames. I downloaded five and looked at them.

| Page | What the image actually shows |
|---|---|
| Ballantyne | A historic square under Spanish moss, antebellum brick rowhouses — **Savannah, Georgia** |
| SouthPark | Pastel Georgian rowhouses with wrought-iron balconies — **Rainbow Row, Charleston SC** |
| Steele Creek | A Lowcountry porch, magnolia and Spanish moss — coastal, not Piedmont |
| NoDa | Beach cottages on stilts behind **palm trees** — a coastal resort town |
| Fort Mill | A white gambrel barn and silo — regionally plausible, possibly Anne Springs Close |

**Four of five are the wrong place, and three are in a different metropolitan area
entirely.** Spanish moss does not grow in Mecklenburg County and neither do palms. Ballantyne
is a 1990s master-planned suburb; NoDa is converted textile mills and murals. Any Charlotte
reader — which is to say every prospective client — can see this at a glance.

Two consequences, and the first matters more:

- **It is a credibility problem, not an aesthetic one.** The entire proposition of an area
  page is *I know this place and you don't*. Illustrating Ballantyne with Savannah refutes
  that claim in the hero image, above any sentence she wrote.
- **They cannot be migrated anyway.** They are hashed objects on Placester's CDN that die
  with the subscription, and `CLAUDE.md` §12 still lists content ownership as unconfirmed.
  Even the Fort Mill barn, the one plausible image, has no established license.

Alt text across the set is the bare area name — `alt="Steele Creek"` — which describes
neither the image nor, in four cases, anything true.

**Recommendation:** commission or license real photography, and until it exists **ship the
area pages without hero images.** The template in `app/areas/[slug]/page.tsx` uses a typographic
`PageHero` and needs no image to look finished. A page with no photograph is honest; a page
photographed in another state is not. This also keeps `CLAUDE.md` §10's performance budget
intact for free.

---

## 6. Statistics — excluded by Locked Decision #1

The stats blocks are MLS-derived, which settles it: Locked Decision #1 keeps MLS data off
this site entirely. They are also wrong. `INVENTORY.md` §3 already records Fort Mill showing
**27,485 active listings** and **3,478 homes sold in 30 days** — metro-wide figures rendered
under a town heading — while Steele Creek shows 4.

Note the trap for the replacement: those numbers are seductive because they look like the
specificity these pages need. `AREAS-SPEC.md` §3 is the standing answer — `priceContext`
describes how price *behaves*, never what it *is*, and no area-level figure appears on the
`CONTENT-MARKETING.md` §2 allowlist.

---

## 7. The migration table

| Element | Verdict |
|---|---|
| Hub-and-spoke IA | **Take**, unchanged |
| NC / SC grouping | **Take** — `sortAreas()` already does it |
| Card: name + line + CTA + image | **Take** the pattern; drop the image for now |
| "View Area" CTA consistency | **Take** |
| Topic order: geography → stock → amenities → commute | **Take as a checklist** |
| "Featured Charlotte Neighborhoods" section | **Drop** — duplicated and mislabelled |
| All 22 area paragraphs | **Drop** — 17 carry §7 language, none carries voice or a lever |
| All area hero images | **Drop** — wrong locations, unlicensed, CDN-bound |
| Stats blocks | **Drop** — Locked Decision #1, and unreliable |
| Intro paragraph | **Rewrite** — names three non-§5 markets, omits Fort Mill |
| URLs | **Keep as redirect sources** — see §9 |

---

## 8. Stepped or single-shot — the recommendation

**Split the question three ways. It has three different answers.**

### The roster decision: single shot, and it should happen first

The old site covers 22 markets, `CLAUDE.md` §5 names 14, and only 11 overlap. Nothing
downstream can be finalized until that set is settled — not the hub, not the 301 map, not
the build order. It is one decision, it needs Jasmine for perhaps twenty minutes, and it is
already open as item 3 in `INVENTORY.md` §7.

Pair it with the subdivision-mapping ask in `AREAS-SPEC.md` §11. Both are "sit down with the
ledger once" questions and the answers interlock: which markets she has actually closed in
is direct evidence for which markets deserve a page.

### The hub page: single shot, and sooner than I previously said

`AREAS-SPEC.md` §11 says an `/areas` index is "not needed yet" and to revisit at three or
more published markets. **That was wrong, and the reason is the migration.**
`INVENTORY.md` §6 already maps `/area-guide/` → `/areas`. That is an indexed URL on the
retiring site, and it needs a live destination on the day the redirects go in — regardless of
how many children exist. Redirecting it to a 404, or collapsing it onto `/`, throws away the
one piece of area-related search equity she has.

The hub is also cheap. It is a heading, a rewritten intro, and `sortAreas(publishedAreas())`
rendered as cards — the same data every other consumer already reads. It degrades gracefully:
with two children it is a short page, and it grows on its own as `data.ts` fills.

**One design note.** The hub must not list markets that have no page. Doing so recreates the
Pineville orphan in reverse — a link to nothing, or worse, a page published thin to satisfy
the link. `unwrittenMarkets()` exists in `lib/areas/index.ts` and should stay unused in the
UI for exactly this reason.

### The child pages: stepped, one at a time

Four reasons, in order of weight:

1. **§6 makes it unavoidable.** Every child needs `housingStock`, `priceContext`, `commute`,
   and `whatTrades` from her, plus levers from her transactions. A single-shot batch of
   fourteen is precisely the situation in which invented content enters — the marginal page
   is the one nobody had real material for, and it looks identical to the others.
2. **The distinctness test gets harder with volume.** `index.test.ts` fails on any field
   shared verbatim between two areas, and that is a floor, not a ceiling. Writing four pages
   in one sitting produces four paraphrases of one page; the Placester set is what that looks
   like at scale.
3. **Thin pages are net-negative.** `CONTENT-PLAN.md` and §11 both say so, and the old site
   is the proof — 22 pages, none ranking for anything, competing with each other.
4. **The template makes stepping free.** Adding a market to `data.ts` yields a route, a
   sitemap entry, a footer link, a hub card, and coverage in both audit suites, with no other
   file touched. Verified: a throwaway Steele Creek entry prerendered as `/areas/steele-creek`
   and was picked up by both suites automatically. There is no batching efficiency to capture,
   because there is no per-page engineering cost to amortize.

**Proposed order:** hub → Fort Mill → Steele Creek → re-assess. Two children is enough to
prove the pattern and to see whether the levers stay genuinely distinct across markets. If
they blur, the fix is fewer and better pages, not more.

---

## 9. What this changes in the 301 map

`INVENTORY.md` §6 stands, with the roster decision as its remaining input. Three notes:

- `/area-guide/` → `/areas` requires the hub to exist at launch. This is now the binding
  reason to build it, ahead of any content argument.
- `/area/{slug}/` → `/areas/{slug}` where retained, otherwise `/areas`. With 14 of 22
  markets retained at most, the majority of area URLs redirect to the hub — another reason it
  cannot be a stub.
- `/area/pineville/` is indexed but unlinked, so it may carry little equity. Redirect it the
  same way regardless; it costs one line.

The caveat in `INVENTORY.md` §6 still governs everything here: confirm in Search Console
whether Google indexed the `myrealestateplatform.com` URLs or a set under `jasminegarcia.com`
before writing the redirect table.

---

## 10. Raise with Jasmine

1. **The fair-housing language is live now.** 17 pages, "excellent schools" and
   "family-friendly" among them, published under NC 334700. Independent of launch timing.
2. **The area photography is of other cities.** Savannah for Ballantyne, Charleston for
   SouthPark. Worth her knowing before a client mentions it.
3. **Which markets does the new site commit to?** 22 vs 14, 11 overlapping. Blocks the 301 map.
4. **Does she own the site's content and images?** `CLAUDE.md` §12, still open, and §5 above
   makes it moot for the images but not for the blog posts or the bio.
5. **Real photography.** Already an open item; this review raises its priority, because the
   area pages are the page type where a wrong image does the most damage.
