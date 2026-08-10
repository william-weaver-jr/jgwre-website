import { AGENT } from "@/lib/site";

/**
 * Official trademark artwork for the footer marks.
 *
 * Both entries are `null` until the licensed files are in public/marks/.
 * While they are null the footer renders compliant text instead — see
 * components/compliance-marks.tsx for why text beats redrawn artwork.
 *
 * Do not populate these with artwork you drew, traced, or generated. The files
 * must be the ones NAR distributes to members.
 * See public/marks/README.md for how to obtain them.
 */

type MarkAsset = {
  src: string;
  width: number;
  height: number;
};

type RealtorAsset = MarkAsset & {
  /**
   * NAR requires the logo to identify the member, the member's firm, or a
   * Member Board, set directly below the block "R".
   */
  identifier: string;
};

export const OFFICIAL_MARKS: {
  equalHousing: MarkAsset | null;
  realtor: RealtorAsset | null;
} = {
  // Once public/marks/equal-housing-opportunity.svg exists:
  // { src: "/marks/equal-housing-opportunity.svg", width: 120, height: 120 }
  equalHousing: null,

  // Once public/marks/realtor-logo.svg exists:
  // { src: "/marks/realtor-logo.svg", width: 120, height: 120, identifier: AGENT.name }
  realtor: null,
};

/** Referenced in the commented example above; keeps the import honest. */
export const REALTOR_IDENTIFIER = AGENT.name;
