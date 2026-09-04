"use client";

import { useEffect, useState } from "react";

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
      {/*
        Three actions since 2026-08-31, and that is why the first one reads
        "Call" rather than the number.

        Three controls and the full "(704) 200-9360" do not both fit: at 375px
        the bar has 319px of usable width, so each of three is ~106px against a
        number that needs ~137px on its own. The number is not lost by
        shortening the label — SiteHeader is `sticky top-0` and stays pinned
        while scrolled, so the digits are on screen at the top of the viewport
        the entire time this bar is on screen at the bottom. Verified.

        The phone keeps first position. CLAUDE.md Locked Decision #4.
      */}
      <div className="flex gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={AGENT.phoneHref}
          data-cta-placement="sticky-bar"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm bg-primary px-3 text-sm font-medium tracking-wide text-primary-foreground"
        >
          Call
          <span className="sr-only"> {AGENT.name} at {AGENT.phoneDisplay}</span>
        </a>
        <a
          href={AGENT.smsHref}
          data-cta-placement="sticky-bar"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm border border-accent-soft px-3 text-sm font-medium tracking-wide text-ink"
        >
          Text
          <span className="sr-only"> {AGENT.name} at {AGENT.phoneDisplay}</span>
        </a>
        {/* `intake_start` is fired by the delegated listener in
            components/contact-link-tracking.tsx, which matches every
            `href="#start"` on the site. It used to be an inline onClick here,
            back when this was the only such link. */}
        <a
          href="#start"
          data-cta-placement="sticky-bar"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm border border-accent-soft px-3 text-sm font-medium tracking-wide text-ink"
        >
          Start here
        </a>
      </div>
    </div>
  );
}
