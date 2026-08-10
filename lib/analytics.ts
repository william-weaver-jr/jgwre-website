/**
 * Thin event shim. docs/CONTACT-STRATEGY.md §5 lists six things to measure; none of
 * them are recoverable retroactively, so the events ship with the UI rather than
 * after it.
 *
 * GA4 is loaded via its dataLayer. If no tag is present — which is the case today,
 * and will be until the GA4 property exists — every call here is a no-op that costs
 * one property lookup. Nothing on the page depends on it.
 */

export type AnalyticsEvent = {
  event: string;
  [key: string]: string | number | undefined;
};

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[];
  }
}

export function track(event: string, params: Record<string, string | number | undefined> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/** UTM parameters off the current URL, for the lead payload. CLAUDE.md §9. */
export function readUtm(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  for (const key of ["source", "medium", "campaign", "term", "content"] as const) {
    const value = params.get(`utm_${key}`);
    if (value) utm[key] = value.slice(0, 120);
  }

  return Object.keys(utm).length ? utm : undefined;
}
