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

export const AREAS: readonly Area[] = [
  {
    /*
      Steele Creek — the first published area page.

      SOURCE: an interview with Jasmine, 2026-08-21, recorded in Granola. She
      has lived in Ayrsley, inside this market, since June 2021, which is why
      it went first: docs/AREAS-SPEC.md §10.

      TWO THINGS FROM THAT INTERVIEW ARE DELIBERATELY NOT HERE.

      1. She named school ratings and crime as the factors suppressing demand.
         Both are §7 fair-housing territory and lib/areas/validate.ts fails the
         build on either word. They are not paraphrased into something softer
         either — "demand is weaker than the location suggests" would be the
         same argument wearing a coat. What ships is the price BEHAVIOUR, which
         she also described and which is what a reader can actually act on.

      2. Her figures — Ashley Park townhomes released in the low $400s now
         pricing low-to-mid $300s, new single-family near Rivergate pushing mid
         $500s. No area-level price is on the documented-facts allowlist in
         docs/CONTENT-MARKETING.md §2, a figure would pull <ResultsDisclaimer />
         onto the page, and a band like that dates within a year. The mechanism
         is more durable and more useful, so the mechanism is what runs.

      Everything else is hers, close to her words.

      SUPPLEMENTED 2026-08-21 with housing-stock data supplied by Bill: the
      boom running late 1990s through the 2010s, a median construction year
      near 2006, little stock predating 1980, and roughly four detached houses
      for every attached one.

      No percentage from that data appears on the page, on his own caveat:
      "Steele Creek" has no agreed boundary, so the figures move depending on
      whether a source means the neighborhood designation, the 28278 ZIP, or
      the broader historic community. A precise-looking share would be precise
      about the wrong thing. Ratios and "around 2006" survive that ambiguity;
      53.5% does not. The ambiguity itself is on the page, because a reader
      being quoted numbers about this market deserves to know they are soft.
    */
    slug: "steele-creek",
    name: "Steele Creek",
    state: "NC",

    targetQuery: "what should i know before buying a house in steele creek charlotte",

    /* The AEO surface — what an answer engine lifts, quoted with nothing beside
       it. Four sentences, each independently true, no figure, and her residency
       named because it is the strongest trust signal on the page.
       BRAND-VOICE.md §4 permits Ayrsley by name; her HOA and the unit count
       stay on /about. */
    answer:
      "Steele Creek is southwest Charlotte, and it was mostly farmland until the late 1990s. The residential boom ran from then through the 2010s, which puts the middle of the housing stock around 2006 and leaves very little of it built before 1980. Newer stock means slab foundations, almost no basements, and inspection findings that are predictable rather than surprising. Houses here sit on the market longer than they do in south Charlotte, and new construction sets a ceiling that resale has to price under — both of which give a buyer room that does not exist further east. Jasmine Garcia has lived in Ayrsley, inside Steele Creek, since 2021.",

    lede:
      "Steele Creek was farmland until the late 1990s, and most of what is here now went up after that. Houses sit longer than they do in south Charlotte, and that is leverage if you know what to do with it.",

    housingStock:
      "It went up in bands rather than blending, because the farmland sold off in pieces and each piece became its own community with its own build year — Berewick, Palisades, Ayrsley, which is the one she lives in. The middle of the stock dates to about 2006, and almost nothing here predates 1980. Detached houses outnumber townhomes by something like four to one, and the townhomes are scattered through rather than gathered in one place. The Palisades end holds the larger houses and the acreage; the older houses on genuinely big lots sit closer to Lake Wylie. The ground is flat, so foundations are slabs and basements are rare — the lots that support a walkout are down by the water, and almost nowhere else.",

    priceContext:
      "This is not a prestige market and it does not price like one. It is more affordable than SouthPark or Ballantyne and it behaves differently: houses sit longer here, and a seller who prices above the market does not get rescued by it. The ceiling is set by new construction rather than by resale — some townhome communities are selling now for less than they released for, which pulls the resale around them down with them. Treat any single statistic you are quoted about this market carefully, including the ones here: nobody agrees where Steele Creek stops, so the numbers move depending on where the person quoting them drew the line.",

    commute:
      "I-77 is the route everyone knows and it is reliably congested; the toll lanes have been in the news for years. What Steele Creek has that much of the county does not is alternatives — I-485 loops around and is often faster than sitting on 77, and the side roads genuinely work. South Tryon is the exception, and it gets worse the further south you go on it. The drive is roughly symmetrical in and out, and like everywhere here it has been getting slower year over year.",

    whatTrades:
      "Two things are on the market at once: builder inventory in the newer communities, and resale from the early-2000s stock that has usually turned over once or twice. The resale arrives with the list a twenty-year-old house arrives with, and the systems tend to reach the end of their first life together, because the houses around it were built within a few years of each other. What you do not get here is the surprise an older Charlotte neighborhood produces — the quirks of a 1930s house are not in play. Worth knowing that a large share of the housing here is apartments, so the for-sale market is smaller than the number of roofs suggests.",

    levers: [
      {
        /* The strongest lever here, and the one she was most specific about.
           Grounded in the interview, and in 2023-shopton-point-01 — a Meritage
           purchase in this market whose recorded lever is builder concessions
           at closing. Distinct from the Fort Mill draft's builder lever, which
           is about what a builder will INCLUDE; this is about a builder setting
           the comp that a private seller has to live under. */
        title: "The builder down the road is your comp",
        body: "In most of Charlotte the house you are competing with is the one two streets over. Here it is often a builder, and a builder is a different opponent. It can move on price without feeling it, it can pay costs a private seller cannot, and it is releasing new phases while your seller waits. If you are buying resale, the builder's number and the builder's inclusions are the argument you bring to the table. If you are selling, that same builder is the competition you have to price against, whether or not anyone told you.",
      },
      {
        /* From "homes sit longer here" and "no sellers successfully
           overpricing", both hers. */
        title: "Time on the market is information, and it is on your side",
        body: "Houses take longer to sell here than they do in the faster parts of south Charlotte, and that is not a defect to be talked around — it is the shape of the negotiation. A listing that has been sitting has already told you what the seller has learned about their price. In a market where overpricing does not get rescued, patience is a position. The mistake is treating a Steele Creek listing the way you would treat one in a submarket where hesitating costs you the house.",
      },
      {
        /* Inference from her two observations — dominant early-2000s era, and
           inspections yielding typical maintenance items for that era. The
           negotiation application is ours; the facts under it are hers. */
        title: "Everything was built at once, so everything ages at once",
        body: "A neighborhood built inside a few years reaches the end of its first mechanical life inside a few years. Water heaters, HVAC, roofs, and the rest arrive at the same conversation at roughly the same time, and across a whole street rather than one house. That makes the inspection response here more predictable than it is anywhere older, which cuts both ways: a buyer who knows the build year knows what is coming and can ask for it, and a seller who knows it can get ahead of it instead of negotiating from a report.",
      },
    ],

    faq: [
      {
        question: "When was most of Steele Creek built?",
        answer:
          "Most of Steele Creek was built between about 2000 and the early 2010s, on farmland that was sold off in pieces over that period. The Palisades end has the larger houses and more acreage, and the older houses on big lots are closer to Lake Wylie.",
      },
      {
        question: "Do houses in Steele Creek have basements?",
        answer:
          "Mostly not. The terrain is flat, so foundations are typically slabs and basements are rare. The exception is nearer Lake Wylie, where some lots fall away enough to support a walkout basement.",
      },
      {
        question: "How is the commute from Steele Creek to Uptown Charlotte?",
        answer:
          "I-77 is the obvious route and it is reliably congested. Steele Creek's advantage is that it has alternatives: I-485 loops around and is often faster than sitting on 77, and the side roads work. South Tryon is the exception, and gets heavier the further south you go.",
      },
      {
        question: "Is Steele Creek mostly townhomes or single-family homes?",
        answer:
          "Single-family, by a wide margin — roughly four detached houses for every attached one, and the townhomes are spread through the area rather than concentrated in one part of it. A large share of the housing overall is apartments, so the for-sale market is smaller than the total number of homes would suggest.",
      },
      {
        /* The boundary problem is real, it is why no percentage appears
           anywhere on this page, and it is genuinely useful to a reader who is
           being shown confident-looking market statistics by someone else. */
        question: "Where exactly are the boundaries of Steele Creek?",
        answer:
          "There is no universally agreed boundary. Some sources mean the smaller neighborhood designation, some mean the 28278 ZIP code, and some mean the broader historic Steele Creek community, which is larger than both. That is worth knowing before you rely on any statistic about the area, because the number changes depending on which of the three the person quoting it used.",
      },
      {
        question: "Is Steele Creek a buyer's market or a seller's market?",
        answer:
          "Houses in Steele Creek tend to sit on the market longer than they do in south Charlotte, and sellers who price above the market are not usually rescued by it. New construction also sets a ceiling that resale has to price under. Both give a buyer more room to negotiate than they would have further east.",
      },
    ],
  },
];
