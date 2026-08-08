import Image from "next/image";

import type { BrandImage } from "@/lib/images";

/**
 * Every photograph on the site renders through this component.
 *
 * The treatment is deliberately minimal: a neutral hairline, square corners, no
 * overlay and no filter. The brand's structure is carried by rules rather than by
 * boxes (see the `rule-gold` / `rule-top` utilities in `globals.css`), and the
 * hairline is here for a practical reason as much as an aesthetic one — these
 * portraits have pale backgrounds, and without an edge they dissolve into the
 * ivory page.
 *
 * Gold is not used to frame photography. It stays a structural accent; a gold
 * border around a headshot reads as a certificate.
 */
export function BrandPhoto({
  photo,
  sizes,
  priority = false,
  className = "",
}: {
  photo: BrandImage;
  /**
   * Required. Without it Next assumes the image is full-viewport width and ships
   * a needlessly large file on every breakpoint.
   */
  sizes: string;
  /** Set only on an image above the fold. At most one per page. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={`h-auto w-full border border-border object-cover ${className}`}
    />
  );
}

/**
 * Stands in for a photograph that has not been taken yet, and states the brief so
 * the slot is a commission rather than a hole. Shared by every page so the boxes
 * cannot drift apart while they wait.
 *
 * Delete a usage the moment its photo lands in `lib/images.ts` — a placeholder
 * that survives to production is worse than no image at all.
 */
export function PhotoPlaceholder({
  label,
  note,
  className = "",
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder for photography: ${label}`}
      className={`flex flex-col items-start justify-end gap-1 border border-accent-soft/70 bg-surface-sunken p-6 ${className}`}
    >
      <span className="eyebrow">Photo placeholder</span>
      <span className="text-sm font-medium text-ink">{label}</span>
      {note ? <span className="text-sm text-ink-muted">{note}</span> : null}
    </div>
  );
}
