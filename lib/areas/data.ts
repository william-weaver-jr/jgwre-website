/**
 * Area page content — the real dataset.
 *
 * EMPTY ON PURPOSE, and this is the file where that matters most.
 *
 * docs/CONTENT-PLAN.md is explicit: "Thin duplicated pages hurt more than they
 * help. If there isn't real content for a market, don't publish the page."
 * CLAUDE.md §11 says the same from the SEO side, and §6 forbids inventing the
 * figures these pages would otherwise be built from.
 *
 * Fourteen pages of plausible-sounding price bands and commute times would be
 * the single most damaging thing that could be added to this site: undocumented
 * claims under her license, on the page type most likely to stray into
 * fair-housing trouble, competing with her own real pages for the same terms.
 * Every templated Charlotte neighborhood page already reads that way. That is
 * the thing to be different from, not the thing to imitate.
 *
 * The template is finished. A market added here gets a real page, a sitemap
 * entry, and a footer link automatically — nothing about the layout changes.
 *
 * ---------------------------------------------------------------------------
 * What each entry needs (lib/areas/types.ts, enforced by index.test.ts):
 *
 *   lede           what this market is, in her words, in a sentence or two
 *   housingStock   eras, types, lots, construction — what is actually built here
 *   priceContext   how price behaves relative to the metro, without invented figures
 *   commute        routes and drive times. Distances, not judgments.
 *   whatTrades     what changes hands, and in what condition
 *   levers         2+ negotiation levers that tend to exist HERE specifically
 *
 * The levers are the whole point. They are the USP applied locally, and they
 * are the only part a competitor cannot copy from a data feed. If a market's
 * levers could be pasted onto another market unchanged, it is not ready — and
 * the test suite will say so.
 *
 * Fair housing, non-negotiable: describe housing stock, amenities, commute, and
 * price. Never who lives somewhere, never school "quality", never "safe",
 * "family-friendly", or "up-and-coming". CLAUDE.md §7. index.test.ts scans this
 * data for that language, so a violation fails the build before it renders.
 *
 * Source: Jasmine. This is her market knowledge, not something to be researched
 * into existence. Fort Mill is the natural first one — CLAUDE.md §5 documents 12
 * closings in that corridor, so she has the most to say about it.
 * ---------------------------------------------------------------------------
 */

import type { Area } from "./types";

export const AREAS: readonly Area[] = [];
