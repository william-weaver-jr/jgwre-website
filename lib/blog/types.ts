import type { ComponentType } from "react";

/**
 * The two things this blog publishes, and nothing else.
 *
 * docs/CONTENT-PLAN.md rules out market-stat posts by name, and neighborhood
 * content belongs in lib/areas/data.ts rather than here — a post about Fort Mill
 * would compete with /areas/fort-mill for the same query, which is the
 * cannibalization CLAUDE.md §11 warns about. See docs/CONTENT-MARKETING.md.
 *
 * - `negotiation` — the USP extended. What is askable, when, and why.
 * - `process`     — how a transaction actually works, question-shaped.
 */
export type PostCategory = "negotiation" | "process";

export const POST_CATEGORIES: Record<PostCategory, { label: string; blurb: string }> = {
  negotiation: {
    label: "What's askable",
    blurb:
      "Which levers exist, when they exist, and why the other side of the table already knows.",
  },
  process: {
    label: "How it actually works",
    blurb: "The mechanics of a transaction, answered plainly and without a sales pitch.",
  },
};

/**
 * One question and its answer, rendered on the page and emitted as FAQPage
 * JSON-LD.
 *
 * This is the AEO surface. An answer engine quoting this site will quote one of
 * these, so each answer has to stand alone with no surrounding paragraph to lean
 * on — and has to survive being read aloud with no disclaimer attached, which is
 * why lib/blog/validate.ts refuses a dollar figure in one.
 */
export type PostFaq = {
  question: string;
  answer: string;
};

/**
 * The authored metadata for one post. The prose body lives beside it as MDX.
 *
 * Every field is required except `updatedAt` and `pillar`, and
 * lib/blog/index.test.ts asserts each is present, substantive, and not shared
 * with another post.
 */
export type Post = {
  slug: string;
  /** The `<h1>`. Question-shaped where the query is a question. */
  title: string;
  /** Meta description. Not a duplicate of `answer`. */
  description: string;
  category: PostCategory;

  /**
   * The query this post exists to answer, phrased the way a reader would type it
   * into Google or say it to ChatGPT. Authoring discipline, not rendered copy —
   * a post that cannot name its query has no reason to exist.
   */
  targetQuery: string;

  /**
   * The self-contained answer, rendered directly under the h1 before the body.
   *
   * Two to four sentences that fully answer `targetQuery` without the reader
   * scrolling. This is the single highest-leverage field for AEO: it is what an
   * answer engine lifts, and burying the answer under 600 words of preamble is
   * why most agent blogs are never cited.
   */
  answer: string;

  /** ISO `YYYY-MM-DD`. A future date schedules the post — see index.ts. */
  publishedAt: string;
  /** ISO `YYYY-MM-DD`. Set when the substance changes, not for a typo fix. */
  updatedAt?: string;

  /** Two or more. Rendered, and emitted as FAQPage structured data. */
  faq: readonly PostFaq[];

  /** An `href` from PILLARS in lib/site.ts. Points the reader at the deep page. */
  pillar?: string;

  /**
   * Set when the MDX body quotes a documented case-study figure. Renders the §7
   * results disclaimer beside the post.
   *
   * It is a flag rather than something derived because the body is a compiled
   * component by the time a page renders, and there is nothing to scan. Forgetting
   * it is not silent: tests/compliance.test.tsx fails any rendered page that shows
   * a dollar figure without the disclaimer, which is exactly this case.
   */
  citesResults?: boolean;

  /** The closing intake. Specific to the post, never a generic sign-off. */
  cta: { heading: string; body: string };

  /**
   * The MDX body, as a dynamic import from content/blog.
   *
   * Registered here rather than resolved from the slug so that the import
   * specifier is a static string a bundler can follow, and so that
   * lib/blog/index.test.ts can assert registry and directory agree.
   */
  body: () => Promise<{ default: ComponentType<Record<string, never>> }>;
};
