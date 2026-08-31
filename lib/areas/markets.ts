import type { Market } from "./types";

/**
 * The markets from CLAUDE.md §5, and which side of the state line each is on.
 *
 * This is a roster, not page content. Names and states are plain facts, so they
 * live here; everything a visitor would read is authored in data.ts.
 *
 * A market appearing here does NOT mean it has a page. Only entries in data.ts
 * get published — see lib/areas/index.ts.
 */
export const MARKETS: readonly Market[] = [
  { slug: "ballantyne", name: "Ballantyne", state: "NC" },
  { slug: "southpark", name: "SouthPark", state: "NC" },
  { slug: "steele-creek", name: "Steele Creek", state: "NC" },
  { slug: "myers-park", name: "Myers Park", state: "NC" },
  { slug: "dilworth", name: "Dilworth", state: "NC" },
  { slug: "south-end", name: "South End", state: "NC" },
  { slug: "loso", name: "LoSo", state: "NC" },
  { slug: "uptown", name: "Uptown", state: "NC" },
  { slug: "pineville", name: "Pineville", state: "NC" },
  { slug: "waxhaw", name: "Waxhaw", state: "NC" },
  /* Added 2026-08-31, not from her own account but from the workbook's own
     Geographical Submarket column, which groups a real cluster of closings
     under this name. Seven rows carry it exactly — Shannon Park, Windsor
     Park, Turtle Rock, Fieldlark Trails, and Easthaven (×2, both 2022 and
     2023) — the single largest evidence count of any market on this roster,
     ahead of every market that predates it. See lib/transactions/data.ts and
     the tally in docs/AREAS-SPEC.md §11. */
  { slug: "east-charlotte", name: "East Charlotte", state: "NC" },
  /* Added 2026-08-31, same source and method as East Charlotte, above. Four
     rows carry it exactly — Trinity Park, Moores Chapel Village, and Aveline
     at Coulwood (×2, both closings). Two nearby submarket labels in the same
     column, "North Charlotte" and "North Charlotte / University Area", are
     NOT the same value and are deliberately not folded in here — Carlton
     Hills, Brownes Ferry, and Katelyn Moors stay unmapped rather than
     stretched into a market they were not recorded against. */
  { slug: "northwest-charlotte", name: "Northwest Charlotte", state: "NC" },
  { slug: "fort-mill", name: "Fort Mill", state: "SC" },
  { slug: "tega-cay", name: "Tega Cay", state: "SC" },
  { slug: "indian-land", name: "Indian Land", state: "SC" },
  /* "Clover / Lake Wylie" in CLAUDE.md §5, and the slash is doing real work.
     The market is the lake — the Lake Wylie CDP, unincorporated York County.
     Clover is the postal city its addresses carry, not a second market and not
     a parent of this one: the town itself is roughly ten miles west and is not
     where she is positioned. Naming it here keeps the market findable under the
     name that appears on the paperwork without claiming the town. */
  { slug: "lake-wylie", name: "Lake Wylie", state: "SC", postalCity: "Clover" },
  /* In §5's markets-served line since it was written, and missing here until
     2026-08-21. Not a thin addition: two closings in the ledger
     (2023-lexington-commons-01, 2022-midbrook-01) and four reviews, which is
     more documented evidence than several markets that were already listed. */
  { slug: "rock-hill", name: "Rock Hill", state: "SC" },
];
