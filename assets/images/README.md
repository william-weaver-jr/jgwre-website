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

| File | Crop | Used by | Status |
|---|---|---|---|
| `jasmine-portrait-warm.jpg` | 4:5, 1600×2000 | Home hero | ✅ Live |
| `jasmine-portrait-studio.jpg` | 4:5 | About hero | ⬜ Awaiting file |
| `jasmine-environmental.jpg` | 3:2 | Home closing CTA | ⬜ Awaiting file |

### The two open slots

**`jasmine-portrait-studio.jpg`** — the darker, more composed frame: black blazer,
deep green backdrop. It goes on `/about`, which is the page that has to carry the
record. It must not be the same photograph as the home page hero; two large frames
of one photo, one click apart and in the same grid position, is the thing that makes
a personal-brand site read as a template.

**`jasmine-environmental.jpg`** — the landscape frame: her in a room, brick and
window light behind her. This one replaces the *brief* currently sitting in the home
page closing block, not just the box. That slot is briefed as "Charlotte housing
stock — exterior," and an exterior streetscape is the weaker choice there: the
section says *call before you write an offer*, and a person is a better argument for
picking up a phone than a building is. Re-brief the slot when the file lands.

Neither is a blocker for the pillar pages, which have no photography at all yet and
need their own brief — see CLAUDE.md §12.

## Adding one

1. Convert and drop the file here.
2. Add an entry to `PHOTOS` in `lib/images.ts`. Alt text is composed there, not at
   the call site, so the same photograph is described identically everywhere and the
   REALTOR® mark cannot be miscapitalised into a compliance problem (CLAUDE.md §7).
3. Swap the `PhotoPlaceholder` for a `BrandPhoto`, and give it a real `sizes` — the
   default assumes full-viewport width and will ship a needlessly large file.
4. `priority` goes on at most one image per page, and only above the fold.
