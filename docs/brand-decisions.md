# Brand Decisions

Log from the Lovable sessions. This file is the source for `tailwind.config.ts` tokens.
**Nothing here is final until Jasmine signs off.**

Lovable project: `389f0bc8-dbb0-4b1d-8fa5-64cc251c28b0` (private)
Editor: https://lovable.dev/projects/389f0bc8-dbb0-4b1d-8fa5-64cc251c28b0

---

## Day 1 — 2026-08-07

Two rounds. Round 1 generated the page blind (no Instagram references). Round 2
redirected the palette after review and fixed three copy/link defects.

### Round 1 — rejected direction (kept for the record)

"Clay and pine on oat paper" — clay `#A24112`, pine `#175A45`, oat `#F8F3E9`, with
Fraunces display and IBM Plex Mono figures. **Rejected as too editorial and too earthy.**
Generated without reference to her actual social presence.

---

### Round 2 — current direction

**Status: proposed, awaiting Jasmine's review.**

Redirected after reviewing her business Instagram, which runs ivory and cream grounds,
gold serif testimonial cards, and generous margins. Brief was: classy, polished,
high-profile — the register of a private client advisor — while still warm, since she
serves clients at every price point.

**Ivory and cream grounds, charcoal-navy ink, one antique-gold accent** used only as
hairlines, small-caps labels, and underlines. No gradients, no metallic fills, no flat
black fields — the brokerage owns black.

### Palette

| Token | Hex | Role |
|---|---|---|
| `ink` | `#1B2230` | Charcoal-navy — headings and body |
| `ink-muted` | `#4E5768` | Secondary text (AA on ivory) |
| `primary` | `#232C3D` | Deep navy — primary buttons |
| `primary-deep` | `#10161F` | Primary pressed / hover |
| `accent` | `#8A6A2F` | Antique gold — labels, links, rules |
| `accent-soft` | `#C9A96A` | Champagne — hairlines and dividers |
| `surface` | `#FCFAF6` | Ivory — page ground |
| `surface-sunken` | `#F4EFE6` | Cream — banded sections |
| `surface-raised` | `#FFFFFF` | Raised plate (Case 01) |

### Typography

- **Display:** Cormorant Garamond, 400/500/600 — headings, case-study titles
- **Body:** Libre Franklin, 400/500/600
- **Figures:** Libre Franklin Medium with `tabular-nums`

The ledger treatment of the dollar figures survived the redirect, which was the goal.
Round 1 set them in IBM Plex Mono, which read technical rather than refined; moving to
the body sans with tabular figures keeps the aligned-ledger quality — numbers as
evidence, not marketing — at a more composed register.

`It's not.` is now set in display italic rather than in an accent color. Quieter and
better.

### Round 2 fixes — all verified in source

| Fix | Status |
|---|---|
| `realtor.com` → `SEARCH_HOMES_URL` constant in `src/lib/site.ts`, used in header and footer, carrying a TODO for the real SRG IDX URL | done |
| Privacy link `/privacy` → `/privacy-policy` | done |
| Hero subhead: deleted the invented "A roof. A rate. Who pays for what at the table." | done |
| Palette and type redirect | done |
| Figures off IBM Plex Mono onto tabular-nums sans | done |
| Case 03 dark plate softened to a cream inset with a gold left hairline; Case 01 promoted to the most visual presence (raised white plate, gold top rule, largest heading) | done |

`SiteFooter` was correctly moved out of `__root.tsx` into each route so the style tile
can sit below the footer on the home page. No duplicate footer.

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

1. Does ivory/navy/antique-gold feel like her, or still too restrained?
2. Cormorant Garamond is a classical serif — elegant, or too formal for a broker who
   serves clients at every price point?
3. Case 01 now carries the most visual weight and Case 03 is quiet. Right balance?
4. Is a photography-forward hero wanted, or does the type-led hero hold once her real
   portrait replaces the placeholder?

---

## Day 2 — pending

Credits exhausted 2026-08-07. Resume next session.

**Carry into the Day 2 prompt (batch, do not send separately):**

- Whatever Jasmine says to the four open questions above
- Mobile layout review — never checked at any breakpoint
- Confirm the real Stone Realty Group IDX URL and replace the `SEARCH_HOMES_URL` TODO

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
