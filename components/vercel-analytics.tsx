"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { hasOptedOutOfAnalytics } from "@/lib/analytics-consent";

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
 *
 * Both also honour the opt-out, through `beforeSend`. Neither sets a cookie or
 * identifies anyone, so neither is what the opt-out is *for* — but a privacy
 * choice that silently covers one vendor out of three is a worse answer than
 * either honouring it everywhere or not offering it. The check reads
 * localStorage per event rather than per mount, so a visitor who opts out is
 * not still being measured until they navigate.
 */
export function VercelAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Analytics beforeSend={(event) => (hasOptedOutOfAnalytics() ? null : event)} />
      <SpeedInsights beforeSend={(event) => (hasOptedOutOfAnalytics() ? null : event)} />
    </>
  );
}
