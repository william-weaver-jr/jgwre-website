import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import { publishedAreas } from "@/lib/areas";
import { publishedPosts } from "@/lib/blog";
import { canonicalUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/**
 * Canonical and og:url, on every route, checked against each other.
 *
 * This suite exists because both halves of that pair were wrong in production
 * and neither was visible from the site:
 *
 * - Next merges `openGraph` by replacement, so pages that set an og title threw
 *   away the layout's `url`, `type`, `siteName`, and `locale`. `/` and
 *   `/negotiation` shipped with no og:url at all.
 * - Pages that set no `openGraph` inherited one hardcoded `url`, so every one
 *   of them named the home page as its canonical. A share of /about was
 *   attributed to /.
 *
 * Neither shows up in a rendered page test, an axe audit, or a Lighthouse run.
 * It only shows up when someone pastes a link into Slack, or months later in
 * Search Console. So it is asserted here, in the metadata itself.
 */

/* Loose on purpose. A page module also exports `default` and, on dynamic
   routes, `generateStaticParams`, so a structural type narrow enough to be
   useful here is one no real page satisfies. The shape is narrowed in
   metadataFor() instead, which is the only place it is read. */
type Loader = () => Promise<unknown>;

type PageModule = {
  metadata?: Metadata;
  generateMetadata?: (props: {
    params: Promise<Record<string, string>>;
  }) => Metadata | Promise<Metadata>;
};

const STATIC: [route: string, load: Loader][] = [
  ["/", () => import("@/app/page")],
  ["/about", () => import("@/app/about/page")],
  ["/new-construction", () => import("@/app/new-construction/page")],
  ["/sellers", () => import("@/app/sellers/page")],
  ["/relocation", () => import("@/app/relocation/page")],
  ["/carolinas-border", () => import("@/app/carolinas-border/page")],
  ["/negotiation", () => import("@/app/negotiation/page")],
  ["/buyers", () => import("@/app/buyers/page")],
  ["/home-value", () => import("@/app/home-value/page")],
  ["/reviews", () => import("@/app/reviews/page")],
  ["/contact", () => import("@/app/contact/page")],
  ["/blog", () => import("@/app/blog/page")],
  ["/areas", () => import("@/app/areas/page")],
  ["/transactions", () => import("@/app/transactions/page")],
];

const DYNAMIC: [route: string, load: Loader, params: Record<string, string>][] = [
  ...publishedPosts().map((post): [string, Loader, Record<string, string>] => [
    `/blog/${post.slug}`,
    () => import("@/app/blog/[slug]/page"),
    { slug: post.slug },
  ]),
  ...publishedAreas().map((area): [string, Loader, Record<string, string>] => [
    `/areas/${area.slug}`,
    () => import("@/app/areas/[slug]/page"),
    { slug: area.slug },
  ]),
];

async function metadataFor(load: Loader, params: Record<string, string> = {}): Promise<Metadata> {
  const mod = (await load()) as PageModule;
  if (typeof mod.generateMetadata === "function") {
    return mod.generateMetadata({ params: Promise.resolve(params) });
  }
  return mod.metadata ?? {};
}

const ALL: [string, Loader, Record<string, string>][] = [
  ...STATIC.map(([route, load]): [string, Loader, Record<string, string>] => [route, load, {}]),
  ...DYNAMIC,
];

describe("canonical URLs", () => {
  it.each(ALL)("%s declares itself canonical", async (route, load, params) => {
    const meta = await metadataFor(load, params);
    expect(meta.alternates?.canonical).toBe(route);
  });
});

describe("og:url", () => {
  it.each(ALL)("%s has one", async (_route, load, params) => {
    const meta = await metadataFor(load, params);
    expect(meta.openGraph, "no openGraph block at all").toBeDefined();
    expect(meta.openGraph && "url" in meta.openGraph ? meta.openGraph.url : undefined).toBeTruthy();
  });

  /** The bug that shipped: every inheriting page claimed the home page. */
  it.each(ALL)("%s agrees with its own canonical", async (route, load, params) => {
    const meta = await metadataFor(load, params);
    const og = meta.openGraph as { url?: string } | undefined;
    expect(og?.url).toBe(canonicalUrl(route));
  });

  /**
   * The apex is canonical and www 308s to it. An og:url or canonical built with
   * a "www." would point at a redirect, which is the whole reason the host was
   * settled in the first place.
   */
  it.each(ALL)("%s points at the serving host, not a redirect", async (_route, load, params) => {
    const meta = await metadataFor(load, params);
    const og = meta.openGraph as { url?: string } | undefined;
    expect(String(og?.url)).toMatch(/^https:\/\/jasminegarcia\.com/);
    expect(String(og?.url)).not.toContain("www.");
  });

  it.each(ALL)("%s keeps the site name and locale a page override used to drop", async (
    _route,
    load,
    params,
  ) => {
    const meta = await metadataFor(load, params);
    const og = meta.openGraph as { siteName?: string; locale?: string } | undefined;
    expect(og?.siteName).toBe("Jasmine Garcia");
    expect(og?.locale).toBe("en_US");
  });
});

describe("the share card", () => {
  /**
   * The card reached only the home page the first time it shipped: it was an
   * app/opengraph-image file, and that convention merges into each segment's
   * own metadata, so every page declaring an `openGraph` block dropped it. The
   * same replacement semantics, a third time. It is named explicitly now.
   */
  it.each(ALL)("%s carries the image", async (_route, load, params) => {
    const meta = await metadataFor(load, params);
    const og = meta.openGraph as { images?: readonly { url?: string }[] } | undefined;
    expect(og?.images?.[0]?.url).toBe("/og-image.jpg");
  });

  it.each(ALL)("%s asks for the large Twitter card", async (_route, load, params) => {
    const meta = await metadataFor(load, params);
    const twitter = meta.twitter as { card?: string } | undefined;
    expect(twitter?.card).toBe("summary_large_image");
  });

  it("ships the file the metadata promises, at the size it declares", async () => {
    const { statSync } = await import("node:fs");
    expect(statSync("public/og-image.jpg").size).toBeGreaterThan(10_000);
  });
});

describe("canonicalUrl()", () => {
  it("gives the home page the bare origin, with no trailing slash", () => {
    expect(canonicalUrl("/")).toBe(SITE_URL);
    expect(canonicalUrl("/")).not.toMatch(/\/$/);
  });

  it("joins an interior path without doubling the slash", () => {
    expect(canonicalUrl("/about")).toBe(`${SITE_URL}/about`);
  });
});
