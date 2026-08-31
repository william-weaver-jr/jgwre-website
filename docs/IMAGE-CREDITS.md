# Image Credits

The licence log for every image on this site that we did not take.

Cited by `lib/images.ts`, which holds the machine-readable half: an entry in `AREA_IMAGES`
cannot be added without a `credit` and a `sourceUrl`, because the type requires them. This
file is the long form — the licence, the date, and the reasoning that a type cannot hold.

Photographs of Jasmine's own are not logged here. They are hers, they are registered in
`PHOTOS`, and their permissions are recorded where the permission question actually gets
asked: `assets/images/README.md`, which carries the clearance record for
`jasmine-closing-day.jpg` in full.

---

## The rules

1. **Confirm the licence on the file page itself.** Not the category page, not the search
   result, not the page that links to it. A Commons category routinely holds files under
   four different licences, and the one you want is never the one you checked.
2. **If it cannot be confirmed there, move to the next candidate.** There is no version of
   this where a guess is cheaper than a different photograph.
3. **Prefer the original over a derived crop.** Wikivoyage banners, thumbnails, and
   letterbox strips are derivatives; the parent file is usually the same licence at several
   times the resolution. See the Steele Creek note below for what this is worth in practice.
4. **CC0 and public domain require no attribution.** Credit anyway. One line of small type
   is a low price for the next person being able to see that the question was answered.
5. **CC-BY / CC-BY-SA require attribution.** Format: `Photo: [Author], [Licence], via
   [Source].` and keep the file-page URL in `sourceUrl`.
6. **Never delete a row.** When an image is replaced, mark the old row
   `(removed — replaced by ___)` and add the new one. The history is the point.

---

## Log

**Empty. No borrowed image is on the site.**

| Page | Placement | File | Source | Licence | Attribution required | Credit line used | Added |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |

---

## Notes

### The one that was here, and why it came out

A public-domain photograph of the Buster Boyd Bridge ran as a full-bleed band above
`/areas/steele-creek` from 2026-08-30 to 2026-08-31. It was removed for two reasons worth
recording, because both will recur with the next candidate.

**Resolution.** The file was 1587×629. A full-bleed band asks for the viewport width, so on a
1920px display the browser wants 1920 CSS pixels and roughly 3840 device pixels on a 2×
screen. The file could supply neither, and `next/image` cannot invent detail it was not
given — it upscaled, and it showed.

**The credit line.** One line of small type under a photograph is cheap in the abstract and
expensive in place: it sat between the image and the `h1`, and it read as an apology for the
image rather than as provenance.

### The floor for the next one

Two numbers, and a preference.

- **Full-bleed:** do not, unless the source is at least **2560px** wide. Nothing borrowed has
  cleared that yet.
- **Page-width** (`max-w-6xl`, 1152px CSS): **2304px** for a crisp 2× render. A 1600px file is
  acceptable here and would have been acceptable for the bridge; it was the full-bleed
  treatment, not the file alone, that failed.
- **Prefer hers.** An area page argues from local knowledge. A borrowed photograph is the one
  element on it that was not sourced locally, and that tension does not go away by choosing a
  better stock image.
