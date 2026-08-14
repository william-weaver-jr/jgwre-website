import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  POSTS,
  formatPostDate,
  lastModified,
  postBySlug,
  postsInCategory,
  publishedPosts,
  scheduledPosts,
  sortPosts,
} from "./index";
import { POST_CATEGORIES } from "./types";
import type { Post } from "./types";
import { findIncompleteFields, findProblems, postText } from "./validate";

/**
 * Integrity over the real post registry, plus the scheduling logic that decides
 * what the public can see.
 *
 * The compliance and accessibility suites render published posts and check the
 * §7 surfaces on the markup. They cannot see a scheduled post — that is the
 * whole point of scheduling — so anything dated forward is checked here, in the
 * data and in the raw MDX, before the date arrives and it publishes itself with
 * nobody watching.
 */

const CONTENT_DIR = join(process.cwd(), "content/blog");

function mdxFiles(): string[] {
  try {
    return readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
}

/** Prose only. Import lines and JSX attributes are not copy and would trip the scanners. */
function mdxProse(file: string): string {
  return readFileSync(join(CONTENT_DIR, file), "utf8")
    .replace(/^import .*$/gm, " ")
    .replace(/^export .*$/gm, " ");
}

const each = POSTS.length > 0 ? it.each(POSTS as Post[]) : it.skip.each([{ slug: "none" } as Post]);

describe("the registry", () => {
  it("gives every post a unique slug", () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    for (const post of POSTS) expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("gives every post a unique title, description, and target query", () => {
    for (const field of ["title", "description", "targetQuery"] as const) {
      const values = POSTS.map((p) => p[field]);
      expect(new Set(values).size, `duplicate ${field}`).toBe(values.length);
    }
  });

  it("files every post in a real category", () => {
    for (const post of POSTS) expect(POST_CATEGORIES[post.category]).toBeDefined();
  });

  /**
   * Registry and directory must agree in both directions. An entry with no file
   * is a route that throws; a file with no entry is copy nobody reviewed sitting
   * in the repo, and one careless import away from shipping.
   */
  it("pairs every post with an MDX body, and every MDX body with a post", async () => {
    for (const post of POSTS) {
      await expect(post.body(), `${post.slug} has no loadable body`).resolves.toBeDefined();
    }

    const expected = new Set(POSTS.map((p) => `${p.slug}.mdx`));
    for (const file of mdxFiles()) {
      expect(expected.has(file), `content/blog/${file} is not registered in data.ts`).toBe(true);
    }
    expect(mdxFiles().length).toBe(POSTS.length);
  });
});

describe("post content (§6, §7)", () => {
  each("$slug is structurally complete", (post) => {
    expect(findIncompleteFields(post)).toEqual([]);
  });

  each("$slug states nothing prohibited in its metadata", (post) => {
    expect(findProblems(postText(post))).toEqual([]);
  });

  /**
   * The body, scanned as raw text.
   *
   * This is where a generated draft goes wrong — an invented median price, a
   * rounded case-study figure, "up-and-coming", a promise about what she will
   * get you. Every one of those is an advertising violation published under
   * NC 334700 and SC 125546. lib/blog/validate.ts holds the rules.
   */
  each("$slug states nothing prohibited in its body", (post) => {
    expect(findProblems(mdxProse(`${post.slug}.mdx`))).toEqual([]);
  });

  each("$slug ships no TODO placeholder", (post) => {
    expect(postText(post)).not.toContain("TODO(");
    expect(mdxProse(`${post.slug}.mdx`)).not.toContain("TODO(");
  });

  /**
   * §10 wants one h1 per page. The page supplies it from the title, so a body
   * heading starts at h2 — see mdx-components.tsx.
   */
  each("$slug opens its body no higher than h2", (post) => {
    expect(mdxProse(`${post.slug}.mdx`)).not.toMatch(/^#\s/m);
  });

  /**
   * A dollar figure in the body needs the §7 disclaimer beside it, and the page
   * renders that from `citesResults`. The flag is the author's; this is what
   * catches them forgetting it before a reader does.
   */
  each("$slug flags citesResults when its body quotes a figure", (post) => {
    if (/\$\s?\d/.test(mdxProse(`${post.slug}.mdx`))) {
      expect(post.citesResults, `${post.slug} quotes a figure without citesResults`).toBe(true);
    }
  });
});

describe("scheduling", () => {
  const dated = (slug: string, publishedAt: string): Post => ({
    slug,
    title: `Post ${slug}`,
    description: "d",
    category: "negotiation",
    targetQuery: "q",
    answer: "a",
    publishedAt,
    faq: [],
    cta: { heading: "h", body: "b" },
    body: async () => ({ default: () => null }),
  });

  /** The boundary is the reason `now` is a parameter — a post goes live ON its date, not after it. */
  it("publishes a post dated today and withholds one dated tomorrow", () => {
    const now = new Date("2026-08-14T12:00:00Z");
    const posts = [dated("today", "2026-08-14"), dated("tomorrow", "2026-08-15")];

    const live = posts.filter((p) => p.publishedAt <= now.toISOString().slice(0, 10));
    expect(live.map((p) => p.slug)).toEqual(["today"]);
  });

  it("splits the real registry into published and scheduled with no overlap or loss", () => {
    const now = new Date();
    const live = publishedPosts(now).map((p) => p.slug);
    const pending = scheduledPosts(now).map((p) => p.slug);

    expect(live.filter((slug) => pending.includes(slug))).toEqual([]);
    expect(live.length + pending.length).toBe(POSTS.length);
  });

  it("never resolves a scheduled post by slug", () => {
    const now = new Date();
    for (const post of scheduledPosts(now)) {
      expect(postBySlug(post.slug, now)).toBeUndefined();
    }
  });

  it("keeps every published post reachable by slug", () => {
    const now = new Date();
    for (const post of publishedPosts(now)) {
      expect(postBySlug(post.slug, now)?.slug).toBe(post.slug);
    }
  });

  it("orders newest first, breaking same-day ties by slug", () => {
    const sorted = sortPosts([
      dated("b", "2026-01-01"),
      dated("a", "2026-01-01"),
      dated("c", "2026-06-01"),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(["c", "a", "b"]);
  });

  it("filters by category within what is published", () => {
    const now = new Date();
    for (const category of ["negotiation", "process"] as const) {
      for (const post of postsInCategory(category, now)) {
        expect(post.category).toBe(category);
      }
    }
  });
});

describe("dates", () => {
  it("reports updatedAt as last modified when set, and publishedAt otherwise", () => {
    const base = {
      slug: "s",
      title: "t",
      description: "d",
      category: "process" as const,
      targetQuery: "q",
      answer: "a",
      faq: [],
      cta: { heading: "h", body: "b" },
      body: async () => ({ default: () => null }),
    };
    expect(lastModified({ ...base, publishedAt: "2026-01-01" })).toBe("2026-01-01");
    expect(lastModified({ ...base, publishedAt: "2026-01-01", updatedAt: "2026-03-04" })).toBe(
      "2026-03-04",
    );
  });

  /** UTC, so the rendered byline never drifts a day from the date that gated publication. */
  it("formats a date without shifting it into another day", () => {
    expect(formatPostDate("2026-08-14")).toBe("August 14, 2026");
    expect(formatPostDate("2026-01-01")).toBe("January 1, 2026");
  });
});
