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

- [x] **Transaction export — RESOLVED.** The closed-transactions workbook (Google
  Sheets) is the source, and it now carries every field the ledger needs. See §5.
- [ ] Her own photography, if any entries should carry images.
- [ ] BIC read on the pipeline-states question before that half is ever revisited.

## 5. Importing from the workbook

The sheet is the business record and is **authoritative for neighborhood, property
type, builder, side, and closing month** — including over Zillow, whose generated
transaction line on a review is a platform approximation and has been wrong about
a neighborhood six times and a property type once.

```bash
npm run import:transactions -- ~/Downloads/Closed\ Transactions.csv
```

Export with **File → Download → Comma-separated values**. A Markdown table also
works, which is what the Google Drive connector returns when the sheet is fetched
by a tool rather than downloaded.

The script reports four things: rows that are **new**, rows where the sheet
**disagrees** with what is shipped, rows in the dataset **absent** from the export,
and everything **unchanged**. For new rows it prints ready-to-paste entries for
`lib/transactions/data.ts` and matching lines for `internal-metrics.ts`.

### What it will not do

**It does not write `data.ts`.** Two parts of every row are editorial and stay
with a person:

- **The lever.** `"$15,100 below list price"` is a fact; *"Purchased under list
  price, with concessions covering foundation work the house needed"* is the same
  fact made to argue. Only the second belongs on the page. The importer emits the
  raw Highlights and Concessions text as a `TODO(lever)` comment and leaves the
  field off.
- **The compliance calls.** Whether a review may run, whether a figure drags the
  results disclaimer in, whether a neighborhood is too narrow. CLAUDE.md §7, read
  by someone who has read it.

Review matching is a **suggestion** only, emitted as `TODO(review)`. Bylines and
workbook names disagree constantly and for good reasons: a couple buys and one of
them writes, platforms generate handles, and one reviewer deliberately shortened
her own name.

### Why matching is not on id

Ids are derived as `{year}-{slug(neighborhood ?? city)}-{nn}`, so a **corrected
neighborhood produces a different id for the same closing**. That is not
hypothetical — Montclaire became Oakwood Acres, Prosperity Village became Katelyn
Moors, and Rock Hill's Oakwood Acres became Midbrook. Matching on id would report
each as one deletion plus one addition, which is the report that gets a real
correction thrown away. Rows are matched on year, month, side, and city instead,
and a matched row **keeps its shipped id** so the `internal-metrics` join
survives a rename.

### Guardrails

The importer refuses rather than guesses. An unrecognised column is an error, not
a shrug — the sheet has been restructured twice and the silent failure mode both
times would have been importing under a header nobody checked. A street address
in the Neighborhood column is refused outright. Closing prices are routed to
`internal-metrics.ts`; addresses and client names are used to derive a
neighborhood and match a review, then discarded.

Checks run against the dataset **as it would be after the import**, so a problem
surfaces while it is still a line in a spreadsheet rather than a diff to unpick.
