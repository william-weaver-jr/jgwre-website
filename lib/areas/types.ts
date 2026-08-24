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
 * One question and its answer, rendered on the page and emitted as FAQPage
 * JSON-LD.
 *
 * The AEO surface, and the same contract the blog's PostFaq carries: an answer
 * engine quoting this site quotes one of these with nothing beside it, so each
 * answer stands alone and none may contain a dollar figure — the §7 results
 * disclaimer cannot travel with a lifted snippet.
 */
export type AreaFaq = {
  question: string;
  answer: string;
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

  /**
   * The meta description, when the lede is the wrong length for one.
   *
   * The two have different jobs. A lede is read on the page with the h1 above
   * it and can run as long as the sentence needs. A meta description is cut off
   * around 160 characters in a result listing, so a long lede reused here gets
   * truncated mid-clause. Falls back to `lede` when absent, which is correct
   * whenever the lede already fits.
   */
  metaDescription?: string;

  /**
   * The query this page exists to answer, phrased the way someone would type it
   * or say it aloud. Authoring discipline, never rendered — an area page that
   * cannot name its query is a page built for a keyword rather than a reader.
   */
  targetQuery: string;

  /**
   * The self-contained answer to `targetQuery`, rendered directly under the h1.
   *
   * Highest-leverage field on the page for AEO: it is what an answer engine
   * lifts. Three or four sentences that stand entirely on their own, because
   * they will be read with nothing around them. docs/CONTENT-MARKETING.md §3.
   */
  answer: string;
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

  /** Two or more FAQ entries. Rendered, and emitted as FAQPage JSON-LD. */
  faq: readonly AreaFaq[];
};
