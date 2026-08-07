# Lovable Brief — jasminegarcia.com visual system

**Scope: brand and visual system only.** This session answers one question — what does
Jasmine's brand *look* like — and produces a single home page that proves it. Everything
else (the other 12+ pages, lead forms, Follow Up Boss wiring, CMS) is built in Claude
Code afterward against the design tokens this session settles.

**Positioning is not up for discussion here.** The USP is locked in `CLAUDE.md` §2 and
the homepage copy is specified in `CONTENT-PLAN.md`. Lovable is deciding color, type,
spacing, and layout — nothing else. Do not let it redesign the message.

Read before running: `CLAUDE.md` §2 (USP), `BRAND-VOICE.md`, `CASE-STUDIES.md`.

---

## Constraints that shape this plan

- **Free plan: 5 build credits/day, 30/month.** Confirmed against the "Bill's Lovable"
  workspace, 2026-08-07.
- **Rough costs:** full landing page with images ≈ 1.7 credits; simple style change ≈ 0.5;
  Plan-mode message = 1.
- **Lovable cannot export into an existing GitHub repo** — it always creates a new private
  one. Its output gets pulled into `william-weaver-jr/jgwre-website` from there.
- **Keep the Lovable project private.** The prompt contains real client transaction
  figures. Permission was obtained for their use on her site, not for a public sandbox.

### Credit discipline — the rules that make 30/month work

1. **Batch feedback.** Collect Jasmine's reactions into *one* prompt per round. "Warm the
   palette, drop the hero font size, tighten the header" is one credit. Sent separately,
   three.
2. **Decide away from the keyboard.** Discussion costs credits in Lovable and nothing at
   the kitchen table. Argue first, prompt second.
3. **Never spend credits on copy or content.** Both are already written. If Lovable
   rewrites the hero, correct it once and move on — don't iterate on words.
4. **Stop when the system is legible.** The deliverable is a set of decisions — colors,
   type, spacing, tone — not a finished website.

---

## Session plan (~4 days, ~5 credits each, ~10 in reserve)

**Day 1 — generate.** Run the prompt below. Expect the structure to be right and the
aesthetics to be a first guess. *Budget: ~2 generation, ~3 obvious fixes.*

**Day 2 — palette and typography.** One batched prompt per round, three or four rounds.
The day that matters most; protect its credits. *Budget: ~5.*

**Day 3 — the case-study block and the footer.** The two hard design problems (below).
Plus mobile layout and spacing rhythm. *Budget: ~5.*

**Day 4 — polish and export.** Final batched pass, then push to GitHub. *Budget: ~3–5.*

After each day, log decisions to `docs/brand-decisions.md` — hex values, font names and
weights, spacing scale. That file is what gets translated into `tailwind.config.ts`.
**The decisions are the deliverable; the Lovable project is scaffolding.**

---

## The two hard design problems

Name these explicitly during iteration — they're the reason this session needs a
designer's judgment rather than a template.

**1. Making documented dollar figures look credible, not infomercial.** The homepage
shows three real transaction outcomes with a legally-required disclaimer beside them.
The instinct — big animated counters, gradient badges — actively destroys the
credibility the numbers exist to build. `CASE-STUDIES.md` bans that treatment. The
numbers should read like evidence: plain, confident, unamplified.

**2. Making the compliance footer look intentional.** Brokerage name, street address,
two license numbers, the Equal Housing logo, the REALTOR® mark, a privacy link. It
appears on every page and most agent sites make it look like a legal afterthought
stapled to the bottom. It should look designed.

---

## Day 1 prompt

> Build a single home page for **Jasmine Garcia**, a Broker/REALTOR® with **Stone Realty
> Group** in Charlotte, NC, licensed in both North Carolina and South Carolina. This is a
> personal-brand and lead-generation page — not a property search portal.
>
> Target stack (this will be exported and maintained by developers): **Next.js App
> Router, TypeScript, Tailwind CSS, shadcn/ui.** Put every color, font, and spacing value
> in **Tailwind theme tokens** — no hardcoded hex in components, no inline styles. Name
> tokens semantically (`primary`, `accent`, `surface`, `ink`), never by color.
>
> ### What I need most
>
> This is a **brand exploration**. She has no existing palette, typography, or logo — the
> point of this page is to discover them. Propose a confident, specific visual direction;
> I would rather react to a strong opinion than a safe one.
>
> At the bottom of the page, include a **style tile** section showing palette swatches
> with hex values, the type scale with font names and weights, and button states — so the
> system is readable at a glance.
>
> **The copy below is final.** Use it as given. Do not rewrite, expand, or "improve" the
> headline — it is the client's own language and it is locked.
>
> ### Brand direction
>
> - Must be **visually distinct from her brokerage**, which is black with a hexagon motif.
>   **No black-dominant palettes, no hexagons.** Do not use or restyle any Stone Realty
>   Group logo or mark.
> - Tone: warm, competent, direct. Approachable expert, not luxury-aloof. Avoid both
>   generic corporate real estate and the gold-serif "luxury agent" cliché.
> - Use clearly-labeled **placeholder blocks** for photography — none has been shot yet.
>
> ### Hero
>
> Headline, verbatim:
>
> > Most people think negotiating is just about getting the price down.
> > It's not.
>
> Subhead conveys: sometimes the biggest savings come from things buyers don't even know
> to ask for.
>
> Primary CTA: the phone number, **(704) 200-9360**, as a tappable `tel:` link — prominent
> in the header and the hero. Secondary CTA: a button reading "The 19 Things Besides Price
> You Can Negotiate" linking to `/negotiation`.
>
> ### Section 2 — three case studies (the most important block on the page)
>
> Three real, documented transaction outcomes. Present them as **three different shapes of
> win**, not three trophies — the argument is that every negotiation is different, so each
> card should feel distinct rather than three identical stat cards.
>
> Order matters. Lead with the second one below; it is the most surprising, not the biggest.
>
> 1. **No money off the price — all of it in condition.** Negotiated a brand new roof, HVAC
>    servicing, a home warranty, and the refrigerator included.
> 2. **Price, cash, and position in one contract.** $20,000 below list · $22,210 in
>    seller-paid concessions · $34,000 in immediate equity at closing.
> 3. **New construction — the builder's own money.** $50,000 in builder incentives · 3%
>    closing costs paid · refrigerator included.
>
> **Do not alter these figures in any way** — no rounding, no restating, no "over $20K."
> $22,210 stays $22,210.
>
> **Presentation rules — these are firm.** Keep it plain. **No animated or counting
> numbers, no oversized gradient stat badges, no confetti.** These figures are evidence and
> should look like evidence; amplification undercuts them. Restraint here is the design
> challenge — make plain numbers feel substantial.
>
> Directly adjacent to this block — visible, same visual weight as body text, **not** in
> the footer and **not** in small gray type — place this disclaimer verbatim:
>
> > Results vary by property, seller, and market conditions. Past transaction outcomes are
> > not a prediction or guarantee of results in any future transaction.
>
> ### Section 3 — four specialty cards
>
> 1. **New construction** — the builder's sales office negotiates daily; the buyer never has.
> 2. **Sellers** — the buyer's agent works for the buyer. So does the inspector.
> 3. **Relocation** — everyone in the transaction is local except you.
> 4. **The NC/SC border** — two states, two tax regimes, two rulebooks.
>
> ### Remaining sections
>
> Short trust strip (98.84% list-to-sale ratio · 73+ transactions · 105 five-star reviews) →
> two testimonial placeholders → contact block with the phone number.
>
> Do **not** put a stat wall above the fold. Do not add an "about" or biography section —
> that copy is still being finalized.
>
> ### Copy rules
>
> Voice: short declarative sentences, fragments fine, numbers over adjectives, second
> person. No exclamation points. No rhetorical-question headers ("Ready to find your dream
> home?").
>
> Banned: `nestled` · `boasts` · `dream home` · `passionate about helping` · `your trusted
> Charlotte REALTOR®` · `unparalleled` · `luxury lifestyle` · `hidden gem` · `whether you're
> buying or selling`.
>
> Never frame outcomes as what she *will* do — only what happened. Banned: "I'll get you,"
> "I always," "guaranteed," "every client saves." **Do not invent any statistic, award,
> credential, or testimonial.** For testimonials use the literal placeholder
> `[REAL CLIENT REVIEW — DO NOT FABRICATE]`.
>
> ### Footer — required, and a real design problem
>
> Appears on every page. Make it look intentional rather than bolted on:
>
> - **Stone Realty Group**, 2459 Wilkinson Blvd, Suite 310, Charlotte, NC 28208
> - License numbers: **NC 334700 · SC 125546**
> - **Equal Housing Opportunity logo** and the REALTOR® mark — correct ® symbols and
>   capitalization throughout
> - A Privacy Policy link
>
> ### Hard constraints
>
> - **No lead-capture form or booking widget on this page** — those are wired separately.
> - **No MLS/IDX content of any kind** — no listing cards, no property search, no
>   home-value estimator. "Search Homes" in the nav links out externally; that's all.
> - Nothing may imply she is an independent brokerage. This is her personal brand *within*
>   Stone Realty Group.
> - **Fair housing:** never characterize the people of a neighborhood. No "safe
>   neighborhood," "good schools for families like yours," "up-and-coming area." Describe
>   housing stock, amenities, commute, and price instead.
> - **Accessibility, WCAG 2.1 AA:** 4.5:1 minimum text contrast, visible focus states,
>   semantic HTML, one `<h1>`, logical heading order, alt text on every image.

---

## Bring visual references to the session

Lovable can't browse Instagram, so screenshot a dozen posts and attach them as style
references:

- **[@myrealtorjasmine](https://www.instagram.com/myrealtorjasmine)** — how she already
  presents professionally
- **[@iheartjasz](https://www.instagram.com/iheartjasz)** — her actual taste and personality

The gap between those accounts is the design target: **the brand should feel like the
person in the personal account doing the job shown in the business account.** Most agent
sites read like the business account alone, which is why they all look the same.

Also useful for voice and on-camera presence: her
[Zillow profile](https://www.zillow.com/profile/myrealtorjasmine) and the
[bio video](https://youtu.be/J6T4pmDWQ6M), "Meet Jasmine Garcia – Stone Realty Group."

---

## After export (Claude Code side)

- Pull the generated repo's code into `william-weaver-jr/jgwre-website`; Lovable's repo is
  a source, not the home.
- Lift the palette, type scale, and spacing into `tailwind.config.ts` tokens; record the
  brand decisions in `CLAUDE.md` §12.
- Audit against `CASE-STUDIES.md`: figures unaltered, disclaimer present and adjacent,
  no animated counters, no aggregated or predictive framing.
- Audit the footer compliance block, REALTOR®/EHO marks, and fair-housing language —
  treat any drift as build-breaking.
- (704) 200-9360 is the confirmed Follow Up Boss tracking number; no swap needed.
- Then build per `CONTENT-PLAN.md` build order — `/` and `/negotiation` with the lead
  magnet and FUB wiring first; that's the revenue path.
