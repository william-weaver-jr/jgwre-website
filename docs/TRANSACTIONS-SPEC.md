# Transactions page — spec and constraints

Proposed 2026-08-10. Status: **approved in principle for CLOSED transactions only;
blocked on data. Pipeline states (active / pending / coming soon) are NOT approved —
see the compliance flags below, which need the BIC before anything changes.**

The idea: a page of completed transactions, both sides, as visual and detailed proof
of the kinds of homes and deals Jasmine actually works. The value is real — it is the
same evidence-led argument the whole site makes, applied at the scale of her record
instead of three case studies.

---

## 1. What ships: closed transactions

A ledger, not a listing gallery. Grouped by year, newest first, filterable by pillar.

Each entry carries:

| Field | Rule |
|---|---|
| Neighborhood + city + state | Neighborhood level for buyer-side entries. **Never a street address for a buyer-side transaction** — that publishes where a client lives, and we just abbreviated reviewer names to avoid exactly that. Seller-side addresses may be considered later with the BIC; default is neighborhood everywhere. |
| Year (+ month if known) | From the closing record. |
| Side | "Represented the buyer" / "Represented the seller" / both. Always stated — NC advertising rules treat implying you listed a home you didn't as misleading. |
| Property type | Single-family, townhouse, condo, new construction. |
| Builder | Named on new-construction entries. The ten-builder list in CLAUDE.md §5 is unmatched locally; this page is where it becomes concrete. |
| Pillar tags | new-construction / relocation / border / sellers — powers the filters and cross-links the pillar pages. |
| The lever (optional) | One factual line: what was negotiated, where documented. This is the USP column. No adjectives. |
| Review cross-link (optional) | Where a published review describes this transaction, link it. The reviews dataset already carries transaction metadata (`lib/reviews`), so the join exists. |
| Photo (optional) | **Her own photography only.** Listing photos are copyrighted by the listing photographer/brokerage; buyer-side deals mean *another firm's* photos. Nothing lifted from MLS, Zillow, or the team site. Entries without a photo render as ledger rows, which suits the brand better anyway. |

**Prices.** Two constraints, one per state:
- **SC is a non-disclosure state.** Sold prices in Fort Mill, Tega Cay, Indian Land,
  Lake Wylie are not public record. Publishing one discloses a client's private
  financial information — written permission per transaction, or no price.
- NC sold prices are public record, but a page of them is a stat wall. Default: no
  prices. Dollar outcomes stay where they are documented and disclaimed — the case
  studies and reviews. Any entry that does show a figure needs `<ResultsDisclaimer />`
  adjacent, per §7.

## 2. What does not ship: active / pending / coming soon

Flagged per CLAUDE.md §7 ("stop and flag"), not built:

1. **It reinstates the surface Locked Decision #1 exists to avoid.** A page
   advertising available property is a listing page. That is the thing that triggers
   MLS/BIC compliance review and locks design changes — the exact cost the no-IDX
   decision was made to escape.
2. **The listings are not hers to advertise.** She lists through the team; the
   brokerage's listings are marketed on the brokerage's platforms (Locked Decision #2
   sends search traffic there). Advertising them on jasminegarcia.com needs the BIC
   regardless.
3. **"Coming soon" is specifically regulated.** Canopy MLS clear-cooperation rules
   attach obligations to public coming-soon marketing. This is not a page a developer
   should create ahead of the BIC.
4. **Staleness is an advertising violation, not a cosmetic bug.** A hand-maintained
   "active" page will advertise homes that went under contract last Tuesday. There is
   no CMS yet (§12) and no feed (Decision #1), so there is no maintenance path that
   keeps "available" true within hours.

If she wants pipeline visibility, the compliant version is one line and a link:
"Current listings are with Stone Realty Group" → the team IDX. Revisit only with
written BIC approval and a real data path.

## 3. Visual and structural direction

Mobile-first, like everything else — unprefixed Tailwind is the phone layout, `md:`
adds the desktop.

- **Route:** `/transactions`. Footer + pillar-page cross-links; sitemap entry.
- **Phone:** single-column ledger. Year headers as sticky eyebrows. Filter chips
  (All · New construction · Sellers · Relocation · NC/SC border) in a horizontally
  scrollable row under the hero — pillars, not property types, because the pillars
  are the argument.
- **Desktop:** the ledger widens to a two-column grid; photo entries can take a
  wider row. Same `rule-gold` + eyebrow + figure system as `/reviews` and the case
  studies — no new visual vocabulary.
- **Counts, not walls:** the filter chips can carry counts ("New construction · 17")
  because those are documented; no animated counters, no badge grid.
- Server component, static render, zero client JS except the filter (URL-param
  driven so it stays crawlable and back-button friendly).

## 4. Blocked on

- [ ] Transaction export from Follow Up Boss or the MLS: closing year/month,
  neighborhood, city, state, side represented, property type, builder (if new
  construction), and the negotiation lever where she remembers it. This also feeds
  the §12 open item about refreshing the §5 stat block.
- [ ] Her own photography, if any entries should carry images.
- [ ] BIC read on the pipeline-states question before that half is ever revisited.

Until the export exists, nothing gets built — §6 forbids inventing entries, and a
transactions page with three placeholder rows argues against her.
