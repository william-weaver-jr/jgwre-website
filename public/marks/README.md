# Official trademark artwork

This directory holds the licensed Equal Housing Opportunity and REALTOR® logos.

**It is empty on purpose, and that is an approved state.** The footer renders
compliant text marks. The BIC approved that treatment on 2026-08-10 — he uses the
same on his own site — so nothing here is blocking launch.

Do not fill this directory with artwork that was drawn, traced, generated, or
pulled from an image search. An unauthorized mark that *looks* official is a worse
problem than no logo at all, which is why the earlier hand-drawn SVGs were removed.

Adding the real logos is an optional upgrade. It changes a compliance surface, so
it goes back to the BIC when it happens.

## Where the files come from

Both are distributed by NAR to members. Jasmine's member login is required, so
this step cannot be automated.

<https://www.nar.realtor/logos-and-trademark-rules>

Download the SVG (or highest-resolution PNG) of:

| File to save here | What to download |
|---|---|
| `equal-housing-opportunity.svg` | Equal Housing Opportunity logo |
| `realtor-logo.svg` | The REALTOR® logo (block "R") |

## Turning them on

Fill in `lib/marks.ts` with the real intrinsic dimensions:

```ts
equalHousing: { src: "/marks/equal-housing-opportunity.svg", width: 120, height: 120 },
realtor: { src: "/marks/realtor-logo.svg", width: 120, height: 120, identifier: AGENT.name },
```

The footer switches from text to artwork automatically. Nothing else changes.

## Rules that constrain how they are displayed

From NAR's [Membership Marks Manual](https://www.nar.realtor/membership-marks-manual):

- The REALTOR® identifier goes **directly below** the block "R". The logo may not
  appear without identifying the member, the member's firm, or a Member Board.
  `components/compliance-marks.tsx` renders `AGENT.name` as that caption.
- Maintain an **area of isolation** on all sides equal to half the width of the
  block "R".
- Do not alter the proportions or colors, and do not combine the marks with
  descriptive words or phrases.

If any intended use is unclear, NAR Legal Affairs answers at trademark@nar.realtor.

The Broker-in-Charge should confirm the final footer treatment, as with any other
advertising change. CLAUDE.md §7.
