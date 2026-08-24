import type { Area } from "./types";

/**
 * Content rules for area pages, checked as data rather than as rendered markup.
 *
 * Area pages are the likeliest place on this site for a fair-housing problem and
 * for thin templated filler, and both are cheaper to catch in the dataset than
 * in a screenshot. lib/areas/index.test.ts runs everything here over every
 * published area, so a bad entry fails the build before it renders.
 */

/**
 * CLAUDE.md §7. Describe housing stock, amenities, commute, and price — never
 * who lives somewhere. "Good schools" is included deliberately: school quality
 * is the most common way an otherwise careful neighborhood page ends up making
 * a familial-status argument.
 */
const FAIR_HOUSING = [
  /\bsafe(?:r|st)?\s+(?:neighborhood|area|community|part of town)\b/i,
  /\bgood schools?\b/i,
  /\bbest schools?\b/i,
  /\bschool (?:quality|ratings?|scores?)\b/i,
  /\bup-and-coming\b/i,
  /\bfamily-friendly\b/i,
  /\bfamilies like\b/i,
  /\bexclusive (?:neighborhood|community|enclave)\b/i,
  /\bdesirable demographic\b/i,
  /\bcrime\b/i,
  /\btransitional (?:neighborhood|area)\b/i,
  /\bethnic\b/i,
  /\bchurches nearby\b/i,
];

/** BRAND-VOICE.md §2, the subset most likely to appear in location copy. */
const BANNED_PHRASES = [
  "nestled",
  "boasts",
  "dream home",
  "hidden gem",
  "up and coming",
  "luxury lifestyle",
  "unparalleled",
  "sought-after",
  "prestigious",
];

/** The authored prose of an area, as one string. */
export function areaText(area: Area): string {
  return [
    area.lede,
    /* targetQuery is authoring discipline and never renders, but it is scanned
       anyway: a page aiming at "safe neighborhoods in X" is one whose copy is
       about to go the same way, and catching it here is catching it early. */
    area.targetQuery,
    area.answer,
    area.housingStock,
    area.priceContext,
    area.commute,
    area.whatTrades,
    ...area.levers.flatMap((lever) => [lever.title, lever.body]),
    ...area.faq.flatMap((entry) => [entry.question, entry.answer]),
  ].join("\n");
}

/** Fair-housing and banned-language hits. Empty means clean. */
export function findProhibitedLanguage(area: Area): string[] {
  const text = areaText(area);
  const hits: string[] = [];

  for (const pattern of FAIR_HOUSING) {
    const match = text.match(pattern);
    if (match) hits.push(`fair-housing: "${match[0]}"`);
  }

  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) hits.push(`banned: "${phrase}"`);
  }

  return hits;
}

/**
 * Structural completeness. A market with a half-written entry is exactly the
 * thin page CONTENT-PLAN.md says not to publish, so it fails rather than ships.
 */
export function findIncompleteFields(area: Area): string[] {
  const problems: string[] = [];
  const prose: [keyof Area, string][] = [
    ["lede", area.lede],
    ["answer", area.answer],
    ["housingStock", area.housingStock],
    ["priceContext", area.priceContext],
    ["commute", area.commute],
    ["whatTrades", area.whatTrades],
  ];

  for (const [field, value] of prose) {
    if (!value?.trim()) problems.push(`${String(field)} is empty`);
    else if (value.trim().length < 80) problems.push(`${String(field)} is too short to be real`);
  }

  if (!area.targetQuery?.trim()) problems.push("targetQuery is empty");

  /* Whatever ends up in the meta description has to survive a result listing
     without being cut mid-clause. Checked against the value the page actually
     renders, so a long lede with no override fails here rather than silently
     truncating in search. */
  const meta = area.metaDescription ?? area.lede;
  if (meta.trim().length > 160) {
    problems.push(
      `meta description is ${meta.trim().length} characters, over the 160 limit (set metaDescription)`,
    );
  }

  if (area.levers.length < 2) problems.push("needs at least two local levers");
  for (const lever of area.levers) {
    if (!lever.title?.trim() || !lever.body?.trim()) problems.push("a lever is missing text");
    else if (lever.body.trim().length < 80) problems.push(`lever "${lever.title}" is too short`);
  }

  if (area.faq.length < 2) problems.push("needs at least two FAQ entries");
  for (const entry of area.faq) {
    if (!entry.question?.trim() || !entry.answer?.trim()) {
      problems.push("an FAQ entry is missing text");
    } else if (entry.answer.trim().length < 80) {
      problems.push(`FAQ "${entry.question}" is too short to stand alone`);
    }
  }

  return problems;
}

/**
 * FAQ answers that quote a dollar figure. Must be empty.
 *
 * These get lifted and quoted with nothing beside them, so the §7 results
 * disclaimer cannot travel with them. Same rule lib/blog/validate.ts applies to
 * a post's FAQ, and for the same reason. Figures belong in the body, where the
 * disclaimer is visible on the page.
 */
export function findDollarFiguresInFaq(area: Area): string[] {
  return area.faq
    .filter((entry) => /\$\s?[\d,]+/.test(entry.answer))
    .map((entry) => entry.question);
}

/** True when the area quotes a dollar amount, which pulls in the §7 disclaimer. */
export function showsDollarFigure(area: Area): boolean {
  return /\$\s?[\d,]+/.test(areaText(area));
}
