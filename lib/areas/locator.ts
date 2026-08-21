export type LocatorPoint = {
  /** 0–100 on the schematic map's x axis in AreaLocator, west → east. */
  x: number;
  /** 0–100 on the schematic map's y axis in AreaLocator, north → south. */
  y: number;
  /**
   * One short, purely geographic orientation line — infrastructure and distance,
   * never neighborhood character. CLAUDE.md §7 (fair housing) applies here same
   * as any other area copy.
   */
  note: string;
};

/**
 * Hand-placed positions for AreaLocator, a schematic (not surveyed) map of a
 * market's approximate position relative to Uptown Charlotte and the I-485 loop.
 *
 * Only markets with a real, published area page (lib/areas/data.ts) belong here.
 * Add a market's point when its page ships — the area page renders AreaLocator
 * only when a point exists, so an unwritten market simply doesn't show one.
 */
export const LOCATOR_POINTS: Readonly<Record<string, LocatorPoint>> = {
  "steele-creek": {
    x: 27,
    y: 63,
    note: "Southwest Charlotte, inside I-485, adjoining Charlotte Douglas International Airport.",
  },
};

export function locatorPoint(slug: string): LocatorPoint | undefined {
  return LOCATOR_POINTS[slug];
}
