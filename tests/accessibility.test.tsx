import axe from "axe-core";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * CLAUDE.md §10: real estate sites are a common target for ADA demand letters,
 * and the launch bar is Lighthouse ≥ 95. Lighthouse runs once, by hand, at the
 * end. This runs on every commit.
 *
 * axe catches the structural WCAG 2.1 AA failures that survive code review —
 * unlabelled controls, broken landmark structure, images with no alt text, list
 * markup nested wrong. It cannot judge contrast here (jsdom computes no colours,
 * and the palette is still pending review in §12), so contrast stays a manual
 * check against `docs/brand-decisions.md`.
 */

vi.mock("next/image", async () => ({
  default: (await import("./next-image-stub")).NextImageStub,
}));

const PAGES: [route: string, load: () => Promise<{ default: ComponentType<never> }>][] = [
  ["/", () => import("@/app/page")],
  ["/about", () => import("@/app/about/page")],
  ["/new-construction", () => import("@/app/new-construction/page")],
  ["/sellers", () => import("@/app/sellers/page")],
  ["/relocation", () => import("@/app/relocation/page")],
  ["/carolinas-border", () => import("@/app/carolinas-border/page")],
  ["/negotiation", () => import("@/app/negotiation/page")],
  ["/reviews", () => import("@/app/reviews/page")],
  ["/contact", () => import("@/app/contact/page")],
  ["/privacy-policy", () => import("@/app/privacy-policy/page")],
];

/**
 * Rules axe cannot evaluate meaningfully in jsdom, disabled deliberately rather
 * than left to fail noisily. Colour contrast needs real layout and a settled
 * palette; both are checked by Lighthouse before launch.
 */
const NOT_MEANINGFUL_IN_JSDOM = {
  "color-contrast": { enabled: false },
  "target-size": { enabled: false },
};

async function auditPage(load: () => Promise<{ default: ComponentType<never> }>) {
  const { default: Page } = await load();
  const element = await (Page as unknown as (props: unknown) => unknown)({
    searchParams: Promise.resolve({}),
    params: Promise.resolve({}),
  });

  // The real landmark structure the root layout provides. A page audited outside
  // it would report every heading as orphaned and miss nothing real.
  document.body.innerHTML = `
    <a href="#main">Skip to content</a>
    ${renderToStaticMarkup(<SiteHeader />)}
    <main id="main">${renderToStaticMarkup(element as React.ReactElement)}</main>
    ${renderToStaticMarkup(<SiteFooter />)}
  `;

  return axe.run(document.body, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    rules: NOT_MEANINGFUL_IN_JSDOM,
  });
}

function report(violations: axe.Result[]): string {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.html).join("\n  ")}`)
    .join("\n\n");
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("WCAG 2.1 AA (§10)", () => {
  it.each(PAGES)("%s has no axe violations", async (_route, load) => {
    const results = await auditPage(load);
    expect(report(results.violations)).toBe("");
  });
});

describe("keyboard and landmark structure (§10)", () => {
  it("opens every page with a skip link that targets the main landmark", async () => {
    await auditPage(PAGES[0][1]);

    const skip = document.querySelector('a[href="#main"]');
    expect(skip).not.toBeNull();
    expect(document.querySelector("main#main")).not.toBeNull();
  });

  it.each(PAGES)("%s exposes one main landmark and one contentinfo", async (_route, load) => {
    await auditPage(load);
    expect(document.querySelectorAll("main")).toHaveLength(1);
    expect(document.querySelectorAll("footer")).toHaveLength(1);
  });

  it.each(PAGES)("%s gives every link a discernible name", async (_route, load) => {
    await auditPage(load);

    for (const link of document.querySelectorAll("a")) {
      const name = (link.textContent ?? "").trim() || link.getAttribute("aria-label") || "";
      expect(name.length, `empty link: ${link.outerHTML}`).toBeGreaterThan(0);
    }
  });

  it.each(PAGES)("%s marks external links as opening elsewhere", async (_route, load) => {
    await auditPage(load);

    for (const link of document.querySelectorAll('a[target="_blank"]')) {
      expect(link.getAttribute("rel") ?? "").toContain("noopener");
      expect(
        (link.textContent ?? "").toLowerCase(),
        `${link.outerHTML} does not say it opens an external site`,
      ).toMatch(/external|new (tab|window)/);
    }
  });
});
