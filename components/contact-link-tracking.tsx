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

/**
 * Every link that jumps to the intake, wherever it is.
 *
 * These were tracked at the call site until 2026-08-31, when there was exactly
 * one of them. Now there are three — the sticky bar, the home page band, and
 * /contact — and an inline `onClick` per link is how one of them quietly ships
 * untracked, or how two mechanisms end up firing the same event twice for the
 * same click. The delegated listener already existed for `tel:`; this is the
 * same click.
 */
const INTAKE_ANCHOR = 'a[href="#start"]';

export function ContactLinkTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>(
        `a[href^="tel:"], a[href^="sms:"], ${INTAKE_ANCHOR}`,
      );
      if (!link) return;

      const page = window.location.pathname;

      if (link.matches(INTAKE_ANCHOR)) {
        track("intake_start", {
          placement: link.dataset.ctaPlacement ?? "unlabeled",
          page,
        });
        return;
      }

      // Read the scheme off the attribute, not the resolved `href` property:
      // the property is normalised by the browser and the attribute is what the
      // selector above matched on.
      const scheme = link.getAttribute("href")?.slice(0, 4).toLowerCase() ?? "";
      const name = EVENTS[scheme];
      if (!name) return;

      track(name, { placement: link.dataset.ctaPlacement ?? "unlabeled", page });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
