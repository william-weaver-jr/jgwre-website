# Area Pages — structure, and Fort Mill as the first one

Read `CLAUDE.md` §5–§7, `BRAND-VOICE.md`, and `CONTENT-PLAN.md` first. This document does
not restate them. It says how an area page gets authored without breaking them, and works
Fort Mill end to end as the first example.

**The template is finished.** `app/areas/[slug]/page.tsx`, `lib/areas/types.ts`, and
`lib/areas/validate.ts` all shipped in `ec3a1ed`. Nothing here asks for new components. A
market added to `lib/areas/data.ts` gets a page, a sitemap entry, a footer link, and both
test suites automatically. The remaining work is entirely content.

---

## 1. Why these pages are hard, stated plainly

Every agent in Charlotte has a Fort Mill page. All of them are the same page: one paragraph
of adjectives, a median-price widget, an MLS grid. Her own Placester site did exactly this
and did it badly — `docs/placester-archive/INVENTORY.md` §3 records the Fort Mill page
showing **27,485 active listings**, a metro-wide number rendered under a town heading.

So the bar is not "publish fourteen neighborhood pages." Fourteen thin pages would be the
most damaging thing that could be added to this site: undocumented claims published under
NC 334700 and SC 125546, on the page type most prone to fair-housing trouble, competing
with her own pillar pages for the same queries.

The `levers` field is the entire reason to publish at all. Housing stock and commute are
table stakes any portal renders from a feed. *Which negotiation levers tend to exist in
this submarket* is the USP applied locally, and it is the only part a competitor cannot
copy from a data source.

**The test, per `BRAND-VOICE.md` §1:** what does the other side of *this* table know that
our reader doesn't? If the answer is the same as it would be for Ballantyne, the page is
not ready.

---

## 2. The six fields, and where each one's facts come from

`lib/areas/types.ts`. All six are required; `findIncompleteFields()` fails anything under
80 characters, and `index.test.ts` fails any field shared verbatim with another area.

| Field | What it is | Source |
|---|---|---|
| `lede` | What this market is, in a sentence or two | Jasmine |
| `housingStock` | Eras, types, lots, construction | Jasmine |
| `priceContext` | How price behaves relative to the metro | Jasmine — **see §3** |
| `commute` | Routes and drive times. Distances, not judgments | Jasmine |
| `whatTrades` | What changes hands, and in what condition | Jasmine, cross-checked against her closings |
| `levers` | 2+ levers that exist **here specifically** | Jasmine + the documented record |

Five of the six are her market knowledge. This is not something to research into existence
from listing portals, and it is not something a language model should generate — it will
produce a plausible commute time and a plausible price band fluently, and they will be
published as advertising under two licenses.

---

## 3. `priceContext` is the trap field

It is the field that most wants a number, and the one where §6 bites hardest.

`docs/CONTENT-MARKETING.md` §2 holds the complete allowlist of dollar figures and
percentages this site may state. **No area-level price appears on it.** There is no
documented median for Fort Mill, no documented price-per-foot, no documented appreciation
rate. `lib/blog/validate.ts` already fails the build on median price and days on market
for blog posts; the same discipline applies here by hand, because `priceContext` is prose.

**Write it as behaviour, not as figures.** How price moves, what it responds to, where the
spread sits relative to the metro — all sayable without a number. The moment a specific
dollar amount appears, `showsDollarFigure()` pulls `<ResultsDisclaimer />` onto the page,
which is a signal that the sentence needs sourcing rather than a disclaimer.

If a draft wants a figure nobody has verified, write `TODO(verify)` and leave it. A `TODO(`
reaching a rendered page fails `tests/compliance.test.tsx`, so it cannot ship by accident.

---

## 4. Fair housing — the specific failure mode here

`CLAUDE.md` §7 and `lib/areas/validate.ts`. Describe housing stock, amenities, commute, and
price. Never who lives somewhere.

The pattern to watch for is not slurs — nobody writes those. It is **schools**. "Fort Mill
schools" is the single most-searched attribute of this market and the most common way an
otherwise careful page ends up making a familial-status argument. `validate.ts` blocks
`good schools`, `best schools`, and `school quality|ratings|scores` by regex.

**What is sayable:** which district a given address falls in, as a fact of geography, and
that district assignment is worth confirming before writing an offer because it does not
follow the town line. **What is not sayable:** that any district is good, better, sought
after, or a reason to buy. Attainment data, rankings, and "top-rated" are all out.

The same applies to "quiet," "safe," "family," and "up-and-coming." `validate.ts` catches
the common phrasings; it cannot catch a novel one, so the rule matters more than the regex.

---

## 5. Cannibalization: `/carolinas-border` vs `/areas/fort-mill`

This is a real conflict and it needs deciding before the page ships, not after.

`/carolinas-border` already names Fort Mill in its meta description, lists it first in its
markets table, and carries the "12 closings in the Fort Mill corridor" line. If
`/areas/fort-mill` re-explains South Carolina's assessment ratio, the two pages compete for
the same queries and both rank worse — the exact failure `CLAUDE.md` §11 warns about, and
the same argument `CONTENT-MARKETING.md` §1 uses to keep neighborhood guides off the blog.

**The split:**

- **`/carolinas-border` owns the comparison.** "NC vs SC," property tax treatment, vehicle
  registration, income tax, closing process. Anyone asking *which side of the line* lands
  here.
- **`/areas/fort-mill` owns the place.** Anyone who has already chosen Fort Mill and is
  asking what to know about buying there. It **links up** to `/carolinas-border` for the tax
  mechanics and does not restate them.

One sentence of acknowledgement plus a link is correct. A second explanation of the
assessment ratio is not.

---

## 6. Fort Mill — what is already documented

Everything below is sourced in this repo today. It is the floor the page is built on.

**From `CLAUDE.md` §5:** 12 closings in the Fort Mill corridor. Licensed in both states,
NC 334700 · SC 125546. Fort Mill is named as a pillar-3 market.

**From `app/carolinas-border/page.tsx`:** Fort Mill is in **York County**, South Carolina.

**From `lib/reviews/data.ts` — four Fort Mill reviews, verbatim and unedited:**

| Review | Year | Side | What it evidences |
|---|---|---|---|
| Townhouse buyer, relocated from out of state | 2024 | bought | First-time buyer, **an Opendoor-owned property**, "saving me thousands of dollars." `statesDollarOutcome: true` |
| Single-family buyer | 2024 | bought | Relocated to SC; **"worked with the builders to get the appliances and blinds included in the selling price"** |
| Single-family seller | 2026 | sold | Multiple offers in 48 hours; **"truly understands South Carolina real estate contracts, buyer protections, seller implications"**; chose "the offer with the most favorable terms" |
| Repeat client, bought and sold | 2026 | both | Second purchase with her, first sale. Four years after her 2022 transaction |

Four reviews from one submarket is the most of any market outside Charlotte proper. That is
why Fort Mill is the right first page — it is the market where the documented record is
thickest, so the least has to be asked of her memory.

**Note the review-linking discipline** from `lib/transactions/data.ts`: a review describing
a closing is evidence that it happened, not a record of its details. These support the
*levers*; they do not license a `whatTrades` claim about the market as a whole.

---

## 7. Fort Mill — proposed `levers`, drafted

The levers are where I can contribute most, because each is grounded in the documented
record above rather than in market data nobody has. **Voice and structure are proposed;
Jasmine confirms or corrects the substance.**

### Lever 1 — The seller may not be a person

> **Title:** The seller across the table may not be a person
>
> Fort Mill has enough recent inventory that some of what is for sale is held by a company
> rather than a household — an iBuyer that bought from the last owner, or a builder still
> holding finished product. That changes the negotiation completely. A company has no
> attachment to the house and no feelings about your offer, but it also has a pricing model
> it will not argue with and an internal process that says which concessions are pre-approved
> and which need a person's signature. Price is usually the hardest thing to move. Cost items
> are usually the easiest. Knowing which is which before you write is the whole game.

*Grounded in:* the 2024 townhouse purchase from an Opendoor-owned property. This is the
strongest lever on the page — it is specific, it is genuinely non-obvious to a buyer, and
no templated neighborhood page contains it.

### Lever 2 — Builder incentives are not on the price sheet

> **Title:** What the builder will include instead of discounting
>
> A builder will resist cutting the base price, because the price sheet is what the next
> buyer sees and the appraisals that follow are built on it. What a builder will often do is
> add. Appliances, window treatments, a lender credit, an upgrade allowance, a closing date
> that suits you. None of it is volunteered, because the on-site agent works for the builder
> and answers the questions you ask rather than the ones you don't. Asking the right ones is
> not a talent. It is a list, and I have it.

*Grounded in:* the 2024 Fort Mill new-construction purchase where the builder included
appliances and blinds, plus the documented 17 new-construction closings (§5).

### Lever 3 — South Carolina's contract is not North Carolina's

> **Title:** The contract changes at the state line
>
> Most people shopping Fort Mill are also shopping Ballantyne or Waxhaw, and the paperwork
> is not the same on both sides. The forms differ, the due-diligence structure differs, and
> what a given deadline obligates you to do differs. That is leverage in both directions: a
> buyer who does not know the timeline gives away optionality, and a seller who does not
> know it takes a worse offer because it looked cleaner. What the state line does to your
> monthly payment is a separate question, and it is on [the border page](/carolinas-border).

*Grounded in:* the 2026 seller review naming SC contracts specifically, and dual licensure.
Note the deliberate hand-off in the last sentence — this is §5's split, enforced in copy.

**A fourth candidate, pending her input:** whether resale competes with new construction in
the same price band here, and what that does to a resale seller's position. If it is true
it is a strong lever. It is currently a guess, so it is not drafted.

---

## 8. The prose fields — what to ask Jasmine

These cannot be drafted from the repo. Recommend recording her answers rather than emailing
questions; the transcript will be closer to her voice than anything she writes deliberately.

**`housingStock`** — What is actually built in Fort Mill, and when? Which eras and which
types, roughly where? Where does the older stock sit versus the newer subdivisions? Anything
structural a buyer should expect from the dominant construction here?

**`priceContext`** — How does price *behave* here compared with south Charlotte? Does it move
faster or slower? What does it respond to? **No figures** — how it moves, not what it is.

**`commute`** — Which routes, and to where? I-77 and what else? What does the drive to Uptown
actually take, off-peak and on? What breaks it? What do relocating buyers consistently get
wrong about it before they arrive?

**`whatTrades`** — Of her 12 corridor closings, what kind of property were they, and in what
condition? What comes to market here and what does it look like when it does?

**`lede`** — Likely written last, from the four above. One or two sentences, second person,
no adjectives doing a number's job.

**On the levers:** are the three in §7 right? Which is most common in her actual experience?
Is there a fourth she would name that nobody outside the business would think of? That last
question is the valuable one.

---

## 9. Publishing checklist

1. Author the entry in `lib/areas/data.ts`. Nothing else needs editing — the router,
   sitemap, footer, and both test suites read from `publishedAreas()`.
2. `npm run verify`. `lib/areas/index.test.ts` checks fair housing, banned language,
   completeness, and cross-area distinctness over the real data.
3. Re-read against §4 of this document by eye. The regexes catch known phrasings, not
   novel ones.
4. **Confirm no new claim needs the BIC.** A new statistic or a new claim about her record
   is a material change under §7 and goes back before it ships. Restating documented §5
   figures does not.
5. Check `generateMetadata` output: it uses `lede` as the meta description, so a lede over
   ~160 characters gets truncated in results. Write the lede knowing it does double duty.

---

## 10. Steele Creek — she lives there

**Reported by Bill, 2026-08-19: Jasmine owns and has lived in Ayrsley, within Steele Creek,
since June 2021.** Now recorded in `BRAND-VOICE.md` §4, so §6 permits its use.

### What is documented

**One closing, confirmed.** The ledger stores subdivisions rather than towns, so I asked
which of them sit in Steele Creek. Bill confirmed 2026-08-19: **`Shopton Point` is the only
one.** `Moores Chapel Village` and `Brownes Ferry`, which I had also guessed at, do not.

That single row is a good one:

> `2023-shopton-point-01` — May 2023, buyer side, Single Family, **Meritage Homes**,
> new construction. Lever recorded as **"Builder concessions at closing."**
> Linked review: `google-charay-bland`, five stars, verified 2026-08-19.

So Steele Creek is not evidence-free after all. It has a documented new-construction
closing with a named national builder, a recorded lever, and a verified review attached —
which is more than enough to author one honest lever from.

**Ayrsley itself,** from `ayrsley.com` and `ayrsleycinemas.com`: a mixed-use development in
southwest Charlotte off I-485 and South Tryon. Five apartment and townhome communities, plus
restaurants, offices, four hotels, and **Ayrsley Grand Cinemas 14** at 9110 Kings Parade
Blvd. Walkable, and close to Charlotte Douglas.

Amenities are explicitly sayable under §7 — "housing stock, amenities, commute, and price"
is the permitted list. A cinema, a bowling venue, and restaurants inside walking distance
are concrete facts about the built environment, not claims about who lives there. This is
the rare area page that can be specific about amenities without going anywhere near the line.

### Why this changes the ordering

Residency outranks the thin transaction record. Five years of living somewhere is
first-person knowledge of
exactly the four fields §8 has to ask other people for. She does not need to research the
commute; she drives it. She does not need to characterise the housing stock; she chose from
it. This is the one market on the roster where the prose fields are a short conversation
rather than a data pull, and where the result cannot be reproduced by a competitor with a
feed — which is the entire test in §1.

**So Steele Creek is a strong second page, and arguably a faster one than Fort Mill.** Fort
Mill has the thicker evidence; Steele Creek has the better-informed author. Ship whichever
one gets its interview done first.

### The levers

Residency answers `housingStock`, `priceContext`, `commute`, and `whatTrades`. It does not
by itself answer `levers`, which is the field that justifies publishing. Living in a market
tells you what it is like; it does not tell you what tends to be askable when a house there
changes hands. That comes from her transactions — and here there is one.

Two are drafted: one from the Shopton Point closing, one from geography. A third should come
from her, and the ask is at the end.

### Lever 1 — Builder concessions, and why they are not a discount

> **Title:** What a builder gives instead of cutting the price
>
> A national builder will hold the base price and give somewhere else, because the price
> sheet sets the comps for every house it sells after yours. What it will move on is the
> cost of closing — a credit, a rate buy-down through its own lender, an allowance, a
> finished item that would otherwise be an upgrade line. The on-site agent works for the
> builder and answers the questions you ask. Which ones are worth asking depends on where
> the community is in its build-out, and that is not something you can see from the parking
> lot.

*Grounded in:* `2023-shopton-point-01` — a Meritage Homes purchase in Steele Creek whose
recorded lever is, precisely, "Builder concessions at closing."

Note the overlap with Fort Mill's Lever 2 — both are builder-incentive levers, and
`index.test.ts` fails on any lever body shared verbatim between two areas. They are written
differently on purpose, and the distinction is real: **Fort Mill's is about what a builder
will *include*; this one is about what a builder will *pay*.** If that distinction feels
strained when she reads it, cut one rather than shipping two paraphrases.

### Lever 2 — The airport is on the map, and it is not priced consistently

> **Title:** The airport is on the map, and it is not priced the same way twice
>
> Charlotte Douglas sits next to this part of the county, and how much of it a given street
> actually notices varies more than people expect — by distance, by which way the runways
> are being used, by time of day. Buyers relocating from out of state price it as a single
> yes-or-no fact about the whole area. It isn't one. That gap between how a house is priced
> and what it is actually like to stand in the backyard on a Tuesday afternoon is leverage,
> in both directions. Go stand in it before you write an offer. I can tell you when to go.

*Grounded in:* geography, plus her residency. **Pending her confirmation** — the degree of
effect is her knowledge, not mine, and if she thinks the framing overstates it, it dies.

Note what it deliberately does not do: it says nothing about who lives there, and it makes
no quality judgment about any street. It describes an aircraft, a runway, and a backyard.
That is the §4 line held under pressure on the one topic where this market invites crossing
it.

**Ask her for a third,** in the §8 form that produced the useful answers: *what do buyers
coming into Steele Creek consistently not know to ask for, that you know because you live
here?* That question is worth more than the rest of the interview.

### How specific the residency claim gets — the call

Bill asked for a judgment here, given that Ayrsley contains **five separate HOAs**. Taking it.

**Name Ayrsley. Do not name her HOA, and keep the unit count away from the residency line.**

The five-HOA structure does most of the work. My original concern assumed naming the
community was equivalent to naming her block; it isn't. "Lives in Ayrsley" plus "presided
over a 105-unit townhome community" resolves, at worst, to roughly one household in a
hundred inside one of five sub-communities — and only for a reader who thinks to combine two
facts from two different pages. That is the same exposure as any agent who says which
neighbourhood they live in, which is most of them.

What tips it from acceptable to worth having is that the claim is load-bearing. "I live
here" is the reason to believe everything else on the page, and hedging it to "southwest
Charlotte" would cost the page its only real advantage while buying almost no privacy.

Three limits, and they are cheap:

1. **Never name which of the five** she presided over. That is the fact that converts a
   hundred households into one, and it has no copy value at all — "HOA board president"
   carries the whole point without it.
2. **Keep "105-unit" off any page that also states residency.** It is a precision multiplier
   and it earns nothing. `BRAND-VOICE.md` §4 already confines the presidency to `/about`;
   that separation is now doing real work, so leave it in place.
3. **Her home is not a case study.** No page describes a transaction, a renovation, or a
   valuation involving her own address.

Still not a §7 matter — no advertising rule is in play — and still Jasmine's to overrule in
either direction. But a recommendation was asked for rather than a menu, and this is it.
Recorded in `BRAND-VOICE.md` §4 so it survives this conversation.

---

## 11. After the first two

**Order by what she can honestly author, not by search volume.** Two things qualify a
market: a thick documented record, or her own residency. Fort Mill has the first, Steele
Creek has both a documented closing and the second. After those, the border corridor, then
the Charlotte submarkets where `lib/reviews/data.ts` shows real activity.

**The subdivision question, asked once — answered 2026-08-31.** This section originally
asked for exactly what §12 below now provides: the full ledger, mapped in one sitting, so
the running order stops being guessed at row by row. The closed-transactions workbook grew
its own Neighborhood and Geographical Submarket columns, and cross-referencing all 44 rows
against the §5 roster surfaced the answer for the whole roster at once rather than one
market at a time.

**Ship them one at a time.** A market with nothing real to say stays absent from `data.ts`
and its URL 404s, which is the specified behaviour.

**An `/areas` index page is needed at launch — this reverses an earlier call here.** The
original reasoning was that an index over one entry is itself a thin page, and to revisit at
three or more. That missed the migration: `placester-archive/INVENTORY.md` §6 maps the
retiring site's `/area-guide/` to `/areas`, so the hub needs a live destination on the day
the redirects go in, whatever the child count. With at most 14 of 22 old markets retained,
most `/area/{slug}/` URLs also land there. See `docs/AREA-GUIDE-MIGRATION.md` §8.

The hub must list only markets that have pages. `unwrittenMarkets()` stays out of the UI —
a card linking to a 404, or a page rushed thin to satisfy a card, is the failure this whole
document exists to prevent.

---

## 12. The build order, from the ledger — a snapshot, not a ruling

Every one of the 44 ledger rows, matched against its workbook Neighborhood or Geographical
Submarket value where that value names a §5 market exactly. `market` set on the row wherever
it does; CLAUDE.md §5 and `lib/areas/markets.ts` record the two new markets this surfaced.
Full method and the individual row-by-row reasoning is in the chat history of 2026-08-31 —
this table is the conclusion, not the derivation.

| Rank | Market | Rows | Why it's there |
|---|---|---|---|
| 1 | **East Charlotte** | 7 | Shannon Park ×2, Windsor Park, Turtle Rock, Fieldlark Trails, Easthaven ×2 |
| 2 | **Northwest Charlotte** | 4 | Trinity Park, Moores Chapel Village, Aveline at Coulwood ×2 |
| 3 | Fort Mill | 2 | English Trails, Masons Bend |
| 3 | Rock Hill | 2 | Lexington Commons, Midbrook |
| 3 | **Steele Creek** | 2 | Shopton Point, Waterlyn — **plus residency (§10), which outranks the count** |
| 6 | SouthPark | 1 | Piedmont Row / Foreman |
| 6 | Dilworth | 1 | 1315 East Condominium / Bernhardt |
| 6 | Pineville | 1 | Preston Park |
| 6 | LoSo | 1 | LoSo Terraces / LoSo Townhomes |
| 6 | Lake Wylie | 1 | Patriots Crossing |
| 6 | Indian Land | 1 | Walnut Creek — her own review says "Lancaster / Indian Land" |
| 6 | Ballantyne | 1 | Belle Vista / "Ballantyne West" |
| — | Myers Park, South End, Uptown, Tega Cay, Waxhaw | 0 | No closing in 44 rows names any of them |

**Steele Creek stays second regardless of the tie at rank 3.** §10's residency argument is
categorical, not additive — she does not need to research the commute, she drives it — and
that outranks a raw count the same way it outranked Fort Mill's thicker record when this
document first proposed the order.

**This will change, and is meant to.** The workbook is a slice of her 73+ career
transactions, not the whole of it — Bill's own note when confirming the two new markets was
that more transactions still need to be added to close that gap. Re-run this tally whenever
the workbook grows materially rather than trusting this table past its date. The zero-row
markets in particular are a snapshot of the workbook's current coverage, not a verdict on
whether she has ever worked there.

**Proposed order, superseding §11's "hub → Fort Mill → Steele Creek":** hub → East
Charlotte → Northwest Charlotte → Fort Mill → Steele Creek → re-assess. The zero-evidence
five wait on either new closings or a residency-style case, whichever comes first.

---

## 13. Phase 2 — a submarket layer above `/areas/[slug]` (not scoped, not scheduled)

Recorded 2026-08-31 so the assessment survives past the conversation that produced it. Bill's
call: **hold this. Revisit once several `/areas` pages are live**, not before.

**The opportunity.** The workbook's hierarchy is three levels — Subdivision → Neighborhood →
Geographical Submarket — and the site has one: `/areas/[slug]`, flat, matched 1:1 to the §5
roster. The Submarket tier (East Charlotte, Northwest Charlotte, Gaston County / Greater
Charlotte Area, and others §12 didn't promote) sits one level above the individual area
pages and would target broader, earlier-funnel queries — "homes for sale east charlotte" —
that nothing on the site currently owns. Roughly half the ledger's 44 rows sit in submarket
clusters with no page at all once East Charlotte and Northwest Charlotte are accounted for:
Gaston County (Dallas ×2, Mount Holly), Cabarrus County / Concord (×2), North Charlotte /
University Area (Brownes Ferry, Katelyn Moors), plus single closings in Huntersville and
Mint Hill.

**The cost.** A hub page above `/areas/[slug]` is a second cannibalization problem of exactly
the kind `CONTENT-PLAN.md` §5 already solved once for `/carolinas-border` vs.
`/areas/fort-mill` — every submarket hub would need the same split worked out against its
own children, and against whichever pillar page already touches that geography. It is also
another content-discipline surface: a hub page makes claims about a broader area than any
single closing supports, which is exactly the "plausible aggregate statistic" failure mode
`AREA-GUIDE-MIGRATION.md` documents in the site this one replaces.

**Why later, not now.** Two live area pages is not enough children for a hub to organize, and
building the layer before the roster has real content inverts §8's stepped-build reasoning:
the child pages are the expensive, evidence-gated part; the hub is cheap and can be added
whenever the children exist. There is no efficiency captured by front-loading it.

**What would trigger revisiting it:** several `/areas/[slug]` pages live and ranking, and a
clear answer on whether the off-roster clusters above (Gaston County, Cabarrus County, North
Charlotte / University Area) get promoted into the §5 roster the way East Charlotte and
Northwest Charlotte just were. If they do, the case for a hub layer gets stronger with each
addition; if the roster stays as it is, a flat `/areas` index may simply be enough.
