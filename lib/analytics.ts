/**
 * Thin event shim. docs/CONTACT-STRATEGY.md §5 lists six things to measure; none of
 * them are recoverable retroactively, so the events ship with the UI rather than
 * after it.
 *
 * The site loads gtag.js directly (components/google-analytics.tsx), not Tag Manager,
 * and the two read `dataLayer` differently. Tag Manager listens for plain objects
 * carrying an `event` key. gtag.js ignores those completely; it acts only on
 * argument-shaped commands — `["event", name, params]`. This file pushed the Tag
 * Manager shape until 2026-08-24, so every call site below was firing into a void
 * that looked, from the page, exactly like a working install.
 *
 * If the site ever moves to Tag Manager, this function is the only thing that changes.
 */

type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 event names and parameter keys are snake_case by convention, and custom
 * parameters need registering as custom dimensions in the GA4 admin before they
 * show up in reports. They are collected either way, so an unregistered parameter
 * is recoverable later; a parameter never sent is not.
 */
export function track(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  /* The tag is loaded afterInteractive, so a fast click can land before gtag
     exists. Queueing the same command shape on dataLayer covers that window —
     gtag.js drains what it finds there once it loads. */
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(["event", event, params]);
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
