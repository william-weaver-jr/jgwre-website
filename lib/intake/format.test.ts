/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";

import { formatIntake } from "./format";
import { BRANCHES, SIDE_TO_LEAD_TYPE, SIDES, labelFor } from "./questions";
import { selectLevers } from "./levers";
import type { Side } from "./types";

const ALL_SIDES = SIDES.map((s) => s.value);

describe("formatIntake", () => {
  it("returns nothing when the visitor never picked a side", () => {
    expect(formatIntake(undefined, { markets: ["south-charlotte"] })).toEqual([]);
  });

  it("still names the side when no step-2 question was answered", () => {
    expect(formatIntake("buying", undefined)).toEqual(["Side of the table: Buying"]);
    expect(formatIntake("buying", {})).toEqual(["Side of the table: Buying"]);
  });

  it("renders option labels, not option ids — a human reads these", () => {
    const lines = formatIntake("buying", { propertyType: "new-construction" });
    expect(lines).toContain("New construction or resale? New construction");
    expect(lines.join("\n")).not.toContain("new-construction");
  });

  it("joins a multi-select with commas", () => {
    const lines = formatIntake("buying", { markets: ["south-charlotte", "carolinas-border"] });
    expect(lines).toContain("Where are you looking? South Charlotte, The NC/SC border");
  });

  it("passes free-text answers through verbatim", () => {
    const lines = formatIntake("relocating", { movingFrom: "Columbus, Ohio" });
    expect(lines).toContain("Where are you moving from? Columbus, Ohio");
  });

  it("skips unanswered, empty, and empty-array questions", () => {
    const lines = formatIntake("buying", {
      propertyType: "resale",
      markets: [],
      timeline: "",
    });
    expect(lines).toHaveLength(2);
    expect(lines.join("\n")).not.toContain("Where are you looking?");
    expect(lines.join("\n")).not.toContain("When would you want");
  });

  it("emits answers in the order the questions were asked", () => {
    const lines = formatIntake("buying", {
      lender: "pre-approved",
      propertyType: "resale",
      markets: ["south-charlotte"],
    }).slice(1);

    expect(lines[0]).toMatch(/New construction or resale\?/);
    expect(lines[1]).toMatch(/Where are you looking\?/);
    expect(lines[2]).toMatch(/Where are you on financing\?/);
  });

  it("ignores answers to questions that are not in this branch", () => {
    const lines = formatIntake("selling", { lender: "cash" });
    expect(lines).toEqual(["Side of the table: Selling"]);
  });

  it("falls back to the raw value for an option id it does not recognise", () => {
    const lines = formatIntake("buying", { propertyType: "mystery" });
    expect(lines).toContain("New construction or resale? mystery");
  });

  it.each(ALL_SIDES)("produces a readable first line for %s", (side) => {
    const [first] = formatIntake(side, {});
    expect(first).toMatch(/^Side of the table: \S/);
    expect(first).not.toContain(side === "both" ? "___" : "___");
  });
});

describe("the question set", () => {
  it("defines a branch for every side, and no empty branches", () => {
    for (const side of ALL_SIDES) {
      expect(BRANCHES[side].length).toBeGreaterThan(0);
    }
  });

  it("keeps each branch short enough to stay a two-tap step", () => {
    for (const side of ALL_SIDES) {
      expect(BRANCHES[side].length).toBeLessThanOrEqual(4);
    }
  });

  it("has no duplicate question ids inside a branch, which would collide in the answers map", () => {
    for (const side of ALL_SIDES) {
      const ids = BRANCHES[side].map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("gives every question either options or a free-text flag", () => {
    for (const side of ALL_SIDES) {
      for (const question of BRANCHES[side]) {
        expect(Boolean(question.options?.length) || question.text === true).toBe(true);
      }
    }
  });

  it("maps every side onto a lead type the schema accepts", () => {
    const allowed = ["buyer", "seller", "valuation", "guide", "relocation", "general"];
    for (const side of ALL_SIDES) {
      expect(allowed).toContain(SIDE_TO_LEAD_TYPE[side]);
    }
  });
});

describe("labelFor", () => {
  it("returns the option label", () => {
    const question = BRANCHES.buying.find((q) => q.id === "propertyType")!;
    expect(labelFor(question, "resale")).toBe("Resale");
  });

  it("returns the value unchanged when there is no matching option", () => {
    const question = BRANCHES.relocating.find((q) => q.id === "movingFrom")!;
    expect(labelFor(question, "Columbus, Ohio")).toBe("Columbus, Ohio");
  });
});

describe("selectLevers", () => {
  it("returns at most three, so the confirmation still reads as considered", () => {
    for (const side of ALL_SIDES) {
      expect(selectLevers(side, {}).length).toBeLessThanOrEqual(3);
    }
  });

  it("returns something for every side even with no answers at all", () => {
    for (const side of ALL_SIDES) {
      expect(selectLevers(side, {}).length).toBeGreaterThan(0);
    }
  });

  it("prefers answer-specific levers over generic ones", () => {
    const specific = selectLevers("buying", { propertyType: "new-construction" });
    expect(specific.some((lever) => lever.group === "new-construction")).toBe(true);
  });

  it("matches a gate inside a multi-select answer", () => {
    const levers = selectLevers("buying", { markets: ["south-charlotte", "carolinas-border"] });
    expect(levers.some((lever) => lever.group === "border")).toBe(true);
  });

  it("does not let one group fill all three slots", () => {
    const levers = selectLevers("buying", {
      propertyType: "new-construction",
      markets: ["carolinas-border"],
      lender: "pre-approved",
    });
    const counts = new Map<string, number>();
    for (const lever of levers) counts.set(lever.group, (counts.get(lever.group) ?? 0) + 1);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(2);
  });

  it("never repeats a lever", () => {
    const levers = selectLevers("both", { propertyType: "new-construction", lender: "cash" });
    expect(new Set(levers.map((l) => l.id)).size).toBe(levers.length);
  });

  it("respects an explicit limit", () => {
    expect(selectLevers("buying", {}, 1)).toHaveLength(1);
  });

  /**
   * CLAUDE.md §7: no guarantees or implied guarantees of outcome. These strings
   * are rendered as copy on the confirmation screen, so they are copy.
   */
  it.each(ALL_SIDES)("phrases every lever for %s as a question, never a promise", (side: Side) => {
    for (const lever of selectLevers(side, {}, 99)) {
      expect(lever.text).not.toMatch(/\bI(’|')ll get you\b|\bI always\b|guarantee|\bwill save you\b/i);
    }
  });
});
