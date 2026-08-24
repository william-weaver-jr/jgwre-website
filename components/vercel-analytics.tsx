import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Vercel Web Analytics and Speed Insights, mounted once in the root layout so
 * every page inherits both — current pages and any added later. CLAUDE.md §4.
 *
 * Production only, matching components/google-analytics.tsx. Both scripts post
 * to `/_vercel/*` endpoints that only exist on Vercel, so mounting them in
 * local dev buys a pair of 404s and a console notice and nothing else. Note
 * that Vercel builds preview deployments with NODE_ENV=production, so previews
 * do report — which is what we want for Speed Insights, since a preview is the
 * only place a regression can be caught before it is live.
 *
 * Neither needs an env var: the endpoints are same-origin and Vercel injects
 * the project ID at deploy time. Nothing to configure, nothing to leak.
 *
 * These two are counted in /privacy-policy alongside GA4. Both are cookieless
 * and neither is used for advertising, but "we run no third-party analytics
 * beyond Google" would have stopped being true the moment this shipped, and
 * that page is a compliance surface.
 */
export function VercelAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
