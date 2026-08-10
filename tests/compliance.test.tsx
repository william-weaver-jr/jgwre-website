import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType } from "react";
import { describe, expect, it, vi } from "vitest";

import { SiteFooter } from "@/components/site-footer";
import { AGENT, BROKERAGE, RESULTS_DISCLAIMER, TCPA_CONSENT } from "@/lib/site";

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

/* Every route with a page, so a new page cannot be added without appearing here. */
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

/** Async pages take props; they are rendered through their own resolved element. */
async function renderPage(load: () => Promise<{ default: ComponentType<never> }>) {
  const { default: Page } = await load();
  const element = await (Page as unknown as (props: unknown) => unknown)({
    searchParams: Promise.resolve({}),
    params: Promise.resolve({}),
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

const rendered = new Map<string, string>();
async function page(route: string): Promise<string> {
  if (!rendered.has(route)) {
    const entry = PAGES.find(([r]) => r === route)!;
    rendered.set(route, await renderPage(entry[1]));
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

describe("SEO metadata (§11)", () => {
  /**
   * The home page deliberately omits `title` and takes the layout's
   * `title.default`. Every other route sets its own, which the layout wraps in
   * its `%s — Jasmine Garcia` template.
   */
  it("gives every page a title and a description", async () => {
    for (const [route, load] of PAGES) {
      const { metadata } = (await load()) as unknown as {
        metadata?: { title?: unknown; description?: unknown };
      };
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

    for (const [route, load] of PAGES) {
      const { metadata } = (await load()) as unknown as {
        metadata: { title?: string; description: string };
      };
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
