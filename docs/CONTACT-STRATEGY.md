# Contact Strategy

Captured 2026-08-10. How call and form coexist on jasminegarcia.com: what each reference
site does, which model performs, and the intake we build instead.

Companion to `docs/CONTENT-PLAN.md` (`/contact`) and `CLAUDE.md` §9 (Follow Up Boss).

**This does not overturn Locked Decision #4.** #4 bans a *booking tool* and makes the phone
the primary CTA. Both still hold. Forms were always in scope — §9 exists for them, and
`app/api/lead/route.ts` has been waiting for a UI since it was written.

---

## 1. What the two reference sites actually do

Both audited live, 2026-08-10.

### mattstoneteam.com/contact-us/

| | |
|---|---|
| Placement | Dedicated page only. No form anywhere else on the site |
| Order | Heading → intro → phone/email → form → "As Seen On" logos → footer |
| Fields | First name\*, Last name\*, Email\*, Phone\*, **"How Can We Help?" free-text textarea\***, City |
| Consent | TCPA checkbox, required, Privacy Policy linked |
| Anti-spam | **Google reCAPTCHA v2 checkbox** |
| Phone | Header `tel:704.755.5095`, "Call Us Now" button beside the form, footer |
| Backend | AgentFire lead post with hidden `lead_type`, `tags`, `agent_id`, `office_id` |

**Read:** compliance-correct, conversion-hostile. Five of six visible fields are required,
and one of them is an open textarea — a required free-text box is the highest-abandonment
field type in any form, because it makes the visitor compose prose before they can ask a
question. reCAPTCHA v2 adds a second gate on top. And the form lives only at `/contact-us`,
so every lead has to leave the page that persuaded them in order to act.

The one genuinely smart thing: `lead_type` and `tags` are set per-form, so the CRM knows
where the lead came from. We already do this better — `source` + `leadType` in `lib/lead.ts`.

### mackenziesiek.com/#contact

| | |
|---|---|
| Placement | Foot of the single page, after the testimonials. Nav's one link points to it |
| Order | "Ready to Make Your Move?" → phone + "Available 7 days a week" → form → "Or call/text me directly at (704) 610-0959" |
| Fields | First name\*, Last name\*, Email\*, Phone *(optional)*, **"I'm interested in…"\*** (Buying / Selling / Both / Getting a home valuation / Just exploring options), **Preferred Neighborhoods**, Message |
| Consent | **None.** Collects a phone number with no TCPA language |
| Anti-spam | None visible |
| Phone | Hero-adjacent, above the form, and repeated below it |

**Read:** much better instincts, unusable compliance. Three things are right and worth
taking:

1. **The form sits where intent peaks** — at the end of the argument, not one navigation
   away from it.
2. **The intent select does real work.** It routes the lead and tells her which
   conversation to have before she dials.
3. **Phone is offered on both sides of the form** — above it for the ready buyer, below it
   for the person who stalled halfway down. That second placement is the one most sites miss.

What we cannot take: no TCPA consent on a form that collects phone, no license number, no
honeypot. `CLAUDE.md` §7 makes all three build-breaking here.

---

## 2. The pick

**Mackenzie's placement model, Matt Stone's compliance layer, neither's field set.**

Placement is the larger of the two effects and it isn't close. A dedicated `/contact` page
is a destination the visitor has to choose; an inline block at the end of a page they just
read is a next step. `/new-construction` spends 1,400 words establishing that the builder's
rep negotiates daily and the reader never has — the worst possible thing to do at the bottom
of that page is ask for a click before asking for a name.

So:

| Surface | Call | Form |
|---|---|---|
| Header (all pages) | `tel:` button, persistent | — |
| Home hero | Primary | Secondary link to the intake |
| Pillar page foot | Beside the form | **Inline, prefilled from the page** |
| `/negotiation` | Beside the form | Inline (lead type `guide`) |
| `/home-value` | Beside the form | Inline (lead type `valuation`) |
| `/contact` | Large, first, with hours | Full intake below it |
| Mobile, scrolled | Sticky bar: **Call** / **Start** | — |
| Footer | Number + brokerage block | — |

The phone does not get demoted anywhere. It gets a *companion*, because the two capture
different people: the phone captures decided high-intent visitors during business hours, the
form captures the 9pm researcher and everyone not ready to talk to a stranger. Today the
site loses the second group entirely.

---

## 3. The intake — "What's on the table?"

Every other agent's form asks *how can we help*. That question puts the work on the visitor,
who came here specifically because they don't know what to ask. Answering it with a blank
textarea is the site contradicting its own USP in the last block on the page.

So the form asks the questions instead. **Three steps, contact details last.**

### Step 1 — Which side of the table? (no PII)

One tap. `Buying` · `Selling` · `Both` · `Relocating here` · `Still deciding`

Starting with a low-commitment, non-personal question is the single highest-leverage change
available: the visitor is committed before they are asked for anything they'd hesitate over,
and a partial drop-off still tells us intent. Name/email/phone first inverts that.

### Step 2 — Branching, 2–3 taps, still no PII

Chips, not dropdowns. Every option is a tap.

| Path | Asked |
|---|---|
| Buying | New construction / resale / not sure · markets (multi-select from §5) · timeline · working with a lender yet |
| Selling | Market · timeline · have you had a valuation |
| Relocating | Coming from where (state) · timeline · NC or SC undecided? |
| Still deciding | Markets · timeline |

Every one of these is a question Jasmine would ask in the first two minutes of a call.
Asking them here means the call starts at minute three. That is the "value-add conversation"
requirement, and it is also the metric that matters more than form fills — see §5.

### Step 3 — Reach you

Name · Email · Phone · "Anything you'd add" (optional, small) · TCPA checkbox (verbatim,
never pre-checked) · honeypot.

### The confirmation is the differentiator

Everyone shows "Thanks, we'll be in touch." We show **what's likely on the table** — two or
three levers that tend to exist for the situation they just described, drawn from the same
list as the `/negotiation` guide, phrased as *questions worth asking*, not outcomes.

New construction, 3–6 months, no lender yet →

> Three things I'd want to know about your builder before you sit down with them:
> whether the incentive is tied to their lender, what's in the base price versus the
> design center, and what they've been doing on standing inventory this quarter.
> I'll call you at (704) 200-9360 — usually same day.

That is the USP performing rather than asserting, it is genuinely useful to someone who
never calls, and no sibling site does anything like it.

**Compliance guardrails on this block, non-negotiable:**
- Questions and possibilities only. No dollar figures, no "you'll get," no "typically saves."
  Every line must survive the §7 guarantee ban read literally.
- Results disclaimer rendered adjacent regardless, via `components/results-disclaimer.tsx`.
- Content is a static lookup table keyed on the answers, reviewed once as copy. Not generated.

---

## 4. What it costs, honestly

Three steps is more total questions than Mackenzie's one screen, and raw submit rate could
land either way. The trade is deliberate: a five-field form that produces a lead Jasmine
knows nothing about is worse for revenue than a three-step form producing half as many leads
she can call prepared. Measure §5.4, not §5.1.

Two hedges keep the downside small:
- **Steps 1–2 are taps, not typing.** Perceived effort tracks typing and decisions, not
  field count.
- **Step 2 is skippable.** A visible "skip to contact details" on every branch. The visitor
  who wants to just send a message can, in two taps.

---

## 5. What to measure once GA4 and Vercel Analytics are live

Instrument before launch or the comparison is unrecoverable.

1. **Form completion rate** — submits ÷ visitors who reached step 1. Segment by entry page.
2. **Step drop-off** — fire an event per step. If step 2 leaks, cut a question from the
   worst-performing branch. This is the whole reason for stepping the form.
3. **`tel:` click rate** — click event on every `tel:` link, tagged by placement (header,
   hero, form-adjacent, sticky, footer). Currently unmeasured anywhere on the site.
4. **Lead-to-conversation rate, from FUB** — the one that decides whether this was right.
   Contacted ÷ received, and how many reach appointment. A form that halves submissions and
   doubles this wins.
5. **Assisted calls** — visitors who hit step 1, abandoned, then called. FUB's tracking
   number plus a session flag. The form earns credit for these; naive form metrics won't.
6. **Sticky-bar split** — Call vs Start taps on mobile.

Nothing about the intake is locked. §3's structure is a hypothesis with an instrument
attached; the branch questions are the cheapest thing on the page to change.

---

## 6. What shipped

| | |
|---|---|
| `lib/intake/` | Questions, branches, and the lever table. `levers.ts` is copy and reads as advertising — see the compliance header on it |
| `components/contact-intake.tsx` | The three-step form. Radios and checkboxes under the chips, so keyboard and screen reader semantics come free |
| `components/sticky-contact-bar.tsx` | Mobile bar. Appears past 600px, hides whenever the intake is on screen |
| `components/tel-tracking.tsx` | One delegated listener; every `tel:` link carries `data-cta-placement` |
| `app/contact/page.tsx` | Phone first in the hero, intake below, brokerage block last |
| Inline on | `/`, `/negotiation`, `/new-construction`, `/sellers`, `/relocation`, `/carolinas-border`, `/about`, `/reviews`, `/transactions` |

`/new-construction`, `/sellers`, `/relocation`, and `/carolinas-border` prefill step 1
from the page and open at step 2 — a reader who just spent 1,400 words on builders
should not be asked whether they are buying.

---

## 7. Open items this raises

- [ ] `AGENT.email` is `TODO(verify)` in `lib/site.ts`. Matt Stone publishes `hello@`.
      Decide whether an address is published at all, or whether form-plus-phone is the
      complete surface.
- [ ] Stated availability. Mackenzie publishes "Available 7 days a week." If we publish
      hours, they must be true — confirm with Jasmine before any hours text ships.
- [x] `leadSchema` carries the step-2 answers as a typed `intake` object rather than
      flattening them into `message`, so FUB gets structured fields it can filter on.
      Rendered into the FUB note and the notification email by `lib/intake/format.ts`.
- [ ] BIC approval covers this too: the confirmation-screen copy is advertising.
- [ ] No CAPTCHA at launch — honeypot plus rate limiting, per §9. Revisit only if spam
      becomes real. Matt Stone's reCAPTCHA is a cost we don't need to inherit.
