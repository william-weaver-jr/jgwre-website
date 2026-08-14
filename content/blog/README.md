# content/blog

Post bodies, one `.mdx` per post. The filename is the slug: `content/blog/<slug>.mdx`
pairs with the `slug` of an entry in `lib/blog/data.ts`, and `lib/blog/index.test.ts`
fails the build if a file here has no entry or an entry has no file.

**Prose only.** No frontmatter, no `<h1>`, no class names, no inline styles. Metadata —
title, description, target query, the standalone answer, the FAQ entries, dates — lives in
`lib/blog/data.ts` as typed TypeScript, because it carries compliance obligations and YAML
carries no types. Styling lives in `mdx-components.tsx`, so a writer never touches one.

Start headings at `##`. The page renders the single `<h1>` from the post title.

Everything in here is scanned as raw text by `lib/blog/validate.ts` — fair-housing
language, banned phrases, outcome claims, market statistics, and any dollar figure or
percentage not documented in `CLAUDE.md` §5 or `docs/CASE-STUDIES.md`. A violation fails
the build rather than reaching a reader.

Read `docs/CONTENT-MARKETING.md` before writing one.
