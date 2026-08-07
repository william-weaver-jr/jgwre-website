# Lovable/v0 Brief — jasminegarcia.com visual direction

Paste the **Prompt** section below into Lovable (or v0) to generate the visual
direction for the site. Everything after the prompt is context for whoever runs the
session. Per the project workflow (CLAUDE.md, Locked Decision #3), the output gets
exported to GitHub and all subsequent work happens in Claude Code against this repo.

**How to use it:** run the prompt, then iterate on aesthetics — palette, typography,
imagery mood — with Jasmine in the room. Her taste decides the look. The prompt's job
is to keep every iteration inside the legal and positioning guardrails so nothing has
to be torn out after export.

**Bring visual references into the session:** Lovable can't browse Instagram, so
screenshot a handful of posts from her accounts and attach them as style references —
[@myrealtorjasmine](https://www.instagram.com/myrealtorjasmine) (business — how she
already presents professionally) and
[@iheartjasz](https://www.instagram.com/iheartjasz) (personal — her actual taste and
personality). The gap between the two is informative: the brand should feel like the
person in the second account doing the job shown in the first. Her
[Zillow profile](https://www.zillow.com/profile/myrealtorjasmine) and
[bio video](https://youtu.be/J6T4pmDWQ6M) ("Meet Jasmine Garcia – Stone Realty Group")
are useful for voice and on-camera presence.

---

## Prompt

Build a personal-brand and lead-generation website for **Jasmine Garcia**, a
Broker/REALTOR® with **Stone Realty Group** in Charlotte, NC. She is licensed in both
North Carolina and South Carolina. This is a brand and conversion site — **not** a
property-search portal.

Tech target (the code will be exported and maintained by developers): **Next.js 15
App Router, TypeScript, Tailwind CSS, shadcn/ui.** Put all colors and fonts in Tailwind
design tokens — no hardcoded hex values in components, no inline styles.

### Pages to build

Build these four pages fully; they set the visual system for the rest of the site:

1. **Home (`/`)** — positioning, proof, primary call-to-action
2. **New Construction (`/new-construction`)** — flagship specialty page with a guide-download lead form
3. **About (`/about`)** — her story
4. **Contact (`/contact`)** — phone-first, form secondary

Include a shared header (nav: Buyers, Sellers, New Construction, Relocation,
NC/SC Border, Areas, Reviews, About, Contact, plus a "Search Homes" link that goes to
an external URL) and a shared footer (requirements below).

### Brand direction

- Her brand identity is **being discovered in this exercise** — there is no existing
  palette, typography, or logo. Propose a distinctive direction; expect iteration.
- It must be clearly distinct from her brokerage's brand, which is black with a
  hexagon motif. **Do not use black-dominant palettes or hexagon shapes.** Do not
  restyle or incorporate any Stone Realty Group logo or mark.
- Tone: warm, competent, direct. She spent a decade as a special-education teacher
  before real estate — approachable expert, not luxury-aloof. Avoid both generic
  corporate real estate and gold-serif "luxury agent" clichés.
- Use placeholder image blocks for her photos (professional photography is not shot
  yet). Label them clearly as placeholders.

### Unique selling proposition — the hero must commit to one

The homepage hero leads with a single, explicit USP — a claim only she can make — not
a services list or a generic welcome. Generate hero variants for these candidate
angles so Jasmine can pick and refine:

1. **The builder's-table angle:** "Builders negotiate every day. You'll do it once.
   I've done it 17 times." — the new-construction specialty as the spearhead.
2. **The two-Carolinas angle:** one broker licensed on both sides of the NC/SC line —
   for buyers who don't yet know which state they're choosing.
3. **The teacher angle:** a decade in special education before real estate — she
   explains the process better than anyone, especially for first-timers and
   relocating buyers who are anxious and far away.

The other pillars still get their pages either way; the USP decides what leads.

### Copy — use these facts, nothing else

Never write generic agent copy ("your trusted Charlotte REALTOR®" is banned). Her
differentiators are specific — use them:

- **New construction:** 17 new-construction closings with builders including Pulte,
  Lennar, DR Horton, David Weekley, and Meritage. Angle: buyers negotiate with a
  builder once in their life; the builder's sales office negotiates every day. She has
  sat on the buyer's side of that table 17 times.
- **Relocation:** 18 relocation transactions helping out-of-state buyers land in Charlotte.
- **NC/SC border:** licensed in both Carolinas — Fort Mill, Tega Cay, Indian Land,
  Lake Wylie, Waxhaw. 12 closings in the Fort Mill corridor.
- **Teaching background:** a decade in special education before real estate — a career
  spent explaining complex processes to anxious people.
- Supporting stats (use sparingly, never as a wall of numbers): 73+ career
  transactions, $30.9M career volume, 98.84% list-to-sale ratio, 105 five-star reviews.

Voice: short sentences, numbers over adjectives. Banned words: "nestled," "boasts,"
"dream home," "passionate about helping." **Do not invent any statistic, award,
credential, or testimonial.** Where a real client review would go, use the literal
placeholder text `[REAL CLIENT REVIEW — DO NOT FABRICATE]`.

### Calls to action

- **Phone-first.** The primary CTA everywhere is calling her: **(704) 200-9360**.
  Make the number tappable (`tel:`) and prominent in the header and page CTAs.
- Secondary CTA: the lead form (guide download on New Construction, contact form on
  Contact). **No booking/calendar widget of any kind.**

### Lead forms

- Fields: name, email, phone. Every field gets a visible `<label>` — placeholders are
  not labels.
- Every form includes a required, **unchecked** consent checkbox with this exact text
  (do not reword or shorten), with "Privacy Policy" as a link:

  > I agree to be contacted by Stone Realty Group via call, email, and text for real
  > estate services. To opt out, you can reply 'stop' at any time or reply 'help' for
  > assistance. You can also click the unsubscribe link in the emails. Message and
  > data rates may apply. Message frequency may vary.

- Forms just POST to a stub — the real backend is wired later.

### Footer — required on every page, non-negotiable

- Brokerage identification, plain text: **Stone Realty Group**,
  2459 Wilkinson Blvd, Suite 310, Charlotte, NC 28208
- License numbers: **NC 334700 · SC 125546**
- **Equal Housing Opportunity logo** and the REALTOR® mark (correct ® symbols and
  capitalization everywhere they appear)
- Privacy Policy link

### Hard constraints

- **No MLS/IDX data anywhere** — no listing cards, no property-search UI, no home-value
  estimate widgets. "Search Homes" is an external link, nothing more.
- Nothing may imply she is an independent brokerage — the site is her personal brand
  *within* Stone Realty Group.
- **Fair housing:** never describe the people of a neighborhood — no "safe
  neighborhood," "good schools for families like yours," "up-and-coming area."
  Describe housing stock, amenities, commute, and price instead.
- **Accessibility:** WCAG 2.1 AA — 4.5:1 text contrast minimum, visible focus states,
  semantic HTML, one `<h1>` per page, logical heading order, alt text on images.

---

## After export (for the Claude Code side)

- Verify the footer compliance block, consent text, and fair-housing language survived
  generation verbatim — treat any drift as build-breaking.
- (704) 200-9360 is the confirmed Follow Up Boss tracking number — correct as displayed,
  no swap needed (Locked Decision #6).
- Extract whatever palette/typography Jasmine approves into `tailwind.config.ts`
  tokens and record the decision in CLAUDE.md Section 11.
- Build out the remaining sitemap pages in Claude Code; wire forms to
  `app/api/lead/route.ts` (Resend + Follow Up Boss) before anything ships.
