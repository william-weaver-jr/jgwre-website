/**
 * Area page content — the real dataset.
 *
 * Four entries as of 2026-09-21. The discipline below is why there are not seventeen.
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
 * Source: Jasmine where the content is about her or her record. POLICY CHANGE
 * 2026-09-14 (Bill): a market no longer waits for a closing or her residency —
 * these pages are marketing for markets she wants business in. Market facts may
 * be researched and verified at a primary source; claims about HER still need
 * CLAUDE.md §5 behind them (§6). docs/AREAS-SPEC.md, top of file.
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
      "Steele Creek is southwest Charlotte, and it was mostly farmland until the late 1990s. The residential boom ran from then through the 2010s, which puts the middle of the housing stock around 2006 and leaves very little of it built before 1980. Newer stock means slab foundations, almost no basements, and inspection findings that are predictable rather than surprising. Houses here sit on the market longer than they do in south Charlotte, and new construction sets a ceiling that resale has to price under. Both of those give a buyer room that does not exist further east. Jasmine Garcia has lived in Ayrsley, inside Steele Creek, since 2021.",

    lede:
      "Steele Creek was farmland until the late 1990s, and most of what is here now went up after that. Houses sit longer than they do in south Charlotte, and that is leverage if you know what to do with it.",

    /* The lede runs 200 characters, which a result listing cuts mid-clause. Same
       two facts, shorter, with the market name first because that is the word
       being searched. */
    metaDescription:
      "Steele Creek was farmland until the late 1990s, so the stock is newer than it looks. Houses sit longer here than in south Charlotte, and that is leverage.",

    housingStock:
      "It went up in bands rather than blending, because the farmland sold off in pieces and each piece became its own community with its own build year: Berewick, Palisades, Ayrsley, which is the one she lives in. The middle of the stock dates to about 2006, and almost nothing here predates 1980. Detached houses outnumber townhomes by something like four to one, and the townhomes are scattered through rather than gathered in one place. The Palisades end holds the larger houses and the acreage. The older houses on genuinely big lots sit closer to Lake Wylie. The ground is flat, so foundations are slabs and basements are rare. The lots that support a walkout are down by the water, and almost nowhere else.",

    priceContext:
      "This is not a prestige market and it does not price like one. It is more affordable than SouthPark or Ballantyne and it behaves differently: houses sit longer here, and a seller who prices above the market does not get rescued by it. The ceiling is set by new construction rather than by resale. Some townhome communities are selling now for less than they released for, which pulls the resale around them down with them. Treat any single statistic you are quoted about this market carefully, including the ones here: nobody agrees where Steele Creek stops, so the numbers move depending on where the person quoting them drew the line.",

    commute:
      "I-77 is the route everyone knows, and it is reliably congested. The toll lanes have been in the news for years. What Steele Creek has that much of the county does not is alternatives. I-485 loops around and is often faster than sitting on 77, and the side roads genuinely work. South Tryon is the exception, and it gets worse the further south you go on it. The drive is roughly symmetrical in and out, and like everywhere here it has been getting slower year over year.",

    whatTrades:
      "Two things are on the market at once: builder inventory in the newer communities, and resale from the early-2000s stock that has usually turned over once or twice. The resale arrives with the list a twenty-year-old house arrives with, and the systems tend to reach the end of their first life together, because the houses around it were built within a few years of each other. What you do not get here is the surprise an older Charlotte neighborhood produces. The quirks of a 1930s house are not in play. Worth knowing that a large share of the housing here is apartments, so the for-sale market is smaller than the number of roofs suggests.",

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
        body: "Houses take longer to sell here than they do in the faster parts of south Charlotte, and that is not a defect to be talked around. It is the shape of the negotiation. A listing that has been sitting has already told you what the seller has learned about their price. In a market where overpricing does not get rescued, patience is a position. The mistake is treating a Steele Creek listing the way you would treat one in a submarket where hesitating costs you the house.",
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
          "Single-family, by a wide margin. Roughly four detached houses for every attached one, and the townhomes are spread through the area rather than concentrated in one part of it. A large share of the housing overall is apartments, so the for-sale market is smaller than the total number of homes would suggest.",
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

  {
    /*
      South End — the first page in the diligence format (types.ts AreaGuide,
      docs/AREAS-SPEC.md §14). Built 2026-09-14 from a brief supplied by Bill.

      READ THIS BEFORE ADDING TO IT. South End is one of the zero-row markets in
      docs/AREAS-SPEC.md §12: no closing in the ledger names it, and she does not
      live here. That is no longer a reason to hold a page (policy, 2026-09-14),
      but it still limits what the page may say about her. So it is built from
      nothing that needs her record behind it. It makes no claim that she has closed here, lives here,
      or knows a particular building. What it offers instead is a method — the
      unit, the building, the block — that is true of attached housing on a rail
      corridor whoever is reading it, and that is exactly what a condo buyer does
      not know to check.

      Keep it that way until the evidence changes. A sentence like "she has sold
      in Atherton Mill" needs a ledger row first. §6.

      PUBLIC FACTS, verified against primary sources 2026-09-14:
        - The Rail Trail is 3.5 miles (southendclt.org, charlotterailtrail.org).
        - South End's Blue Line stations are Carson, Bland Street, East/West
          Boulevard and New Bern (southendclt.org).
        - CATS is building a station between East/West Boulevard and New Bern.
          Track and systems work spring 2026 to spring 2027; station construction
          2027; testing and opening 2028 (charlottenc.gov/CATS, Blue Line South
          End Station). Re-check that page before editing the dates — the copy
          says "targeted" because transit schedules slip.

      DELIBERATELY ABSENT.
        - Any price, median, or HOA dues figure. No area-level figure is on the
          allowlist in docs/CONTENT-MARKETING.md §2, a dollar amount would pull
          the results disclaimer onto the page, and a condo median here is an
          average across buildings that the whole page argues is meaningless.
          The brief's "$500,000 condo" example became "the same list price".
        - Who lives here. The brief's own banned list ("young professionals",
          "singles") is the fair-housing failure this market invites, and the
          suite below asserts it stays out. The page describes trains, parking,
          and associations instead.
        - A search-listings CTA. "See South End homes" would have pointed at the
          brokerage IDX, and CLAUDE.md §12 (2026-09-04) moved that link to the
          footer because a registration there becomes a broker-sourced lead.
        - Images. There are no licensed South End photographs in the repo and
          nothing is hotlinked. Wanted, in order: the Rail Trail with the
          skyline, a Blue Line train in South End, condo and mixed-use
          architecture, Atherton Mill streetscape. docs/IMAGE-CREDITS.md governs
          how one lands.
    */
    slug: "south-end",
    name: "South End",
    state: "NC",

    targetQuery: "what should i know before buying a condo in south end charlotte",

    answer:
      "South End sits immediately south of Uptown, built along the LYNX Blue Line and the Charlotte Rail Trail, and it is one of Charlotte's most urban residential markets. Most people buying here are comparing condos and townhomes rather than detached houses.\n\nBecause the neighborhood runs along a rail corridor, how close a property sits to a station, to the trail, and to South Boulevard changes how it lives day to day.\n\nThe comparison that matters is rarely price per square foot. It is the full ownership picture: HOA dues, parking, amenities, the condition of the building, any upcoming assessments, rental rules, construction nearby, and how many similar units will be competing with yours when you eventually sell.",

    lede:
      "South End puts condos, townhomes, the Rail Trail and the LYNX Blue Line within a few minutes of Uptown. That convenience comes with tradeoffs: HOA costs, parking, construction, nightlife and resale can change noticeably from one property to the next.",

    metaDescription:
      "Buying or selling in South End Charlotte? Condos, townhomes, HOA costs, the Rail Trail, light rail, parking, and what to check before you make a move.",

    housingStock:
      "If your search starts with “South End homes for sale,” expect a different market from most of Charlotte. Apartments make up a large share of what has been built here, and the for-sale market is concentrated in condos, loft-style units, and townhomes. Detached houses are the exception inside the core of the district.\n\nThat makes the building or the community part of what you are buying. Two listings with the same bedroom count can come with different associations, different parking, and different rules about what you are allowed to do with the unit later.",

    priceContext:
      "The list price is only the first number to compare. Prices in South End vary a great deal by building, property type, size, parking, condition, and where along the corridor a home sits, so a neighborhood average says very little about any one unit.\n\nFor a condo or other attached home, the monthly and long-run cost of ownership belongs in the same comparison as the price. Put these side by side before deciding which listing is actually the better value:",

    commute:
      "South End is one of the few Charlotte neighborhoods where daily life can depend less on a car, particularly close to the Rail Trail and a Blue Line station.\n\nThe Charlotte Rail Trail is a 3.5-mile paved path beside the light rail corridor, with restaurants, shops, offices, public art, and gathering spaces opening onto it. The Blue Line runs north from South End directly into Uptown, so a trip downtown can be a few stops rather than a drive and a parking deck.\n\nBeing close to the corridor is not simply good, though. It is a trade, and it is worth weighing on purpose.",

    whatTrades:
      "For a South End condo seller, the closest comparable can be one floor above you.\n\nBuyers here can usually compare several similar units, buildings, or townhome communities within a short walk, and within a single weekend. That makes your price, your presentation, and your association's details unusually easy to hold up against the alternatives. A buyer who toured the unit upstairs on Saturday already knows what it had that yours does not.\n\nThe details that decide it tend to be specific:",

    /* For the diligence format these are the three layers — the three places
       where the other side of the table knows more than the listing says. */
    levers: [
      {
        title: "The unit",
        body: "Which way it faces, which floor it is on, and what the windows look at. Natural light, whether the balcony faces the street or a courtyard, how far it is from the elevator and the trash room, and which parking space and storage unit actually convey with it. None of that is in the square footage. All of it shows up at resale.",
      },
      {
        title: "The building or community",
        body: "The association's finances and reserves, its maintenance history, the master insurance policy, the amenities and what they cost to keep running, the rental rules, any assessment already approved or under discussion, and how earlier units have resold. On a tour you see the lobby. The association's budget and minutes tell you what the lobby is going to cost.",
      },
      {
        title: "The block",
        body: "How far it is to the Rail Trail and the nearest station, whether it fronts South Boulevard or a side street, what sits at street level below it, how close the nearest bars are, what is under construction or approved nearby, and how far you walk for groceries. The same floor plan lives differently a few blocks up or down the corridor.",
      },
    ],

    faq: [
      {
        question: "Is South End Charlotte a good place to live?",
        answer:
          "It depends on what you want a neighborhood to do. South End suits people who want to walk to restaurants, the Rail Trail and a Blue Line station, and who accept density, construction and evening activity in exchange. It suits buyers who want a yard, a detached house, or distance from nightlife less well. Most of the decision comes down to the specific building and block rather than the neighborhood as a whole.",
      },
      {
        question: "What types of homes are in South End Charlotte?",
        answer:
          "South End is mostly condos, townhomes and apartments. Apartments make up a large share of the housing, so the for-sale market is concentrated in condos, loft-style units and townhomes. Detached single-family houses are uncommon inside the core of the district and more common in neighboring areas such as Dilworth and Wilmore.",
      },
      {
        question: "Are there single-family homes in South End Charlotte?",
        answer:
          "A few, mostly around the edges of the district. South End's ownership market is dominated by condos and townhomes. Buyers who want a detached house within reach of South End usually end up looking in neighboring Dilworth or Wilmore, which have more of them and a more residential street pattern.",
      },
      {
        question: "How much do condos cost in South End Charlotte?",
        answer:
          "Prices vary substantially by building, property type, size, parking, condition and location within South End, so a neighborhood average is a poor guide to any one unit. Monthly HOA dues and any special assessments also change what a condo really costs to own. Contact Jasmine Garcia for current active listings and recent comparable sales in the buildings you are considering.",
      },
      {
        question: "Is South End Charlotte walkable?",
        answer:
          "Yes. South End is one of the most walkable parts of Charlotte, particularly near the Rail Trail and the LYNX Blue Line corridor. Restaurants, shops, offices and the trail itself are within walking distance of much of the housing. How walkable a particular home feels depends on its distance to the trail and a station, and on whether South Boulevard sits between them.",
      },
      {
        question: "Does South End have light rail access?",
        answer:
          "Yes. The LYNX Blue Line runs through South End and continues directly into Uptown Charlotte. Four stations serve the neighborhood today, and the city is building another between East/West Boulevard and New Bern, targeted to open in 2028. Living near a station can reduce how often you drive, though homes right beside the tracks also hear the trains.",
      },
      {
        question: "Which LYNX stations are in South End?",
        answer:
          "South End is served by four LYNX Blue Line stations: Carson, Bland Street, East/West Boulevard and New Bern. Carson is the closest to Uptown and New Bern is the southernmost. CATS is adding a station between East/West Boulevard and New Bern, with station construction scheduled for 2027 and service targeted for 2028.",
      },
      {
        question: "What is the Charlotte Rail Trail?",
        answer:
          "The Charlotte Rail Trail is a 3.5-mile paved path running alongside the LYNX Blue Line between Uptown and South End. It connects the neighborhood's restaurants, shops, offices, public art and gathering spaces. For a buyer, distance to the trail is one of the clearest ways South End properties differ from one another, in daily convenience and in how much activity passes by.",
      },
      {
        question: "Do South End condos have HOA fees?",
        answer:
          "Yes. Condos and most townhomes in South End belong to an owners' association, and dues vary widely from building to building. Dues may cover exterior maintenance, the building's insurance, amenities, some utilities and reserves for future repairs. Compare what the dues include rather than only the monthly amount, and ask whether any special assessment has been approved or is being discussed.",
      },
      {
        question: "What should I check before buying a South End condo?",
        answer:
          "Start with the association: dues, what they cover, reserve funding, special assessments, rental restrictions and how many units are owner-occupied. Then the unit: parking, storage, orientation, floor and street exposure. Then the block: distance to the Rail Trail and a station, nightlife, and construction planned nearby. Ask your lender early whether the condo project meets its financing requirements.",
      },
      {
        question: "Is parking difficult in South End Charlotte?",
        answer:
          "It can be, and it varies by building. Some condos come with a deeded or assigned space, some share a garage, and some include no space at all. Guest parking is often limited, and street parking competes with restaurant and nightlife traffic. Before an offer, confirm exactly which space conveys with the unit, how that is documented, and where visitors park.",
      },
      {
        question: "Is South End noisy?",
        answer:
          "Parts of it are. Trains on the Blue Line, traffic on South Boulevard, restaurant and bar crowds, and ongoing construction all add sound, and how much a home hears depends on its floor, orientation and distance from each. A unit facing an interior courtyard can be very different from one facing the corridor. Visit in the evening and on a weekend, not only during a daytime showing.",
      },
      {
        question: "Is South End close to Uptown Charlotte?",
        answer:
          "Yes. South End sits immediately south of Uptown, and the two meet at I-277. The LYNX Blue Line connects them directly, the Rail Trail links them on foot and by bike, and South Boulevard and South Tryon Street both run between them. How long the trip takes depends on where in South End you start and how you travel.",
      },
      {
        question: "Is South End good for someone relocating to Charlotte?",
        answer:
          "It can be, particularly for someone who wants to be near Uptown and use the light rail rather than drive for every errand. The harder part of relocating to South End is judging buildings from a distance: HOA finances, parking, noise and nearby construction do not show up in listing photos. Having someone walk the building and the block before you commit helps close that gap.",
      },
      {
        question: "Is South End a good place to buy an investment property?",
        answer:
          "It can work, but the building's rules matter as much as the location. Many associations restrict short-term rentals, some limit how many units can be leased, and a high share of rented units can narrow financing options for the next buyer. Compare purchase price, HOA dues, taxes, insurance and realistic rent against the association's actual documents. No location promises appreciation or a return.",
      },
      {
        question: "What should sellers know about selling a condo in South End?",
        answer:
          "Your closest competition may be in your own building. Buyers can compare several similar units within a short walk, so price, condition, parking, floor, view and HOA dues are easy to hold up side by side. Expect questions about reserves, assessments and nearby construction. The useful pricing question is not only what the last unit sold for, but why a buyer would choose yours instead.",
      },
    ],

    guide: {
      city: "Charlotte",
      headline:
        "South End real estate is mostly about choosing the right block — and the right building.",
      heroCloser:
        "Jasmine Garcia helps buyers and sellers see those differences before they become expensive ones.",
      seoTitle: "South End Charlotte Real Estate: Condos & Townhomes",
      heroCta: "Talk with Jasmine about South End",

      answerHeading: "What should you know before buying in South End?",
      facts: [
        { label: "Housing", value: "Mostly condos, townhomes and apartments" },
        { label: "Location", value: "Immediately south of Uptown Charlotte" },
        {
          label: "Transit",
          value: "LYNX Blue Line: Carson, Bland Street, East/West Boulevard and New Bern stations",
        },
        { label: "Rail Trail", value: "A 3.5-mile paved path along the light rail corridor" },
        { label: "Character", value: "Dense, walkable, mixed-use, and built around transit" },
        { label: "Still changing", value: "Another Blue Line station targeted to open in 2028" },
      ],

      housingHeading: "What can you actually buy in South End?",
      propertyTypes: [
        {
          name: "Condo",
          goodFor:
            "Buyers who put location, lower exterior maintenance, and building amenities ahead of space.",
          checks: [
            "HOA dues, and what they cover",
            "Reserves and any assessments",
            "Owner-occupancy and rental restrictions",
            "Parking: deeded, assigned, or shared",
            "Storage",
            "How the association's insurance and yours split",
            "Recent sales in the same building",
          ],
        },
        {
          name: "Townhome",
          goodFor:
            "Buyers who want more room or a garage and still want to walk to the Rail Trail.",
          checks: [
            "Fee-simple ownership, or legally a condo",
            "What the HOA maintains, and what you do",
            "Roof and exterior responsibility",
            "Guest parking and street access",
            "What is planned on the neighboring lots",
            "New construction competing nearby",
          ],
        },
        {
          name: "Detached house",
          goodFor:
            "They exist around the edges of the district and in neighboring Dilworth and Wilmore, but they are not what South End mostly sells.",
        },
      ],
      housingCta: {
        prompt: "Not sure which property type makes sense?",
        label: "Talk with Jasmine before narrowing the search",
        href: "#start",
      },

      layersHeading: "In South End, a few blocks can change the experience.",
      layersIntro:
        "Look at a South End property on three levels, in this order. The listing describes the first one. The other side of the table usually knows all three.",
      layersClosing:
        "Two condos with similar square footage and similar list prices can be very different purchases once those three layers are compared.",

      transitEyebrow: "The Rail Trail and the Blue Line",
      transitHeading: "How walkable is South End Charlotte?",
      transitColumns: [
        {
          heading: "Blue Line stations",
          items: ["Carson", "Bland Street", "East/West Boulevard", "New Bern"],
        },
        {
          heading: "What proximity gives you",
          items: [
            "An easier trip into Uptown",
            "Less driving for daily errands",
            "Restaurants, shops, and the trail on foot",
            "Appeal to the next buyer shopping for exactly this",
          ],
        },
        {
          heading: "What it comes with",
          items: [
            "Train movement and crossing signals",
            "Foot traffic, late into the evening",
            "Street noise and nightlife",
            "Competition for parking, guest parking included",
            "Construction and development around you",
          ],
        },
      ],
      transitCallout:
        "A five-minute walk to the station and a bedroom window facing the corridor are two different real-estate facts.",

      changeHeading: "South End is still changing.",
      changeBody: [
        "CATS is adding a Blue Line station between East/West Boulevard and New Bern. Track and systems work began in spring 2026, and the city's current schedule has station construction starting in 2027, followed by testing and opening for service in 2028. Transit schedules move, so treat those dates as targets.",
        "New stations and dense development can add access and amenities. They also bring years of construction, and they change what gets built next door. Before an offer, look at what is planned directly around the property, not only what is there on the day you tour it.",
      ],

      costHeading: "What does a South End condo really cost?",
      costChecks: [
        "Monthly HOA dues",
        "What the dues cover, and what they do not",
        "How the association's insurance and your own policy split",
        "Parking included with the unit",
        "Storage",
        "Amenities, and what they cost to maintain",
        "Special assessments, current or pending",
        "How well the reserves are funded",
        "Your own maintenance obligations",
        "Property taxes",
        "Financing requirements for the project, if any",
        "Rental restrictions",
        "Capital projects the association has planned",
      ],
      costClosing:
        "Two condos at the same list price, two blocks apart, can be materially different purchases once the association's numbers are in the comparison. Jasmine can help you gather them and put them side by side. Your lender, tax adviser, and attorney are the right people to interpret them.",
      costCta: {
        prompt: "Comparing two or three units?",
        label: "Have Jasmine compare the numbers with you",
        href: "#start",
      },

      buyerHeading: "Buying in South End? These are the questions worth asking first.",
      buyerQuestions: [
        "How much are the HOA dues, and what do they cover?",
        "Are there any current or planned special assessments?",
        "How much does the HOA hold in reserves?",
        "Is parking deeded, assigned, or shared?",
        "Are there rental restrictions?",
        "How many units are owner-occupied?",
        "How often do comparable units come onto the market?",
        "Is major development planned next door or across the street?",
        "Which direction does the unit face?",
        "What does it sound like at 10 p.m. on a Friday, not just during a showing?",
        "Has the building had major roof, envelope, elevator, plumbing, or mechanical work?",
        "Are there financing considerations specific to this condo project?",
      ],
      buyerClosing:
        "Those answers can matter as much as negotiating the purchase price, and nearly all of them are cheaper to learn before an offer than after one.",
      buyerCta: {
        prompt: "Already looking at a specific unit?",
        label: "Send Jasmine the address",
        href: "#start",
      },

      sellerHeading: "Selling in South End? Your competition may be inside your own building.",
      sellerChecks: [
        "Recent sales in your own building",
        "Units competing with yours right now",
        "Floor, view, and orientation",
        "Parking and storage",
        "Renovations, and how they compare",
        "HOA dues against nearby buildings",
        "Amenities and building condition",
        "Any upcoming assessment a buyer will ask about",
        "Construction nearby",
        "The objection a buyer will raise, before they raise it",
      ],
      sellerClosing:
        "The question is not only what the last unit sold for. It is why a buyer would choose yours over the other South End options they can see this weekend.",
      sellerCta: {
        prompt: "Thinking about selling?",
        label: "Ask what your South End home is competing against",
        href: "/home-value",
      },

      nearbyHeading: "South End or somewhere nearby?",
      nearby: [
        {
          name: "South End",
          chooseWhen:
            "Walkability, the light rail, restaurants, and an urban street life are at the top of the list, and a yard is not.",
        },
        {
          name: "Dilworth",
          slug: "dilworth",
          chooseWhen:
            "You want to be close to South End and Uptown but prefer older residential streets with more detached houses.",
        },
        {
          name: "Wilmore",
          chooseWhen:
            "You want South End within reach and a more residential street pattern, with a larger share of detached houses.",
        },
        {
          name: "LoSo",
          slug: "loso",
          chooseWhen:
            "You want the South Boulevard light-rail corridor farther south, with newer development and a different mix of housing and commercial space.",
        },
      ],

      faqHeading: "South End Charlotte real estate: common questions",

      closingHeading: "Looking at a property in South End?",
      closingBody:
        "Send Jasmine the address. For a condo or townhome, she can help you look past the listing photos and compare the building, the HOA, parking, nearby development, and the recent competition before you decide how to approach it.",
      intakeHeading: "Tell me what you’re looking at.",
      intakeBody:
        "Property type, rough timing, and which side of the table you’re on. If you have an address or a listing link, put it in the message box.",
      intakeMarket: "in-town-charlotte",
    },
  },
  {
    /*
      Ballantyne — the second page in the diligence format (types.ts AreaGuide,
      docs/AREAS-SPEC.md §14), published 2026-09-21 under the 2026-09-14 policy
      that area guides do not wait for evidence.

      WHAT IS DOCUMENTED, AND WHAT THEREFORE MAY BE SAID ABOUT HER.
      One closing: 2022-belle-vista-01 — March 2022, buyer side, a CONDO in
      "Ballantyne West", recorded lever "Won in a multiple-offer situation."
      That row is already public on /transactions, so the page may reference it
      and does, once, in the seller section. It is the only claim on this page
      about her record. No residency, no volume, no "she knows every builder
      here" — none of that is documented. §6.

      PUBLIC FACTS, verified 2026-09-21 against primary or near-primary sources:
        - Ballantyne is inside the City of Charlotte, annexed between 1999 and
          2003; Mecklenburg County; mostly ZIP 28277; at the South Carolina
          line (Wikipedia, Ballantyne (Charlotte neighborhood), sourced to the
          annexation record). It is not a municipality — no town hall, no
          separate tax jurisdiction. That is the single most useful orientation
          fact for a searcher and it leads the page.
        - Rezoned as roughly 2,000 acres in 1992 (Harris/Bissell). The name now
          covers far more ground than that, which is why "what counts as
          Ballantyne" is section two rather than a footnote.
        - Ballantyne Corporate Park: 535 acres, bought by Northwood Investors
          in 2017 for $1.2 billion. NO DOLLAR FIGURE FROM THAT SENTENCE SHIPS —
          see below.
        - Ballantyne Reimagined (goballantyne.com): Stream Park, six acres, and
          TD Amp Ballantyne both opened September 2023; six new roads and a
          greenway connector complete; The Bowl restaurant district opening in
          stages; Oro Ballantyne, 26 stories and 356 residences, opened for
          move-ins late 2025; Wegmans, about 110,000 square feet on North
          Community House Road, opening October 2026; an NCDOT direct connector
          from the I-485 express lanes to Johnston Road is planned.
        - Bryant Farms Road Extension (charlottenc.gov): Phase 1, Elm Lane to
          Rea Road, complete — ribbon-cutting 11 June 2025, landscaping
          finished March 2026. Phase 2, Rea Road to Ardrey Kell Road, about
          1.25 miles, is in advanced planning and design with NO published
          completion date. The page says exactly that and no more.
        - Greenways: Four Mile Creek, McMullen Creek and Lower McAlpine Creek
          connect to the campus greenway connector.

      DELIBERATELY ABSENT.
        - Every dollar figure, including the $1.2 billion sale and any price
          band. A figure pulls <ResultsDisclaimer /> onto the page, and no
          area-level price is on the docs/CONTENT-MARKETING.md §2 allowlist.
        - School names and anything resembling a rating. Assignment is stated
          as what it is — a fact of the address that changes — and verification
          is sent to CMS. docs/AREAS-SPEC.md §4 is explicit that schools are how
          a careful page ends up making a familial-status argument.
        - "Top-rated", "safe", who lives here. Several sources consulted lead
          with exactly those; none of it is repeatable under §7.
        - A listings feed or a "View homes for sale" button pointed at the
          brokerage IDX. CLAUDE.md §12 (2026-09-04) made that link footer-only
          because a registration there becomes a broker-sourced lead at the
          worse split. The buyer who wants to see what is for sale is sent to
          her instead, which is the whole reason this site exists.
        - Images. Nothing licensed for Ballantyne is in the repo and nothing is
          hotlinked. Wanted: The Bowl streetscape, Stream Park, a Johnston Road
          or Ballantyne Commons Parkway streetscape, established subdivision
          architecture. docs/IMAGE-CREDITS.md governs how one lands.
    */
    slug: "ballantyne",
    name: "Ballantyne",
    state: "NC",

    targetQuery: "what is it like to live in ballantyne charlotte nc",

    answer:
      "Ballantyne is an area of far south Charlotte, in Mecklenburg County, running along Johnston Road and Ballantyne Commons Parkway up to the South Carolina line. It is part of the City of Charlotte rather than its own town, annexed between 1999 and 2003, so there is no separate town hall and no separate tax jurisdiction.\n\nMost of the housing is detached houses in master-planned subdivisions built from the 1990s onward, with townhomes, condos and newer apartments mixed in. The 535-acre office park at its center is being rebuilt as a walkable district of restaurants, shops, a park and an amphitheater, which is the biggest change here in thirty years.\n\nThe thing worth knowing before you search: Ballantyne is a name, not a boundary. Listings well outside the original master plan are marketed as Ballantyne, and the address decides school assignment, HOA dues and which houses your offer is actually competing with.",

    lede:
      "Ballantyne is far south Charlotte at the South Carolina line: master-planned subdivisions, townhomes and condos around an office park that is being rebuilt into a walkable district.",

    metaDescription:
      "Ballantyne, Charlotte NC: where it is, what you can buy, how the area is changing, and what to check before buying or selling. Guidance from Jasmine Garcia.",

    housingStock:
      "The bulk of Ballantyne is detached houses in master-planned subdivisions, most of them built from the early 1990s onward as the land west and east of Johnston Road was developed in large pieces. Each piece came with its own street pattern, its own architecture and its own homeowners association, which is why two houses a mile apart can feel like different markets.\n\nAround and between them sit townhomes, a smaller number of condos, and apartments — including the newest residential towers on the old corporate campus. There is also a golf and country club community here, where club membership is a separate arrangement from the subdivision's HOA and should be priced separately when you compare two houses.",

    priceContext:
      "Ballantyne is one of the higher-priced parts of Mecklenburg County, and the spread inside it is wide: a townhome off Community House Road and a larger house on an established subdivision street are not competing for the same buyer, even with a Ballantyne address on both.\n\nWhat moves the number for a specific house is rarely the area name. It is the subdivision, the lot, the build year, what has been updated, the HOA and any club dues, and what else is available that weekend within a few minutes' drive. Before comparing two listings, get these on the same page:",

    commute:
      "Ballantyne is built around driving. I-485 runs along its northern edge with interchanges at Johnston Road, Rea Road and Ballantyne Commons Parkway, and Johnston Road — US 521 — is the spine running south into South Carolina.\n\nThe exception is the old corporate campus, where the rebuild has added sidewalks, six new roads, a park and a greenway connector, so the newest apartments and the restaurant district genuinely are walkable to each other. That does not extend to the subdivisions. In most of Ballantyne you drive to dinner, and the honest question for a buyer is which of those two experiences they are buying into.\n\nGreenways are the other way to get around on foot: Four Mile Creek, McMullen Creek and Lower McAlpine Creek connect through this part of the county and into the campus.",

    whatTrades:
      "In Ballantyne the closest comparable is almost always inside your own subdivision, and often on your own street.\n\nThat cuts both ways. A buyer touring your house has usually already seen the other listing in the neighborhood, knows the floor plan because the builder used it forty times, and is pricing the difference between the two in updates rather than in square footage. Where your house has the same bones as its neighbors, condition, finishes and lot are the argument.\n\nThe other competition is newer: the apartments and townhomes on the rebuilt campus are pulling some of the same people who would otherwise buy a resale here. What tends to decide it:",

    /* The three levels, Ballantyne's version. Not the unit/building/block of a
       condo market — here the fuzzy name is the problem, so the levels run
       address, subdivision, segment. */
    levers: [
      {
        title: "The address, not the area name",
        body: "Ballantyne is a marketing label attached to more ground than any boundary supports, and the address under it is what actually decides things. School assignment follows the address. So does the HOA you will pay, the county and city you are taxed by, and the set of recent sales an appraiser will use. Two listings both described as Ballantyne can answer those four questions differently.",
      },
      {
        title: "The subdivision and what its association covers",
        body: "This is not one community with one set of rules. It is dozens of separately platted subdivisions, each with its own association, dues, amenities, architectural restrictions and reserve position. Some include a pool and tennis courts; some include almost nothing. A country club membership, where one is available, is a separate arrangement again. Ask what the dues cover and what they have done recently before you treat two similar houses as similar purchases.",
      },
      {
        title: "Which part of Ballantyne you are in",
        body: "There are effectively three. The rebuilt campus around the Bowl is the newest and the only genuinely walkable part, and it is mostly apartments and condos. The established subdivisions off Johnston Road, Rea Road and Ardrey Kell Road are where most of the detached houses are, and they date from the 1990s and 2000s. Then there is the edge, where a listing carries the Ballantyne name because it sells better than the name of the road it is actually on.",
      },
    ],

    faq: [
      {
        question: "Where is Ballantyne in Charlotte?",
        answer:
          "Ballantyne is in far south Charlotte, in Mecklenburg County, at the South Carolina state line. It runs along Johnston Road, which is US 521, and Ballantyne Commons Parkway, with I-485 along its northern edge. It sits roughly 13 to 15 miles south of Uptown Charlotte, and most of it falls in the 28277 ZIP code.",
      },
      {
        question: "Is Ballantyne part of the City of Charlotte?",
        answer:
          "Yes. Ballantyne is part of the City of Charlotte, annexed in stages between 1999 and 2003, and it sits in Mecklenburg County. It is not a separate municipality, so there is no Ballantyne town hall, no separate town government and no separate town tax. Addresses here are Charlotte, North Carolina addresses, and city services are Charlotte services.",
      },
      {
        question: "What types of homes are in Ballantyne?",
        answer:
          "Mostly detached houses in master-planned subdivisions built from the early 1990s onward, with townhomes, a smaller number of condos, and apartments mixed in. The newest residential is on the former corporate campus, where mixed-use buildings have added apartments and condos beside restaurants and shops. Most subdivisions have their own homeowners association, and dues and amenities vary from one to the next.",
      },
      {
        question: "What is Ballantyne known for?",
        answer:
          "Ballantyne is known for the combination of large master-planned residential subdivisions and a major employment center in the same place, which is unusual for a residential area this far from Uptown. The 535-acre office park at its center is being redeveloped into a mixed-use district with restaurants, shops, a six-acre park and an amphitheater. Shopping, dining and services are concentrated along Johnston Road and Ballantyne Commons Parkway.",
      },
      {
        question: "How far is Ballantyne from Uptown Charlotte?",
        answer:
          "Ballantyne sits roughly 13 to 15 miles south of Uptown Charlotte. The usual routes are I-485 to I-77, or Johnston Road north through south Charlotte. How long it takes depends heavily on the time of day and on conditions on I-485 and I-77, so treat any single drive-time figure you are quoted as an average rather than a promise.",
      },
      {
        question: "What schools serve Ballantyne?",
        answer:
          "Ballantyne is served by Charlotte-Mecklenburg Schools. Assignment is determined by the property address, not by the neighborhood name, and CMS can and does change assignment boundaries. Magnet and choice programs are separate from home-school assignment and have their own application process. Confirm the current assignment for any specific address with CMS directly before you make an offer.",
      },
      {
        question: "Is Ballantyne walkable?",
        answer:
          "Partly, and it depends where. The redeveloped campus around The Bowl at Ballantyne is genuinely walkable, with sidewalks, new streets, a park and restaurants close together. Most of the residential subdivisions are not: they are laid out for driving, and errands generally mean a car. Greenways along Four Mile Creek, McMullen Creek and Lower McAlpine Creek add walking and cycling connections through the wider area.",
      },
      {
        question: "Is there new construction in Ballantyne?",
        answer:
          "Yes, though less of it than in Charlotte's outer suburbs, because much of Ballantyne was built out in earlier decades. Most current new construction is attached or multifamily on and around the redeveloped campus, including recently completed residential towers. New detached houses are limited and tend to appear on infill sites or in communities just outside the original master-planned area.",
      },
      {
        question: "How is Ballantyne changing?",
        answer:
          "The 535-acre office park at its center is being rebuilt as a mixed-use district. A six-acre park and an amphitheater opened in 2023, six new roads and a greenway connector are in, restaurants and shops have been opening in stages, and a residential tower opened for move-ins in late 2025. A large grocery store is opening on North Community House Road in October 2026, and further roadway work is planned.",
      },
    ],

    guide: {
      city: "Charlotte",
      headline:
        "Ballantyne is a name on a lot of listings — the address under it decides what you are buying.",
      heroCloser:
        "Jasmine Garcia works this part of south Charlotte and can tell you what a specific Ballantyne address actually comes with, before you write an offer on it.",
      seoTitle: "Ballantyne Charlotte NC Homes & Real Estate",
      heroCta: "Ask about a Ballantyne address",

      answerHeading: "What is it like to live in Ballantyne?",
      facts: [
        { label: "Where", value: "Far south Charlotte, Mecklenburg County, at the South Carolina line" },
        { label: "Jurisdiction", value: "City of Charlotte — annexed 1999-2003, not a separate town" },
        { label: "ZIP", value: "Mostly 28277" },
        {
          label: "Main roads",
          value: "I-485, Johnston Road (US 521), Ballantyne Commons Parkway, Rea Road, Community House Road",
        },
        {
          label: "Housing",
          value: "Master-planned subdivisions, townhomes, condos, and newer mixed-use apartments",
        },
        { label: "Changing", value: "The 535-acre office park at its center is being rebuilt as a walkable district" },
      ],

      orientation: {
        eyebrow: "Where it is",
        heading: "What counts as Ballantyne?",
        body: [
          "Ballantyne began as a rezoning of roughly 2,000 acres in 1992 and has never been a town. It has no municipal boundary of its own, which means no line on a map settles the question of whether a given house is in it.",
          "In practice the name gets used three ways. There is the original master-planned area either side of Johnston Road. There is the 535-acre former corporate park at its center, now being redeveloped. And there is everything marketed as Ballantyne because the name carries — listings on the Blakeney, Ardrey Kell and Providence side that a stricter definition would exclude.",
          "None of that is dishonest, and it is not a reason to distrust a listing. It is a reason to look past the name. When a search result says Ballantyne, the questions that matter are which subdivision, which association, which school assignment and which recent sales the appraiser will reach for. Those come from the address.",
        ],
      },

      housingHeading: "What can you buy in Ballantyne?",
      propertyTypes: [
        {
          name: "Detached house",
          goodFor:
            "Buyers who want a yard, a garage and a master-planned subdivision, and who accept driving for most errands.",
          checks: [
            "Which subdivision, and its association's dues",
            "What the dues actually cover",
            "Build year and what has been updated since",
            "Architectural restrictions before you plan changes",
            "Whether a club membership is separate",
            "Recent sales on the same streets, not area-wide",
          ],
        },
        {
          name: "Townhome",
          goodFor:
            "Buyers who want less exterior maintenance and a location close to Johnston Road and Ballantyne Commons Parkway.",
          checks: [
            "Fee-simple ownership, or legally a condo",
            "What the association maintains, and what you do",
            "Roof, siding and reserve funding",
            "Rental restrictions",
            "Guest parking",
            "How many similar units resell each year",
          ],
        },
        {
          name: "Condo or mixed-use apartment",
          goodFor:
            "Buyers who want the walkable part of Ballantyne — the rebuilt campus, where restaurants and the park are a short walk rather than a drive.",
          checks: [
            "Dues, reserves and any assessments",
            "Parking and storage",
            "Rental and owner-occupancy rules",
            "Financing requirements for the project",
            "What is still under construction nearby",
          ],
        },
      ],
      housingCta: {
        prompt: "Comparing a subdivision house with something on the campus?",
        label: "Talk it through with Jasmine",
        href: "#start",
      },

      layersHeading: "In Ballantyne, the area name is the least useful thing on the listing.",
      layersIntro:
        "Three things decide what a Ballantyne house actually is, and a search result shows you none of them. Work down this list for any address you are serious about.",
      layersClosing:
        "Two houses marketed as Ballantyne, a few miles apart, can differ on every one of these at the same list price.",

      transitEyebrow: "Getting around",
      transitHeading: "How convenient is Ballantyne, really?",
      transitColumns: [
        {
          heading: "The roads that matter",
          items: [
            "I-485, along the northern edge",
            "Johnston Road (US 521), the north-south spine",
            "Ballantyne Commons Parkway",
            "Rea Road",
            "Community House Road",
            "Ardrey Kell Road",
          ],
        },
        {
          heading: "What the location gives you",
          items: [
            "I-485 access to both I-77 and south Charlotte",
            "A large employment base within the area itself",
            "Shopping, dining and services close by",
            "A short drive to the South Carolina line",
            "Greenway access for walking and cycling",
          ],
        },
        {
          heading: "What to account for",
          items: [
            "A car for most daily errands",
            "Peak congestion on Johnston Road and at I-485",
            "Walkability that varies sharply by location",
            "Ongoing construction on and around the campus",
            "Roadway projects still in design",
          ],
        },
      ],
      transitCallout:
        "Walkable Ballantyne and drive-everywhere Ballantyne are both real, and they are about two miles apart. Know which one an address is in before you fall for the photos.",

      changeHeading: "What is changing in Ballantyne?",
      changeBody: [
        "The 535-acre office park at the center of Ballantyne was bought by Northwood Investors in 2017 and is being rebuilt as a mixed-use district under the name Ballantyne Reimagined. This is the largest change here since the area was first developed, and it is being delivered in stages rather than all at once.",
        "Each item below says where it actually stands. That distinction matters when you are buying: a restaurant district that is open is an amenity you can use, and a roadway extension still in design is not something to pay for today.",
      ],
      changeItems: [
        {
          status: "Open",
          name: "Stream Park and TD Amp Ballantyne",
          body: "A six-acre park and an amphitheater, both opened in September 2023, plus a greenway connector linking the campus to the wider greenway network.",
        },
        {
          status: "Open",
          name: "Six new roads",
          body: "New streets and intersection upgrades through the former office park, which is what makes the district walkable internally rather than a set of parking lots.",
        },
        {
          status: "Opening in stages",
          name: "The Bowl at Ballantyne",
          body: "The restaurant, retail and entertainment district at the center of the redevelopment. Tenants have been opening in waves rather than on one date, and more are announced.",
        },
        {
          status: "Open",
          name: "Oro Ballantyne",
          body: "A 26-story residential tower with 356 residences on the campus, opened for move-ins in late 2025. It is the tallest apartment building in south Charlotte.",
        },
        {
          status: "Opening October 2026",
          name: "Wegmans on North Community House Road",
          body: "A roughly 110,000-square-foot grocery store on the campus. A full-size grocery within walking distance changes daily life for the newest housing here more than any restaurant does.",
        },
        {
          status: "Complete",
          name: "Bryant Farms Road Extension, Phase 1",
          body: "A short extension connecting Elm Lane to Rea Road, opened in June 2025, giving an east-west alternative to Ballantyne Commons Parkway.",
        },
        {
          status: "Planned, no date",
          name: "Bryant Farms Road Extension, Phase 2",
          body: "About 1.25 miles further, from Rea Road to Ardrey Kell Road. The city lists it in advanced planning and design and has published no completion date, so treat it as intent rather than schedule.",
        },
        {
          status: "Planned",
          name: "I-485 direct connector to Johnston Road",
          body: "NCDOT has planned a direct connection between the I-485 express lanes and Johnston Road. Planned means planned: it is not something to price into an offer today.",
        },
      ],

      costHeading: "What does a Ballantyne house cost to own?",
      costChecks: [
        "HOA dues, and what they cover",
        "Whether a club membership is separate, and what it costs",
        "Any special assessment, approved or under discussion",
        "Reserve funding for roofs, roads and amenities",
        "Mecklenburg County and City of Charlotte property taxes",
        "Insurance for the specific structure and roof age",
        "What the subdivision maintains versus what you do",
        "Age of the systems: HVAC, roof, water heater",
        "Architectural restrictions on future changes",
        "Rental restrictions, if that matters later",
      ],
      costClosing:
        "Jasmine can pull these together for a specific address so you are comparing two houses rather than two listing prices. Your lender, tax adviser and attorney are the right people to interpret the numbers once you have them.",
      costCta: {
        prompt: "Weighing two Ballantyne houses against each other?",
        label: "Have Jasmine compare them with you",
        href: "#start",
      },

      schools: {
        eyebrow: "Schools",
        heading: "Schools serving the Ballantyne area",
        body: [
          "Ballantyne is served by Charlotte-Mecklenburg Schools. Assignment is determined by the property address rather than by the neighborhood name, and the district can change assignment boundaries — so the assignment attached to a house today is not a permanent feature of it.",
          "Magnet and choice programs run separately from home-school assignment and have their own application windows. Several private schools also operate in south Charlotte.",
          "Because this page cannot be current for every address, and because assignment is the kind of thing that changes between one listing and the next, confirm it at the source for any specific property before you write an offer.",
        ],
        link: {
          href: "https://www.cmsk12.org",
          label: "Check assignment with Charlotte-Mecklenburg Schools",
        },
      },

      buyerHeading: "Buying in Ballantyne? Ask these before you get attached.",
      buyerQuestions: [
        "Which subdivision is this, exactly?",
        "What are the HOA dues, and what do they cover?",
        "Is there a club membership, and is it optional?",
        "Has the association approved or discussed an assessment?",
        "What are the architectural restrictions?",
        "What is the current CMS assignment for this address?",
        "What has sold on these streets in the last six months?",
        "What was updated, and when?",
        "How old are the roof, HVAC and water heater?",
        "What is being built nearby, and at what stage?",
        "How far is this from the parts of Ballantyne I would actually use?",
        "If several buyers want it, what besides price can I offer?",
      ],
      buyerClosing:
        "The last one is worth planning before you need it. In a market where a well-priced house draws more than one offer, the terms around the price are often what separates two buyers.",
      buyerCta: {
        prompt: "Found a Ballantyne listing you like?",
        label: "Send Jasmine the address",
        href: "#start",
      },

      sellerHeading: "Selling in Ballantyne? Your buyer has already seen the house down the street.",
      sellerChecks: [
        "Recent sales in your own subdivision",
        "Listings competing with yours right now",
        "The same floor plan, elsewhere in the neighborhood",
        "Updates against the neighborhood's baseline",
        "Lot position, yard and trees",
        "HOA dues compared with nearby subdivisions",
        "Newer construction and rentals pulling the same buyer",
        "The objection a buyer will raise, before they raise it",
        "How your timing lines up with the school calendar",
      ],
      sellerClosing:
        "Her one recorded Ballantyne closing is a buyer-side condo purchase won in a multiple-offer situation. The same thing that wins an offer is what a seller needs to read on the other side of the table.",
      sellerCta: {
        prompt: "Thinking about selling in Ballantyne?",
        label: "Ask what your home is competing against",
        href: "/home-value",
      },

      nearbyHeading: "Ballantyne or somewhere nearby?",
      nearby: [
        {
          name: "Ballantyne",
          chooseWhen:
            "You want master-planned subdivisions, I-485 access and an employment and shopping base in the same place you live.",
        },
        {
          name: "Pineville",
          slug: "pineville",
          chooseWhen:
            "You want to be just north of Ballantyne in a town with its own government, older housing stock and generally lower prices.",
        },
        {
          name: "Fort Mill",
          slug: "fort-mill",
          chooseWhen:
            "You are willing to cross into South Carolina for different tax treatment and newer construction, with a similar drive to the same jobs.",
        },
        {
          name: "Indian Land",
          slug: "indian-land",
          chooseWhen:
            "You want to stay on the Johnston Road corridor but continue south over the state line, where much of the housing is newer.",
        },
        {
          name: "SouthPark",
          slug: "southpark",
          chooseWhen:
            "You want to be closer to Uptown with older established neighborhoods and a denser mix of shopping and offices.",
        },
      ],

      faqHeading: "Ballantyne real estate: common questions",

      closingHeading: "Looking at a house in Ballantyne?",
      closingBody:
        "Send Jasmine the address. She can tell you which subdivision it is actually in, what the association covers, what has sold near it recently, and what is being built close enough to matter — before you decide how to approach it.",
      intakeHeading: "Tell me what you are looking at.",
      intakeBody:
        "Property type, rough timing, and which side of the table you are on. If you have an address or a listing link, put it in the message box.",
      intakeMarket: "south-charlotte",
    },
  },
  {
    /*
      Myers Park — the third page in the diligence format, published
      2026-09-21. The format fits this market for a reason that has nothing to
      do with condos: what decides value here is the property, and one specific
      attribute of it — whether the house sits in a LOCAL historic district —
      changes what an owner may do to the outside of it.

      WHAT IS DOCUMENTED ABOUT HER RECORD.
      One closing: 2024-tranquil-court-01 — December 2024, buyer side, a CONDO,
      recorded lever "Closed successfully on a non-conforming loan, with seller
      concessions at closing." Already public on /transactions. That row is
      genuinely on point here: financing is the quiet problem in an established
      neighborhood of older and unusual properties, and it is referenced once,
      in the cost section. No other claim about her is made on this page. §6.

      THE DISTINCTION THIS PAGE EXISTS TO GET RIGHT.
      Every competing Myers Park page treats "historic district" as one thing.
      It is two, and they do different work:

        - NATIONAL REGISTER. The Myers Park Historic District was listed on the
          National Register on 10 August 1987 (ref. 87000655), roughly 597
          acres, bounded approximately by Providence Road, East and West Queens
          Road, and Lillington Avenue. National Register listing is an honour
          and a planning record. By itself it does not put a private owner's
          exterior work under design review.
        - LOCAL HISTORIC DISTRICT. Charlotte's own districts are regulated by
          the Historic District Commission, and HERMITAGE COURT — inside Myers
          Park — is one of them. In a local district a Certificate of
          Appropriateness must be obtained before exterior work: alterations,
          restoration, new construction, moving, demolition, and sometimes
          landscaping and site work. Normal in-kind repair generally does not
          need one, and interior work is not covered at all
          (charlottenc.gov, Certificate of Appropriateness).

      So: most of Myers Park is NOT under design review, part of it is, and the
      page says exactly that. Conflating the two would either scare a buyer off
      a house that is unrestricted or, far worse, leave one believing they can
      replace the windows on a Hermitage Court house without asking.

      VERIFIED 2026-09-21: the 1911 start and John Nolen's authorship of the
      plan, with George Stephens as developer and Earle Sumner Draper and Louis
      Asbury among those who followed; the National Register listing date,
      reference number, acreage and approximate bounds; the Certificate of
      Appropriateness rules above; Little Sugar Creek Greenway running through
      Freedom Park. Sources in docs/AREAS-SPEC.md §17.

      DELIBERATELY ABSENT.
        - Every dollar figure and percentage. Myers Park is the market where a
          median is most misleading anyway: the boundary you draw changes it,
          which is the same argument the page makes about comps.
        - "Prestigious", "exclusive", "elite", "estate living". §7 bans some of
          it outright and BRAND-VOICE bans the rest. The architecture, the lot
          sizes and the 1911 plan carry the point without a single adjective
          doing a number's job.
        - School names and any rating. Same treatment as Ballantyne.
        - A count of Charlotte's local historic districts. Sources disagree
          between six and seven, and the number is not what a reader needs —
          whether THEIR address is in one is.
        - Any statement about who lives here.
        - A "View homes for sale" CTA pointed at the brokerage IDX. CLAUDE.md
          §12 keeps that link footer-only; the intent routes to her instead.
        - Images. Nothing licensed is in the repo. Wanted: the Queens Road West
          canopy, a representative streetscape, architectural detail on an
          older house. NOT a mansion stock photo — the page argues against
          exactly that impression of the market.
    */
    slug: "myers-park",
    name: "Myers Park",
    state: "NC",

    targetQuery: "what should i know before buying a house in myers park charlotte",

    answer:
      "Myers Park is an established residential neighborhood in central Charlotte, just south of Uptown, laid out beginning in 1911 to a plan by the landscape architect John Nolen. Its curving streets, deep setbacks and mature tree canopy are the plan, not an accident, and they are most of what people recognise about it.\n\nThe housing is genuinely varied: substantial early-twentieth-century houses, bungalows in some sections, mid-century houses, heavily renovated older houses, newly built houses on older lots, and some condos and townhomes toward the edges. Two houses of the same size on the same street can be very different properties.\n\nThe part that catches buyers out is designation. A large part of Myers Park sits in a National Register historic district, which by itself does not restrict what an owner does. A smaller part — Hermitage Court — is a City of Charlotte local historic district, where exterior work needs approval before it starts. Those are two different things, and which one applies depends on the address.",

    lede:
      "Myers Park is central Charlotte, laid out from 1911 to John Nolen's plan: curving streets, deep lots, and houses that range from original to rebuilt.",

    metaDescription:
      "Myers Park, Charlotte NC: the housing, the 1911 plan, what historic designation does and does not restrict, and what to check before buying or selling.",

    housingStock:
      "Myers Park was built out over decades rather than in one push, and the housing shows it. The early sections carry substantial houses from the 1910s through the 1930s — Colonial Revival and Tudor Revival among the most recognisable — on generous lots with deep setbacks. Other sections hold bungalows, and later streets carry mid-century houses.\n\nOn top of that sits sixty years of change. Houses have been renovated to the studs, extended at the back, raised, or taken down and replaced with new construction on the original lot. There are also condos and townhomes, mostly toward the edges of the neighborhood rather than in its interior.\n\nThe practical consequence: square footage tells you less here than almost anywhere else in Charlotte. An original house that has never been updated, the same house rebuilt inside, and a new house on the next lot are three different purchases at similar sizes.",

    priceContext:
      "Myers Park is among the higher-priced parts of Charlotte, and the range inside it is wide enough that an area-level figure is close to meaningless. A condo near the edge, an unrenovated house on a smaller lot, and a rebuilt house on a large one are not the same market, and all three carry a Myers Park address.\n\nWhat actually moves the number is the street, the lot, the era of the house, how much has been done to it and how well, and what else is available at that moment — which in a neighborhood this size can be very little. Older houses also carry ownership costs a newer house does not, so the comparison worth making is the whole picture:",

    commute:
      "Myers Park sits between Uptown and SouthPark, which is the reason much of its housing holds the value it does. Providence Road and Queens Road are the main routes through it, with Selwyn Avenue and Sharon Road serving the western and southern sides. Queens University of Charlotte sits inside the neighborhood on Selwyn Avenue.\n\nWalkability varies a great deal and should be checked at the address rather than assumed. Some streets are a short walk from a commercial node; others are residential for a long way in every direction, which is exactly what the 1911 plan intended.\n\nFor walking that is not errands, Freedom Park is the anchor, and the Little Sugar Creek Greenway runs through it. Briar Creek greenway segments run nearby as well.",

    whatTrades:
      "A Myers Park house is harder to price than almost anything else in Charlotte, and it is worth understanding why before you interview anyone about selling yours.\n\nThe usual method — find three similar recent sales nearby, adjust for size — assumes the houses around you are comparable. Here they often are not. The house two doors down may be eighty years old and untouched, or eighty years old and rebuilt, or eight years old on an eighty-year-old lot. Its lot may be half again the size of yours. It may sit on a quiet street or on a corridor carrying traffic all day.\n\nSo the comparable set has to be built rather than pulled, and the things that decide it are specific:",

    /* The three levels for this market: the street and lot, the house and what
       has been done to it, and the designation attached to the address. */
    levers: [
      {
        title: "The street and the lot",
        body: "Nolen's plan curves, which means lots here are not interchangeable rectangles and two addresses a block apart can differ in width, depth, grade and how far the house sits back from the road. Frontage on a through route is a different property from frontage on a residential curve, and mature trees are both an asset and a maintenance obligation attached to the specific lot. This is the layer that survives every renovation, and the one you cannot change later.",
      },
      {
        title: "The house, and what has already been done to it",
        body: "Original, renovated, extended, or rebuilt — those are four different purchases, and listing photos flatten them into one. What matters is which systems were actually replaced and when: wiring, plumbing, heating and cooling, roof, windows, drainage. A house that shows beautifully may have had one renovation of the parts you can see and none of the parts you cannot, and an older house that has been properly brought forward is worth more than a newer one that has not.",
      },
      {
        title: "The designation attached to the address",
        body: "Part of Myers Park sits in a National Register district, which is a recognition and does not by itself put your exterior work under review. A smaller part sits in a City of Charlotte local historic district, where it does. Those two facts get used interchangeably in conversation and they are not the same, so the question to ask about a specific address is which, if either, applies to it — particularly if you are buying the house intending to change it.",
      },
    ],

    faq: [
      {
        question: "Where is Myers Park in Charlotte?",
        answer:
          "Myers Park is in central Charlotte, immediately south of Uptown and north of SouthPark, in Mecklenburg County. Providence Road and Queens Road run through it, with Selwyn Avenue and Sharon Road on its western and southern sides. Freedom Park sits on its northern edge, and Queens University of Charlotte is inside the neighborhood on Selwyn Avenue.",
      },
      {
        question: "What is Myers Park known for?",
        answer:
          "Myers Park is known for its 1911 plan by the landscape architect John Nolen, and for what that plan produced: curving streets, deep setbacks, large lots in many sections, and a mature tree canopy. It is also known for architecturally distinctive housing, with Colonial Revival and Tudor Revival among the most recognisable styles in its earliest sections.",
      },
      {
        question: "What types of homes are in Myers Park?",
        answer:
          "Mostly detached houses, spanning a wide range. The earliest sections carry substantial houses from the 1910s through the 1930s. Other parts hold bungalows and mid-century houses. Many older houses have been renovated or extended, and some lots now carry newly built houses. There are also condos and townhomes, generally toward the edges of the neighborhood rather than in its interior.",
      },
      {
        question: "Is Myers Park a historic district?",
        answer:
          "Partly, and in two different senses. A large area of Myers Park was listed on the National Register of Historic Places in 1987. Separately, Hermitage Court, within Myers Park, is a City of Charlotte local historic district regulated by the Historic District Commission. The two designations are not the same and do not cover the same ground, so what applies depends on the specific address.",
      },
      {
        question: "Are all Myers Park homes subject to historic district rules?",
        answer:
          "No. Only property in a City of Charlotte local historic district is subject to the Historic District Commission's review of exterior work. Much of Myers Park is not in one. National Register listing, which covers a larger area, is a recognition and does not by itself restrict what a private owner does to their house. Confirm the designation for any specific address before planning exterior changes.",
      },
      {
        question: "What approvals does a local historic district require?",
        answer:
          "In a City of Charlotte local historic district, a Certificate of Appropriateness must be obtained before exterior work begins. That covers alterations, restoration, new construction, moving and demolition, and landscaping or site work may also require it. Normal repair and maintenance using the same materials generally does not, and interior work is not covered. Check with the Historic District Commission before you start.",
      },
      {
        question: "Is Myers Park walkable?",
        answer:
          "It varies by location, and should be checked at the address rather than assumed. Some streets are a short walk from a commercial node such as Selwyn Avenue or the Providence Road corridor. Much of the neighborhood is residential in every direction for some distance, which is what the original plan intended. Freedom Park and the Little Sugar Creek Greenway serve walking that is not errands.",
      },
      {
        question: "Is there new construction in Myers Park?",
        answer:
          "Yes, though not as subdivisions. New houses here are generally built one at a time on existing lots, sometimes replacing an older house. That makes new construction a scattered feature of the neighborhood rather than a section of it, and it means a newly built house may sit between houses several decades older, on a lot shaped by the original plan.",
      },
      {
        question: "What should I check before buying an older home in Myers Park?",
        answer:
          "Which systems have been replaced and when: wiring, plumbing, heating and cooling, roof, windows and drainage. Then the lot, the trees on it, and whether the house has been extended, and how well. Then the designation attached to the address, if you intend to change the exterior. Financing can also be less straightforward on older or unusual properties than buyers expect.",
      },
      {
        question: "What schools serve Myers Park?",
        answer:
          "Myers Park is served by Charlotte-Mecklenburg Schools. Assignment is determined by the property address rather than the neighborhood name, and the district can change assignment boundaries. Magnet and choice programs are separate from home-school assignment and have their own application process. Confirm the current assignment for a specific address with CMS before making an offer.",
      },
    ],

    guide: {
      city: "Charlotte",
      headline:
        "In Myers Park, two houses the same size are rarely the same purchase.",
      heroCloser:
        "Jasmine Garcia can tell you what a specific Myers Park address actually is — the lot, what has been done to the house, and whether its designation restricts what you could do next.",
      seoTitle: "Myers Park Charlotte NC Homes & Real Estate",
      heroCta: "Ask about a Myers Park address",

      answerHeading: "What is it like to live in Myers Park?",
      facts: [
        { label: "Where", value: "Central Charlotte, between Uptown and SouthPark" },
        { label: "Planned", value: "From 1911, to a plan by landscape architect John Nolen" },
        {
          label: "Housing",
          value: "Detached houses from the 1910s onward, plus renovations, infill, and some condos and townhomes",
        },
        {
          label: "Main roads",
          value: "Providence Road, Queens Road and Queens Road West, Selwyn Avenue, Sharon Road",
        },
        { label: "Designation", value: "A National Register district; Hermitage Court is a local historic district" },
        { label: "Nearby", value: "Freedom Park, the Little Sugar Creek Greenway, Queens University of Charlotte" },
      ],

      orientation: {
        eyebrow: "Where it is",
        heading: "Where is Myers Park, and what counts as Myers Park?",
        body: [
          "Myers Park sits in central Charlotte, immediately south of Uptown and north of SouthPark, with Dilworth to its west and Eastover to its northeast. Providence Road and Queens Road are the routes most people use to describe it.",
          "As with most Charlotte neighborhoods, the name is used more broadly than any single boundary. The National Register district covers roughly 597 acres, bounded approximately by Providence Road, East and West Queens Road, and Lillington Avenue — but properties outside that line are also marketed as Myers Park, and not wrongly, because the neighborhood and the historic district were never the same shape.",
          "This matters for two practical reasons. Any market statistic you are quoted about Myers Park depends on which boundary the person quoting it used. And the rules that might apply to your exterior work depend on the address, not on whether a listing calls it Myers Park.",
        ],
      },

      housingHeading: "What can you buy in Myers Park?",
      propertyTypes: [
        {
          name: "Older detached house",
          goodFor:
            "Buyers who want the architecture and the lot the original plan produced, and who are prepared for an older house's maintenance.",
          checks: [
            "Wiring, plumbing, heating and cooling, and their ages",
            "Roof, windows and drainage",
            "Whether additions were permitted and done well",
            "Lot size, grade and mature trees",
            "Designation attached to the address",
            "Insurance on an older structure",
          ],
        },
        {
          name: "Renovated or rebuilt house",
          goodFor:
            "Buyers who want the neighborhood without an older house's project list, and who can tell a deep renovation from a cosmetic one.",
          checks: [
            "Which systems were actually replaced, and when",
            "Permits for the work that was done",
            "Quality of the addition where there is one",
            "How the renovation sits with the street",
            "Whether the lot was reshaped",
            "What comparable rebuilds have sold for",
          ],
        },
        {
          name: "Condo or townhome",
          goodFor:
            "Buyers who want a central location with less maintenance, generally toward the edges of the neighborhood.",
          checks: [
            "Dues, reserves and any assessments",
            "What the association maintains",
            "Rental restrictions",
            "Parking",
            "Financing requirements for the project",
            "How often comparable units come up",
          ],
        },
      ],
      housingCta: {
        prompt: "Trying to compare an original house with a rebuilt one?",
        label: "Walk through the differences with Jasmine",
        href: "#start",
      },

      layersHeading: "Three things decide what a Myers Park house actually is.",
      layersIntro:
        "None of them is square footage, and a listing shows you the third one almost never. Work down these for any address you are serious about.",
      layersClosing:
        "Two houses of the same size, a block apart, can differ on all three at once. That is the whole reason a Myers Park comparison takes real work.",

      notes: [
        {
          eyebrow: "Historic designation",
          heading: "Historic homes and renovation considerations",
          body: [
            "Two different designations get called the same thing here, and the difference decides what you may do to the outside of your house.",
            "The Myers Park Historic District was listed on the National Register of Historic Places in 1987, covering roughly 597 acres. National Register listing is a recognition of significance and a planning record. On its own, it does not place a private owner's exterior work under design review.",
            "A City of Charlotte local historic district is different. Those are regulated by the Charlotte Historic District Commission, and Hermitage Court, inside Myers Park, is one of them. In a local district a Certificate of Appropriateness must be obtained before exterior work begins — alterations, restoration, new construction, moving and demolition, with landscaping and site work sometimes included. Normal repair and maintenance in the same materials generally does not require one, and interior work is not covered.",
            "So most of Myers Park is not under design review and part of it is. If you are buying a house here intending to add to it, change its windows, or take it down, find out which applies to that address before you write the offer rather than after. This page cannot answer it for a specific property, and neither can a listing.",
          ],
          link: {
            href: "https://www.charlottenc.gov/Growth-and-Development/Planning-and-Development/Historic-District/Certificate-of-Appropriateness",
            label: "Certificate of Appropriateness rules, City of Charlotte",
          },
        },
      ],

      transitEyebrow: "Location and getting around",
      transitHeading: "How central is Myers Park?",
      transitColumns: [
        {
          heading: "The roads that matter",
          items: [
            "Providence Road",
            "Queens Road and Queens Road West",
            "Selwyn Avenue",
            "Sharon Road",
            "East Boulevard, toward Dilworth",
          ],
        },
        {
          heading: "What the location gives you",
          items: [
            "Uptown to the north, SouthPark to the south",
            "Freedom Park and the Little Sugar Creek Greenway",
            "Queens University of Charlotte within the neighborhood",
            "Commercial nodes at Selwyn Avenue and along Providence Road",
            "Dilworth, Eastover and Park Road nearby",
          ],
        },
        {
          heading: "What to account for",
          items: [
            "Walkability that varies street by street",
            "Traffic on Providence Road and Queens Road",
            "Older street layouts and driveway access",
            "Mature trees, and what they ask of a lot",
            "Exterior approvals where a local district applies",
          ],
        },
      ],
      transitCallout:
        "A Myers Park address is not automatically a walkable one. Stand on the specific street before you decide which kind you are buying.",

      changeHeading: "What is changing in Myers Park?",
      changeBody: [
        "Not the plan. The streets, lots and canopy are largely what was laid out from 1911 onward, and that is the most durable thing about the neighborhood.",
        "What changes is the houses. Older houses are renovated, extended, and in some cases replaced, which means the character of an individual street shifts slowly as lots turn over. For a buyer, the question is what that does to the house you are considering — a rebuilt house next door affects your light, your privacy and eventually your comparable set. For an owner, the same turnover is what makes pricing here a moving target rather than a fixed one.",
        "Where a local historic district applies, that turnover is slower and more regulated by design, which is the point of the designation.",
      ],

      costHeading: "What does a Myers Park house cost to own?",
      costChecks: [
        "Age and remaining life of the major systems",
        "Roof, windows and drainage on an older structure",
        "Insurance for the age and construction of the house",
        "Mecklenburg County and City of Charlotte property taxes",
        "Tree work on a mature lot",
        "Exterior approvals where a local district applies",
        "HOA or condo dues, where there are any",
        "What a planned renovation will actually require",
        "Whether the property needs non-standard financing",
      ],
      costClosing:
        "That last one is not theoretical. Her most recent closing in Myers Park was a condo purchase that completed on a non-conforming loan with seller concessions at closing — the kind of financing an older or unusual property can require, and the kind that is far better to discover before an offer than during one.",
      costCta: {
        prompt: "Wondering what a specific house will actually cost to run?",
        label: "Go through it with Jasmine",
        href: "#start",
      },

      schools: {
        eyebrow: "Schools",
        heading: "Schools serving Myers Park",
        body: [
          "Myers Park is served by Charlotte-Mecklenburg Schools. Assignment follows the property address rather than the neighborhood name, and the district can change assignment boundaries, so the assignment attached to a house today is not a fixed feature of it.",
          "Magnet and choice programs run separately from home-school assignment and have their own application windows. Several private schools also operate in this part of Charlotte.",
          "Confirm the current assignment for any specific address at the source before you write an offer.",
        ],
        link: {
          href: "https://www.cmsk12.org",
          label: "Check assignment with Charlotte-Mecklenburg Schools",
        },
      },

      buyerHeading: "Buying in Myers Park? Ask these before you get attached.",
      buyerQuestions: [
        "How old is the house, and what has been replaced since?",
        "Were the additions permitted?",
        "Is this address in a local historic district?",
        "Is it inside the National Register district?",
        "What would my planned changes actually require?",
        "How big is the lot, and how does it sit?",
        "What condition are the trees in?",
        "How much traffic does this street carry?",
        "What has sold on these streets, and how comparable was it really?",
        "Will this property finance conventionally?",
        "What does the inspection say about the systems I cannot see?",
        "If several buyers want it, what besides price can I offer?",
      ],
      buyerClosing:
        "The designation questions are the ones people skip, and they are the only ones on this list that can quietly rule out the reason you wanted the house.",
      buyerCta: {
        prompt: "Found a Myers Park house worth a closer look?",
        label: "Send Jasmine the address",
        href: "#start",
      },

      sellerHeading: "Selling in Myers Park? A generic market analysis will not price your house.",
      sellerChecks: [
        "Recent sales on genuinely comparable streets",
        "Whether those houses were original, renovated or rebuilt",
        "Lot size, shape and position against yours",
        "The quality and age of your own renovation",
        "Additions, and how they read from the street",
        "New construction competing nearby",
        "Where your house sits in its price band",
        "The objection a buyer will raise, before they raise it",
        "Designation, if a buyer will want to change the exterior",
      ],
      sellerClosing:
        "Price per square foot is the wrong instrument here. It averages away the lot, the era, the renovation and the street, which between them are most of what your house is worth.",
      sellerCta: {
        prompt: "Thinking about selling in Myers Park?",
        label: "Ask what your home is competing against",
        href: "/home-value",
      },

      nearbyHeading: "Myers Park or somewhere nearby?",
      nearby: [
        {
          name: "Myers Park",
          chooseWhen:
            "You want the 1911 plan and the housing it produced, and you are prepared to compare properties one at a time.",
        },
        {
          name: "Dilworth",
          slug: "dilworth",
          chooseWhen:
            "You want an older central neighborhood on a tighter grid, generally closer to East Boulevard and Uptown.",
        },
        {
          name: "Eastover",
          chooseWhen:
            "You want a smaller established neighborhood of the same era immediately northeast of Myers Park.",
        },
        {
          name: "SouthPark",
          slug: "southpark",
          chooseWhen:
            "You want to be closer to the shopping and office core to the south, with more housing built after the 1960s.",
        },
        {
          name: "South End",
          slug: "south-end",
          chooseWhen:
            "You want condos and townhomes on the light rail rather than an older detached house.",
        },
      ],

      faqHeading: "Myers Park real estate: common questions",

      closingHeading: "Looking at a house in Myers Park?",
      closingBody:
        "Send Jasmine the address. She can tell you what the lot is, what has actually been done to the house, which designation applies to it, and what genuinely comparable properties have sold for — before you decide how to approach it.",
      intakeHeading: "Tell me what you are looking at.",
      intakeBody:
        "Property type, rough timing, and which side of the table you are on. If you have an address or a listing link, put it in the message box.",
      intakeMarket: "in-town-charlotte",
    },
  },
];
