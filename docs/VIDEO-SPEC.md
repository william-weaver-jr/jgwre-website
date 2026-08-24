# Video — the registry, and where video is allowed to appear

How a YouTube video gets onto this site. Read `CLAUDE.md`, `BRAND-VOICE.md`, and
`CONTENT-MARKETING.md` first — this document does not restate them.

The channel is [@MyRealtorJasmine](https://www.youtube.com/@MyRealtorJasmine). As of
2026-08-20 it has 6 subscribers, two public videos, no Shorts, no playlists, and no custom
channel description. It publishes irregularly — one video in June 2025, one in June 2026.

**Everything here follows from that last fact.** There is no cadence to design around, so
the site cannot be laid out around specific videos. It is laid out around a registry.

---

## 1. The mechanism, in one paragraph

`lib/video/data.ts` holds every video. Each entry carries a YouTube id, a duration, an
**original** summary, and a `placements` array naming the routes it appears on and the copy
it uses on each. A page asks `videoForRoute()` for the placement registered against it and
hands the result to `<VideoEmbed>`. Adding a video is one entry in one file: no layout
change, no new component, no route. A video with an empty `placements` array renders
nowhere, and that is a supported state — the same posture `lib/areas/data.ts` takes.

| File | What it is |
|---|---|
| `lib/video/types.ts` | The `Video` and `VideoPlacement` shapes, and why each field exists |
| `lib/video/data.ts` | The registry. The only file that changes when a video is added |
| `lib/video/index.ts` | The publishing gate, the URL builders, the duration formatters |
| `lib/video/index.test.ts` | Integrity over the real registry |
| `components/video-embed.tsx` | The section: heading, player, summary, link out. Server |
| `components/video-facade.tsx` | The click-to-load player. The only client code here |
| `lib/schema.tsx` → `videoObjectSchema()` | `VideoObject`, on the primary placement only |

---

## 2. Why the embed is a facade

The page ships a static panel. Nothing is requested from YouTube until the visitor clicks,
and then the player loads from `youtube-nocookie.com`.

Two reasons, both load-bearing:

1. **Performance.** A YouTube iframe pulls roughly a megabyte of third-party JavaScript on
   load. `CLAUDE.md` §10 sets Lighthouse ≥ 90 before launch and one embed is enough to lose
   it.
2. **Consent.** No third-party cookie is set on a page view. The consent decision recorded
   in §7 — no banner, full disclosure, reachable opt-out — rests on this site being modest
   about what it loads. A player that phoned home before anyone clicked would make that
   argument harder, and it would do it on the page a visitor reads to decide whether to
   trust her.

`components/video-embed.test.tsx` asserts both halves: no iframe before the click, and the
no-cookie host after it.

**No channel feed, no "latest upload" strip, no playlist embed.** A named video is a fixed
asset at a fixed id — it can be reviewed once and stay reviewed. Anything that pulls
whatever she posted last puts unreviewed copy on BIC-approved advertising, which is the
exact reason `lib/site.ts` `SOCIAL` links Instagram and Facebook rather than embedding them.

---

## 3. Adding a video

**On YouTube, first:**

- Title, question-shaped where the query is a question:
  `<Question or subject> | <Market> | Jasmine Garcia, Charlotte REALTOR®`
- Description with the answer in the first line, then:
  `Jasmine Garcia, Broker/REALTOR® · Stone Realty Group · (704) 200-9360 ·
  https://jasminegarcia.com/<the page this supports> · Licensed in NC (334700) and SC (125546)`
  Brokerage identification is not optional. A video by a licensed broker is advertising in
  both states, and it should be **spoken** in the video as well as written below it.
- **Corrected captions.** Auto-captions mangle names, numbers, and both license numbers.
  This is the same ADA exposure §10 opens with, and it is not satisfied by YouTube's guess.
- Category `Howto & Style` or `Education`. Both current videos are `People & Blogs`, which
  is wrong for real-estate content and was left at the default.

**Then in the repo:**

1. Add the entry to `lib/video/data.ts`.
2. Write an **original** `summary`. Never the YouTube description — it is written for
   someone who already pressed play, and video 2's opens with language `BRAND-VOICE.md`
   bans outright. `lib/video/index.test.ts` scans the registry for that list.
3. Set `placements`. One page, maybe two. Exactly one carries `primary: true`.
4. Add a `transcript` only if the copy clears §7 — see §5 below.
5. `npm run verify`.
6. **If it introduces a claim, a statistic, or a dollar figure, it goes to the BIC before
   it ships.** §7's "material changes after" applies to a video exactly as to a page.

Committing a still to `assets/images/video/` and setting `poster` is optional; without one
the panel is typographic, which is a finished state rather than a placeholder.

---

## 4. Which page gets which video

Four questions, in order:

1. **Which pillar?** `meet` → `/about`. `negotiable` → `/negotiation`, `/`, or a matching
   blog post. `tables` → its pillar page. `ground-truth` → its area page. A video that fits
   no pillar gets no placement, and that is a fine outcome — it lives on YouTube.
2. **Evergreen?** `evergreen: false` needs a `reviewBy` date and may never sit on `/` or a
   pillar page. The test suite enforces both.
3. **Does that page already have a video?** One per page, maximum, always. A page with two
   has decided nothing. If a better video arrives, the old entry's `placements` shrinks —
   the page never grows a second slot.
4. **Is there a page at all?** If the honest answer is "it would need a new page," the
   answer is usually no. See §6.

Three rules that are not preferences:

- **A video never precedes the argument.** It sits after the copy that does the persuading,
  never above it. On `/about` it is after the story and before the argument that follows
  from it.
- **No autoplay on load, no carousel, no floating player, no modal.** Every one of them
  costs more than it returns on a site whose primary call to action is a phone call.
- **Not on `/reviews`** (a video beside verbatim testimonials invites the reader to treat
  the clip as one), **not on `/transactions`** (BIC-approved to a specific shape), **not on
  `/home-value`** (single-purpose form).

---

## 5. Compliance

**A summary is copy. A transcript is copy.** Both are advertising under NC 334700 and
SC 125546 the moment they render, and `tests/compliance.test.tsx` checks them like any other
string on the site.

- **Figures.** If she states a dollar figure on camera and it is transcribed here, the §7
  results disclaimer is triggered on that page. If the figure is outside the
  `CONTENT-MARKETING.md` §2 allowlist, the clip cannot be transcribed on this site at all.
  Worth telling her **before** filming, not after.
- **Fair housing applies to a spoken sentence exactly as to a written one.** No "safe," no
  "good schools," no "family-friendly," no "up-and-coming." Housing stock, amenities,
  commute, price. `lib/areas/validate.ts` scans authored strings and cannot hear a video, so
  this one is on the person holding the camera. A shot-list checklist before filming a
  neighbourhood video is the practical control.
- **Market updates are not exempt.** `CONTENT-MARKETING.md` §1 rules them out by name and
  `lib/blog/validate.ts` fails the build on the figures they need. Filming them for YouTube
  is a good idea; they stay on YouTube, never embedded, summarised, or transcribed here.
- **Video testimonials are testimonials.** §7 forbids altering one, and an edited clip is an
  altered testimonial. Not without the BIC and probably counsel.
- **Nothing from another channel.** See `lib/video/data.ts` on `J6T4pmDWQ6M`.

---

## 6. SEO — what video does and does not do

**Embedding a video does not improve a page's ranking.** Google indexes video through
`VideoObject` markup, a video sitemap, and the written content around the embed. A page
whose only new content is an iframe has no new content. The summary beside the player is not
decoration; it is the part with independent value.

- `VideoObject` is emitted on the **primary placement only**. The same markup on two URLs
  invites a crawler to pick the wrong canonical.
- Its `description` is the string the page renders, in the same words. Declaring something a
  visitor cannot see is a markup violation and an unreviewed advertising claim at once —
  the rule `faqSchema()` already follows.
- **A video never canonicalises to YouTube.** Different content, different site.
- **A video sitemap** is worth adding at 5+ videos with markup. Below that the markup is
  enough, and `MetadataRoute.Sitemap` does not type the `video:` extension, so it needs a
  hand-written route.

### When a video earns its own page

Three tests, all of which must pass: it answers a specific query someone types; there is
500+ words of original writing to put on the page that stands alone with the video removed;
and no existing page already targets that query.

In practice, for now, the answer is **no** — the video belongs on an existing page or inside
a blog post. The blog pipeline already produces exactly what a video page would need: an
`answer` field, an h2-structured body, and FAQ entries, all validated. Pairing a video with
a post is strictly better than inventing a parallel page type.

### `/videos` — not yet

Build the route, keep it `noindex` and unlinked, and gate it on **8 published videos across
at least two pillars**, behind an `isVideoPageIndexable()` mirroring
`isTransactionsPageIndexable()`. `app/sitemap.ts` already documents the reasoning for
`/transactions`: a two-row ledger is a thin page. Two videos is thinner.

---

## 7. Open items

- [x] **The teaching years — RESOLVED 2026-08-20.** Ten years total: six in Charleston, SC
      and four in Hampton, VA (Bill). `/about`'s "ten years" and the video's "six years" are
      both true, and neither is corrected. The on-page summary continues to state neither,
      because a reader who hears one number and reads the other cannot see the reconciliation
      — repeating either would show them the seam twice. **Not a §6 problem.** Worth noting
      separately that six years teaching in Charleston is a real South Carolina tie and is
      documented nowhere in the site's copy; that is a `/carolinas-border` question, not a
      video one.
- [ ] **`CLAUDE.md` §6 lists a Stone Realty Group video as her bio video.** Corrected in §6
      as of 2026-08-20; noted here because the wrong one is still the one people find first.
- [ ] **The third video.** YouTube reports 3 videos on the channel and lists 2. Bill is
      checking with Jasmine (2026-08-20) whether the third is unlisted, private, or something
      else, and whether it should be public.
- [ ] **The Palisades home tour is unplaced.** It needs `/areas/steele-creek` to exist, the
      property confirmed sold or expired, and its narration checked against §7.
- [x] **BIC approval — RECEIVED 2026-08-20**, reported by Bill: the BIC funded this video
      and distributes it on his own channels. See `CLAUDE.md` §7 Approvals for scope, and for
      the one question it does not answer.
- [ ] **No still is committed.** `assets/images/video/` is empty and the panel is
      typographic. See `assets/images/video/README.md`.
- [ ] **Captions.** Neither existing video has corrected captions. Noted by Bill 2026-08-20.
- [ ] **The channel cleanup is planned.** Bill confirmed 2026-08-20 that §3's YouTube-side
      conventions — the title format, the description template with brokerage identification,
      corrected captions, the category fix, custom thumbnails — will be implemented on the
      channel. Nothing in this repo depends on it, but the two existing descriptions are the
      first thing to fix: one carries no site URL, the other a broken email.
- [ ] **Video 2's description carries a broken email** — `jasmine@.comattstoneteam.com`,
      public since June 2025. Nothing to do with this repo; worth fixing on YouTube.
