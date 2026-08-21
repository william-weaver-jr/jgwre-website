export type AreaState = "NC" | "SC";

/** A market in CLAUDE.md §5. The roster is factual; the page content is authored. */
export type Market = {
  slug: string;
  name: string;
  state: AreaState;
  /**
   * The city on the mailing address, when it is not the market's own name.
   *
   * Set only where the two genuinely differ. Lake Wylie is the case this exists
   * for: it is a census-designated place, not a municipality, and it sits in ZIP
   * 29710 whose only post office is Clover — so a house on the lake is addressed
   * "Clover, SC" while the town of Clover is about ten miles west on SC 557.
   *
   * This is why CLAUDE.md §5 writes the market as "Clover / Lake Wylie". Both
   * names are load-bearing: buyers search the one they have heard of, and read
   * the other one on the paperwork. Stating it is orientation, not decoration.
   *
   * It is a postal fact and nothing more. It does not imply the market is part
   * of that town, and it is not a listing or MLS field — Locked Decision #1.
   */
  postalCity?: string;
};

/**
 * One negotiation lever that tends to exist in this submarket.
 *
 * This is the USP applied locally — "what does the other side of *this* table
 * know that our reader doesn't" — and it is the only thing that separates these
 * pages from the thousands of templated Charlotte neighborhood pages.
 * docs/CONTENT-PLAN.md.
 */
export type AreaLever = {
  title: string;
  body: string;
};

/**
 * The authored content for one area page.
 *
 * Every field is required, and lib/areas/index.test.ts asserts each is present,
 * substantive, and not shared verbatim with another area. A market with nothing
 * real to say does not get a page — it is simply absent from data.ts and its URL
 * 404s. docs/CONTENT-PLAN.md: "Thin duplicated pages hurt more than they help."
 */
export type Area = Market & {
  /** The lede under the h1. One or two sentences, specific to this market. */
  lede: string;
  /** What is actually built here — eras, types, lot patterns, construction. */
  housingStock: string;
  /** How price behaves here relative to the metro. No invented figures. */
  priceContext: string;
  /** Drive times and routes. Distances, not judgments. */
  commute: string;
  /** What typically changes hands, and in what condition. */
  whatTrades: string;
  /** Two or more levers that tend to exist here. */
  levers: readonly AreaLever[];
};
