import { AREAS } from "./data";
import { MARKETS } from "./markets";
import type { Area, Market } from "./types";

export { AREAS } from "./data";
export { MARKETS } from "./markets";
export type { Area, AreaLever, AreaState, Market } from "./types";

/**
 * The areas that have real authored content, and therefore real pages.
 *
 * Everything routes through this. A market in MARKETS without an entry in
 * data.ts has no page and 404s, which is what docs/CONTENT-PLAN.md asks for.
 */
export function publishedAreas(): readonly Area[] {
  return AREAS;
}

export function areaBySlug(slug: string): Area | undefined {
  return AREAS.find((area) => area.slug === slug);
}

/** Markets from §5 that are still waiting on content. Useful in tests and copy. */
export function unwrittenMarkets(): readonly Market[] {
  const written = new Set(AREAS.map((area) => area.slug));
  return MARKETS.filter((market) => !written.has(market.slug));
}

/** NC first, then SC; alphabetical within each. Stable ordering for lists. */
export function sortAreas(areas: readonly Area[]): Area[] {
  return [...areas].sort(
    (a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name),
  );
}
