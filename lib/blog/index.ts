import { POSTS } from "./data";
import type { Post, PostCategory } from "./types";

export { POSTS } from "./data";
export { POST_CATEGORIES } from "./types";
export type { Post, PostCategory, PostFaq } from "./types";

/**
 * Posts that are live as of `now`.
 *
 * Everything the public can reach routes through this: the listing, the
 * sitemap, generateStaticParams, and the compliance suite. A post dated in the
 * future exists in the repo and is unreachable on the site — that is how a batch
 * of drafts becomes a weekly cadence without anyone logging in on a Tuesday.
 *
 * `now` is a parameter so the tests can assert the boundary instead of waiting
 * for a date to pass.
 */
export function publishedPosts(now: Date = new Date()): readonly Post[] {
  const today = toIsoDate(now);
  return sortPosts(POSTS.filter((post) => post.publishedAt <= today));
}

/** Written, dated forward, not yet live. Nothing renders these; they surface in tests and tooling. */
export function scheduledPosts(now: Date = new Date()): readonly Post[] {
  const today = toIsoDate(now);
  return sortPosts(POSTS.filter((post) => post.publishedAt > today));
}

export function postBySlug(slug: string, now: Date = new Date()): Post | undefined {
  return publishedPosts(now).find((post) => post.slug === slug);
}

export function postsInCategory(category: PostCategory, now: Date = new Date()): readonly Post[] {
  return publishedPosts(now).filter((post) => post.category === category);
}

/** Newest first; slug breaks a same-day tie so ordering is stable across builds. */
export function sortPosts(posts: readonly Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

/** The date a crawler should treat as current for this post. */
export function lastModified(post: Post): string {
  return post.updatedAt ?? post.publishedAt;
}

/**
 * `YYYY-MM-DD` in UTC.
 *
 * Deliberately not the visitor's local date. Comparing an authored date string
 * against a locale-shifted one makes a post go live a few hours early or late
 * depending on where the build ran, and Vercel's build region is not something
 * this repo controls.
 */
function toIsoDate(now: Date): string {
  return now.toISOString().slice(0, 10);
}

/** Long form, UTC, for the byline. `2026-08-14` → `August 14, 2026`. */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
