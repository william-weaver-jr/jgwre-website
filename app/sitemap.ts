import type { MetadataRoute } from "next";

import { publishedAreas, sortAreas } from "@/lib/areas";
import { lastModified, publishedPosts } from "@/lib/blog";
import { PILLARS, SITE_URL } from "@/lib/site";
import { isTransactionsPageIndexable } from "@/lib/transactions";

/*
  Add routes here as pages ship. See the build order in docs/CONTENT-PLAN.md.

  Only list routes that actually resolve. mackenziesiek.com advertises six
  /neighborhood/* URLs in its sitemap that all 404 — see the Competitive Landscape
  in Notion (docs/README.md has the link).

  /style-tile is deliberately absent: it is an internal review page and carries
  robots noindex.
*/
const routes = [
  "",
  "/about",
  "/negotiation",
  ...PILLARS.map((p) => p.href),
  "/buyers",
  "/home-value",
  "/reviews",
  "/contact",
  /* Listed only once the ledger is substantial. The route resolves either way,
     but a two-row ledger is a thin page, so /transactions carries noindex until
     data.ts passes TRANSACTIONS_INDEX_THRESHOLD. */
  ...(isTransactionsPageIndexable() ? ["/transactions"] : []),
  /* The hub resolves always, because it is the redirect target for the old
     site's /area-guide/ and for every retired /area/{slug}/. It is worth
     crawling once it links something, which is the same rule /blog follows. */
  ...(publishedAreas().length > 0 ? ["/areas"] : []),
  /* Only markets with authored content in lib/areas/data.ts. An unwritten
     market has no page at all, so listing it would advertise a 404 — the exact
     mistake noted above about mackenziesiek.com. */
  ...sortAreas(publishedAreas()).map((area) => `/areas/${area.slug}`),
  /* The listing is worth crawling once there is something on it, not before. */
  ...(publishedPosts().length > 0 ? ["/blog"] : []),
  "/privacy-policy",
];

/**
 * Regenerated hourly, on the same clock as /blog and /blog/[slug].
 *
 * Without this the sitemap is baked at build time, and a post scheduled for next
 * Tuesday would go live on a route that resolves while the sitemap kept claiming
 * it does not exist. docs/CONTENT-MARKETING.md.
 */
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
    })),
    /*
      Posts carry their own date rather than the build's. A future-dated post is
      absent entirely — publishedPosts() is the same gate the router uses, so the
      sitemap can never advertise a URL that is not live yet. That is the mistake
      noted above about mackenziesiek.com, in its other direction.
    */
    ...publishedPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(`${lastModified(post)}T00:00:00Z`),
    })),
  ];
}
