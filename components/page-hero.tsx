import type { ReactNode } from "react";

/**
 * The opening of every interior page. Eyebrow, gold hairline, h1, lede.
 *
 * On the pillar pages the eyebrow names the table — "The other side of this table" —
 * so the USP is stated structurally rather than asserted. See docs/BRAND-VOICE.md §1.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-gutter py-16 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <div className="mt-6 w-16 rule-gold" aria-hidden="true" />
        <h1 className="mt-6 max-w-4xl font-display text-display-sm text-balance sm:text-display">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">{lede}</p>
        {children}
      </div>
    </section>
  );
}

/** Section opener used below the hero. Keeps heading rhythm identical across pages. */
export function SectionHeading({
  eyebrow,
  id,
  children,
}: {
  eyebrow: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
        {children}
      </h2>
    </>
  );
}
