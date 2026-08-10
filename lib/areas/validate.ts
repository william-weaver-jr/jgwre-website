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
    area.housingStock,
    area.priceContext,
    area.commute,
    area.whatTrades,
    ...area.levers.flatMap((lever) => [lever.title, lever.body]),
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
    ["housingStock", area.housingStock],
    ["priceContext", area.priceContext],
    ["commute", area.commute],
    ["whatTrades", area.whatTrades],
  ];

  for (const [field, value] of prose) {
    if (!value?.trim()) problems.push(`${String(field)} is empty`);
    else if (value.trim().length < 80) problems.push(`${String(field)} is too short to be real`);
  }

  if (area.levers.length < 2) problems.push("needs at least two local levers");
  for (const lever of area.levers) {
    if (!lever.title?.trim() || !lever.body?.trim()) problems.push("a lever is missing text");
    else if (lever.body.trim().length < 80) problems.push(`lever "${lever.title}" is too short`);
  }

  return problems;
}

/** True when the area quotes a dollar amount, which pulls in the §7 disclaimer. */
export function showsDollarFigure(area: Area): boolean {
  return /\$\s?[\d,]+/.test(areaText(area));
}
