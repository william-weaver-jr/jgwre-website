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
 * One of those has happened. Bill directed on 2026-09-08 that the property be
 * linked to Google Ads, so `generate_lead` can be imported as a conversion.
 * Read the list above as one condition spent rather than four still unspent:
 *
 * - The tag config did NOT change, and did not need to. Google documents that
 *   disabling ads personalization does not affect measurement, so the
 *   conversion is importable with both flags still false. No remarketing
 *   audience is built and no event is eligible for personalized targeting.
 * - What changed is the destination. Analytics data now reaches an advertising
 *   product, which is the premise the no-banner answer was resting on.
 *   /privacy-policy discloses the link, and the banner question itself is with
 *   counsel and the BIC rather than settled here.
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
