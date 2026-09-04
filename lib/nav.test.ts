import { describe, expect, it } from "vitest";

import { publishedAreas } from "@/lib/areas";
import { publishedPosts } from "@/lib/blog";
import { isNavGroup, primaryNav, type NavLink } from "@/lib/nav";
import { isTransactionsPageIndexable } from "@/lib/transactions";

/**
 * The nav is the site's own map of itself, and the failure it has already
 * shipped once is a section that exists and is linked from nowhere. These check
 * the two directions that can go wrong: a link to something not ready, and
 * something ready with no link.
 */

function flatten(): NavLink[] {
  return primaryNav().flatMap((item) => (isNavGroup(item) ? [...item.children] : [item]));
}

function hrefs(): string[] {
  return flatten().map((link) => link.href);
}

describe("primary navigation", () => {
  it("exposes the sections the audit found buried in the footer", () => {
    expect(hrefs()).toEqual(expect.arrayContaining(["/buyers", "/sellers", "/reviews"]));
  });

  it("keeps /negotiation top-level, because the home page hero points at it", () => {
    const top = primaryNav().filter((item) => !isNavGroup(item)) as NavLink[];
    expect(top.map((link) => link.href)).toContain("/negotiation");
  });

  it("does not put Contact in the nav — it is the phone button", () => {
    expect(hrefs()).not.toContain("/contact");
  });

  /*
    The most expensive link on the site, and the reason it is a test rather than
    a comment. Jasmine confirmed on 2026-09-04 that a visitor who registers on
    the brokerage IDX still becomes Matt's lead and still affects her commission
    split — so a "Search Homes" item in the primary navigation converts her own
    organic traffic against her.

    It stays in the footer, which is all Locked Decision #2 requires. Anyone
    re-adding it here, or pointing it at the agent subdomain, should have to
    delete this test and read why first.
  */
  it("keeps Search Homes out of the primary nav", () => {
    const external = flatten().filter((link) => link.external);
    expect(external, `external links in the nav: ${JSON.stringify(external)}`).toEqual([]);
    expect(hrefs().some((href) => href.includes("mattstoneteam"))).toBe(false);
  });

  it("gives every link a label", () => {
    for (const link of flatten()) {
      expect(link.label.trim().length, JSON.stringify(link)).toBeGreaterThan(0);
    }
  });

  it("links no route twice", () => {
    const all = hrefs();
    expect(new Set(all).size, `duplicated: ${all.join(", ")}`).toBe(all.length);
  });

  it("marks only off-site destinations external", () => {
    for (const link of flatten()) {
      expect(Boolean(link.external), link.href).toBe(!link.href.startsWith("/"));
    }
  });
});

describe("the gates", () => {
  /*
    Each of these mirrors a gate the footer already applies. They are asserted
    as equivalences rather than as fixed expectations so they keep holding as the
    datasets grow — the point is that the nav and the dataset agree, not that
    either has a particular value today.
  */

  it("links /areas exactly when a guide is published", () => {
    expect(hrefs().includes("/areas")).toBe(publishedAreas().length > 0);
  });

  it("links /transactions exactly when the ledger is indexable", () => {
    expect(hrefs().includes("/transactions")).toBe(isTransactionsPageIndexable());
  });

  /*
    The regression this exists for: /blog shipped with two published posts and
    zero links to it from the header, the footer, or the home page, discoverable
    only through sitemap.xml. docs/CONTENT-MARKETING.md plans several more.
  */
  it("links /blog exactly when a post is published", () => {
    expect(hrefs().includes("/blog")).toBe(publishedPosts().length > 0);
  });

  it("never leaves Proof empty", () => {
    const proof = primaryNav().find((item) => isNavGroup(item) && item.label === "Proof");
    expect(proof && isNavGroup(proof) && proof.children.length).toBeGreaterThan(0);
  });
});
