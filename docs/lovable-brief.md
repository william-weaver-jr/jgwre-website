# Lovable Brief — jasminegarcia.com visual system

**Scope: brand and visual system only.** This session exists to answer one question —
what does Jasmine's brand look and sound like — and to produce a single home page that
proves it. Everything else (the other 12+ pages, lead forms, Follow Up Boss wiring,
CMS) gets built in Claude Code afterward, against the design tokens this session
settles.

Do not ask Lovable to build the rest of the site. It costs credits we don't have and
produces code that will be rewritten anyway.

---

## Constraints that shape this plan

- **Free plan: 5 build credits/day, 30/month.** Confirmed against the "Bill's Lovable"
  workspace on 2026-08-07.
- **Rough credit costs:** a full landing page with images ≈ 1.7 credits; a simple style
  change ≈ 0.5; a message in Plan mode = 1.
- **Lovable cannot export into an existing GitHub repo** — it always creates a new
  private one. So the export will land in a fresh repo, and the code gets pulled into
  `william-weaver-jr/jgwre-website` from there. Don't try to point it at our repo.

### Credit discipline — the rules that make 30/month work

1. **Batch feedback.** Jasmine's reactions get collected into *one* prompt per round,
   not six small ones. "Warm the palette, drop the hero font size, tighten the header
   spacing" is one credit. Sent separately it's three.
2. **Decide away from the keyboard.** Discussion costs credits in Lovable and nothing
   at the kitchen table. Argue about the palette first, prompt second.
3. **Never spend credits on content.** Copy, page structure, and the remaining pages
   are Claude Code's job. Lovable only decides *look*.
4. **Stop when the system is legible.** The deliverable is a set of decisions — colors,
   type, spacing, tone — not a finished website.

---

## Session plan (~4 days, ~5 credits each, ~10 in reserve)

**Day 1 — generate and choose the USP.** Run the Day 1 prompt below. It produces the
home page with three alternate heroes. Jasmine picks the angle that sounds like her.
*Budget: ~2 for generation, ~3 for immediate obvious fixes.*

**Day 2 — palette and typography.** One batched prompt per round, three or four rounds.
This is the day that matters most; protect its credits. *Budget: ~5.*

**Day 3 — refinement.** Header/footer treatment, mobile layout, spacing rhythm,
photography placeholders. *Budget: ~5.*

**Day 4 — polish and export.** Final batched pass, then push to GitHub. *Budget: ~3–5.*

After each day, write the decisions into `docs/brand-decisions.md` in this repo — hex
values, font names and weights, spacing scale. That file is what I translate into
`tailwind.config.ts`. **The decisions are the deliverable; the Lovable project is
scaffolding.**

---

## Day 1 prompt

> Build a single home page for **Jasmine Garcia**, a Broker/REALTOR® with **Stone
> Realty Group** in Charlotte, NC, licensed in both North Carolina and South Carolina.
> This is a personal-brand and lead-generation page — not a property search portal.
>
> Target stack (this will be exported and maintained by developers): **Next.js App
> Router, TypeScript, Tailwind CSS, shadcn/ui.** Put every color, font, and spacing
> value in **Tailwind theme tokens** — no hardcoded hex values in components, no inline
> styles. Name the tokens semantically (`primary`, `accent`, `surface`, `ink`), not by
> color.
>
> ### What I need most
>
> This is a **brand exploration**. She has no existing palette, typography, or logo, and
> the point of this page is to discover them. Propose a confident, specific visual
> direction — I would rather react to a strong opinion than a safe one. Include a small
> **style tile** section at the bottom of the page showing the palette swatches with
> their hex values, the type scale with font names, and the button states, so the
> system is readable at a glance.
>
> ### Brand direction
>
> - Must be **visually distinct from her brokerage**, which is black with a hexagon
>   motif. **No black-dominant palettes, no hexagons.** Do not use or restyle any Stone
>   Realty Group logo or mark.
> - Tone: warm, competent, direct. She spent a decade as a **special-education teacher**
>   before real estate — an approachable expert, not a luxury-aloof one. She is also a
>   mother of twins and an HOA board president.
> - Avoid both generic corporate real estate and the gold-serif "luxury agent" cliché.
> - Use clearly-labeled **placeholder blocks** for her photography — none has been shot yet.
>
> ### Hero — three variants, please
>
> The hero must lead with **one specific claim only she can make**, not a services list
> or a generic welcome. Build the page with the first hero, then provide the other two
> as alternates I can swap in:
>
> 1. **"Builders negotiate every day. You'll do it once."** — she has represented buyers
>    at the builder's table 17 times, with Pulte, Lennar, DR Horton, David Weekley, and
>    Meritage.
> 2. **"One broker. Both Carolinas."** — licensed in NC and SC, for buyers who haven't
>    yet decided which side of the state line they're moving to. Fort Mill, Tega Cay,
>    Indian Land, Lake Wylie, Waxhaw.
> 3. **"I taught special ed for a decade. Explaining hard things is the job."** — the
>    teaching background as the trust signal, aimed at first-time and relocating buyers.
>
> ### Page sections
>
> Hero (with the phone CTA) → the three specialty pillars as cards (new construction,
> relocation, the NC/SC border) → a short proof strip → an about teaser → a reviews
> placeholder → footer. Keep it to one screen of scroll per section.
>
> ### Copy — use these facts and nothing else
>
> Never write generic agent copy; "your trusted Charlotte REALTOR®" and anything like it
> is banned. Use only these:
>
> - 17 new-construction closings (Pulte, Lennar, DR Horton, David Weekley, Meritage)
> - 18 relocation transactions with out-of-state buyers
> - Licensed in NC and SC; 12 closings in the Fort Mill corridor
> - A decade teaching special education before real estate
> - Sparingly: 73+ career transactions, $30.9M career volume, 98.84% list-to-sale ratio,
>   105 five-star reviews
>
> Voice: short sentences, numbers over adjectives. Banned words: "nestled," "boasts,"
> "dream home," "passionate about helping." **Do not invent any statistic, award,
> credential, or testimonial.** Where a client review would go, use the literal
> placeholder `[REAL CLIENT REVIEW — DO NOT FABRICATE]`.
>
> ### Calls to action
>
> **Phone-first.** The primary CTA everywhere is calling **(704) 200-9360** — make it a
> tappable `tel:` link, prominent in the header and in the hero. Secondary CTA is a
> button linking to `/contact`. **Do not build any lead-capture form or booking widget
> on this page** — those are wired later.
>
> ### Footer — required, and a real design problem
>
> Every page carries a legally-required block. Make it look intentional rather than
> bolted on:
>
> - **Stone Realty Group**, 2459 Wilkinson Blvd, Suite 310, Charlotte, NC 28208
> - License numbers: **NC 334700 · SC 125546**
> - **Equal Housing Opportunity logo** and the REALTOR® mark, correct ® symbols and
>   capitalization throughout
> - A Privacy Policy link
>
> ### Hard constraints
>
> - **No MLS/IDX content of any kind** — no listing cards, no property search, no
>   home-value estimator. A "Search Homes" nav item links out externally; that's all.
> - Nothing may imply she is an independent brokerage. This is her personal brand
>   *within* Stone Realty Group.
> - **Fair housing:** never characterize the people of a neighborhood. No "safe
>   neighborhood," "good schools for families like yours," "up-and-coming area."
>   Describe housing stock, amenities, commute, and price instead.
> - **Accessibility, WCAG 2.1 AA:** 4.5:1 minimum text contrast, visible focus states,
>   semantic HTML, one `<h1>`, logical heading order, alt text on every image.

---

## Bring visual references to the session

Lovable can't browse Instagram, so screenshot a dozen posts and attach them as style
references:

- **[@myrealtorjasmine](https://www.instagram.com/myrealtorjasmine)** — how she already
  presents professionally
- **[@iheartjasz](https://www.instagram.com/iheartjasz)** — her actual taste and
  personality

The gap between those two accounts is the design target: **the brand should feel like
the person in the personal account doing the job shown in the business account.** Most
agent sites read like the business account alone, which is why they all look the same.

Also useful for voice and on-camera presence: her
[Zillow profile](https://www.zillow.com/profile/myrealtorjasmine) and the
[bio video](https://youtu.be/J6T4pmDWQ6M), "Meet Jasmine Garcia – Stone Realty Group."

---

## After export (Claude Code side)

- Pull the generated repo's code into `william-weaver-jr/jgwre-website`; Lovable's repo
  is a source, not the home.
- Lift the palette, type scale, and spacing into `tailwind.config.ts` tokens; record the
  final USP wording and brand decisions in CLAUDE.md Section 11.
- Audit the footer compliance block, REALTOR®/EHO marks, and fair-housing language —
  treat any drift as build-breaking.
- (704) 200-9360 is the confirmed Follow Up Boss tracking number; no swap needed.
- Then build the remaining sitemap pages and wire every form to `app/api/lead/route.ts`
  (Resend + Follow Up Boss) before anything ships.
