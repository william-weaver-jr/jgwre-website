"use client";

import { useEffect } from "react";

import { track } from "@/lib/analytics";

/**
 * Measures every outbound contact link by placement — docs/CONTACT-STRATEGY.md §5.3.
 *
 * One delegated listener mounted in the layout, rather than a client component
 * per link: the header, footer, hero, and every closing block stay
 * server-rendered. Links opt in with `data-cta-placement`.
 *
 * Was `TelTracking` and handled only `tel:` until 2026-08-31, when the text
 * affordance shipped. A text is not a call and gets its own event: the whole
 * point of §5.3 is comparing which contact path a given placement actually
 * produces, and folding texts into `call_click` would answer that question
 * wrongly rather than not at all. They also cost her different things — a call
 * interrupts, a text waits.
 */

/** Event name per URI scheme. Adding a scheme here is the only change needed. */
const EVENTS: Record<string, string> = {
  "tel:": "call_click",
  "sms:": "text_click",
};

export function ContactLinkTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href^="tel:"], a[href^="sms:"]');
      if (!link) return;

      // Read the scheme off the attribute, not the resolved `href` property:
      // the property is normalised by the browser and the attribute is what the
      // selector above matched on.
      const scheme = link.getAttribute("href")?.slice(0, 4).toLowerCase() ?? "";
      const name = EVENTS[scheme];
      if (!name) return;

      track(name, {
        placement: link.dataset.ctaPlacement ?? "unlabeled",
        page: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
