"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { AGENT } from "@/lib/site";

/**
 * Mobile only. Both conversion paths, one thumb-reach away, once the visitor is far
 * enough down that the header CTA has scrolled off.
 *
 * docs/CONTACT-STRATEGY.md §2: call and form catch different people — the decided
 * caller during business hours, and the 9pm researcher who will not phone a stranger.
 * §5.6 measures which one this bar actually produces.
 *
 * Hidden until 600px of scroll so it never competes with the hero, and hidden again
 * once the intake itself is on screen — two "start" affordances in view at once reads
 * as a nag.
 */
export function StickyContactBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Geometry read in the scroll handler rather than an IntersectionObserver: one
    // listener, no second async source of truth, and both conditions stay legible
    // side by side.
    function update() {
      if (window.scrollY <= 600) {
        setShown(false);
        return;
      }

      const intake = document.getElementById("start")?.getBoundingClientRect();
      const intakeOnScreen = Boolean(
        intake && intake.top < window.innerHeight * 0.6 && intake.bottom > 0,
      );

      setShown(!intakeOnScreen);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      // Shown and hidden, not slid in and out. Tailwind v4 drives `translate-y-*`
      // through the `translate` property, and transitioning it against the unset
      // state leaves the bar stuck off screen. Appearing outright also means there is
      // no motion to suppress for prefers-reduced-motion.
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur md:hidden ${
        shown ? "" : "hidden"
      }`}
      // Kept out of the tab order and the accessibility tree while off screen: the
      // header phone button and the intake are both reachable without it.
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="flex gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={AGENT.phoneHref}
          data-cta-placement="sticky-bar"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium tracking-wide tabular-nums text-primary-foreground"
        >
          <span className="sr-only">Call {AGENT.name} at </span>
          {AGENT.phoneDisplay}
        </a>
        <a
          href="#start"
          onClick={() => track("intake_start", { placement: "sticky-bar" })}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm border border-accent-soft px-4 text-sm font-medium tracking-wide text-ink"
        >
          Start here
        </a>
      </div>
    </div>
  );
}
