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

  /**
   * The due-diligence format. Absent on markets whose page is the negotiation
   * layout (Steele Creek); present where the decision a reader is actually
   * worried about is the property itself rather than the price.
   *
   * See AreaGuide below and docs/AREAS-SPEC.md §14 for when to use it.
   */
  guide?: AreaGuide;
};

/** A contextual call to action between sections. Every one goes somewhere real. */
export type AreaCta = {
  /** The question or prompt the reader is left holding, in display type. */
  prompt: string;
  label: string;
  /**
   * `#start` scrolls to the intake on this page and is tracked as an intake
   * start by components/contact-link-tracking.tsx. Anything else must be a
   * route that exists.
   */
  href: string;
};

/**
 * The diligence layout, for attached-housing markets where the building, the
 * association, and the block decide more than the neighborhood does.
 *
 * Written first for South End, 2026-09-14. It reuses the six required Area
 * fields rather than replacing them, so the validators, the distinctness test,
 * and the hub card all keep working unchanged:
 *
 *   answer        → the quick answer under "what should you know"
 *   housingStock  → the opening of "what can you buy"
 *   levers        → the unit / building / block layers — for this format, the
 *                   three places the other side of the table knows more than
 *                   the listing says
 *   commute       → the opening of the walkability section
 *   priceContext  → the opening of the ownership-cost section
 *   whatTrades    → the opening of the seller section
 *
 * Every string in here is scanned by lib/areas/validate.ts areaText(), so the
 * fair-housing and banned-language rules reach it exactly as they reach the
 * six fields above. A new string field added here must be added there too.
 */
export type AreaGuide = {
  /**
   * The city the market sits inside, for the eyebrow and the schema's Place —
   * "South End, Charlotte, NC". A neighborhood is not findable by its own name
   * alone the way a town is.
   */
  city: string;
  /** The h1. Replaces "{name} and what is negotiable in it." */
  headline: string;
  /** The second hero paragraph, under the lede. */
  heroCloser: string;
  /** `<title>` before the site-name suffix the layout appends. */
  seoTitle: string;
  /** Label for the hero's secondary button, which scrolls to the intake. */
  heroCta: string;

  answerHeading: string;
  facts: readonly { label: string; value: string }[];

  /**
   * Where the market is, and what its name actually covers. Optional, and
   * worth having only where the name is fuzzier than buyers assume — a
   * marketing label attached to more ground than any boundary supports, which
   * is the single most useful thing to tell a Ballantyne searcher first.
   */
  orientation?: {
    eyebrow: string;
    heading: string;
    body: readonly string[];
  };

  /**
   * Schools, handled the only way §7 permits: assignment is a fact of address,
   * it changes, and it is verified at the district rather than here. No
   * ratings, no rankings, no "good schools" — docs/AREAS-SPEC.md §4 records
   * that this is the single most common way a careful neighborhood page ends
   * up making a familial-status argument. Optional; omit rather than pad.
   */
  schools?: {
    eyebrow: string;
    heading: string;
    body: readonly string[];
    /** The district's own site. External, and labelled as such in the markup. */
    link: { href: string; label: string };
  };

  housingHeading: string;
  propertyTypes: readonly {
    name: string;
    goodFor: string;
    /** Absent for a type described in prose only. */
    checks?: readonly string[];
  }[];
  housingCta: AreaCta;

  layersHeading: string;
  layersIntro: string;
  layersClosing: string;

  /**
   * Getting around. Generalised 2026-09-21 for Ballantyne: South End's version
   * of this section was three hard-coded columns about a rail line, and a
   * car-dependent market has to be able to say something honest here rather
   * than borrow a transit frame it does not have.
   */
  transitEyebrow: string;
  transitHeading: string;
  transitColumns: readonly { heading: string; items: readonly string[] }[];
  transitCallout: string;

  changeHeading: string;
  changeBody: readonly string[];
  /**
   * Named projects, each labelled with where it actually is — open, under
   * construction, or planned. Optional, because not every market has a
   * build-out worth itemising.
   *
   * The label is the point. A development page that lists an approved project
   * beside a finished one reads as a promise about the finished one, and
   * every date in here ages, so each entry states its own status rather than
   * relying on a reader to infer it.
   */
  changeItems?: readonly { status: string; name: string; body: string }[];

  costHeading: string;
  costChecks: readonly string[];
  costClosing: string;
  costCta: AreaCta;

  buyerHeading: string;
  buyerQuestions: readonly string[];
  buyerClosing: string;
  buyerCta: AreaCta;

  sellerHeading: string;
  sellerChecks: readonly string[];
  sellerClosing: string;
  sellerCta: AreaCta;

  nearbyHeading: string;
  /**
   * `slug` links the entry only once that market's page is published — naming a
   * neighbor is fine, linking a 404 is not. A place off the §5 roster carries no
   * slug at all.
   */
  nearby: readonly { name: string; slug?: string; chooseWhen: string }[];

  faqHeading: string;

  closingHeading: string;
  closingBody: string;
  intakeHeading: string;
  intakeBody: string;
  /**
   * The intake's market-group answer, prefilled so the lead reaches Follow Up
   * Boss already labeled. A value from lib/intake/questions.ts MARKET_OPTIONS;
   * the visitor can still change it.
   */
  intakeMarket: string;
};
