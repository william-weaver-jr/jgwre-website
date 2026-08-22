# Fort Mill — the five questions

The draft in `lib/areas/drafts/fort-mill.ts` ships when four fields get answered. This is
the script for getting them, written because the fields do not survive being asked about
directly: "how does price behave here" gets a blank stare from anyone, including people who
know the answer cold.

**Do this as a recorded conversation, not a form.** Twenty minutes on the phone. Her spoken
answers will be closer to `BRAND-VOICE.md` than anything she writes deliberately, and the
follow-up questions are where the real material is. A form gets back four sentences of
brochure copy.

**Every example below is invented.** They show the *shape* of a usable answer. None is a
claim about Fort Mill, and none should end up on the page.

---

## Before you start: what will get cut

Say this up front so she doesn't spend breath on it.

| Cut | Why |
|---|---|
| Schools — quality, ratings, "the district is the draw" | Fair housing, familial status. `CLAUDE.md` §7. **Which** district an address falls in is fine as geography; whether it is *good* is not |
| "Safe," "quiet," "family," "great for families," "up-and-coming" | Same rule. `lib/areas/validate.ts` fails the build on most of these |
| Who lives there — any description of the people | Same rule, most directly |
| Any dollar figure, median, or percentage | No area-level price is documented. §3 of `AREAS-SPEC.md` |
| "Charming," "sought-after," "hidden gem," "nestled" | `BRAND-VOICE.md` banned list |

What is always safe: **housing stock, amenities, commute, price behaviour.** Buildings,
roads, shops, and how the market moves.

### This already happened once — say it out loud before you start

In the Steele Creek interview on 2026-08-21, asked why homes sit longer there, she answered:
**school ratings and crime.**

That is not a slip and it is not her being careless. It is very likely the correct market
read, it is what a good agent tells a client across a kitchen table, and it is the honest
answer to the question as asked. It is also the one answer that cannot go on the page in any
form, and the whole exchange was unusable — the most concrete thing she said about pricing
in that market, and none of it shipped.

**Say this to her before the recorder starts**, roughly:

> Advertising rules are stricter than conversation. Schools and crime are the two that will
> come out naturally and neither can be published, even indirectly — so when I ask why
> houses sit, I need the mechanics instead. Who the competition is, what the inventory is
> doing, where sellers misprice.

Two reasons this matters more than the rest of the list:

- **It cannot be fixed in the edit.** Quoting it breaks §7; paraphrasing it to "demand is
  weaker than the location would suggest" is the same argument wearing a coat, and the
  Steele Creek entry has a test asserting the softened proxies — `school`, `crime`, `safe`,
  `reputation`, `demographic`, `suppress` — stay out. Every one of those is a word a
  well-meaning later edit reaches for.
- **The reframe produces better copy anyway.** Pushed off that answer, she gave the builder
  setting the ceiling, the compression running through the resale around it, and the fact
  that overpricing does not get rescued here. Those are levers a reader can act on. "The
  ratings are low" is not something anyone can do anything with.

The same applies to anything about who lives somewhere, in any phrasing, however
affectionate.

---

## 1. Housing stock — "drive me through it"

**The field:** what is actually built here — eras, types, lots, construction.

**Why it is hard:** asked plainly, it invites brochure copy. We need the physical, specific,
slightly boring answer: what a building inspector would notice, not what a marketer would.

**Ask it like this:**

> If you drove me from the oldest part of Fort Mill to the newest, what changes out the
> window? Where does it change?

Then follow up:

- What went up when? Which decade dominates, and which pockets are older or newer than that?
- Single-family, townhouse, or both — and are they in the same places or different ones?
- Lot sizes. Flat or sloped. Trees or scraped.
- Slab, crawlspace, or basement? Does that vary by area?
- What do you find on inspections here that you would not find in Charlotte?

That last one is the highest-value question in the group, because it is knowledge a portal
cannot render.

> **Shape of a good answer (invented, not Fort Mill):**
> "Everything inside the old town is pre-war on small lots, and it is all crawlspace. Cross
> the highway and it is 2005-and-later, quarter-acre, slab, mostly the same four floor
> plans. The newest ring out past the bypass is townhomes on almost no lot. If it was built
> in the boom years I am looking hard at the HVAC, because they all went in the same year
> and they are all failing the same year."

---

## 2. Price context — "what makes one sit"

**The field:** how price *behaves* relative to the metro.

**Why it is hard:** everyone answers this with numbers, and numbers are the one thing that
cannot ship. There is no documented Fort Mill median in this project, and the figures on
competitor blogs are not a source. We need the mechanics instead — and the mechanics are
more useful to a reader anyway.

**Ask it like this:**

> Two near-identical houses go on the market the same week, one in Fort Mill and one in
> south Charlotte. What happens differently?

Then follow up:

- What makes a house here sit? What makes one go in a weekend?
- Does price move faster or slower here than Charlotte when the market turns?
- Is new construction setting the ceiling that resale has to price under?
- Does anything physical move the number — the highway, the water, the lot?
- Where do sellers here consistently overprice, and on what reasoning?

**Do not let her give you a number.** If one arrives, that is fine in conversation — it just
cannot go on the page. Steer back to behaviour.

> **Shape of a good answer (invented, not Fort Mill):**
> "It is slower on the way up and slower on the way down. Sellers here price off the builder
> down the road, which is the wrong comp, because the builder is including things they are
> not. Anything within five minutes of the interstate moves in a weekend; the same house
> fifteen minutes further out sits for a month, and the sellers never believe that is what
> is happening."

---

## 3. Commute — "what time do you leave"

**The field:** routes and drive times. Distances, not judgments.

**Why it is hard:** the obvious answer — "about twenty minutes to Uptown" — is an average
that is wrong half the time and is already on Google. What is worth publishing is what a
resident knows: where it breaks, when it breaks, and what transplants get wrong.

**Ask it like this:**

> What time do you have to leave Fort Mill to be Uptown for a nine o'clock? And what time is
> already too late?

Then follow up:

- Which route do you actually take, and which one do the maps tell people to take?
- Where does it break down? A bridge, a merge, a light, construction?
- Is coming home worse than going in?
- How long to the airport, really — and does that change by time of day?
- What do people relocating here believe about the drive that turns out to be wrong?

That last one is the one to dig on. It is the USP applied to a road.

> **Shape of a good answer (invented, not Fort Mill):**
> "Leave at 7:15 and you are fine. Leave at 7:40 and you are twenty minutes late, because
> everything funnels into the same two lanes at the river and there is no way around it. The
> maps send people down the main road and locals cut across on the two-lane. People moving
> here price the commute off a Sunday drive and then discover Tuesday."

---

## 4. What trades — "the last five houses"

**The field:** what changes hands, and in what condition.

**Why it is hard:** asked in the abstract it produces "houses." Anchor it to specific recent
transactions and it produces inventory character, which is what we actually want.

**Ask it like this:**

> Think of the last five Fort Mill houses you showed or listed. Who was selling, and why
> were they selling?

Then follow up:

- Builders, relocating owners, investors, iBuyers, estates — what is the mix?
- What condition do they arrive in? Move-in, dated, or renovated to sell?
- Is there a typical story? A job transfer, a first move-up, a downsize?
- What is on the market here that a buyer from Charlotte would not expect to see?
- How much is new construction versus resale?

> **Shape of a good answer (invented, not Fort Mill):**
> "Most of what I see is people who bought new eight years ago and have outgrown it, so it
> is one owner, decent condition, and dated in exactly the same way — same builder finishes,
> same year. Then there is a layer of builder inventory that nobody counts as competition
> and should. The estates are rare here because the housing is not old enough yet."

---

## 5. The lever — the one worth the whole call

**The field:** `levers`. Three are already written and sourced. This is asking for a fourth,
and it is the most valuable thing in this document.

**Why it is hard:** asked abstractly — "what is negotiable here" — it produces "everything
is negotiable," which is true and useless. It has to be anchored to a specific deal.

**Ask it like this:**

> Think of a Fort Mill deal where you got the client something they did not know to ask for.
> What was it, and why was it available?

Then, and this is the better version of the question:

> What do you always check on a Fort Mill contract that you would not bother checking on a
> Charlotte one?

Then follow up:

- What do buyers coming into Fort Mill consistently not know to ask for?
- What do sellers here give up because nobody told them they did not have to?
- Is there anything about how builders operate here specifically?
- Anything about the South Carolina side that catches North Carolina buyers out?

**The test for a real answer:** would a competent agent who works Ballantyne already know
this? If yes, it is not a lever — it is general knowledge, and it belongs on `/negotiation`
instead. A lever has to be *local*, or the page has no reason to exist.

> **Shape of a good answer (invented, not Fort Mill):**
> "Nobody asks the builder to cover the first year of HOA dues, and around here they
> almost always will at the end of a quarter, because it comes out of a different budget
> than the price does."

Notice what makes that usable: it is specific, it names when the lever exists, and it
explains *why* the other side says yes. All three are required. "You can negotiate HOA dues"
on its own is not a lever, it is a fact.

---

## After the call

1. Draft the four fields from the transcript, in her words wherever they are usable.
2. Run them past her once — not for polish, for accuracy.
3. Delete the `TODO(verify)` markers, move `FORT_MILL_DRAFT` into `AREAS` in
   `lib/areas/data.ts`. Nothing else changes.
4. `npm run verify`. `lib/areas/index.test.ts` re-checks fair housing, banned language,
   completeness, and cross-area distinctness against the real entry.
5. Read it once by eye against the cut list above. The regexes catch known phrasings, not
   novel ones.
6. If a new claim about her record appeared in the interview, it is a material change under
   §7 and goes to the BIC before it ships.

**While she is on the phone, ask the two standing questions too** — they are both "sit down
with the ledger once" items and neither needs a second call:

- Which subdivisions in the ledger fall in which market? The Steele Creek pass returned one
  match from three guesses (`AREAS-SPEC.md` §11).
- Which markets does the new site commit to? The old site covered 22, §5 names 15, and the
  answer blocks the 301 map (`AREA-GUIDE-MIGRATION.md` §8).
