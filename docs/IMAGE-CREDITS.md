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

| Page | Placement | File | Source | Licence | Attribution required | Credit line used | Added |
|---|---|---|---|---|---|---|---|
| `/areas/steele-creek` | Banner, above the hero | `assets/images/areas/steele-creek-buster-boyd-bridge.jpg` | [Wikimedia Commons — File:Buster Boyd Bridge.jpg](https://commons.wikimedia.org/wiki/File:Buster_Boyd_Bridge.jpg) | Public domain (Fife_Club, 2007) | No | "Photo: Fife_Club, public domain, via Wikimedia Commons." | 2026-08-30 |

---

## Notes

### Steele Creek — why the original and not the banner crop

The candidate first identified was
[`File:WV banner Charlotte Steele Creek Buster Boyd Bridge.jpg`](https://commons.wikimedia.org/wiki/File:WV_banner_Charlotte_Steele_Creek_Buster_Boyd_Bridge.jpg),
a CC0 Wikivoyage banner at 2100×300. It is a crop of the file we actually shipped, and its
own Commons description says so.

The parent is public domain at 1587×629 — the same photograph under an equally free
licence with more than twice the vertical resolution. At 300px tall the banner could only
be shown at roughly the height it already was; at 629px the shipped file can be cropped to
whatever band the layout wants and still have pixels left over.

Worth recording because the parent was nearly passed over on the grounds that its licence
"could not be confirmed." It could — via the Commons API
(`action=query&prop=imageinfo&iiprop=extmetadata`), which returns `LicenseShortName` and
`AttributionRequired` as structured fields and does not depend on a file page rendering
readably. Rule 2 above still stands. Rule 2 is about what to do when confirmation genuinely
fails, not a reason to stop after one attempt.

### Every area image is a placeholder

The area pages argue from local knowledge. A stock photograph is the single element on such
a page that was not sourced locally, and a reader who recognises a borrowed picture learns
something about the page that the copy is working hard to deny.

These exist so a page is not textually naked while photography is arranged. Each is meant
to be replaced by one of Jasmine's own, and a row here marked `(removed — replaced by ___)`
is this file working correctly.
