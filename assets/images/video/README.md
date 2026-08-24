# Video stills

## `meet-jasmine-still.jpg`

YouTube's generated frame for `EpLuc5n6hHs`, 1280×720.

**It carries Stone Realty Group's stylized hexagon, burned into the frame.** The video is
watermarked throughout, so no frame of it is clean. `CLAUDE.md` §7 forbids using the
brokerage's registered marks decoratively, and this ships as a documented exception on Bill's
direction (2026-08-20) because the BIC funded and distributes the video. **It is replaced by a
custom thumbnail during the channel cleanup.** See `CLAUDE.md` §7 Approvals for the boundary —
no other surface on this site may carry that mark.

## No still is also a finished state

`components/video-facade.tsx` falls back to a typographic panel — the video's title in the
site's display face, on its own ground, with the play affordance drawn from the site's
tokens. A new entry with no `poster` renders that, and it is a deliberate design rather than
a placeholder. `components/video-embed.test.tsx` covers both paths.

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
