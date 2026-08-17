/**
 * Completed transactions — the real dataset.
 *
 * EMPTY ON PURPOSE. CLAUDE.md §6 forbids inventing transactions, and a
 * transactions page carrying three plausible-looking placeholder rows argues
 * against her rather than for her.
 *
 * The page, the row component, the filters, and the year grouping are all built
 * and working against this array. Populating it is the only remaining step —
 * nothing about the layout has to change.
 *
 * ---------------------------------------------------------------------------
 * What the export needs, per row (docs/TRANSACTIONS-SPEC.md §4):
 *
 *   closing year (and month if available)
 *   side represented — buyer, seller, or both
 *   neighborhood, city, state
 *   property type
 *   builder, on new construction
 *   the negotiation lever, where she remembers it — one factual line, no dollars
 *
 * Source is Follow Up Boss or the MLS. The same pull settles the CLAUDE.md §12
 * open item about refreshing the §5 stat block, so it is one ask serving two.
 *
 * Do not add a row from memory, from Instagram, or from a review. A review
 * describing a closing is evidence that it happened, not a record of its
 * details — link it with `reviewId` once the real row exists.
 * ---------------------------------------------------------------------------
 */

import type { Transaction } from "./types";

export const TRANSACTIONS: readonly Transaction[] = [
  {
    /* id convention: `{year}-{neighborhood-slug}-{nn}`. Stable, readable, and it
       sorts usefully in a diff. The counter suffix exists because she has closed
       in Aveline at Coulwood more than once. */
    id: "2022-aveline-at-coulwood-01",
    side: "buyer",
    year: 2022,
    /* Closing month. Under contract February 2022, closed April 2022 — the gap
       is the build. The schema records the closing only, because that is what
       the ledger sorts and groups on. */
    month: 4,
    neighborhood: "Aveline at Coulwood",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    /* Aveline at Coulwood is the community; JCB Urban is the builder.
       jcburban.com. Not among the ten in CLAUDE.md §5 — that list is not
       exhaustive, and this page is where it stops being a list. */
    builder: "JCB Urban",
    pillars: ["new-construction"],
    /* A hot market and the winning offer went over asking. Deliberately not
       marketed: it is a dollar outcome, it would drag <ResultsDisclaimer /> onto
       the row, and "paid more than asking" is not a lever that recommends her. */
    lever:
      "The client would consider no other community. Multiple offers on the homesite; this one was accepted.",
    reviewId: "zillow-saquanna-carter",
  },

  /* --------------------------------------------------------------------------
     From the closed-transactions workbook, 2022. Only the rows whose property
     type is DOCUMENTED are here: each one below is matched to a Zillow review
     whose platform-generated transaction line states the property type, and in
     most cases the neighborhood too. The workbook itself records neither.

     The workbook's other five rows are held out pending the questions raised
     against them — property type at minimum, which this schema requires and
     §6 forbids guessing at.

     Three things from the workbook are deliberately NOT carried across:
       - Street addresses. Every row here is buyer-side, and publishing the
         address is publishing where a client lives.
       - Closing prices. No price field exists on this schema by design.
       - Client names. The review join carries an abbreviated byline; the
         ledger itself names nobody.
     Dollar figures in the workbook's Highlights column are reduced to the KIND
     of thing negotiated, per §7 and the test that greps every lever for "$".
     -------------------------------------------------------------------------- */

  {
    id: "2022-montclaire-01",
    side: "buyer",
    year: 2022,
    month: 2,
    /* Neighborhood and property type from zillow-mckenna-jahns' own transaction
       line: "Montclaire, Charlotte, NC". */
    neighborhood: "Montclaire",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    pillars: [],
    /* Workbook: "$4500 Seller Concessions". The amount stays out. */
    lever: "Seller concessions at closing.",
    reviewId: "zillow-mckenna-jahns",
  },
  {
    id: "2022-aveline-at-coulwood-02",
    side: "buyer",
    year: 2022,
    month: 4,
    /* Second closing in this community, a different client from -01. Zillow's
       line says "Coulwood West"; the community name is the finer-grained one
       and matches -01. TODO(verify): builder — likely JCB Urban if this is the
       same community, but the workbook does not say and it is not assumed. */
    neighborhood: "Aveline at Coulwood",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    pillars: ["new-construction"],
    /* No Highlights entry in the workbook, so no lever. A row without one is
       still evidence; an invented one is not. */
    reviewId: "zillow-harrist245034",
  },
  {
    id: "2022-dallas-01",
    side: "buyer",
    year: 2022,
    month: 4,
    /* Zillow's line records the city only — "Dallas, NC" — so no neighborhood.
       locationLabel() degrades to "Dallas, NC" on its own. */
    city: "Dallas",
    state: "NC",
    propertyType: "Single Family",
    /* Gaston County, outside the markets listed in CLAUDE.md §5. It was a real
       closing, so it belongs in the ledger; it just carries no pillar. */
    pillars: [],
    /* Workbook Highlights: "No DDF or EMD". In North Carolina the due diligence
       fee is non-refundable money paid up front, so a contract without one is a
       substantive term, not a technicality — exactly the kind of lever a
       first-time buyer would never know to ask for. */
    lever: "No due diligence fee and no earnest money deposit.",
    reviewId: "zillow-steven-holt",
  },
  {
    id: "2022-prosperity-village-01",
    side: "buyer",
    year: 2022,
    month: 11,
    neighborhood: "Prosperity Village",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    /* Relocation is documented in the clients' own words — one review says they
       were moving from out of state, the other names Phoenix. */
    pillars: ["relocation"],
    /* Workbook: purchased below list, plus seller concessions. Both figures
       withheld; the disclaimer rule attaches to the number, not the fact. */
    lever: "Out-of-state buyers who saw the house once. Purchased under list price, with seller concessions on top.",
    /* Two reviews describe this one closing and must never both run on a page.
       Linking the Phoenix one, which is the stronger relocation evidence; its
       pair is zillow-cori-halter. */
    reviewId: "zillow-kathy-hannan",
  },

  /* Property type and neighborhood supplied directly for the three below —
     they carry no review, so nothing else documents them. */

  {
    id: "2022-dilworth-01",
    side: "buyer",
    year: 2022,
    month: 2,
    neighborhood: "Dilworth",
    city: "Charlotte",
    state: "NC",
    propertyType: "Condo",
    pillars: [],
    /* Workbook: under list by a five-figure sum, plus seller concessions. Both
       figures withheld — the fact is the lever, the number would drag the
       disclaimer onto the row. */
    lever: "Purchased under list price, with seller concessions on top.",
  },
  {
    id: "2022-oakwood-acres-01",
    side: "buyer",
    year: 2022,
    month: 8,
    neighborhood: "Oakwood Acres",
    city: "Rock Hill",
    state: "SC",
    propertyType: "Single Family",
    /* York County, and a listed SC market as of 2026-08-17 (CLAUDE.md §5), so
       the border pillar is the right tag rather than a stretch. */
    pillars: ["carolinas-border"],
    /* Workbook: "Buyer possesion before close". Possession ahead of closing is
       a real concession and a good example of a lever that is not price at all.
       No figure involved, which also keeps it clear of the SC non-disclosure
       problem that rules out prices on this row entirely. */
    lever: "Possession granted to the buyer before closing.",
  },
  {
    id: "2022-carlton-hills-01",
    side: "buyer",
    year: 2022,
    month: 12,
    /* Carlton Hills subdivision, within the wider Nevin community area. The
       subdivision is the finer-grained and more useful of the two. */
    neighborhood: "Carlton Hills",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    builder: "Northway Homes",
    pillars: ["new-construction"],
    /* Under list on a NEW BUILD, which is the noteworthy part — builders hold
       list price far harder than individual sellers, so this is a different
       achievement from the same line on a resale. Figure withheld as ever. */
    lever: "New construction purchased under the builder's list price.",
  },
  {
    id: "2022-shannon-park-01",
    side: "buyer",
    year: 2022,
    month: 4,
    neighborhood: "Shannon Park",
    city: "Charlotte",
    state: "NC",
    propertyType: "Single Family",
    pillars: [],
    /* Workbook: "$2500 Seller Concessions", and nothing else. The thinnest row
       in the ledger — no review, no highlight. It stays because a ledger that
       silently omits the unremarkable closings is not a ledger. */
    lever: "Seller concessions at closing.",
  },
  {
    id: "2022-southpark-01",
    side: "buyer",
    year: 2022,
    month: 9,
    /* The unit is in the Piedmont Row complex; the neighborhood recorded here
       is SouthPark, deliberately one level up. Naming a single condo complex
       alongside a month and a property type narrows toward the individual
       buyer, which is the same privacy line the street-address rule draws. */
    neighborhood: "SouthPark",
    city: "Charlotte",
    state: "NC",
    propertyType: "Condo",
    pillars: [],
    lever: "Purchased under list price.",
    /* The workbook marks this client as having left a review, but its text is
       recorded nowhere and no entry in lib/reviews matches. No reviewId until
       one is found. */
  },
];
