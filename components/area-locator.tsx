import type { LocatorPoint } from "@/lib/areas/locator";

/*
  Tier 1 of the area-page map options (CLAUDE.md §12): a schematic locator, not
  a surveyed boundary. Uptown Charlotte and the I-485 loop are fixed reference
  points; the market gets a highlighted approximate position. This is pure
  geometry through the existing design tokens, not a style statement, so it
  doesn't need to wait on the pending brand-identity decision — unlike the
  illustrated-outline and interactive-map tiers, which do.

  Deliberately not to scale and says so in its caption. A real traced boundary
  (tier 2) needs county GIS data and an actual illustration style to draw it in;
  this only needs to be roughly, honestly right.
*/

type AreaLocatorProps = {
  name: string;
  state: "NC" | "SC";
  point: LocatorPoint;
};

const UPTOWN = { x: 50, y: 48 };
const I485_RADIUS = { rx: 33, ry: 30 };

export function AreaLocator({ name, state, point }: AreaLocatorProps) {
  return (
    <figure>
      <svg
        viewBox="0 0 100 90"
        className="w-full max-w-sm"
        role="img"
        aria-labelledby="area-locator-title"
      >
        <title id="area-locator-title">{`${name}, ${state} relative to Uptown Charlotte`}</title>

        <rect
          x="1"
          y="1"
          width="98"
          height="88"
          rx="2"
          className="fill-surface-sunken stroke-border"
          strokeWidth="0.5"
        />

        {/* I-485 loop, schematic */}
        <ellipse
          cx={UPTOWN.x}
          cy={UPTOWN.y}
          rx={I485_RADIUS.rx}
          ry={I485_RADIUS.ry}
          className="fill-none stroke-accent-soft"
          strokeWidth="0.6"
          strokeDasharray="1.6 1.4"
        />
        <text
          x={UPTOWN.x + I485_RADIUS.rx - 2}
          y={UPTOWN.y - I485_RADIUS.ry + 7}
          textAnchor="end"
          className="fill-ink-muted font-sans text-[3px] tracking-[0.1em] uppercase"
        >
          I-485
        </text>

        {/* Uptown */}
        <circle cx={UPTOWN.x} cy={UPTOWN.y} r="1.4" className="fill-ink" />
        <text
          x={UPTOWN.x + 3}
          y={UPTOWN.y - 2}
          className="fill-ink font-sans text-[3.4px] font-medium"
        >
          Uptown
        </text>

        {/* Market highlight */}
        <ellipse
          cx={point.x}
          cy={point.y}
          rx="9"
          ry="7"
          className="fill-accent-soft/25 stroke-accent"
          strokeWidth="0.6"
        />
        <circle cx={point.x} cy={point.y} r="1.2" className="fill-accent" />
        <text
          x={point.x}
          y={point.y - 9}
          textAnchor="middle"
          className="fill-ink font-display text-[5.5px] font-medium"
        >
          {name}
        </text>

        {/* Compass */}
        <g transform="translate(90, 8)" className="stroke-ink-muted" strokeWidth="0.5">
          <line x1="0" y1="4" x2="0" y2="-2" />
          <polyline points="-1.2,-0.6 0,-2 1.2,-0.6" fill="none" />
        </g>
        <text x="90" y="10.5" textAnchor="middle" className="fill-ink-muted font-sans text-[3px]">
          N
        </text>
      </svg>

      <figcaption className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
        {point.note} Approximate, for orientation — not a boundary map.
      </figcaption>
    </figure>
  );
}
