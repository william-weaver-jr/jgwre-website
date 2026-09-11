import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";

import { AGENT } from "@/lib/site";

/** See tests/next-image-stub.tsx. Nothing here reads an image, but the pillar
    pages import components that do, and an unmocked next/image fails to render. */
vi.mock("next/image", async () => ({
  default: (await import("./next-image-stub")).NextImageStub,
}));

/**
 * C1.02 — the opening screen of the four pillar pages.
 *
 * These pages take transactional search and paid traffic, and a visitor who
 * lands on one has four questions before they have any interest in the
 * editorial thesis: is this the right page for what I typed, is it Charlotte,
 * who is this person, and how do I reach her. The pages answered the first
 * question with a metaphor and the fourth one 6,000px later.
 *
 * What this suite asserts is that contract, and only that contract. It reads
 * the HERO — the first <section> of the page, which is what a visitor sees
 * before scrolling — rather than the page, because every one of these strings
 * was already somewhere further down and none of it was doing this job there.
 *
 * It deliberately does not pin whole sentences. The copy is BIC-reviewed and
 * will be edited; the thing that must survive an edit is that the first screen
 * still names the market, names her, matches the query, and offers both
 * contact paths. A test that breaks on a comma teaches people to loosen it.
 *
 * Compliance, accessibility, metadata, links, the intake, and analytics stay in
 * their own suites. This one adds nothing to them.
 */

type Entry = {
  route: string;
  load: () => Promise<{ default: ComponentType<never> }>;
  /** The signal that says this hero matches the query that brought the visitor. */
  intent: RegExp;
  /** docs/CONTACT-STRATEGY.md §5 — one placement per hero, never shared. */
  placement: string;
  /** The label on the link into the page's own intake. */
  secondary: string;
};

const LANDING_PAGES: Entry[] = [
  {
    route: "/new-construction",
    load: () => import("@/app/new-construction/page"),
    intent: /new[\s-]construction/i,
    placement: "hero-new-construction",
    secondary: "Start your builder plan",
  },
  {
    route: "/sellers",
    load: () => import("@/app/sellers/page"),
    intent: /selling|home-selling/i,
    placement: "hero-sellers",
    secondary: "Start your selling plan",
  },
  {
    route: "/relocation",
    load: () => import("@/app/relocation/page"),
    intent: /moving|relocation/i,
    placement: "hero-relocation",
    secondary: "Plan your Charlotte move",
  },
  {
    route: "/carolinas-border",
    load: () => import("@/app/carolinas-border/page"),
    intent: /state line/i,
    placement: "hero-carolinas-border",
    secondary: "Compare NC and SC",
  },
];

async function renderPage(load: Entry["load"]): Promise<string> {
  const { default: Page } = await load();
  const element = await (Page as unknown as (props: unknown) => unknown)({
    searchParams: Promise.resolve({}),
    params: Promise.resolve({}),
  });
  return renderToStaticMarkup(element as React.ReactElement);
}

/**
 * The opening screen: everything up to the start of the second <section>.
 *
 * PageHero is one flat section with no section nested inside it, so the next
 * `<section` in the markup is the page's first content block. If that ever
 * stops being true this slice gets longer and the assertions get weaker, which
 * is why `has one h1, in the hero` below is asserted against the whole page.
 */
function hero(html: string): string {
  const next = html.indexOf("<section", 1);
  return next === -1 ? html : html.slice(0, next);
}

function text(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&reg;/g, "®")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ");
}

const heroes = new Map<string, string>();
async function heroOf(entry: Entry): Promise<string> {
  if (!heroes.has(entry.route)) heroes.set(entry.route, hero(await renderPage(entry.load)));
  return heroes.get(entry.route)!;
}

describe.each(LANDING_PAGES)("$route opening screen (C1.02)", (entry) => {
  it("names the market it serves", async () => {
    expect(text(await heroOf(entry))).toContain("Charlotte");
  });

  it("names the broker who will represent the visitor", async () => {
    expect(text(await heroOf(entry))).toContain(AGENT.name);
  });

  it("matches the intent that brought the visitor", async () => {
    expect(text(await heroOf(entry))).toMatch(entry.intent);
  });

  it("offers the phone as the primary action", async () => {
    const html = await heroOf(entry);
    // The href carries a `+`, which is a quantifier unescaped.
    const href = AGENT.phoneHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const link = html.match(new RegExp(`<a[^>]*href="${href}"[^>]*>`));
    expect(link, "no tel: link in the hero").not.toBeNull();
    expect(link![0]).toContain(`data-cta-placement="${entry.placement}"`);
    expect(text(html)).toContain(AGENT.phoneDisplay);
  });

  it("offers the page's own intake as the secondary action", async () => {
    const html = await heroOf(entry);
    const link = html.match(/<a[^>]*href="#start"[^>]*>/);
    expect(link, "no #start link in the hero").not.toBeNull();
    // Unlabeled, the delegated listener still fires `intake_start` — but into
    // the "unlabeled" bucket, which is a hole in the placement comparison
    // docs/CONTACT-STRATEGY.md §5.7 exists to run.
    expect(link![0]).toContain(`data-cta-placement="${entry.placement}"`);
    expect(text(html)).toContain(entry.secondary);
  });

  it("has one h1, and it is in the hero", async () => {
    const page = await renderPage(entry.load);
    expect(page.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(hero(page)).toContain("<h1");
  });
});

describe("hero CTA placements (docs/CONTACT-STRATEGY.md §5)", () => {
  it("gives each landing page its own placement value", () => {
    const placements = LANDING_PAGES.map((p) => p.placement);
    expect(new Set(placements).size).toBe(placements.length);
  });

  /**
   * A placement that is reused somewhere else answers §5.3 with a number that
   * looks confident and is wrong — two surfaces added together.
   */
  it.each(LANDING_PAGES)("$route uses $placement nowhere but its hero", async (entry) => {
    const page = await renderPage(entry.load);
    const occurrences = page.split(`data-cta-placement="${entry.placement}"`).length - 1;
    expect(occurrences).toBe(2); // the phone link and the intake link, both in the hero
  });
});

/**
 * The editorial thesis is not deleted, it is repositioned. It was the hero and
 * is now the section under it, where it argues for the answer the hero already
 * gave. If a future edit drops it, the page loses the thing that separates it
 * from every other agent's landing page — so it is asserted, loosely.
 */
describe("the other side of the table survives below the hero", () => {
  it.each(LANDING_PAGES)("$route still makes the argument", async (entry) => {
    const page = await renderPage(entry.load);
    const belowHero = page.slice(hero(page).length);
    expect(text(belowHero)).toMatch(/other side of this table/i);
  });
});
