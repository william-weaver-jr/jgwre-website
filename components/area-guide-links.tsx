import Link from "next/link";
import type { ReactNode } from "react";

import { areaBySlug, publishedAreas, sortAreas } from "@/lib/areas";

/*
  How the area guides reach the rest of the site. 2026-09-14, Bill: the guides
  are marketing — they exist to win business in those markets — so they are
  linked by name from the pages a reader in that market is already on, not
  only through the /areas hub.

  Everything here reads publishedAreas(), so a new guide appears in the strip
  and the footer the day it lands, and a named link to a guide that is later
  unpublished degrades to plain text rather than a 404.
*/

const LINK = "decoration-accent-soft decoration-1 underline-offset-4 hover:underline";

/** A named link to one guide, or its name as text if that guide is not published. */
export function GuideLink({ slug, children }: { slug: string; children?: ReactNode }) {
  const area = areaBySlug(slug);
  if (!area) return <>{children}</>;
  return (
    <Link href={`/areas/${area.slug}`} className={LINK}>
      {children ?? area.name}
    </Link>
  );
}

/**
 * Every published guide as a card, name plus lede. Used on the home page and
 * at the foot of each guide (minus itself), so the guides link to each other.
 */
export function AreaGuidesStrip({
  eyebrow,
  heading,
  body,
  exclude,
  id,
  className = "",
}: {
  eyebrow: string;
  heading: string;
  body?: ReactNode;
  exclude?: string;
  id: string;
  className?: string;
}) {
  const areas = sortAreas(publishedAreas()).filter((area) => area.slug !== exclude);
  if (areas.length === 0) return null;

  return (
    <section aria-labelledby={id} className={`mx-auto max-w-6xl px-gutter ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
        {heading}
      </h2>
      {body ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">{body}</p>
      ) : null}
      <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <article key={area.slug} className="rule-top pt-6">
            <h3 className="font-display text-2xl leading-snug md:text-3xl">
              <Link href={`/areas/${area.slug}`} className={LINK}>
                {area.name}
              </Link>
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">{area.lede}</p>
          </article>
        ))}
      </div>
      <p className="mt-10 text-base">
        <Link href="/areas" className={LINK}>
          All area guides
        </Link>
      </p>
    </section>
  );
}
