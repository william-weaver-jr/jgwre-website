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
