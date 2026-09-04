import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import {
  CASE_CONDITION,
  CASE_NEW_CONSTRUCTION,
  CASE_RESALE,
} from "@/components/case-ledger";
import { SIDES } from "@/lib/intake";
import { RESULTS_DISCLAIMER } from "@/lib/site";

vi.mock("next/image", async () => ({
  default: (await import("../tests/next-image-stub")).NextImageStub,
}));

/**
 * The home page hero pathways.
 *
 * They exist because everything else on the first screen speaks to a buyer —
 * the headline is her own line about what buyers don't know to ask for, and the
 * secondary CTA is the buyer's guide — so a seller could read the first screen
 * and conclude the site is not for them. The audit of 2026-08-31 raised it.
 *
 * What these tests protect is the coupling, not the pixels. Each pathway carries
 * a label read out of SIDES and a destination whose intake opens on that same
 * side, and both halves are edited by different people at different times.
 */

async function homeMarkup(): Promise<string> {
  const { default: Home } = await import("./page");
  return renderToStaticMarkup(<Home />);
}

/** The pathway anchors, in document order. */
function pathways(html: string): { href: string; label: string }[] {
  return [
    ...html.matchAll(
      /<a[^>]*data-cta-placement="home-hero-pathway"[^>]*>(.*?)<\/a>/g,
    ),
  ].map((match) => {
    const href = /href="([^"]+)"/.exec(match[0])?.[1] ?? "";
    return { href, label: match[1].replace(/<[^>]+>/g, "").trim() };
  });
}

describe("home page hero pathways", () => {
  it("offers buying, selling, and relocating", async () => {
    expect(pathways(await homeMarkup()).map((p) => p.href)).toEqual([
      "/buyers",
      "/sellers",
      "/relocation",
    ]);
  });

  /*
    The seller signal is the whole point. If this disappears, the finding the
    audit raised is back and nothing else on the first screen will say so.
  */
  it("puts a seller entry point on the first screen", async () => {
    const seller = pathways(await homeMarkup()).find((p) => p.href === "/sellers");
    expect(seller?.label).toBe("Selling");
  });

  /*
    A visitor picks a word here and should meet the same word as the selected
    chip on arrival. Two names for one choice reads as two choices, and the
    drift would be invisible — two plausible labels on two pages nobody diffs.
  */
  it("labels every pathway with its own SIDES label, verbatim", async () => {
    const labels = SIDES.map((side) => side.label);
    for (const pathway of pathways(await homeMarkup())) {
      expect(labels, `"${pathway.label}" is not a SIDES label`).toContain(pathway.label);
    }
  });

  it("gives every pathway a label and an internal destination", async () => {
    const all = pathways(await homeMarkup());
    expect(all).toHaveLength(3);
    for (const pathway of all) {
      expect(pathway.label.length).toBeGreaterThan(0);
      expect(pathway.href.startsWith("/")).toBe(true);
    }
  });
});

/**
 * The three case studies, after the section was condensed on 2026-08-31.
 *
 * The compliance suite already asserts that a page showing a dollar figure
 * carries the results disclaimer. It cannot assert the opposite direction: a
 * future trim that deletes a case, or drops a ledger row, removes the figure
 * *and* the obligation together and leaves every existing test green while
 * quietly weakening the site's central proof.
 *
 * docs/CASE-STUDIES.md is explicit on both counts — three different shapes of
 * win, and "$22,210 stays $22,210" — so both are asserted here.
 */
/** Just the case-study section, from its opening tag to the next section end. */
function caseStudySection(html: string): string {
  const start = html.indexOf('aria-labelledby="outcomes"');
  expect(start, "the case-study section is gone from the home page").toBeGreaterThan(-1);
  return html.slice(start, html.indexOf("</section>", start));
}

describe("home page case studies", () => {
  it("renders every term and figure of all three cases", async () => {
    const html = await homeMarkup();

    for (const entries of [CASE_CONDITION, CASE_RESALE, CASE_NEW_CONSTRUCTION]) {
      for (const entry of entries) {
        expect(html, `missing ledger term: ${entry.term}`).toContain(entry.term);
        expect(html, `missing ledger value: ${entry.value}`).toContain(entry.value);
      }
    }
  });

  /*
    Hardcoded on purpose, against the constants rather than derived from them.
    The rule in docs/CASE-STUDIES.md is about these exact numbers, so a test
    that reads them from the same file it is guarding would pass through any
    edit to it.
  */
  it("keeps the documented figures exact and unrounded", async () => {
    const html = await homeMarkup();
    for (const figure of ["$20,000", "$22,210", "$34,000", "$50,000"]) {
      expect(html, `${figure} is no longer on the home page`).toContain(figure);
    }
  });

  it("keeps all three cases, so the argument stays three shapes and not one", async () => {
    // Scoped to the section: the four pillar cards are <article> too, and
    // counting them would make this pass no matter what happened here.
    expect(caseStudySection(await homeMarkup()).match(/<article/g) ?? []).toHaveLength(3);
  });

  it("keeps the results disclaimer with them", async () => {
    expect(await homeMarkup()).toContain(RESULTS_DISCLAIMER);
  });
});
