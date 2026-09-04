import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";

import { SiteFooter } from "@/components/site-footer";
import { publishedAreas } from "@/lib/areas";
import { publishedPosts } from "@/lib/blog";
import { AGENT, BROKERAGE, RESULTS_DISCLAIMER, SOCIAL, TCPA_CONSENT } from "@/lib/site";
import { staticPageRoutes } from "./page-routes";

/** See tests/next-image-stub.tsx. `alt` survives, which is what §10 asserts here. */
vi.mock("next/image", async () => ({
  default: (await import("./next-image-stub")).NextImageStub,
}));

/**
 * CLAUDE.md §7 says advertising violations are build-breaking. Until now nothing
 * actually broke — this suite is what makes that sentence true.
 *
 * Every page is rendered to static markup and checked against the rules a
 * Broker-in-Charge would check by hand. Pages are server components, so they are
 * rendered directly rather than through the layout; the layout's own
 * contribution (footer, brokerage identification) is asserted separately, and
 * the layout is what puts it on every route.
 */

type PageEntry = [
  route: string,
  load: () => Promise<{ default: ComponentType<never> }>,
  /** Route params, for dynamic segments. Static routes take none. */
  params?: Record<string, string>,
];

/**
 * Every blog post, expanded into a page entry.
 *
 * Generated rather than listed. The blog is the one page type that grows on a
 * schedule — a batch of posts every few weeks, some of them dated forward — and
 * a hand-maintained list is a list someone forgets to add to. Forgetting here
 * would not fail; it would silently skip §7 on the newest copy on the site,
 * which is the worst available outcome. lib/blog/index.test.ts covers the
 * scheduled ones that this cannot see.
 */
const POST_PAGES: PageEntry[] = publishedPosts().map((post) => [
  `/blog/${post.slug}`,
  () => import("@/app/blog/[slug]/page"),
  { slug: post.slug },
]);

/**
 * Every published area, expanded, for the same reason as the posts above.
 *
 * Areas grow one market at a time out of `lib/areas/data.ts` — fourteen are
 * rostered and they land whenever Jasmine has something real to say about the
 * next one. That is a cadence, so the list is generated.
 *
 * These carry more §7 risk than any other page type, not less: neighbourhood
 * copy is where fair-housing language actually shows up. `lib/areas/validate.ts`
 * scans the dataset and is the first line, but it reads the authored strings
 * only. It cannot see the rendered page, so brokerage identification, the
 * disclaimer beside a dollar figure, and the marks are checked here.
 */
const AREA_PAGES: PageEntry[] = publishedAreas().map((area) => [
  `/areas/${area.slug}`,
  () => import("@/app/areas/[slug]/page"),
  { slug: area.slug },
]);

/* Every route with a page, so a new page cannot be added without appearing here. */
const PAGES: PageEntry[] = [
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
  ["/privacy-policy", () => import("@/app/privacy-policy/page")],
  ...POST_PAGES,
  ...AREA_PAGES,
];

/** Async pages take props; they are rendered through their own resolved element. */
async function renderPage(
  load: () => Promise<{ default: ComponentType<never> }>,
  params: Record<string, string> = {},
) {
  const { default: Page } = await load();
  const element = await (Page as unknown as (props: unknown) => unknown)({
    searchParams: Promise.resolve({}),
    params: Promise.resolve(params),
  });
  return renderToStaticMarkup(element as React.ReactElement);
}

/** Visible text. JSON-LD is markup for crawlers, not copy, and is asserted separately. */
function text(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&reg;/g, "®")
    .replace(/\s+/g, " ");
}

/**
 * The page's own copy, with two things removed.
 *
 * Testimonials are verbatim and §7 forbids altering them, so a client's word
 * choice is not the site making a claim — that is exactly why the "Queen of
 * Negotiations" review is cleared to run whole while §2 still bans the phrase in
 * her voice. And the results disclaimer contains the word "guarantee" by design.
 * Neither should trip a rule aimed at our own copy.
 */
function ourCopy(html: string): string {
  return text(html.replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ")).replaceAll(
    RESULTS_DISCLAIMER,
    " ",
  );
}

/**
 * A page's metadata, however it produces it.
 *
 * Static routes export a `metadata` object; dynamic ones export
 * `generateMetadata`. §11 asks for a unique title and description per page, and
 * that obligation does not change with which of the two a route happens to use.
 */
async function resolveMetadata(
  load: () => Promise<{ default: ComponentType<never> }>,
  params: Record<string, string> = {},
): Promise<{ title?: unknown; description?: unknown } | undefined> {
  const mod = (await load()) as unknown as {
    metadata?: { title?: unknown; description?: unknown };
    generateMetadata?: (props: unknown) => Promise<{ title?: unknown; description?: unknown }>;
  };
  if (mod.generateMetadata) {
    return mod.generateMetadata({ params: Promise.resolve(params) });
  }
  return mod.metadata;
}

const rendered = new Map<string, string>();
async function page(route: string): Promise<string> {
  if (!rendered.has(route)) {
    const entry = PAGES.find(([r]) => r === route)!;
    rendered.set(route, await renderPage(entry[1], entry[2]));
  }
  return rendered.get(route)!;
}

describe("brokerage identification (§7)", () => {
  /**
   * NC requires brokerage identification in a broker's advertising and SC has an
   * equivalent rule. The footer is in the root layout, so asserting it once is
   * asserting it for every route.
   */
  it("names Stone Realty Group in the footer that ships on every page", () => {
    expect(text(renderToStaticMarkup(<SiteFooter />))).toContain(BROKERAGE.name);
  });

  it("carries the brokerage address", () => {
    const body = text(renderToStaticMarkup(<SiteFooter />));
    expect(body).toContain(BROKERAGE.street);
    expect(body).toContain(`${BROKERAGE.city}, ${BROKERAGE.state} ${BROKERAGE.zip}`);
  });

  it("carries both license numbers", () => {
    const body = text(renderToStaticMarkup(<SiteFooter />));
    for (const license of BROKERAGE.licenses) {
      expect(body).toContain(license.number);
    }
  });

  it("carries the Equal Housing Opportunity mark", () => {
    expect(text(renderToStaticMarkup(<SiteFooter />))).toContain("Equal Housing Opportunity");
  });

  it("carries the REALTOR® mark with the registered symbol", () => {
    expect(text(renderToStaticMarkup(<SiteFooter />))).toContain("REALTOR®");
  });

  /**
   * The footer once shipped hand-drawn SVG approximations of both marks. An
   * invented block "R" reads as authoritative while being an unauthorized use
   * of a registered mark — worse than showing no logo. The marks are text until
   * the licensed files from NAR are in public/marks/.
   *
   * This asserts the shape of the fix, not the destination: inline <svg> in the
   * footer means someone has drawn a mark again. Real artwork arrives as a file
   * through lib/marks.ts and renders via next/image, which trips neither branch.
   * See public/marks/README.md.
   */
  it("draws no trademark artwork of its own", () => {
    expect(renderToStaticMarkup(<SiteFooter />)).not.toContain("<svg");
  });

  it("links the privacy policy", () => {
    expect(renderToStaticMarkup(<SiteFooter />)).toContain('href="/privacy-policy"');
  });

  it("states that services are provided through the brokerage", () => {
    expect(text(renderToStaticMarkup(<SiteFooter />))).toMatch(
      /licensed real estate broker affiliated with Stone Realty Group/i,
    );
  });
});

/**
 * §7 makes every page brokerage advertising, and this suite is what reviews it.
 * An embedded Instagram or Facebook feed would render whatever Meta returned that morning —
 * copy on approved advertising that no reviewer and no test ever sees. Her own
 * captions are the reason that matters: the register BRAND-VOICE.md bans, the
 * unbounded superlative §5 keeps off the site, dollar figures with no disclaimer
 * beside them, and the nickname §12 resolved as hers on Instagram and never here.
 *
 * So each feed is a link out. This asserts the shape of that decision — the
 * profile is reachable, and nothing on the page pulls from Meta at runtime.
 * lib/site.ts SOCIAL carries the reasoning; a curated strip of images committed
 * to the repo would be reviewable and trips neither branch.
 */
describe("social profiles are linked, never embedded (§7)", () => {
  it("links her profiles from the footer that ships on every page", () => {
    const html = renderToStaticMarkup(<SiteFooter />);
    expect(html).toContain(`href="${SOCIAL.instagram.url}"`);
    expect(text(html)).toContain(SOCIAL.instagram.handle);
    expect(html).toContain(`href="${SOCIAL.facebook.url}"`);
  });

  it.each(PAGES.map(([route]) => route))("%s embeds no feed", async (route) => {
    const html = await page(route);
    expect(html).not.toMatch(/instagram\.com\/(embed|p\/|reel\/)/);
    expect(html).not.toMatch(/facebook\.com\/(plugins|tr\?)/);
    expect(html).not.toMatch(
      /<(iframe|script)[^>]+(instagram|cdninstagram|facebook|fbcdn|connect\.facebook|elfsight|snapwidget)/i,
    );
  });
});

describe("the phone number (Locked Decision #6)", () => {
  it.each(PAGES.map(([route]) => route))(
    "%s uses the Follow Up Boss tracking number and no other",
    async (route) => {
      const html = await page(route);
      const numbers = [...text(html).matchAll(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}/g)].map(
        (m) => m[0],
      );
      for (const number of numbers) {
        expect(number.replace(/\D/g, "")).toBe("7042009360");
      }
    },
  );

  it("dials the same number it displays", () => {
    expect(AGENT.phoneHref).toBe(`tel:+1${AGENT.phoneDisplay.replace(/\D/g, "")}`);
  });
});

describe("TCPA consent (§7)", () => {
  /** Carried over verbatim from the team site. Not reworded, not shortened. */
  it("matches the approved wording character for character", () => {
    expect(TCPA_CONSENT).toBe(
      "I agree to be contacted by Stone Realty Group via call, email, and text for real estate services. To opt out, you can reply 'stop' at any time or reply 'help' for assistance. You can also click the unsubscribe link in the emails. Message and data rates may apply. Message frequency may vary.",
    );
  });

  it("names the brokerage, the three channels, and both opt-out routes", () => {
    expect(TCPA_CONSENT).toContain("Stone Realty Group");
    expect(TCPA_CONSENT).toMatch(/call, email, and text/);
    expect(TCPA_CONSENT).toMatch(/reply 'stop'/);
    expect(TCPA_CONSENT).toMatch(/unsubscribe link/);
  });
});

describe("results disclaimer (§7)", () => {
  it("is worded as approved and never as a prediction", () => {
    expect(RESULTS_DISCLAIMER).toContain("Results vary");
    expect(RESULTS_DISCLAIMER).toMatch(/not a prediction or guarantee/);
  });

  /**
   * Any page showing a specific dollar outcome must carry the disclaimer
   * adjacent. Required by the BIC — this is the check that would otherwise be
   * done by eye on every copy edit.
   */
  it.each(PAGES.map(([route]) => route))(
    "%s carries the disclaimer if it shows any dollar figure",
    async (route) => {
      const body = text(await page(route));
      const showsDollars = /\$\s?[\d,]+/.test(body);
      if (showsDollars) {
        expect(body, `${route} shows a dollar figure without the results disclaimer`).toContain(
          RESULTS_DISCLAIMER,
        );
      }
    },
  );
});

describe("prohibited claims (§7)", () => {
  const GUARANTEES = [
    /\bI(?:’|')ll get you\b/i,
    /\bI always\b/i,
    /\bguarantee[ds]?\b/i,
    /\bevery client saves\b/i,
    /\bwill save you\b/i,
  ];

  it.each(PAGES.map(([route]) => route))("%s implies no guaranteed outcome", async (route) => {
    const body = ourCopy(await page(route));
    for (const pattern of GUARANTEES) {
      expect(body, `${route} matched ${pattern}`).not.toMatch(pattern);
    }
  });

  /**
   * Fair housing. Describe housing stock, amenities, commute, and price —
   * never who lives somewhere.
   */
  const FAIR_HOUSING = [
    /\bsafe neighborhood\b/i,
    /\bgood schools for families\b/i,
    /\bup-and-coming\b/i,
    /\bfamily-friendly\b/i,
    /\bexclusive (?:neighborhood|community)\b/i,
    /\bdesirable demographic\b/i,
  ];

  it.each(PAGES.map(([route]) => route))("%s uses no fair-housing-adjacent framing", async (route) => {
    const body = ourCopy(await page(route));
    for (const pattern of FAIR_HOUSING) {
      expect(body, `${route} matched ${pattern}`).not.toMatch(pattern);
    }
  });

  it.each(PAGES.map(([route]) => route))(
    "%s never presents jasminegarcia.com as a brokerage",
    async (route) => {
      const body = ourCopy(await page(route));
      expect(body).not.toMatch(/\b(?:my|her) (?:brokerage|firm|real estate company)\b/i);
      expect(body).not.toMatch(/\bindependent(?:ly)? (?:broker|firm|brokerage)\b/i);
    },
  );

  /**
   * §2: rejected in her voice and in ours, in any form, on this site. It stays
   * on her Instagram; it never appears in our copy. (§12 — resolved 2026-08-07.)
   *
   * One client review says it, cleared 2026-08-10 and documented in
   * lib/reviews/data.ts. A client's verbatim words are not the site making the
   * claim, so blockquotes are excluded — and that review must run whole, which
   * is asserted separately below.
   */
  it.each(PAGES.map(([route]) => route))("%s contains no negotiation-queen framing", async (route) => {
    expect(ourCopy(await page(route))).not.toMatch(/negotiation queen|queen of negotiation/i);
  });

  it("never pulls the Queen of Negotiations review as an excerpt", async () => {
    const body = text(await page("/reviews"));
    if (body.includes("Queen of Negotiations")) {
      // The last sentence of that review. If the quote were cropped it would be
      // the first thing dropped, and the disclosed friendship would go with it.
      expect(body).toContain("worth the wait");
    }
  });
});

describe("banned language (BRAND-VOICE.md §2)", () => {
  const BANNED = [
    "nestled",
    "boasts",
    "dream home",
    "passionate about helping",
    "your trusted Charlotte REALTOR",
    "unparalleled",
    "luxury lifestyle",
    "let me help you find",
    "whether you're buying or selling",
    "hidden gem",
    "I traded one classroom for another",
    "real estate found me",
  ];

  it.each(PAGES.map(([route]) => route))("%s avoids the banned list", async (route) => {
    const body = ourCopy(await page(route)).toLowerCase();
    for (const phrase of BANNED) {
      expect(body, `${route} contains "${phrase}"`).not.toContain(phrase.toLowerCase());
    }
  });
});

describe("completeness claims (§7)", () => {
  /**
   * An absolute about what a list contains is the same class of problem as an
   * absolute about what a negotiation will produce, and easier to write by
   * accident.
   *
   * /negotiation carried three of these until 2026-09-04 — "the list of
   * everything else" in its meta description, "everything else" in the OG
   * description, and "everything that can be asked for" above the form. A
   * purchase contract has more terms than any list of nineteen, so each was
   * both inaccurate and an absolute in advertising. The h1 was already bounded.
   *
   * Two things are deliberately NOT caught here, and both are on the site:
   *
   * - "Everything below is also on the table" (/negotiation) says the listed
   *   items are negotiable. It makes no claim that the list is exhaustive.
   * - "Almost every term in a purchase contract is negotiable" (a published
   *   post) is the correctly hedged form. An earlier draft of this test matched
   *   the bare phrase "every term" and failed on it, which is the wrong lesson:
   *   the hedge is what makes it accurate, and a test that punishes hedging
   *   teaches the opposite of what §7 wants.
   *
   * So the patterns below are specific constructions, not keywords.
   */
  const ABSOLUTES = [
    "everything that can be",
    "everything else on the table",
    "list of everything",
    "complete list",
    "exhaustive list",
    "is everything you can",
    "all the terms you can",
  ];

  it.each(PAGES.map(([route]) => route))(
    "%s claims no list is complete",
    async (route) => {
      const body = ourCopy(await page(route)).toLowerCase();
      for (const phrase of ABSOLUTES) {
        expect(body, `${route} contains the completeness claim "${phrase}"`).not.toContain(
          phrase,
        );
      }
    },
  );
});

describe("undocumented claims (§6)", () => {
  /**
   * §6 says to leave `TODO(verify)` in place rather than invent a number. It is
   * a marker for the author, not copy — none of it may reach a visitor. An open
   * question belongs in a source comment, where `/privacy-policy` now keeps its
   * remaining one.
   */
  it.each(PAGES.map(([route]) => route))(
    "%s ships no TODO placeholder to the visitor",
    async (route) => {
      expect(text(await page(route))).not.toContain("TODO(");
    },
  );

  /**
   * §5 documents the recognition and its scope. Two of the three are internal
   * brokerage awards; an unattributed one reads as an industry award.
   */
  it("names Stone Realty Group as the issuer wherever an award appears", async () => {
    const body = ourCopy(await page("/reviews"));
    if (body.includes("Excellence in Client Satisfaction")) {
      expect(body).toContain("Stone Realty Group");
    }
  });

  /** A nomination is not a win. Say "Nominated" and nothing warmer. §5. */
  it("never warms the 2026 nomination into an award", async () => {
    const body = ourCopy(await page("/reviews"));
    if (body.includes("Charlotte’s Best")) {
      expect(body).toMatch(/Nominated/);
      expect(body).not.toMatch(/\bwinner\b|\bwon\b|\bawarded\b|\bwinning\b/i);
    }
  });

  it("keeps recognition off the home page", async () => {
    const body = text(await page("/"));
    expect(body).not.toContain("Excellence in Client Satisfaction");
    expect(body).not.toContain("Charlotte’s Best");
  });
});

/**
 * The privacy policy is a compliance surface, and the thing most likely to make
 * it wrong is code: a measurement script added to the layout discloses itself
 * nowhere. This pins the disclosure to what components/*-analytics.tsx actually
 * mount, so adding a fourth vendor and forgetting the page breaks the build
 * rather than shipping a policy that undercounts what runs.
 */
describe("the privacy policy names every analytics vendor we load (§7)", () => {
  it.each([
    ["Google Analytics", "components/google-analytics.tsx"],
    ["Vercel Web Analytics", "components/vercel-analytics.tsx"],
    ["Vercel Speed Insights", "components/vercel-analytics.tsx"],
  ])("discloses %s", async (vendor) => {
    expect(text(await page("/privacy-policy"))).toContain(vendor);
  });

  /**
   * The 2026-08-24 decision (lib/analytics-consent.ts) trades the consent banner
   * for a disclosure and a reachable opt-out. The banner is the visible half; if
   * the opt-out ever stops shipping, what is left is the half that took
   * something away from the visitor and gave nothing back.
   */
  it("offers the opt-out the no-banner decision rests on", async () => {
    const html = await page("/privacy-policy");
    expect(html).toContain('id="privacy-choices"');
    expect(html).toMatch(/Turn analytics off/);
  });

  it("states that Google's advertising features are off", async () => {
    const body = text(await page("/privacy-policy"));
    expect(body).toMatch(/Google Signals/);
    expect(body).toMatch(/ad personalization/i);
  });
});

describe("SEO metadata (§11)", () => {
  /**
   * The home page deliberately omits `title` and takes the layout's
   * `title.default`. Every other route sets its own, which the layout wraps in
   * its `%s — Jasmine Garcia` template.
   */
  it("gives every page a title and a description", async () => {
    for (const [route, load, params] of PAGES) {
      const metadata = await resolveMetadata(load, params);
      expect(metadata, `${route} exports no metadata`).toBeDefined();
      expect(metadata!.description, `${route} has no description`).toBeTruthy();
      if (route !== "/") {
        expect(metadata!.title, `${route} has no title`).toBeTruthy();
      }
    }
  });

  it("uses no templated boilerplate — every title and description is unique", async () => {
    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const [route, load, params] of PAGES) {
      const metadata = (await resolveMetadata(load, params))!;
      if (metadata.title) titles.push(String(metadata.title));
      descriptions.push(String(metadata.description));
      expect(String(metadata.description).length, `${route} has a stub description`).toBeGreaterThan(
        50,
      );
    }

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

describe("headings (§10)", () => {
  it.each(PAGES.map(([route]) => route))("%s has exactly one h1", async (route) => {
    const matches = (await page(route)).match(/<h1[\s>]/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it.each(PAGES.map(([route]) => route))("%s skips no heading level", async (route) => {
    const levels = [...(await page(route)).matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    let deepest = 0;
    for (const level of levels) {
      if (deepest !== 0) expect(level).toBeLessThanOrEqual(deepest + 1);
      deepest = Math.max(deepest, level);
    }
  });
});

describe("images (§10)", () => {
  it.each(PAGES.map(([route]) => route))("%s gives every image alt text", async (route) => {
    const imgs = (await page(route)).match(/<img\b[^>]*>/g) ?? [];
    for (const img of imgs) {
      expect(img, `${route} has an <img> with no alt attribute`).toMatch(/\balt=/);
    }
  });
});

describe("page coverage", () => {
  /**
   * Static routes with no compliance surface, each excluded for a stated
   * reason. Everything else on disk must appear in `PAGES` above, or it ships
   * unaudited — which is exactly how `/transactions` slipped through: listed
   * in tests/metadata.test.ts, absent here and from tests/accessibility.test.tsx.
   */
  const EXEMPT = [
    // Internal design reference, index:false/follow:false. Not advertising —
    // see the comment at the top of app/style-tile/page.tsx.
    "/style-tile",
  ];

  it("covers every static page route on disk", () => {
    const listed = new Set(PAGES.map(([route]) => route));
    const missing = staticPageRoutes().filter(
      (route) => !listed.has(route) && !EXEMPT.includes(route),
    );
    expect(missing, `add these routes to PAGES in tests/compliance.test.tsx`).toEqual([]);
  });
});
