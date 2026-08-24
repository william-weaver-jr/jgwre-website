/**
 * The analytics opt-out. One key, read by everything that measures.
 *
 * Recorded decision, 2026-08-24 (Bill): a Charlotte-only GA4 install with no
 * advertising features does not require a consent banner. What it does require
 * is an honest disclosure and an opt-out someone can actually reach — so there
 * is no interstitial on this site, and there is this.
 *
 * That balance depends on facts that could change. Turning on Google Signals,
 * remarketing, or any Google Ads link, or marketing the site outside the local
 * metro, reopens the question. components/google-analytics.tsx switches the
 * advertising features off explicitly rather than relying on the account
 * default, so flipping one is a code change that lands in a diff.
 *
 * Deliberately localStorage and not a cookie: a preference about being measured
 * should not itself be sent to a server on every request.
 */
export const ANALYTICS_OPT_OUT_KEY = "jg-analytics-opt-out";

/**
 * Read on the client only. Server-rendered HTML is identical either way, which
 * is what keeps this out of the prerendered markup and out of the cache.
 */
export function hasOptedOutOfAnalytics(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1";
  } catch {
    /* Safari in private mode throws on localStorage. Measuring someone who
       cannot record a preference is the wrong way to resolve that, but so is
       treating every locked-down browser as an opt-out and reporting nothing.
       The tag itself is the tie-breaker: it honours whatever it last saw. */
    return false;
  }
}

/**
 * Persist the choice and apply it to the tag already on the page, so it takes
 * effect on the next event rather than the next reload. The `ga-disable-*`
 * global is gtag.js's own kill switch and is read before every hit.
 */
export function setAnalyticsOptOut(optedOut: boolean, measurementId?: string): void {
  if (typeof window === "undefined") return;

  try {
    if (optedOut) {
      window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
    } else {
      window.localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
    }
  } catch {
    /* Nothing to persist to. The in-page flag below still applies for this
       session, which is the part the visitor asked for. */
  }

  if (measurementId) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = optedOut;
  }
}
