# Content Marketing — the blog pipeline

How posts get written, checked, scheduled, and published. Read `CLAUDE.md`,
`BRAND-VOICE.md`, and `CONTENT-PLAN.md` first — this document does not restate them, it
says how the cadence works without breaking them.

The goal is visibility in two places at once: ranking in Google, and being the thing an
answer engine quotes when someone asks ChatGPT or Perplexity a question about buying a
house in Charlotte. Those want the same thing, which is convenient — a specific question,
answered plainly, near the top of the page, by an author with a real name and a real
license attached.

---

## 1. What this blog publishes

Two categories, and nothing else. `lib/blog/types.ts` enforces the list.

| Category | What it is |
|---|---|
| `negotiation` | The USP extended. Which levers exist, when they exist, why the other side already knows. |
| `process` | How a transaction actually works, question-shaped. The long-tail queries people type and ask out loud. |

### What it does not publish, and where that content goes instead

**Market updates and stat roundups — never.** `CONTENT-PLAN.md` rules them out by name:
"They date instantly and every agent publishes them." They are also the §6 risk in its
purest form, because a market-stat post cannot be written without numbers this repo does
not document. `lib/blog/validate.ts` fails the build on median price, days on market,
months of inventory, and year-over-year framing.

**Neighborhood and market guides — not here.** They belong in `lib/areas/data.ts`, which
already has a finished page template and fourteen rostered markets waiting on content. A
blog post about Fort Mill would compete with `/areas/fort-mill` for the same query and
both would rank worse for it — the cannibalization `CLAUDE.md` §11 warns about. If a
neighborhood idea comes out of a content session, it is an area entry, not a post.

The area pages are the higher-value work of the two. The `levers` field on each one is the
USP applied locally and is the only part of a neighborhood page a competitor cannot copy
from a data feed.

---

## 2. The documented-facts allowlist

`CLAUDE.md` §6: never claim a statistic not documented in §5 or `CASE-STUDIES.md`. This is
the rule most at risk from a generated draft, because a language model will produce a
median sale price or a "typical" savings figure fluently and with total confidence, and it
will be published under NC 334700 and SC 125546.

**Every dollar figure and percentage the site may state:**

| Figure | Source |
|---|---|
| $20,000 below list · $22,210 concessions · $34,000 equity at closing | Case 1 |
| $50,000 builder incentives · 3% closing costs | Case 3 |
| 98.84% list-to-sale · $30.9M career volume · $9.9M in 2024 | §5 |

Counts, which are safer but equally undocumentable if invented: 73+ career transactions ·
23 transactions in 2024 · 17 new-construction closings · 18 relocations · 12 in the Fort
Mill corridor · 105 five-star reviews (42 Zillow, 62 Google).

`lib/blog/validate.ts` holds the dollar and percentage list as a set and fails the build on
anything outside it — including a rounded restatement of something on it. `$22,210` stays
`$22,210`; "over $22K" fails. `CASE-STUDIES.md`: "Do not round up or restate the figures."

Case 2 is the most useful case study for blog copy precisely because it contains **no
dollar figure at all** — a roof, HVAC servicing, a home warranty, a refrigerator. It can be
told in full without triggering the disclaimer, and it is the most persuasive of the three.

**If a draft needs a number nobody has verified, write `TODO(verify)` and leave it.** A
`TODO(` reaching a rendered page fails `tests/compliance.test.tsx`, so it cannot ship by
accident.

Note the standing §12 open item: the §5 counts are from an earlier pull and are probably
low. They do not get updated by estimating.

---

## 3. How a post is built for answer engines

The structure is not decoration. It is the reason a post gets cited.

1. **`title`** — the question, phrased the way it gets asked.
2. **`targetQuery`** — the literal query. Authoring discipline, never rendered. A post that
   cannot name its query has no reason to exist.
3. **`answer`** — two to four sentences that fully answer the query, rendered directly under
   the h1. **This is the highest-leverage field on the site.** It is what an answer engine
   lifts. Burying the answer under six paragraphs of preamble is why most agent blogs are
   never quoted, and it is also just rude to the reader.
4. **Body** — elaboration, in `content/blog/<slug>.mdx`. `h2` sections, each one a sub-question.
   Never build to a reveal; the reveal was in step 3.
5. **`faq`** — two or more entries, rendered on the page and emitted as `FAQPage` JSON-LD.

Each FAQ answer must stand alone, because it gets extracted and quoted with nothing next to
it. That is also why `validate.ts` refuses a dollar figure inside one: the §7 results
disclaimer cannot travel with a quoted snippet, so figures stay in the body where the
disclaimer is visible.

`BlogPosting` JSON-LD names her as `author` and Stone Realty Group as `publisher`. That
split is a compliance requirement, not an SEO nicety — structured data naming
jasminegarcia.com as its own publisher would assert this domain is a firm, which §7 forbids.

---

## 4. Cadence and scheduling

**Batch four or five, date them a week apart, merge once.**

A post is live when `publishedAt` is today or earlier. `publishedPosts()` in
`lib/blog/index.ts` is the single gate — the listing, the sitemap, `generateStaticParams`,
and both test suites all route through it. A future-dated post is in the repo and
unreachable on the site.

So a batch is one pull request. Nobody logs in on a Tuesday.

**What makes the date take effect.** `/blog`, `/blog/[slug]`, and `sitemap.xml` each carry
`revalidate = 3600`, and `/blog/[slug]` leaves `dynamicParams` on so a newly-eligible slug
renders on demand instead of 404ing until the next deploy. A post therefore goes live
within an hour of its date, with no redeploy and no cron job.

If that hour ever matters, the alternative is a Vercel Cron hitting a revalidation route at
a fixed time. It is not built, because nothing about a weekly blog needs minute precision.

**Ordering** is newest first, ties broken by slug, so two posts sharing a date do not
reshuffle between builds.

---

## 5. Adding a post

Two files, and a test that fails if you only write one.

1. `content/blog/<slug>.mdx` — prose only. No frontmatter, no `h1`, no class names.
   Headings start at `##`. Styling comes from `mdx-components.tsx`.
2. An entry in `lib/blog/data.ts` — the typed metadata. The `slug` must match the filename.

Metadata is TypeScript rather than YAML frontmatter for one reason: frontmatter is untyped,
so a post could ship with no `answer`, a malformed date, or a single FAQ entry and nothing
would notice until a reader hit the page. Every other compliance-carrying dataset in this
repo is typed data with a test over it, and a post makes claims under her license the same
way an area page does.

Set `citesResults: true` if the body quotes a documented dollar figure; it renders the §7
disclaimer. Forgetting is caught — `tests/compliance.test.tsx` fails any rendered page
showing a figure without the disclaimer.

Then `npm run verify`.

---

## 6. What the tests actually check

A post cannot ship unchecked, because nothing about enrollment is manual.

`tests/compliance.test.tsx` and `tests/accessibility.test.tsx` expand `publishedPosts()`
into their `PAGES` lists automatically. Every post gets the same §7 and §10 treatment every
other page gets: brokerage identification, the disclaimer beside any figure, banned
language, fair-housing framing, guarantee language, one `h1`, heading order, link names,
axe at WCAG 2.1 AA.

`lib/blog/index.test.ts` covers what those cannot see — **scheduled posts**. A post dated
forward is invisible to a suite that renders published pages, and would otherwise publish
itself on a future Tuesday with nobody watching. So its metadata and its raw MDX are
scanned there, at merge time, against every rule in `validate.ts`. It also asserts registry
and directory agree in both directions: an entry with no file throws at runtime, and a file
with no entry is unreviewed copy sitting in the repo one careless import from shipping.

---

## 7. Review gates

The tests check the rules that can be written down. They cannot check whether a sentence is
true, or whether it sounds like her.

- **Jasmine reads every post before it ships.** The tests do not know her market. A post can
  be perfectly compliant and still be wrong about how a builder in Fort Mill behaves.
- **The BIC sees anything that touches a compliance surface.** §7: material changes go back
  to him. A post that introduces a new claim, a new statistic, or new language about
  outcomes is a material change. Routine posts inside the documented-facts allowlist are
  not, and do not need a fresh approval each week.
- **The site's general approval (2026-08-10) does not cover future blog copy.** It covers
  the site as it stood. A post making a claim nobody has reviewed is exactly the case §7
  reserves for him.

---

## 8. Status

- [x] Pipeline built: routes, MDX, scheduling, structured data, sitemap, test enrollment.
- [x] **`what-you-can-negotiate-besides-price` — APPROVED BY JASMINE 2026-08-21.** She read
      the full post and signed off on the revision. Reported by Bill. It ships with launch.

      Her review changed the copy in two ways worth keeping on record, because both are the
      kind of thing the test suite cannot catch:

      - **The draft was wrong about who holds the knowledge.** It said the seller "has usually
        done this a few times." Her correction: someone selling their second house is as new
        to it as someone buying their second. The asymmetry is the *listing agent*, not the
        seller, and the post now says so. This sharpened the USP rather than softening it —
        worth remembering when the next batch is drafted.
      - **It got the contract mechanics wrong.** The draft listed inspection, appraisal, and
        financing as contingencies in both states. North Carolina runs on a due diligence
        period; South Carolina runs on three contingencies — financing, appraisal, and
        wood-destroying insect. Fixed in the body and the FAQ, and the `answer` field now
        avoids the word entirely, because that paragraph is quoted with no state attached to
        it. **Any future post touching contract mechanics states which Carolina it means.**

      Also from her review: the CTA offers a call, a Zoom, or a text, because she would rather
      be texted. The Follow Up Boss tracking number was tested and receives SMS (2026-08-21).

      The BIC was not re-consulted. The post states no figure and makes no claim about
      results, which is the §7 case that does not need fresh approval. The NC/SC paragraph is
      the one new factual statement in it.
- [ ] First real batch — four or five posts, one per week. Draft, review with her, merge as
      one pull request with dates a week apart.
- [ ] Fort Mill as the first `/areas` entry. §5 documents 12 closings in that corridor, so
      she has the most to say about it, and it is worth more than any blog post on this list.
- [ ] Revisit when the CMS lands (§12, Sanity vs Payload). The `Post` type in
      `lib/blog/types.ts` is deliberately shaped to map onto CMS document fields, so
      migration is mechanical. Whatever replaces this must keep the validation in
      `lib/blog/validate.ts` — moving content into a CMS is how the §6 discipline gets lost.
