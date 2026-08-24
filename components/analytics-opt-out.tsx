"use client";

import { useCallback, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { hasOptedOutOfAnalytics, setAnalyticsOptOut } from "@/lib/analytics-consent";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/*
  useSyncExternalStore rather than an effect that copies localStorage into state.

  The value is read at render on the client and `false` on the server, which is
  what makes the prerendered HTML identical for everyone — the page is static and
  cached, so it cannot contain anyone's answer. The `storage` event is part of the
  subscription on purpose: opting out in one tab settles it in the others, and a
  privacy choice that only applied to the tab it was made in would be a bug the
  visitor discovers by being measured.
*/
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/**
 * The opt-out named in the 2026-08-24 privacy decision (lib/analytics-consent.ts).
 * A control on the privacy policy, not an interstitial: nobody is asked to make
 * this choice before reading anything, and anyone who wants it finds it where
 * they went looking for what is collected.
 *
 * The status line is `aria-live`, so a keyboard or screen-reader user hears the
 * choice take effect — a button whose only feedback is its own changed label
 * changes silently for the people most likely to be using this. §10.
 */
export function AnalyticsOptOut() {
  const optedOut = useSyncExternalStore(
    subscribe,
    hasOptedOutOfAnalytics,
    () => false,
  );

  const toggle = useCallback(() => {
    setAnalyticsOptOut(!hasOptedOutOfAnalytics(), MEASUREMENT_ID);
    for (const listener of listeners) listener();
  }, []);

  return (
    <div className="mt-4 rounded-sm border border-border bg-surface-sunken p-5">
      <p aria-live="polite" className="text-base">
        {optedOut
          ? "Analytics are off for this browser."
          : "Analytics are on for this browser."}
      </p>
      <Button type="button" variant="outlineInk" size="sm" onClick={toggle} className="mt-4">
        {optedOut ? "Turn analytics back on" : "Turn analytics off"}
      </Button>
      <p className="mt-4 text-sm text-ink-muted">
        The choice is stored in this browser only, so it does not follow you to another
        device, and clearing your browsing data clears it. It is not a cookie and it is
        never sent to us.
      </p>
    </div>
  );
}
