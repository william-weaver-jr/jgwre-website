import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { AnalyticsOptOut } from "./analytics-opt-out";
import { ANALYTICS_OPT_OUT_KEY } from "@/lib/analytics-consent";

/*
  /privacy-policy tells visitors they can switch analytics off, and that sentence
  is the reason there is no consent banner (lib/analytics-consent.ts). This is the
  control that has to make it true.
*/

afterEach(() => {
  window.localStorage.clear();
});

describe("the analytics opt-out", () => {
  it("starts opted in and says so", () => {
    render(<AnalyticsOptOut />);

    expect(screen.getByText("Analytics are on for this browser.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Turn analytics off" })).toBeInTheDocument();
  });

  it("records the choice and reports it back", async () => {
    render(<AnalyticsOptOut />);

    await userEvent.click(screen.getByRole("button", { name: "Turn analytics off" }));

    expect(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY)).toBe("1");
    expect(screen.getByText("Analytics are off for this browser.")).toBeInTheDocument();
  });

  it("lets someone change their mind back", async () => {
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
    render(<AnalyticsOptOut />);

    await userEvent.click(screen.getByRole("button", { name: "Turn analytics back on" }));

    expect(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY)).toBeNull();
    expect(screen.getByText("Analytics are on for this browser.")).toBeInTheDocument();
  });

  /* The status has to reach a screen reader, not just the screen. §10. */
  it("announces the change rather than only relabelling the button", () => {
    render(<AnalyticsOptOut />);

    expect(screen.getByText("Analytics are on for this browser.")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });
});
