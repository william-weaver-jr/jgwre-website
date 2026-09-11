/**
 * Google Ads click identifiers captured from the landing URL.
 *
 * Google supplies one of these parameters when its privacy and platform rules
 * allow it. They are attribution tokens, not values this site creates. The
 * first paid touch is kept in first-party storage so a visitor can navigate,
 * return, or complete the stepped intake without losing the click that brought
 * them here.
 */
import { hasOptedOutOfAnalytics } from "@/lib/analytics-consent";

export type GoogleClickIds = Partial<Record<"gclid" | "wbraid" | "gbraid", string>>;

export const GOOGLE_CLICK_IDS_STORAGE_KEY = "jg-google-click-ids-v1";

const CLICK_ID_KEYS = ["gclid", "wbraid", "gbraid"] as const;
const MAX_CLICK_ID_LENGTH = 512;

function sanitize(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_CLICK_ID_LENGTH);
}

function normalize(candidate: unknown): GoogleClickIds | undefined {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return undefined;

  const record = candidate as Record<string, unknown>;
  const clickIds: GoogleClickIds = {};

  for (const key of CLICK_ID_KEYS) {
    const value = sanitize(record[key]);
    if (value) clickIds[key] = value;
  }

  return Object.keys(clickIds).length ? clickIds : undefined;
}

/** Read click identifiers from a URL query string without touching storage. */
export function clickIdsFromSearch(search: string): GoogleClickIds | undefined {
  const params = new URLSearchParams(search);
  const clickIds: GoogleClickIds = {};

  for (const key of CLICK_ID_KEYS) {
    const value = sanitize(params.get(key));
    if (value) clickIds[key] = value;
  }

  return Object.keys(clickIds).length ? clickIds : undefined;
}

/**
 * Capture and return the first Google Ads click represented in this browser.
 *
 * Existing valid storage always wins, so a later direct visit or a second ad
 * click cannot silently rewrite the lead's original acquisition source. When
 * storage is unavailable (notably some private-browsing modes), the current URL
 * value is still returned and reaches the lead submission.
 */
export function captureFirstTouchGoogleClickIds(): GoogleClickIds | undefined {
  if (typeof window === "undefined") return undefined;

  /*
    The opt-out gates this, decided 2026-09-11 (Bill).

    There was a defensible reading where it should not: what reaches Follow Up
    Boss is a business record of how a lead arrived, not an analytics hit, and
    /privacy-policy offers to switch *analytics* off. The reading lost on the
    plainer fact that a visitor who asks not to be measured does not mean
    "except by the advertising identifier", and on this being a Google Ads
    token rather than a note we wrote ourselves.

    It also forgets. Returning early would leave an identifier captured before
    the opt-out sitting in storage indefinitely, and the switch reads as a
    promise about what this browser holds, not only about what it sends next.
    Clearing here rather than in the opt-out control is deliberate: this runs
    on mount on every page, so a visitor who opted out before this shipped is
    cleaned up on their next visit without anyone having to migrate anything.
  */
  if (hasOptedOutOfAnalytics()) {
    try {
      window.localStorage.removeItem(GOOGLE_CLICK_IDS_STORAGE_KEY);
    } catch {
      // Unavailable storage cannot hold a stale identifier either.
    }
    return undefined;
  }

  try {
    const stored = window.localStorage.getItem(GOOGLE_CLICK_IDS_STORAGE_KEY);
    if (stored) {
      const parsed = normalize(JSON.parse(stored));
      if (parsed) return parsed;
    }
  } catch {
    // Corrupt or unavailable storage must never break the conversion path.
  }

  const incoming = clickIdsFromSearch(window.location.search);
  if (!incoming) return undefined;

  try {
    window.localStorage.setItem(GOOGLE_CLICK_IDS_STORAGE_KEY, JSON.stringify(incoming));
  } catch {
    // The identifiers still return for this submission even if persistence fails.
  }

  return incoming;
}
