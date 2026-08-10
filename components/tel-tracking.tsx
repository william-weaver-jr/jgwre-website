"use client";

import { useEffect } from "react";

import { track } from "@/lib/analytics";

/**
 * Measures `tel:` clicks by placement — docs/CONTACT-STRATEGY.md §5.3. The phone is
 * the primary CTA on every page and is currently the one conversion path with no
 * instrumentation at all, which makes any later call-vs-form comparison impossible.
 *
 * One delegated listener mounted in the layout, rather than a client component per
 * link: the header, footer, hero, and every closing block stay server-rendered.
 * Links opt in with `data-cta-placement`.
 */
export function TelTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (!link) return;

      track("call_click", {
        placement: link.dataset.ctaPlacement ?? "unlabeled",
        page: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
