# Brand Decisions

Log from the Lovable sessions. This file is the source for `tailwind.config.ts` tokens.
**Nothing here is final until Jasmine signs off.**

Lovable project: `389f0bc8-dbb0-4b1d-8fa5-64cc251c28b0` (private)
Editor: https://lovable.dev/projects/389f0bc8-dbb0-4b1d-8fa5-64cc251c28b0

---

## Day 1 — 2026-08-07 — first generation

**Status: proposed, awaiting Jasmine's review.** Generated without the Instagram
reference screenshots, so treat the palette as a starting position, not a read on her
taste.

### Direction

"Clay and pine on oat paper." Warm earth tones, deliberately not black — the brokerage
owns black. No hexagons. Reads closer to a well-set print piece than to a typical agent
site, which is the right instinct for copy that argues rather than sells.

### Palette

| Token | Hex | Role |
|---|---|---|
| `primary` | `#A24112` | Clay — CTAs, numerals, accents |
| `primary-deep` | `#6B2A0B` | Clay pressed / hover |
| `accent` | `#175A45` | Pine — plates, focus rings, footer |
| `accent-soft` | `#C3E3D6` | Pine tint on dark plates |
| `ink` | `#261D16` | Body and headings |
| `ink-muted` | `#665B53` | Secondary text |
| `surface` | `#F8F3E9` | Oat — page ground |
| `surface-sunken` | `#EDE3D2` | Sand — banded sections |
| `surface-raised` | `#FFFFFF` | Cards and plates |

### Typography

- **Display:** Fraunces, 500/600/700 — headings, case-study titles
- **Body:** Archivo, 400/500/600/700
- **Figures:** IBM Plex Mono, 400/600, tabular — all dollar amounts and the phone number

Setting the transaction figures in tabular mono is the strongest single decision in the
draft. It makes the numbers read as ledger entries — evidence — instead of marketing,
which is exactly what `CASE-STUDIES.md` asks for.

### What worked

- Hero headline used verbatim, with "It's not." breaking to its own line in clay
- Each case study got a genuinely different treatment — numbered list, `<dl>` ledger,
  dark pine plate — so they read as three shapes of win rather than three stat cards
- Zero animated counters
- Disclaimer at body weight and body color with a clay left-rule, immediately below the
  block. Meets the "not 9px gray, not the footer" requirement
- Footer treated as a designed closing band on pine, not a legal dump. It volunteers an
  affiliation line — "All real estate services are provided through Stone Realty Group" —
  which goes beyond what the prompt asked and directly serves the no-independent-brokerage rule
- Skip-to-content link, `sr-only` context on every phone link, semantic `<dl>`/`<address>`

### Open questions for Jasmine

1. Does clay/pine/oat feel like her, or is it too editorial?
2. Fraunces is characterful — confidence or affectation?
3. Is the dark pine plate on Case 03 right, or does highlighting the $50,000 case
   undercut the argument that the roof case is the more interesting one?

---

## Fix list — batch into the Day 2 prompt

Do not spend separate credits on these. Send with the palette feedback.

1. **`Search Homes` points to realtor.com** — a fabricated destination, and a competitor
   portal. Locked Decision #2 requires the Stone Realty Group IDX. Appears in both
   `site-header.tsx` and `site-footer.tsx`.
2. **Privacy link goes to `/privacy`** — sitemap says `/privacy-policy`.
3. **Hero subhead adds "A roof. A rate. Who pays for what at the table."** — not from
   approved copy. "A rate" implies mortgage-rate negotiation, which is a lender function
   and not something she controls. Cut or rewrite.

## Fix list — handle in Claude Code after export

1. **The EHO and REALTOR® marks are hand-drawn SVG approximations, not the official
   artwork.** Both are registered marks and must be replaced with the real files before
   launch. Trademark exposure, not a design preference.
2. Style-tile swatches use inline `style={{ backgroundColor }}`, against project
   convention. Acceptable in a demo block; remove if the tile ships.
3. `/negotiation` and `/privacy-policy` don't exist yet, so those links 404.

---

## Stack note — affects the export

Lovable ignored the Next.js instruction and built on **TanStack Start + Vite**
(`tanstack_start_ts_current`), its default. It cannot be told otherwise on this plan.

Consequence: the export is a **port, not a merge.** What transfers cleanly is the design
system — palette, type scale, spacing, and the component structure as reference. The
routing, head/meta handling, and data layer get rewritten for Next.js App Router in
Claude Code.

This does not change the plan; `docs/lovable-brief.md` already treats the decisions as
the deliverable and the project as scaffolding. But do not expect to `git merge`
Lovable's repo into ours.
