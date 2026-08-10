import Image from "next/image";

import { OFFICIAL_MARKS } from "@/lib/marks";

/**
 * The Equal Housing Opportunity and REALTOR® marks required in the footer of
 * every page. CLAUDE.md §7.
 *
 * These render as TEXT until the official artwork is in place. That is
 * deliberate: earlier revisions shipped hand-drawn SVG approximations of both
 * marks, which is a worse problem than having no logo. An invented block "R"
 * looks authoritative while being an unauthorized use of a registered mark, and
 * NAR licenses its artwork to members on specific terms — redrawing it is not
 * one of them.
 *
 * The word REALTOR® with the registered symbol is itself a proper use of the
 * mark, so the text treatment is defensible on its own. It is still an interim
 * state, not the destination.
 *
 * To finish this: download both logos from https://www.nar.realtor/logos-and-trademark-rules
 * using Jasmine's member login, drop them in public/marks/ under the filenames
 * in lib/marks.ts, and fill in the dimensions there. Nothing else changes —
 * these components switch to the artwork automatically. See public/marks/README.md.
 */

export function EqualHousingMark() {
  const asset = OFFICIAL_MARKS.equalHousing;

  if (asset) {
    return (
      <Image
        src={asset.src}
        alt="Equal Housing Opportunity"
        width={asset.width}
        height={asset.height}
        className="h-10 w-auto"
      />
    );
  }

  return (
    <span
      className="text-[0.6875rem] leading-tight font-semibold tracking-wide uppercase"
      data-mark="equal-housing"
    >
      Equal Housing Opportunity
    </span>
  );
}

export function RealtorMark() {
  const asset = OFFICIAL_MARKS.realtor;

  if (asset) {
    /*
      NAR requires the member identifier directly below the block "R", and an
      area of isolation equal to half the block "R" width on all sides. The
      padding below supplies the isolation; the identifier is the caption.
      Membership Marks Manual, https://www.nar.realtor/membership-marks-manual
    */
    return (
      <span className="inline-flex flex-col items-center gap-1 p-[calc(1.25rem/2)]">
        <Image
          src={asset.src}
          alt="REALTOR®"
          width={asset.width}
          height={asset.height}
          className="h-10 w-auto"
        />
        <span className="text-[0.625rem] leading-none font-semibold tracking-wide uppercase">
          {asset.identifier}
        </span>
      </span>
    );
  }

  return (
    <span
      className="text-[0.6875rem] leading-tight font-semibold tracking-wide uppercase"
      data-mark="realtor"
    >
      REALTOR&reg;
    </span>
  );
}
