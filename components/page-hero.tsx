import type { ReactNode } from "react";

/**
 * The opening of every interior page. Eyebrow, gold hairline, h1, lede.
 *
 * Most interior pages are editorial and open with the table they are about —
 * "The other side of this table" — so the USP is stated structurally rather
 * than asserted. See docs/BRAND-VOICE.md §1.
 *
 * `variant="landing"` is the other job an opening screen can have, and it is a
 * different job. The four pillar pages take paid and organic traffic on
 * transactional queries, and a visitor arriving on one of those has four
 * questions before they have any interest in a metaphor: is this the right
 * page, is it Charlotte, who is this person, and how do I reach her. The
 * landing treatment answers them in the first screen and moves the editorial
 * thesis to the section immediately below, where it becomes the argument for
 * the answer rather than the answer itself.
 *
 * Mechanically it is the same hero with the vertical rhythm compressed and the
 * mobile h1 a step smaller, because the measured constraint is 812px of phone:
 * the eyebrow, the whole h1, enough lede to name her, and the phone button all
 * have to land above the fold. It is opt-in per page rather than a global
 * change, so the interior pages that are genuinely editorial keep the roomier
 * opening they were designed with.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  variant = "editorial",
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  children?: ReactNode;
  variant?: "editorial" | "landing";
}) {
  const landing = variant === "landing";

  return (
    <section className="border-b border-border">
      <div
        className={
          landing
            ? "mx-auto max-w-6xl px-gutter py-10 sm:py-14 md:py-20"
            : "mx-auto max-w-6xl px-gutter py-16 md:py-24"
        }
      >
        <p className="eyebrow">{eyebrow}</p>
        <div
          className={landing ? "mt-4 w-16 rule-gold" : "mt-6 w-16 rule-gold"}
          aria-hidden="true"
        />
        <h1
          className={
            landing
              ? /*
                   1.75rem below `sm`, measured rather than chosen. These h1s
                   are two sentences — a query match and the offer — and at
                   2rem all four wrapped to five lines on a 375px phone, one of
                   them leaving "representation" alone on a line. A step down
                   takes every one of them to four lines with no orphan, and
                   buys ~50px of the fold budget the phone button needs.
                */
                "mt-4 max-w-4xl font-display text-[1.75rem] leading-[1.12] tracking-tight text-balance sm:text-display-sm md:text-display"
              : "mt-6 max-w-4xl font-display text-display-sm text-balance sm:text-display"
          }
        >
          {title}
        </h1>
        <p
          className={
            landing
              ? "mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
              : "mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted"
          }
        >
          {lede}
        </p>
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
