import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SIDES } from "@/lib/intake";

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
