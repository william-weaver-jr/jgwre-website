/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";

import { MARKETS, areaBySlug, publishedAreas, sortAreas, unwrittenMarkets } from "./index";
import { areaText, findIncompleteFields, findProhibitedLanguage, showsDollarFigure } from "./validate";
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
};

function withText(overrides: Partial<Area>): Area {
  return { ...GOOD, ...overrides };
}

describe("the market roster", () => {
  it("carries every market in CLAUDE.md §5", () => {
    expect(MARKETS).toHaveLength(15);
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
