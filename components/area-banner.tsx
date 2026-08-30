import Image from "next/image";

import type { SourcedImage } from "@/lib/images";

/**
 * The establishing strip above an area page's hero.
 *
 * It is a band rather than a hero image, and that is a decision rather than a
 * limitation. These pages open with a claim — *here is what is negotiable in
 * this specific market* — and a full-bleed photograph pushes that claim below
 * the fold in exchange for a stock picture of a place the reader is already
 * standing in. The band orients and gets out of the way.
 *
 * It also matches what the source files can honestly carry. A borrowed image is
 * whatever resolution it is; cropping a wide frame to a short band is a use it
 * supports, and stretching one to fill a tall hero is not.
 *
 * `BrandPhoto` is deliberately not reused here. That component renders a
 * photograph at its own aspect ratio behind a hairline, which is right for a
 * portrait and wrong for a crop, and it takes a `BrandImage` — which cannot
 * carry the credit line this needs.
 */
export function AreaBanner({ image }: { image: SourcedImage }) {
  return (
    <figure className="border-b border-border">
      <div className="relative h-40 w-full overflow-hidden md:h-56">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          /* Full-bleed at every breakpoint, so the browser may as well be told
             so plainly rather than guess from the default. */
          sizes="100vw"
          placeholder="blur"
          className="object-cover"
          priority
        />
      </div>
      {/* Below the image, not over it. An overlaid credit either fails contrast
          against whatever happens to be in the frame or needs a scrim, and a
          scrim over a photograph to accommodate six words of small type is a
          lot of design for a line nobody is required to print. CLAUDE.md §10. */}
      <figcaption className="mx-auto max-w-6xl px-gutter py-3 text-xs text-ink-muted">
        {image.credit}
      </figcaption>
    </figure>
  );
}
