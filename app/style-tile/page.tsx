import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

/*
  Internal review page for the brand system. Ported out of the Lovable home page,
  where it sat below the footer as a demo block — it does not belong on the public
  home page, so it lives here and is excluded from indexing and the sitemap.

  Purpose: give Jasmine one URL that shows the whole system at a glance while the
  four open questions in docs/brand-decisions.md are still unanswered.

  Lovable's version set the swatches with inline `style={{ backgroundColor }}`,
  against CLAUDE.md §4. They use token-backed utility classes here instead.
*/

export const metadata: Metadata = {
  title: "Style tile (internal)",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ["ink", "#1B2230", "Charcoal-navy: headings and body", "bg-ink"],
  ["ink-muted", "#4E5768", "Secondary text (AA on ivory)", "bg-ink-muted"],
  ["primary", "#232C3D", "Deep navy: primary buttons", "bg-primary"],
  ["primary-deep", "#10161F", "Primary pressed / hover", "bg-primary-deep"],
  ["accent", "#8A6A2F", "Antique gold: labels, links, rules", "bg-accent"],
  ["accent-soft", "#C9A96A", "Champagne: hairlines and dividers", "bg-accent-soft"],
  ["surface", "#FCFAF6", "Ivory: page ground", "bg-surface"],
  ["surface-sunken", "#F4EFE6", "Cream: banded sections", "bg-surface-sunken"],
  ["surface-raised", "#FFFFFF", "Raised plate (Case 01)", "bg-surface-raised"],
] as const;

const TYPE_SCALE = [
  ["text-display-lg", "Cormorant Garamond Medium 500 / 76px / -2%", "font-display text-display-lg"],
  ["text-display", "Cormorant Garamond Medium 500 / 56px / -1.5%", "font-display text-display"],
  ["h2 · text-5xl", "Cormorant Garamond Medium 500 / 48px", "font-display text-5xl"],
  ["h3 · text-3xl", "Cormorant Garamond Medium 500 / 30px", "font-display text-3xl"],
  ["body-lg · text-lg", "Libre Franklin Regular 400 / 18px", "font-sans text-lg"],
  ["body · text-base", "Libre Franklin Regular 400 / 16px", "font-sans text-base"],
  ["figures · figure-plain", "Libre Franklin Medium 500, tabular-nums", "figure-plain text-lg"],
  ["eyebrow", "Libre Franklin Semibold 600 / 12px / +18% caps", "eyebrow"],
] as const;

export default function StyleTilePage() {
  return (
    <div className="mx-auto max-w-6xl px-gutter py-section">
      <p className="eyebrow">Style tile &middot; internal</p>
      <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
        The system at a glance
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
        Ivory and cream grounds, charcoal-navy ink, one antique-gold accent used only as hairlines,
        small-caps labels, and underlines. No gradients, no metallic fills, no flat black fields.
        The brokerage owns black.
      </p>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
        Proposed, not approved. Four open questions about this direction are recorded in
        docs/brand-decisions.md.
      </p>

      <h2 className="mt-14 text-eyebrow font-semibold tracking-[0.18em] text-ink uppercase">
        Palette
      </h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-3">
        {SWATCHES.map(([token, hex, use, swatchClass]) => (
          <li key={token}>
            <div className={`h-20 border border-border ${swatchClass}`} aria-hidden="true" />
            <p className="mt-3 text-sm font-medium">{token}</p>
            <p className="text-sm tabular-nums text-ink-muted">{hex}</p>
            <p className="text-sm text-ink-muted">{use}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-16 text-eyebrow font-semibold tracking-[0.18em] text-ink uppercase">
        Type scale
      </h2>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {TYPE_SCALE.map(([name, spec, cls]) => (
          <li key={name} className="grid gap-2 py-5 md:grid-cols-[1fr_20rem] md:items-baseline">
            <span className={`${cls} truncate`}>
              {name.startsWith("figures")
                ? "$22,210 · $34,000 · 98.84%"
                : "Negotiating is not just price"}
            </span>
            <span className="text-sm text-ink-muted">
              <span className="text-sm font-medium text-ink">{name}</span> &middot; {spec}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-16 text-eyebrow font-semibold tracking-[0.18em] text-ink uppercase">
        Buttons
      </h2>
      <div className="mt-6 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="mb-3 text-sm text-ink-muted">variant=&quot;phone&quot;</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="phone" size="lg">
              (704) 200-9360
            </Button>
            <Button variant="phone" size="lg" className="bg-primary-deep">
              Hover / active
            </Button>
            <Button variant="phone" size="lg" disabled>
              Disabled
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm text-ink-muted">variant=&quot;outlineInk&quot;</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outlineInk" size="lg">
              Default
            </Button>
            <Button variant="outlineInk" size="lg" className="border-accent bg-surface-sunken">
              Hover / active
            </Button>
            <Button variant="outlineInk" size="lg" disabled>
              Disabled
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm text-ink-muted">variant=&quot;gold&quot;</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="gold" size="lg">
              Default
            </Button>
            <Button variant="gold" size="lg" className="bg-accent text-accent-foreground">
              Hover / active
            </Button>
            <Button variant="gold" size="lg" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm leading-relaxed text-ink-muted">
        Focus state on every interactive element: 2px antique-gold outline, 3px offset. Text
        contrast is 4.5:1 or better on every pairing above.
      </p>
    </div>
  );
}
