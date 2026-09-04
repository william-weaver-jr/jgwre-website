import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ContactLinkTracking } from "./contact-link-tracking";

/**
 * The measurement half of docs/CONTACT-STRATEGY.md §5.3.
 *
 * What matters here is that a text and a call stay separable. Folding texts
 * into `call_click` would not lose data noisily — it would answer "which
 * contact path does this placement produce?" with a confident wrong number,
 * which is worse than not asking.
 */

afterEach(() => {
  delete window.gtag;
  delete window.dataLayer;
  document.body.innerHTML = "";
});

/** Renders the listener, clicks the link, returns the events it produced. */
function clickAndCapture(html: string, selector = "a"): { event: string; params: Record<string, unknown> }[] {
  const events: { event: string; params: Record<string, unknown> }[] = [];
  window.gtag = ((...args: unknown[]) => {
    events.push({ event: args[1] as string, params: (args[2] ?? {}) as Record<string, unknown> });
  }) as typeof window.gtag;

  render(<ContactLinkTracking />);

  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.appendChild(host);

  // jsdom would otherwise complain about navigating to an unimplemented scheme.
  host.querySelector("a")?.addEventListener("click", (e) => e.preventDefault());
  host.querySelector<HTMLAnchorElement>(selector)?.click();

  return events;
}

describe("contact link tracking", () => {
  it("records a call as call_click", () => {
    const events = clickAndCapture(
      '<a href="tel:+17042009360" data-cta-placement="header">(704) 200-9360</a>',
    );
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("call_click");
    expect(events[0].params.placement).toBe("header");
  });

  /* The regression this file exists for. */
  it("records a text as text_click, never as a call", () => {
    const events = clickAndCapture(
      '<a href="sms:+17042009360" data-cta-placement="contact-hero-sms">Text her</a>',
    );
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("text_click");
    expect(events[0].params.placement).toBe("contact-hero-sms");
  });

  it("fires on a click inside the link, not only on the anchor itself", () => {
    const events = clickAndCapture(
      '<a href="sms:+17042009360" data-cta-placement="sticky-bar">Text<span>!</span></a>',
      "a span",
    );
    expect(events.map((e) => e.event)).toEqual(["text_click"]);
  });

  it("labels an untagged link rather than dropping it", () => {
    const events = clickAndCapture('<a href="tel:+17042009360">Call</a>');
    expect(events[0].params.placement).toBe("unlabeled");
  });

  it("ignores links that are neither a call nor a text", () => {
    expect(clickAndCapture('<a href="/buyers" data-cta-placement="nav">Buy</a>')).toEqual([]);
  });

  /*
    `intake_start` moved here from an inline onClick on the sticky bar when the
    second and third "#start" links shipped. The risk of that move is firing
    twice for one click — once from the listener and once from a leftover
    handler — which would silently inflate the one funnel number the intake is
    judged on.
  */
  describe("the intake jump", () => {
    it("records a #start link as one intake_start", () => {
      const events = clickAndCapture(
        '<a href="#start" data-cta-placement="home-band">Start here</a>',
      );
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe("intake_start");
      expect(events[0].params.placement).toBe("home-band");
    });

    it("keeps placements apart, so the band and the bar stay comparable", () => {
      expect(
        clickAndCapture('<a href="#start" data-cta-placement="sticky-bar">Start here</a>')[0]
          .params.placement,
      ).toBe("sticky-bar");
    });

    it("does not treat another in-page anchor as the intake", () => {
      expect(clickAndCapture('<a href="#outcomes">Jump</a>')).toEqual([]);
    });
  });

  it("ignores a mailto, which is neither and must not become one", () => {
    expect(clickAndCapture('<a href="mailto:someone@example.com">Email</a>')).toEqual([]);
  });
});
