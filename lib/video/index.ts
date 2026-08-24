import { VIDEOS } from "./data";
import type { Video, VideoPlacement } from "./types";

export { VIDEOS } from "./data";
export { VIDEO_PILLARS } from "./types";
export type { Video, VideoPillar, VideoPlacement } from "./types";

/**
 * The privacy-preserving embed host. No cookie is set until playback starts,
 * and components/video-embed.tsx does not load this until the visitor clicks.
 *
 * Both halves matter. `youtube-nocookie.com` is what keeps a first page view
 * from setting a third-party cookie while the consent question in
 * /privacy-policy is still with counsel (CLAUDE.md §7), and the facade is what
 * keeps roughly a megabyte of player JavaScript off a page that has to clear
 * Lighthouse ≥ 90 (§10).
 */
const EMBED_HOST = "https://www.youtube-nocookie.com/embed";

/**
 * Videos live as of `now`.
 *
 * Everything public routes through this, on the same pattern as
 * publishedPosts() in lib/blog/index.ts: a video dated forward is registered and
 * unreachable, so a placement can be written and reviewed before the video is
 * public. `now` is a parameter so tests can assert the boundary.
 */
export function publishedVideos(now: Date = new Date()): readonly Video[] {
  const today = toIsoDate(now);
  return sortVideos(VIDEOS.filter((video) => video.publishedAt <= today));
}

/** Newest first; slug breaks a same-day tie so ordering is stable across builds. */
export function sortVideos(videos: readonly Video[]): Video[] {
  return [...videos].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

/**
 * The one video a route shows, with the copy written for that route.
 *
 * At most one, always — lib/video/index.test.ts fails the build on a second. A
 * page with two videos has decided nothing, and the reader has to choose
 * something they cannot evaluate without watching both.
 */
export function videoForRoute(
  route: string,
  now: Date = new Date(),
): { video: Video; placement: VideoPlacement } | undefined {
  for (const video of publishedVideos(now)) {
    const placement = video.placements.find((p) => p.route === route);
    if (placement) return { video, placement };
  }
  return undefined;
}

/** True when this route is the video's canonical home, and so emits VideoObject. */
export function isPrimaryPlacement(placement: VideoPlacement): boolean {
  return placement.primary === true;
}

export function watchUrl(video: Video): string {
  return `https://www.youtube.com/watch?v=${video.id}`;
}

/** `?rel=0` keeps the end screen on her own channel rather than a competitor's. */
export function embedUrl(video: Video, autoplay = false): string {
  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  if (autoplay) params.set("autoplay", "1");
  return `${EMBED_HOST}/${video.id}?${params.toString()}`;
}

/**
 * The image URL declared to crawlers. Google requires one on VideoObject.
 *
 * Prefers the committed still, so that what the page shows and what the markup
 * declares are the same file. Falls back to YouTube's own thumbnail for the
 * video, which is the correct answer while no still has been committed — it is
 * the image YouTube itself serves for this ID, so the two cannot disagree.
 *
 * Nothing on the page requests this URL. It is a string in JSON-LD.
 */
export function thumbnailUrl(video: Video, siteUrl: string): string {
  return video.poster
    ? `${siteUrl}${video.poster.src.src}`
    : `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;
}

/** ISO 8601, for VideoObject `duration`. 102 → `PT1M42S`. */
export function isoDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `PT${minutes > 0 ? `${minutes}M` : ""}${rest > 0 || minutes === 0 ? `${rest}S` : ""}`;
}

/** For the eye. 102 → `1:42`. */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * For a screen reader. 102 → `1 minute 42 seconds`.
 *
 * `1:42` is read aloud as a time of day by some screen readers, which is both
 * wrong and confusing next to a play button. CLAUDE.md §10.
 */
export function spokenDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  const parts: string[] = [];
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  if (rest > 0) parts.push(`${rest} second${rest === 1 ? "" : "s"}`);
  return parts.join(" ");
}

/** `YYYY-MM-DD` in UTC. Same reasoning as lib/blog/index.ts — never the visitor's date. */
function toIsoDate(now: Date): string {
  return now.toISOString().slice(0, 10);
}
