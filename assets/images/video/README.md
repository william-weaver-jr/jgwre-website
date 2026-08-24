# Video stills

Empty on purpose, and this is a finished state rather than a missing one.

`components/video-facade.tsx` falls back to a typographic panel — the video's title in the
site's display face, on its own ground, with the play affordance drawn from the site's
tokens. That is a deliberate design, not a placeholder rendering.

## When you add one

Drop a still here, import it in `lib/images.ts` beside the portraits, and set `poster` on
the entry in `lib/video/data.ts`. Nothing else changes.

Same rules as `assets/images/README.md`, for the same two reasons:

1. **It goes through the bundler.** A static import carries intrinsic `width`/`height` and a
   generated `blurDataURL`, so the panel reserves its own space and nothing shifts on load.
   `CLAUDE.md` §4.
2. **Alt text cannot drift.** It is described once, in `lib/images.ts`.

## What not to do

**Do not hotlink `i.ytimg.com`.** It forfeits both of the above, and it puts a third-party
request on the page before the visitor has clicked — which is the entire reason the embed is
a facade. The one place that URL is legitimate is `thumbnailUrl()` in `lib/video/index.ts`,
where it is a string in JSON-LD that the page never requests.

A frame grabbed from the video is fine. A custom still in her own type and palette is
better, and is a nice-to-have rather than a blocker.
