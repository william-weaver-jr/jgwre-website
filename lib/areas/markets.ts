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
];
