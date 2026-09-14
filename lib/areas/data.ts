/**
 * Area page content — the real dataset.
 *
 * Two entries as of 2026-09-14. The discipline below is why there are not fourteen.
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

      transitHeading: "How walkable is South End Charlotte?",
      stations: ["Carson", "Bland Street", "East/West Boulevard", "New Bern"],
      transitAdvantages: [
        "An easier trip into Uptown",
        "Less driving for daily errands",
        "Restaurants, shops, and the trail on foot",
        "Appeal to the next buyer shopping for exactly this",
      ],
      transitTradeoffs: [
        "Train movement and crossing signals",
        "Foot traffic, late into the evening",
        "Street noise and nightlife",
        "Competition for parking, guest parking included",
        "Construction and development around you",
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
];
