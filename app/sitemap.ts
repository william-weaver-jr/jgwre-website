import type { MetadataRoute } from "next";

import { publishedAreas, sortAreas } from "@/lib/areas";
import { PILLARS, SITE_URL } from "@/lib/site";
import { isTransactionsPageIndexable } from "@/lib/transactions";

/*
  Add routes here as pages ship. See the build order in docs/CONTENT-PLAN.md.

  Only list routes that actually resolve. mackenziesiek.com advertises six
  /neighborhood/* URLs in its sitemap that all 404 — see docs/competitive-landscape.md.

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
  /* Only markets with authored content in lib/areas/data.ts. An unwritten
     market has no page at all, so listing it would advertise a 404 — the exact
     mistake noted above about mackenziesiek.com. */
  ...sortAreas(publishedAreas()).map((area) => `/areas/${area.slug}`),
  "/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
