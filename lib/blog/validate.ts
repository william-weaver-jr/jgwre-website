import type { Post } from "./types";

/**
 * Content rules for blog posts, checked as text rather than as rendered markup.
 *
 * This file exists because of how these posts get written. Everything else on
 * this site was authored once, by hand, with CLAUDE.md open. The blog is a
 * cadence — a batch of drafts every few weeks, generated fast, published on a
 * schedule — and the failure mode of generated real estate copy is completely
 * predictable: it invents a median sale price, it rounds $22,210 to "over
 * $22K", it says "up-and-coming", it promises what she will get you. Every one
 * of those is an advertising violation published under NC 334700 and SC 125546.
 *
 * So the rules are mechanical, and lib/blog/index.test.ts runs all of them over
 * both the metadata in data.ts and the raw MDX in content/blog. A post that
 * breaks one fails the build. CLAUDE.md §6 and §7.
 */

/**
 * Every dollar figure and percentage this site is permitted to state, from
 * CLAUDE.md §5 and docs/CASE-STUDIES.md. Anything else is undocumented until
 * someone verifies it.
 *
 * Normalized: lowercase, no spaces, no separators. Compared against the same
 * normalization of whatever the copy contains, so "$22,210" and "$22210" are
 * one entry and neither "$22k" nor "over $22,000" matches — which is the point.
 * CASE-STUDIES.md: "Do not round up or restate the figures."
 */
const DOCUMENTED_FIGURES = new Set([
  /* Case 1 — resale */
  "$20000",
  "$22210",
  "$34000",
  /* Case 3 — new construction */
  "$50000",
  "3%",
  /* §5 career and 2024 production */
  "$30.9million",
  "$9.9million",
  "98.84%",
]);

/** `$1.2 million`, `$50,000`, `$22,210`, `$30.9M` — every shape copy might use. */
const DOLLAR = /\$\s?\d[\d,]*(?:\.\d+)?\s?(?:million|billion|m\b|k\b)?/gi;
const PERCENT = /\b\d+(?:\.\d+)?\s?%/g;

function normalizeFigure(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, "")
    .replace(/(\d)m$/, "$1million")
    .replace(/(\d)b$/, "$1billion");
}

/**
 * CLAUDE.md §7, same list the area pages are held to. School quality is in here
 * deliberately: it is the most common way an otherwise careful post ends up
 * making a familial-status argument.
 */
const FAIR_HOUSING = [
  /\bsafe(?:r|st)?\s+(?:neighborhood|area|community|part of town|place)\b/i,
  /\bgood schools?\b/i,
  /\bbest schools?\b/i,
  /\bgreat schools?\b/i,
  /\bschool (?:quality|ratings?|scores?|district is)\b/i,
  /\bup[- ]and[- ]coming\b/i,
  /\bfamily[- ]friendly\b/i,
  /\bfamilies like\b/i,
  /\bgood for families\b/i,
  /\bexclusive (?:neighborhood|community|enclave)\b/i,
  /\bdesirable demographic\b/i,
  /\bcrime\b/i,
  /\btransitional (?:neighborhood|area)\b/i,
  /\bethnic\b/i,
  /\bchurches nearby\b/i,
];

/** BRAND-VOICE.md §2, plus the filler that generated copy reaches for first. */
const BANNED_PHRASES = [
  "nestled",
  "boasts",
  "dream home",
  "hidden gem",
  "luxury lifestyle",
  "unparalleled",
  "passionate about helping",
  "your trusted charlotte realtor",
  "let me help you find",
  "whether you're buying or selling",
  "whether you are buying or selling",
  "negotiation queen",
  "queen of negotiations",
  "sought-after",
  "prestigious",
  "in today's ever-changing market",
  "at the end of the day",
  "when it comes to",
];

/**
 * Outcome claims. CLAUDE.md §7 bans guarantees; CASE-STUDIES.md separately bans
 * aggregating three deals into an implied average. Both are here because a post
 * summarizing her results is where the two failures meet.
 */
const OUTCOME_CLAIMS = [
  /\bguarantee[ds]?\b/i,
  /\bi'?ll get you\b/i,
  /\bi always\b/i,
  /\bevery client\b/i,
  /\bclients save\b/i,
  /\bon average,? (?:my )?(?:clients|buyers|sellers)\b/i,
  /\baverage savings\b/i,
  /\btypically saves?\b/i,
  /\bwill save you\b/i,
  /\byou'?ll save\b/i,
];

/**
 * docs/CONTENT-PLAN.md: "Avoid market-stat posts. They date instantly and every
 * agent publishes them." That is an editorial decision, but it is enforced here
 * because it is also the §6 risk — a market-stat post cannot be written without
 * numbers this repo does not document.
 */
const MARKET_STATS = [
  /\bmedian (?:home |sale |sales |list )?price\b/i,
  /\baverage (?:home |sale |sales |list )?price\b/i,
  /\bdays on market\b/i,
  /\bmonths of inventory\b/i,
  /\byear[- ]over[- ]year\b/i,
  /\bmarket (?:report|update|snapshot|statistics)\b/i,
  /\bhome values (?:rose|fell|increased|decreased)\b/i,
];

export type Finding = { rule: string; match: string };

/** Every rule above, over one blob of text. Empty means clean. */
export function findProblems(text: string): Finding[] {
  const findings: Finding[] = [];

  const scan = (patterns: RegExp[], rule: string) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) findings.push({ rule, match: match[0] });
    }
  };

  scan(FAIR_HOUSING, "fair-housing");
  scan(OUTCOME_CLAIMS, "outcome-claim");
  scan(MARKET_STATS, "market-stat");

  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) findings.push({ rule: "banned-language", match: phrase });
  }

  for (const raw of [...(text.match(DOLLAR) ?? []), ...(text.match(PERCENT) ?? [])]) {
    if (!DOCUMENTED_FIGURES.has(normalizeFigure(raw))) {
      findings.push({ rule: "undocumented-figure", match: raw.trim() });
    }
  }

  return findings;
}

/** The authored metadata of a post, as one string. The MDX body is scanned separately. */
export function postText(post: Post): string {
  return [
    post.title,
    post.description,
    post.answer,
    ...post.faq.flatMap((entry) => [entry.question, entry.answer]),
    post.cta.heading,
    post.cta.body,
  ].join("\n");
}

/** True when a post quotes a dollar amount, which pulls in the §7 disclaimer. */
export function showsDollarFigure(text: string): boolean {
  return /\$\s?\d/.test(text);
}

/**
 * Structural completeness. A thin post is worse than no post — CLAUDE.md §11 —
 * and an FAQ answer that trails off is the one an answer engine will quote.
 */
export function findIncompleteFields(post: Post): string[] {
  const problems: string[] = [];

  if (!post.title?.trim()) problems.push("title is empty");
  if (!post.targetQuery?.trim()) problems.push("targetQuery is empty");

  if (!post.description?.trim()) problems.push("description is empty");
  else if (post.description.length > 160) problems.push("description exceeds 160 characters");

  if (!post.answer?.trim()) problems.push("answer is empty");
  else if (post.answer.trim().length < 120) problems.push("answer is too short to stand alone");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt)) {
    problems.push(`publishedAt "${post.publishedAt}" is not YYYY-MM-DD`);
  }
  if (post.updatedAt && !/^\d{4}-\d{2}-\d{2}$/.test(post.updatedAt)) {
    problems.push(`updatedAt "${post.updatedAt}" is not YYYY-MM-DD`);
  }
  if (post.updatedAt && post.updatedAt < post.publishedAt) {
    problems.push("updatedAt precedes publishedAt");
  }

  if (post.faq.length < 2) problems.push("needs at least two FAQ entries");
  for (const entry of post.faq) {
    if (!entry.question.trim().endsWith("?")) {
      problems.push(`FAQ "${entry.question}" is not a question`);
    }
    if (entry.answer.trim().length < 80) {
      problems.push(`FAQ answer for "${entry.question}" is too short to stand alone`);
    }
    /*
      An FAQ answer is extracted from its page and quoted without whatever sits
      next to it, so the §7 disclaimer cannot travel with it. Keep the figures in
      the body, where the disclaimer is visible.
    */
    if (/\$\s?\d/.test(entry.answer)) {
      problems.push(`FAQ answer for "${entry.question}" states a dollar figure`);
    }
  }

  if (!post.cta.heading?.trim() || !post.cta.body?.trim()) problems.push("cta is incomplete");

  return problems;
}
