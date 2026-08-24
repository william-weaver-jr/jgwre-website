import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

/** See tests/next-image-stub.tsx — under Vite a .jpg import has no intrinsic width. */
vi.mock("next/image", async () => ({
  default: (await import("../tests/next-image-stub")).NextImageStub,
}));

import { VideoEmbed } from "./video-embed";
import { VIDEOS } from "@/lib/video";
import type { VideoPlacement } from "@/lib/video";

/**
 * The video block, and the two properties that are not style preferences.
 *
 * **Nothing is requested from YouTube until the visitor asks.** That is what
 * keeps a megabyte of player JavaScript off a page that has to clear Lighthouse
 * ≥ 90 (CLAUDE.md §10), and what keeps a third-party cookie off a first page
 * view while /privacy-policy's consent question is still with counsel (§7). It
 * is invisible in a screenshot, so it is asserted here.
 *
 * **A visitor who never presses play still gets the content.** The summary is on
 * the page in words, which is both the accessibility answer and the reason the
 * page is worth crawling — an embed on its own adds no content to a page.
 */

const video = VIDEOS[0];

const feature: VideoPlacement = {
  route: "/about",
  variant: "feature",
  eyebrow: "In her own words",
  id: "video",
  heading: "A minute and a half, if you would rather hear it.",
  intro: "The page above is the long version. This is the short one.",
  primary: true,
};

const card: VideoPlacement = { ...feature, variant: "card", primary: undefined };

describe.each([
  ["feature", feature],
  ["card", card],
])("the %s variant", (_name, placement) => {
  it("loads no iframe until the visitor clicks", () => {
    const { container } = render(<VideoEmbed video={video} placement={placement} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.innerHTML).not.toContain("youtube.com/embed");
  });

  it("loads the player from the no-cookie host once clicked", async () => {
    const { container } = render(<VideoEmbed video={video} placement={placement} />);
    await userEvent.click(screen.getByRole("button", { name: /play the video/i }));

    const frame = container.querySelector("iframe");
    expect(frame).not.toBeNull();
    expect(frame!.getAttribute("src")).toContain("youtube-nocookie.com");
    expect(frame!.getAttribute("title")).toBe(video.title);
  });

  /**
   * `1:42` is announced as a time of day by some screen readers, which is both
   * wrong and confusing beside a play button.
   */
  it("names the action and speaks the length in words", () => {
    render(<VideoEmbed video={video} placement={placement} />);
    const button = screen.getByRole("button", { name: /play the video/i });
    expect(button).toHaveAccessibleName(/1 minute 42 seconds/);
    expect(button).not.toHaveAccessibleName(/1:42/);
  });

  it("renders the summary as text, so the page stands up without playback", () => {
    render(<VideoEmbed video={video} placement={placement} />);
    expect(screen.getByText(video.summary)).toBeInTheDocument();
  });

  it("says the YouTube link leaves the site", () => {
    render(<VideoEmbed video={video} placement={placement} />);
    const link = screen.getByRole("link", { name: /watch on youtube/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.textContent?.toLowerCase()).toContain("external");
  });

  it("labels its section with its own heading", () => {
    const { container } = render(<VideoEmbed video={video} placement={placement} />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe(placement.id);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", placement.id);
  });

  /**
   * The panel below the button is aria-hidden so a screen reader hears the
   * action once. If a still is committed later it arrives as a decorative image
   * inside a labelled control, which is the correct treatment — but it must
   * still carry an alt attribute, because tests/compliance.test.tsx checks every
   * <img> on every page for one.
   */
  it("gives any image an alt attribute", () => {
    const { container } = render(<VideoEmbed video={video} placement={placement} />);
    for (const img of container.querySelectorAll("img")) {
      expect(img.hasAttribute("alt")).toBe(true);
    }
  });
});

describe("the panel", () => {
  it("shows the committed still, described", () => {
    render(<VideoEmbed video={video} placement={feature} />);
    const still = screen.getByRole("img", { hidden: true });
    expect(still).toHaveAttribute("alt", video.poster!.alt);
  });

  /** The state every entry starts in. Not a placeholder — see lib/video/types.ts. */
  it("falls back to the video's own title when no still is committed", () => {
    const { poster: _poster, ...noArtwork } = video;
    render(<VideoEmbed video={noArtwork} placement={feature} />);
    /* Inside an aria-hidden panel, so it is queried as text rather than by role. */
    expect(screen.getByText(video.title)).toBeInTheDocument();
  });

  it("draws no borrowed play-button artwork", () => {
    const { container } = render(<VideoEmbed video={video} placement={feature} />);
    /* One path, drawn from the site's own tokens. Not YouTube's mark. */
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.innerHTML).not.toMatch(/youtube_social|#FF0000|#ff0000/);
  });
});
