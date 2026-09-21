/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";

import { MARKETS, areaBySlug, publishedAreas, sortAreas, unwrittenMarkets } from "./index";
import {
  areaText,
  findDollarFiguresInFaq,
  findIncompleteFields,
  findProhibitedLanguage,
  showsDollarFigure,
} from "./validate";
import { FORT_MILL_DRAFT } from "./drafts/fort-mill";
import type { Area } from "./types";

/**
 * AREAS is empty today, so most checks below would pass vacuously. That is the
 * failure mode this suite has to avoid: a guard that is green because it never
 * ran is worse than no guard, because it reads as coverage.
 *
 * So every rule is also exercised against a fixture that deliberately breaks it.
 * The real data is checked by the same functions, which means these tests start
 * doing useful work the moment Jasmine's content lands, and are proven to bite
 * before then.
 */

const GOOD: Area = {
  slug: "fixture",
  name: "Fixture",
  state: "SC",
  lede: "A fixture market used to prove the validators bite. It is long enough to clear the substance threshold that real entries have to clear.",
  targetQuery: "what should i know before buying a house in fixture",
  answer:
    "A fixture answer, long enough to clear the substance threshold, standing on its own the way a real one has to because an answer engine will quote it with nothing beside it.",
  housingStock:
    "Brick ranches from the sixties on wide lots, with a band of two-story builder product from the last decade along the eastern edge of the township.",
  priceContext:
    "Prices sit below the metro median and move more slowly, because the inventory turns over less often than the newer subdivisions to the north do.",
  commute:
    "Twenty-five minutes to Uptown outside peak, closer to forty inside it. I-77 is the only real route, so an incident on the bridge changes the whole morning.",
  whatTrades:
    "Mostly original-owner resales that have not been updated since they were built, plus the occasional builder closeout at the end of a phase.",
  levers: [
    {
      title: "Deferred maintenance is the whole negotiation",
      body: "Houses that have not turned over in thirty years arrive with original systems, which means the inspection response is where the money is rather than the price.",
    },
    {
      title: "Phase-end builder inventory",
      body: "When a builder is closing out a phase they would rather move the last three houses than carry them, and that shows up as incentives instead of a lower price.",
    },
  ],
  faq: [
    {
      question: "When was the fixture market built?",
      answer:
        "A fixture FAQ answer, written long enough to clear the eighty character floor that every entry has to clear so that it can be quoted on its own.",
    },
    {
      question: "How is the fixture commute?",
      answer:
        "A second fixture FAQ answer, also long enough to clear the floor, because two entries are the minimum a published area is allowed to carry.",
    },
  ],
};

function withText(overrides: Partial<Area>): Area {
  return { ...GOOD, ...overrides };
}

describe("the market roster", () => {
  it("carries every market in CLAUDE.md §5", () => {
    expect(MARKETS).toHaveLength(17);
    expect(MARKETS.filter((m) => m.state === "SC").map((m) => m.name).sort()).toEqual([
      "Fort Mill",
      "Indian Land",
      "Lake Wylie",
      "Rock Hill",
      "Tega Cay",
    ]);
  });

  it("uses unique slugs", () => {
    expect(new Set(MARKETS.map((m) => m.slug)).size).toBe(MARKETS.length);
  });

  /**
   * CLAUDE.md §5 writes this market as "Clover / Lake Wylie". Lake Wylie is a
   * census-designated place in ZIP 29710, whose only post office is Clover, so
   * the addresses read "Clover, SC" while the town sits ten miles west.
   *
   * The failure this guards is someone tidying the roster by dropping one of
   * the two names — either renaming the market to Clover, which claims a town
   * she is not positioned in, or dropping postalCity, which leaves a buyer
   * unable to reconcile the name they searched with the one on the paperwork.
   */
  it("keeps both names on Lake Wylie, and the market on the lake", () => {
    const lakeWylie = MARKETS.find((m) => m.slug === "lake-wylie");
    expect(lakeWylie).toBeDefined();
    expect(lakeWylie?.name).toBe("Lake Wylie");
    expect(lakeWylie?.postalCity).toBe("Clover");
  });

  it("sets a postal city only where it differs from the market name", () => {
    for (const market of MARKETS) {
      if (market.postalCity === undefined) continue;
      expect(market.postalCity, `${market.slug} names itself as its postal city`).not.toBe(
        market.name,
      );
    }
  });
});

describe("publishing", () => {
  /**
   * CONTENT-PLAN.md: "If there isn't real content for a market, don't publish
   * the page." A market only reaches the router by appearing in data.ts.
   */
  it("publishes only markets that have authored content", () => {
    for (const area of publishedAreas()) {
      expect(
        MARKETS.some((m) => m.slug === area.slug),
        `${area.slug} is published but is not a §5 market`,
      ).toBe(true);
    }
    expect(publishedAreas().length + unwrittenMarkets().length).toBe(MARKETS.length);
  });

  it("resolves a published slug and nothing else", () => {
    expect(areaBySlug("definitely-not-a-market")).toBeUndefined();
    for (const area of publishedAreas()) {
      expect(areaBySlug(area.slug)).toBe(area);
    }
  });

  it("orders NC before SC, alphabetically within each", () => {
    const sorted = sortAreas([
      withText({ slug: "b", name: "Bravo", state: "SC" }),
      withText({ slug: "a", name: "Alpha", state: "NC" }),
      withText({ slug: "c", name: "Charlie", state: "NC" }),
    ]);
    expect(sorted.map((a) => a.name)).toEqual(["Alpha", "Charlie", "Bravo"]);
  });
});

describe("fair housing and banned language (§7)", () => {
  it("passes clean copy", () => {
    expect(findProhibitedLanguage(GOOD)).toEqual([]);
  });

  it.each([
    ["a safe neighborhood to raise kids in", "fair-housing"],
    ["the good schools are the draw here", "fair-housing"],
    ["an up-and-coming stretch of the corridor", "fair-housing"],
    ["a family-friendly pocket near the greenway", "fair-housing"],
    ["low crime compared to the county", "fair-housing"],
    ["a hidden gem of a neighborhood", "banned"],
    ["homes nestled among mature oaks", "banned"],
    ["this prestigious enclave", "banned"],
  ])("flags %j", (phrase, kind) => {
    const hits = findProhibitedLanguage(withText({ lede: `${GOOD.lede} ${phrase}` }));
    expect(hits.join(" ")).toContain(kind);
  });

  it("scans the levers, not just the prose", () => {
    const hits = findProhibitedLanguage(
      withText({
        levers: [
          { ...GOOD.levers[0], body: `${GOOD.levers[0].body} Buyers want good schools.` },
          GOOD.levers[1],
        ],
      }),
    );
    expect(hits.join(" ")).toContain("fair-housing");
  });

  it("holds every published area to the same rules", () => {
    for (const area of publishedAreas()) {
      expect(findProhibitedLanguage(area), `${area.slug} uses prohibited language`).toEqual([]);
    }
  });
});

describe("thin content (§11, CONTENT-PLAN.md)", () => {
  it("accepts a fully written area", () => {
    expect(findIncompleteFields(GOOD)).toEqual([]);
  });

  it("rejects an empty field", () => {
    expect(findIncompleteFields(withText({ commute: "" })).join(" ")).toContain("commute");
  });

  it("rejects a field too short to be real", () => {
    expect(findIncompleteFields(withText({ housingStock: "Nice houses." })).join(" ")).toContain(
      "too short",
    );
  });

  it("requires at least two local levers", () => {
    expect(findIncompleteFields(withText({ levers: [GOOD.levers[0]] })).join(" ")).toContain(
      "two local levers",
    );
  });

  it("holds every published area to the same rules", () => {
    for (const area of publishedAreas()) {
      expect(findIncompleteFields(area), `${area.slug} is thin`).toEqual([]);
    }
  });
});

describe("distinctness (§11)", () => {
  /**
   * The failure this catches is one area being written by copying another and
   * changing the place names — which is what every templated neighborhood page
   * on the internet already is, and the thing these pages exist to not be.
   */
  it("shares no field verbatim between two areas", () => {
    const fields: (keyof Area)[] = [
      "lede",
      "housingStock",
      "priceContext",
      "commute",
      "whatTrades",
    ];

    for (const field of fields) {
      const values = publishedAreas().map((a) => String(a[field]).trim());
      expect(new Set(values).size, `two areas share the same ${String(field)}`).toBe(
        values.length,
      );
    }
  });

  it("shares no lever verbatim between two areas", () => {
    const bodies = publishedAreas().flatMap((a) => a.levers.map((l) => l.body.trim()));
    expect(new Set(bodies).size, "two areas share a lever").toBe(bodies.length);
  });
});

describe("dollar figures", () => {
  it("notices when an area quotes one", () => {
    expect(showsDollarFigure(GOOD)).toBe(false);
    expect(showsDollarFigure(withText({ priceContext: `${GOOD.priceContext} Around $450,000.` }))).toBe(
      true,
    );
  });

  it("collects every authored field into the scanned text", () => {
    const text = areaText(GOOD);
    expect(text).toContain(GOOD.commute);
    expect(text).toContain(GOOD.levers[1].title);
  });
});

describe("the Fort Mill draft", () => {
  /**
   * The draft is a real Area, typed and validated, that deliberately does not
   * publish. Four of its six fields need Jasmine and carry TODO(verify) until
   * they get her — see the header of drafts/fort-mill.ts.
   *
   * These tests exist so the draft cannot leak. A TODO reaching a rendered page
   * already fails tests/compliance.test.tsx, but that fires late and explains
   * nothing; this fires here and says why.
   */
  const hasTodo = (area: Area) => areaText(area).includes("TODO(");

  it("is not published while it still carries a TODO", () => {
    if (!hasTodo(FORT_MILL_DRAFT)) return;
    expect(
      publishedAreas().some((a) => a.slug === FORT_MILL_DRAFT.slug),
      "the Fort Mill draft is published with TODO(verify) still in it",
    ).toBe(false);
  });

  it("keeps its slug and state matched to the §5 roster", () => {
    const market = MARKETS.find((m) => m.slug === FORT_MILL_DRAFT.slug);
    expect(market, "the draft's slug is not a §5 market").toBeDefined();
    expect(FORT_MILL_DRAFT.state).toBe(market?.state);
    expect(FORT_MILL_DRAFT.name).toBe(market?.name);
  });

  /* The authored half is already held to §7. Waiting on her facts is not a
     reason to let fair-housing language sit in a file for months. */
  it("is already clean of fair-housing and banned language", () => {
    expect(findProhibitedLanguage(FORT_MILL_DRAFT)).toEqual([]);
  });

  it("quotes no dollar figure, so no source is being invented", () => {
    expect(showsDollarFigure(FORT_MILL_DRAFT)).toBe(false);
  });

  /* The levers are the part that justifies the page, and they are finished.
     If this fails, the draft got thinner rather than closer to shipping. */
  it("carries finished levers now, not placeholders", () => {
    expect(FORT_MILL_DRAFT.levers.length).toBeGreaterThanOrEqual(3);
    for (const lever of FORT_MILL_DRAFT.levers) {
      expect(lever.body).not.toContain("TODO(");
      expect(lever.body.trim().length).toBeGreaterThan(80);
    }
  });

  /* The whole promise of the draft: answer the TODOs and it ships. If the rest
     of the entry is malformed, that promise is false. */
  it("is structurally complete apart from the TODOs", () => {
    expect(findIncompleteFields(FORT_MILL_DRAFT)).toEqual([]);
  });
});

describe("the AEO surface", () => {
  /**
   * An answer engine quotes one FAQ entry with nothing beside it, so the §7
   * results disclaimer cannot travel with it. Same rule lib/blog/validate.ts
   * applies to a post's FAQ, enforced here for the same reason.
   */
  it("allows no dollar figure in an FAQ answer", () => {
    expect(findDollarFiguresInFaq(GOOD)).toEqual([]);
    const withPrice = withText({
      faq: [{ question: "What do houses cost?", answer: `${GOOD.faq[0].answer} Around $450,000.` }, GOOD.faq[1]],
    });
    expect(findDollarFiguresInFaq(withPrice)).toEqual(["What do houses cost?"]);
  });

  it("scans the answer and the FAQ for prohibited language, not just the prose", () => {
    expect(
      findProhibitedLanguage(withText({ answer: `${GOOD.answer} The schools are good schools.` })).join(" "),
    ).toContain("fair-housing");
    expect(
      findProhibitedLanguage(
        withText({ faq: [{ ...GOOD.faq[0], answer: "Low crime, mostly." }, GOOD.faq[1]] }),
      ).join(" "),
    ).toContain("fair-housing");
  });

  /* targetQuery never renders, but a page aiming at "safe neighborhoods in X"
     is one whose copy is about to go the same way. */
  it("scans targetQuery even though it never renders", () => {
    expect(
      findProhibitedLanguage(withText({ targetQuery: "safest neighborhood in the area" })).join(" "),
    ).toContain("fair-housing");
  });

  it("requires an answer and at least two FAQ entries", () => {
    expect(findIncompleteFields(withText({ answer: "" })).join(" ")).toContain("answer");
    expect(findIncompleteFields(withText({ faq: [GOOD.faq[0]] })).join(" ")).toContain("two FAQ");
    expect(findIncompleteFields(withText({ targetQuery: "" })).join(" ")).toContain("targetQuery");
  });

  it("holds every published area to all of it", () => {
    for (const area of publishedAreas()) {
      expect(findDollarFiguresInFaq(area), `${area.slug} has a price in an FAQ`).toEqual([]);
      expect(area.answer.trim().length, `${area.slug} has no answer`).toBeGreaterThan(80);
      expect(area.faq.length, `${area.slug} has too few FAQ entries`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Steele Creek, the first published area", () => {
  const steeleCreek = () => publishedAreas().find((a) => a.slug === "steele-creek");

  it("is published", () => {
    expect(steeleCreek()).toBeDefined();
  });

  /**
   * The interview named school ratings and crime as the factors suppressing
   * demand here. Both are §7 fair-housing territory, and neither ships — not
   * quoted, and not paraphrased into something softer, which would be the same
   * argument wearing a coat.
   *
   * findProhibitedLanguage already covers the literal words. This asserts the
   * softened forms stay out too, because those are what a well-meaning edit
   * reaches for.
   */
  it("carries none of the interview's fair-housing material, in any form", () => {
    const text = areaText(steeleCreek()!).toLowerCase();
    for (const proxy of [
      "school",
      "crime",
      "safe",
      "reputation",
      "demographic",
      "suppress",
      "undesirable",
    ]) {
      expect(text, `steele-creek copy contains "${proxy}"`).not.toContain(proxy);
    }
  });

  /* Her figures were real and are deliberately absent — no area price is on the
     documented-facts allowlist, and a band dates within a year. */
  it("quotes none of the interview's price figures", () => {
    expect(showsDollarFigure(steeleCreek()!)).toBe(false);
  });

  /**
   * The supplied housing data carried precise shares — 53.5% detached, 12.5%
   * attached — and Bill's own caveat was not to quote them: "Steele Creek" has
   * no agreed boundary, so a share is precise about the wrong thing. Ratios and
   * "about 2006" survive that ambiguity. A decimal percentage does not.
   *
   * The failure this guards is a later edit deciding the page would look more
   * authoritative with a number in it.
   */
  it("quotes no precise percentage, because the boundary is not agreed", () => {
    expect(areaText(steeleCreek()!)).not.toMatch(/\d+(\.\d+)?\s?%/);
  });

  it("says out loud that the boundary is unsettled", () => {
    expect(areaText(steeleCreek()!).toLowerCase()).toContain("no universally agreed boundary");
  });

  it("keeps the residency claim inside the BRAND-VOICE §4 limits", () => {
    const text = areaText(steeleCreek()!);
    expect(text).toMatch(/has lived in Ayrsley, inside Steele Creek, since 2021/);
    /* Named community plus unit count plus tenure narrows to a household. The
       presidency and the 105-unit figure stay on /about. */
    expect(text).not.toContain("105");
    expect(text.toLowerCase()).not.toContain("hoa");
    expect(text.toLowerCase()).not.toContain("board president");
  });
});

describe("South End, the first diligence-format area", () => {
  const southEnd = () => publishedAreas().find((a) => a.slug === "south-end");
  const text = () => areaText(southEnd()!);

  it("is published in the diligence format", () => {
    expect(southEnd()).toBeDefined();
    expect(southEnd()?.guide).toBeDefined();
  });

  /**
   * The brief for this page listed "perfect for young professionals" and "great
   * for singles" among the things to avoid, which is the right instinct and the
   * exact failure this market invites: a dense, rail-served district is described
   * by who lives in it far more often than by what is built in it. The regexes
   * in validate.ts catch the common phrasings; these are the ones specific to
   * urban-core copy, plus the Steele Creek proxies.
   */
  it("describes buildings and trains, never who lives there", () => {
    /* "Single-family" is a housing type, the one legitimate use of the word. */
    const lower = text().toLowerCase().replaceAll("single-family", "detached");
    for (const proxy of [
      "young professional",
      "singles",
      "famil",
      "empty nester",
      "retiree",
      "school",
      "crime",
      "safe",
      "demographic",
      "vibrant",
      "live, work",
      "something for everyone",
    ]) {
      expect(lower, `south-end copy contains "${proxy}"`).not.toContain(proxy);
    }
  });

  /**
   * South End has no row in the ledger and she does not live there
   * (docs/AREAS-SPEC.md §12). Since 2026-09-14 that does not stop a page from
   * publishing, but §6 still stops the page claiming either. The
   * failure this guards is a later edit reaching for credibility it has not
   * earned — "she has sold in South End", "her clients here" — which is a §6
   * claim with nothing behind it.
   */
  it("claims no closing or residency she does not have on record", () => {
    const lower = text().toLowerCase();
    for (const claim of [
      "has lived",
      "lives in",
      "she lives",
      "has sold",
      "she sold",
      "closed in",
      "her clients",
      "transactions in",
    ]) {
      expect(lower, `south-end copy contains "${claim}"`).not.toContain(claim);
    }
  });

  it("quotes no price, dues figure, or percentage", () => {
    expect(showsDollarFigure(southEnd()!)).toBe(false);
    expect(text()).not.toMatch(/\d+(\.\d+)?\s?%/);
  });

  /* An investment question on a broker's page is where a return gets implied. */
  it("promises no appreciation or return", () => {
    expect(text()).not.toMatch(/\b(?:will|guaranteed to) (?:appreciate|rise|increase in value)\b/i);
    expect(text()).toContain("No location promises appreciation or a return.");
  });

  /* The CATS dates are a schedule, not a fact, and the copy has to say so. */
  it("states the new station's schedule as a target", () => {
    const guide = southEnd()!.guide!;
    expect(guide.changeBody.join(" ")).toMatch(/2028/);
    expect(guide.changeBody.join(" ").toLowerCase()).toContain("targets");
  });

  it("lists the four current stations", () => {
    const stations = southEnd()!.guide!.transitColumns.find((c) =>
      c.heading.includes("stations"),
    );
    expect(stations?.items).toEqual([
      "Carson",
      "Bland Street",
      "East/West Boulevard",
      "New Bern",
    ]);
  });

  /**
   * The brief asked for 40–100 words per answer: long enough to stand alone when
   * an answer engine lifts it, short enough to be lifted whole.
   */
  it("keeps every FAQ answer quotable on its own", () => {
    for (const entry of southEnd()!.faq) {
      const words = entry.answer.trim().split(/\s+/).length;
      expect(words, `"${entry.question}" is ${words} words`).toBeGreaterThanOrEqual(40);
      expect(words, `"${entry.question}" is ${words} words`).toBeLessThanOrEqual(100);
    }
  });

  /**
   * CLAUDE.md §12, 2026-09-04: the brokerage IDX is footer-only, because a
   * registration there becomes a broker-sourced lead. "See South End homes" is
   * the CTA most likely to be added back pointing at it.
   */
  it("routes every CTA to the intake or a page on this site", () => {
    const guide = southEnd()!.guide!;
    for (const cta of [guide.housingCta, guide.costCta, guide.buyerCta, guide.sellerCta]) {
      expect(cta.href, cta.label).toMatch(/^(#start|\/[a-z-]+)$/);
    }
  });

  it("prefills a market group the intake actually offers", async () => {
    const { BRANCHES } = await import("@/lib/intake");
    const offered = BRANCHES.buying
      .find((q) => q.id === "markets")
      ?.options?.map((o) => o.value);
    expect(offered).toContain(southEnd()!.guide!.intakeMarket);
  });
});

describe("Ballantyne", () => {
  const ballantyne = () => publishedAreas().find((a) => a.slug === "ballantyne");
  const text = () => areaText(ballantyne()!);

  it("is published in the diligence format", () => {
    expect(ballantyne()).toBeDefined();
    expect(ballantyne()?.guide).toBeDefined();
  });

  /**
   * Ballantyne is the market where the sources themselves are the hazard. Half
   * the pages written about it lead with "top-rated schools" and "one of
   * Charlotte's safest", which is the §7 line and a familial-status argument in
   * one sentence. None of it is repeatable, in any softened form.
   */
  it("rates no school and describes nobody who lives there", () => {
    /* "Single-family" and "multifamily" are housing types, the only legitimate
       uses of the word on a real estate page. */
    const lower = text()
      .toLowerCase()
      .replaceAll("single-family", "detached")
      .replaceAll("multifamily", "apartments");
    for (const proxy of [
      "top-rated",
      "top rated",
      "highly rated",
      "best school",
      "good school",
      "school district ranking",
      "safe",
      "crime",
      "famil",
      "young professional",
      "affluent",
      "upscale",
      "desirable",
      "demographic",
      "vibrant",
      "something for everyone",
    ]) {
      expect(lower, `ballantyne copy contains "${proxy}"`).not.toContain(proxy);
    }
  });

  /**
   * Schools are on the page, which means the page owes three things: the
   * district by name, assignment stated as a fact of the address, and the
   * admission that it changes. Anything less is a page that sounds
   * authoritative about the one attribute buyers most want to be told.
   */
  it("sends the school question to the district, with the caveat attached", () => {
    const schools = ballantyne()!.guide!.schools;
    expect(schools).toBeDefined();
    const body = schools!.body.join(" ").toLowerCase();
    expect(body).toContain("charlotte-mecklenburg schools");
    expect(body).toContain("address");
    expect(body).toMatch(/change|changes/);
    expect(schools!.link.href).toBe("https://www.cmsk12.org");
  });

  /**
   * The development section is the other place this page could mislead without
   * saying anything false: an approved project listed beside a finished one
   * reads as a promise. Every entry carries its own status, and at least one
   * says out loud that it has no date.
   */
  it("labels every development item with where it actually stands", () => {
    const items = ballantyne()!.guide!.changeItems;
    expect(items?.length).toBeGreaterThanOrEqual(4);
    for (const item of items!) {
      expect(item.status.trim().length, `${item.name} has no status`).toBeGreaterThan(0);
    }
    expect(items!.some((i) => /planned/i.test(i.status))).toBe(true);
    expect(text().toLowerCase()).toContain("no completion date");
  });

  /* The $1.2 billion sale of the office park is true, documented, and still not
     shippable: any dollar figure pulls the §7 results disclaimer onto the page,
     and no area price is on the CONTENT-MARKETING §2 allowlist. */
  it("quotes no dollar figure or percentage, including the office-park sale", () => {
    expect(showsDollarFigure(ballantyne()!)).toBe(false);
    expect(text()).not.toMatch(/\d+(\.\d+)?\s?%/);
    expect(text().toLowerCase()).not.toContain("billion");
  });

  /**
   * The only §5-documented claim about her record here is 2022-belle-vista-01,
   * a buyer-side condo purchase carrying the recorded lever "Won in a
   * multiple-offer situation". The page may lean on that row and does. It may
   * not grow a second claim without a second row.
   */
  it("claims nothing about her record beyond the one documented closing", () => {
    const lower = text().toLowerCase();
    expect(lower).toContain("multiple-offer");
    for (const claim of ["has lived", "lives in", "she lives", "years in ballantyne", "her clients"]) {
      expect(lower, `ballantyne copy contains "${claim}"`).not.toContain(claim);
    }
  });

  it("keeps every FAQ answer quotable on its own", () => {
    for (const entry of ballantyne()!.faq) {
      const words = entry.answer.trim().split(/\s+/).length;
      expect(words, `"${entry.question}" is ${words} words`).toBeGreaterThanOrEqual(40);
      expect(words, `"${entry.question}" is ${words} words`).toBeLessThanOrEqual(100);
    }
  });

  /* CLAUDE.md §12, 2026-09-04: the brokerage IDX is footer-only, because a
     registration there becomes a broker-sourced lead. A "view homes for sale"
     button is exactly what gets added back pointing at it. */
  it("routes every CTA to the intake or a page on this site", () => {
    const guide = ballantyne()!.guide!;
    for (const cta of [guide.housingCta, guide.costCta, guide.buyerCta, guide.sellerCta]) {
      expect(cta.href, cta.label).toMatch(/^(#start|\/[a-z-]+)$/);
    }
  });

  it("links only neighbours that are real markets", () => {
    for (const place of ballantyne()!.guide!.nearby) {
      if (!place.slug) continue;
      expect(
        MARKETS.some((m) => m.slug === place.slug),
        `${place.slug} is not a §5 market`,
      ).toBe(true);
    }
  });
});
