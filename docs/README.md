# docs/

Specifications. **Everything in this directory is cited from source code**, enforced by
a test, or both. Run this before assuming a file here is just prose:

```bash
grep -rn "docs/[A-Za-z-]*\.md" --include="*.ts" --include="*.tsx" . --exclude-dir=node_modules
```

That returns ~90 citations across `lib/`, `app/`, `components/`, and `tests/`. A comment
in `lib/blog/validate.ts` points at `CONTENT-PLAN.md`; `components/contact-intake.tsx`
points at `CONTACT-STRATEGY.md`. Those are relative paths a developer can open and a
`grep` can find, and the spec and the code it governs move in the same commit — which is
what makes the audit trail for a licensed broker's advertising hold together.

## What lives here

| File | Governs | Cited by |
|---|---|---|
| `BRAND-VOICE.md` | Voice rules, banned language, the origin story | `lib/site.ts`, `lib/schema.tsx`, `lib/reviews/data.ts`, `lib/video/` |
| `CASE-STUDIES.md` | The three permissioned case studies + the results disclaimer | `app/page.tsx`, `components/case-ledger.tsx`, `lib/transactions/` |
| `CONTENT-PLAN.md` | Per-page content direction, the lead magnet spec | `lib/blog/`, `lib/areas/`, `app/contact/page.tsx` |
| `CONTENT-MARKETING.md` | The blog pipeline, documented-facts allowlist, AEO post structure | `lib/blog/data.ts`, `lib/areas/`, `lib/video/` |
| `CONTACT-STRATEGY.md` | The conversion path, intake, phone-first CTAs | `components/contact-intake.tsx`, `components/phone-cta.tsx`, `lib/lead.ts`, `lib/intake/` |
| `TRANSACTIONS-SPEC.md` | The closed-transactions ledger and what may not appear on it | `lib/transactions/` |
| `AREAS-SPEC.md` | Area-page requirements and the levers test | `lib/areas/drafts/fort-mill.ts` |
| `AREA-GUIDE-MIGRATION.md` | The 301 map and what did not survive the migration | `app/sitemap.ts` |
| `VIDEO-SPEC.md` | How a video reaches the site | `lib/video/` |
| `brand-decisions.md` | Palette, typography, spacing — the source for `tailwind.config.ts` | `app/style-tile/page.tsx`, `tests/accessibility.test.tsx` |
| `placester-archive/` | Crawl of record of the retired site — 301 source data and evidence | `app/relocation/page.tsx:19` cites a specific file as proof for a testimonial |

`CLAUDE.md` at the repo root sits above all of it and is read at the start of every
session. **§7 is enforced mechanically** by `tests/compliance.test.tsx`.

## What moved to Notion — 2026-08-28

Strategy, competitive analysis, and research instruments now live in the **JGWRE Website**
space in Notion. Nothing in that set was cited by code; all of it has an owner, a status,
or an audience that is not a compiler.

| Was | Now |
|---|---|
| `visibility-plan/` (7 docs) | Notion → Visibility & Traction Plan |
| `docs/competitive-landscape.md` | Notion → Competitive Analysis → Competitive Landscape |
| `docs/FORT-MILL-INTERVIEW.md` | Notion → Marketing & Research → Fort Mill — the five questions |
| `docs/lovable-brief.md` | Notion → Archive → Lovable Brief |

Space: <https://app.notion.com/p/3caa9020fb9581eba4fbe389cfcf7753>

## Where a new document goes

One question decides it:

> **Does source code cite this, or does a test enforce it?**
> Yes → here. No → Notion.

Two things follow. Do not copy §7 compliance rules into Notion — a second copy drifts from
the enforced one, and the drifted copy is the one someone reads. And do not move a spec out
of this directory without first removing the citations that point at it, or roughly ninety
comments start lying.
