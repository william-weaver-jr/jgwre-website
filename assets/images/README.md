# Photography

Source images. Imported by `lib/images.ts`, rendered by `components/brand-photo.tsx`.

## Why here and not `public/`

Files in `public/` are served verbatim: `next/image` cannot know their dimensions,
so every usage has to hardcode `width` and `height` by hand and a wrong number is a
layout shift nobody notices until launch. Files in `assets/` go through the bundler,
so a static import carries intrinsic `width`, `height`, and a generated
`blurDataURL`, and the filename is content-hashed for immutable caching.

CLAUDE.md §4 requires explicit dimensions on every image. This is how we get them
without writing them down.

`public/` is still the right home for anything that must keep a stable, predictable
URL — `og-image.jpg`, `favicon.ico`, the licensed Equal Housing and REALTOR® marks.

## Convention

```
jasmine-<subject>-<variant>.jpg
```

Lowercase, hyphenated, no dates, no camera filenames, no `final-v2`. The name
describes the photograph, because that is what a person reading `lib/images.ts` is
trying to work out.

## Preparation

Longest edge 2000px, JPEG quality ~82. Next generates the AVIF and WebP derivatives
and the responsive srcset at request time, so the source only needs to be the
largest size any breakpoint will ask for — 2000px covers a 4:5 portrait rendered at
~500px CSS on a 2× display with room to spare. Shipping the 2800px original would
add megabytes to the repo and change nothing a visitor can see.

```bash
sips -s format jpeg -s formatOptions 82 -Z 2000 "<source>" --out assets/images/<name>.jpg
```

Two things to check on anything coming off a phone:

- **HEIC in a `.jpg` costume.** `Facetune_06-02-2025-14-11-17.jpg` was HEIC. The
  bundler will reject it. Confirm with `sips -g format <file>`.
- **GPS EXIF.** `sips -g all <file> | grep -i gps`. Strip it before committing —
  these are photographs of a person, published on the open web.

## Inventory

| File | Crop | Used by | Note |
|---|---|---|---|
| `jasmine-portrait-warm.jpg` | 4:5, 1600×2000 | Home hero | Warm interior, camel blazer |
| `jasmine-portrait-studio.jpg` | 4:5, 1600×2000 | About hero | Dark backdrop, black blazer |
| `jasmine-environmental.jpg` | 4:3, 1800×1350 | Home closing CTA | In a room, not against a backdrop |
| `jasmine-closing-day.jpg` | 12:7, 1200×700 | Registered, no slot cut yet | Candid, at the closing table. Cleared — see below |
| `areas/steele-creek-buster-boyd-bridge.jpg` | 5:2, 1587×629 | `/areas/steele-creek` banner | **Not hers.** Public domain, borrowed — see below |

Three photographs, three registers, and that is the point. The warm frame opens the
site; the composed frame carries the page that has to hold the record; the
environmental frame sits where the ask is to pick up a phone. Do not swap one for
another to fill a new slot — two large frames of the same photograph on two pages is
what makes a personal-brand site read as a template.

`jasmine-environmental.jpg` is a centred 4:3 crop of a 3:2 original. The full frame
put too much window on one side and too much brick on the other, and at ~520px of
column the subject read small. The uncropped file is not in the repo; re-crop from
the original if the slot ever changes shape.

That slot was briefed as "Charlotte housing stock — exterior." It was re-briefed
deliberately: the section says *call before you write an offer*, and a person is a
better argument for calling someone than a streetscape is.

### `jasmine-closing-day.jpg` — cleared, and why the record matters

Added 2026-08-28 from `assets.agentfire3.com` (the Matt Stone Team site), where it
ran as a blog photo. **Cleared for use by Bill the same day**, on three points that
were raised before it was registered and are all now answered:

- **The two clients pictured have approved this use.** They are identifiable, front
  and centre, which is a larger ask than the case studies make — those name nobody.
  The alt text still names nobody, and nothing should change that.
- **The closing attorney's office has approved it too.** Their "Just Closed" sign,
  firm name, and phone number are in the frame.
- **Jasmine owns the copyright.** It appearing on the team site first is not what
  makes it usable here.

Worth keeping the record even though the answer was yes on all three, because the
next candid from a closing will raise exactly the same questions and someone will
otherwise reason from this one's presence that faces are fine by default. They are
not. This photograph is cleared; the category is not.

The open item is resolution. It is 1200×700, under the 2000px standard above,
because that is the largest version anyone published. That is enough for a
half-column or a card, and not enough for anything full-bleed. Get the original off
her phone before it goes anywhere large, and do not upscale this file to fake it.

It is registered in `lib/images.ts` as `closingDay` and no page uses it yet. Per the
note below, cut its slot alongside a brief rather than dropping it into the first
gap that will take a landscape crop.

### `areas/` — borrowed images, and why they sit in their own folder

Everything else in here is hers. The files under `areas/` are not, and the folder exists so
that fact is visible in a file path rather than only in a comment. The convention above
(`jasmine-<subject>-<variant>.jpg`) does not apply; these are named
`<area-slug>-<subject>.jpg`, because the slug is what a reader is trying to match them to.

They are registered in `lib/images.ts` as `AREA_IMAGES`, whose `SourcedImage` type requires
a credit line and the file page the licence was confirmed on. The licence log and the
sourcing rules are `docs/IMAGE-CREDITS.md`; read rule 1 before adding one.

**Each is a placeholder.** An area page argues from local knowledge, and a borrowed
photograph is the one thing on it that was not sourced locally. Replacing these with her own
is the goal, not a nice-to-have — see below.

### Still unphotographed

The four pillar pages have no imagery at all and no slots cut for any. They need
their own brief before a shoot, not a leftover from this one — see CLAUDE.md §12.
There is no placeholder component any more; every slot that existed has a photo in
it, so the next one gets built alongside its brief.

## Adding one

1. Convert and drop the file here.
2. Add an entry to `PHOTOS` in `lib/images.ts`. Alt text is composed there, not at
   the call site, so the same photograph is described identically everywhere and the
   REALTOR® mark cannot be miscapitalised into a compliance problem (CLAUDE.md §7).
3. Swap the `PhotoPlaceholder` for a `BrandPhoto`, and give it a real `sizes` — the
   default assumes full-viewport width and will ship a needlessly large file.
4. `priority` goes on at most one image per page, and only above the fold.
