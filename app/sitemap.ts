import type { MetadataRoute } from "next";

import { PILLARS, SITE_URL } from "@/lib/site";

/*
  Add routes here as pages ship. See the build order in docs/CONTENT-PLAN.md.

  Only list routes that actually resolve. mackenziesiek.com advertises six
  /neighborhood/* URLs in its sitemap that all 404 — see docs/competitive-landscape.md.

  /style-tile is deliberately absent: it is an internal review page and carries
  robots noindex.
*/
const routes = ["", "/negotiation", ...PILLARS.map((p) => p.href), "/privacy-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
