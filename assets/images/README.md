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
| `jasmine-closing-day.jpg` | 12:7, 1200×700 | **Nothing yet** | Candid, at the closing table. Held — see below |

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

### Held: `jasmine-closing-day.jpg`

In the repo, deliberately not in `lib/images.ts`. Added 2026-08-28 from
`assets.agentfire3.com` (the Matt Stone Team site), where it ran as a blog photo.
Bill confirms the photograph is Jasmine's own and hers to use, so the question is
not ownership.

It is the only candid we have of an actual closing, and that is exactly why it is
worth holding rather than shipping. Three things have to clear first:

- **Two clients are identifiable, front and centre.** §7 already requires client
  permission to publish the case studies, which name nobody. Publishing faces is a
  larger ask than publishing a story, and it needs their written yes, not an
  inference from the photo having appeared on a team site.
- **A third party's mark is in the frame.** The "Just Closed" sign carries a law
  firm's name and phone number. Naming the closing attorney in her advertising is
  a claim about a business relationship that nobody has cleared.
- **It is 1200×700**, below the 2000px standard above, because that is the largest
  version published. If it ships, get the original off her phone rather than
  upscaling this.

Registering it in `lib/images.ts` is what makes it publishable, so that step waits
on the first two. Do not do it to fill a slot.

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
