"use client";

import Image from "next/image";
import { useState } from "react";

import type { BrandImage } from "@/lib/images";

/**
 * A click-to-load YouTube embed.
 *
 * The page ships a static panel. Nothing is requested from YouTube until the
 * visitor asks for it, and then the player loads from `youtube-nocookie.com`.
 *
 * Both halves are deliberate:
 *
 * 1. **Performance.** A YouTube iframe pulls roughly a megabyte of third-party
 *    JavaScript on load. CLAUDE.md §10 sets Lighthouse ≥ 90 performance before
 *    launch, and one embed is enough to lose it.
 * 2. **Consent.** No third-party cookie is set on a page view. The consent
 *    question in /privacy-policy is settled for the three analytics vendors and
 *    still open with counsel generally (CLAUDE.md §7); a player that phoned home
 *    before anyone clicked would make it harder rather than easier.
 *
 * This is the only client component the video work adds. Everything else —
 * the registry, the copy, the structured data — renders on the server.
 */
export function VideoFacade({
  embedSrc,
  title,
  spokenLength,
  displayLength,
  poster,
}: {
  /** The `youtube-nocookie.com` URL, with autoplay already set. lib/video/index.ts. */
  embedSrc: string;
  /** The video's own title. Used for the iframe title and the button's name. */
  title: string;
  /** `1 minute 42 seconds`. Read aloud — never `1:42`, which is read as a clock time. */
  spokenLength: string;
  /** `1:42`. Shown, never announced. */
  displayLength: string;
  /**
   * The committed still. Optional: with no artwork the panel is typographic,
   * which is a finished state rather than a placeholder. See lib/video/types.ts.
   */
  poster?: BrandImage;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full border border-border bg-primary-deep">
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      /*
        The accessible name is set here rather than assembled from the panel
        below, so it stays one sentence however the panel is dressed. The panel
        is aria-hidden for the same reason: a screen reader should hear the
        action once, not the action plus a title plus a clock-shaped number.
      */
      aria-label={`Play the video: ${title}. ${spokenLength}.`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden border border-border bg-surface-sunken"
    >
      <span aria-hidden="true" className="absolute inset-0">
        {poster ? (
          <Image
            src={poster.src}
            alt=""
            sizes="(min-width: 768px) 62vw, calc(100vw - 3.5rem)"
            placeholder="blur"
            className="h-full w-full object-cover"
          />
        ) : (
          /*
            No still committed yet. Rather than hotlink a frame from
            i.ytimg.com, the panel carries the video's own title in the site's
            display face on its own ground. See lib/video/types.ts `poster`.
          */
          <span className="flex h-full w-full flex-col justify-end p-6 md:p-10">
            <span className="max-w-lg font-display text-2xl leading-snug text-balance md:text-3xl">
              {title}
            </span>
            <span className="mt-3 text-sm tabular-nums text-ink-muted">{displayLength}</span>
          </span>
        )}
      </span>

      {/*
        The play affordance. Ink on ivory, square-cornered, drawn from the same
        tokens as everything else.

        Deliberately not YouTube's red rounded rectangle. components/brand-photo.tsx
        is explicit that the imagery treatment is minimal and that gold never
        frames a photograph; a red play button would be the loudest object on
        any page it landed on, and it would be borrowed artwork besides.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="flex h-16 w-16 items-center justify-center border border-border-strong bg-surface transition-colors group-hover:bg-accent-soft">
          <svg viewBox="0 0 12 14" className="h-5 w-4 fill-ink" focusable="false">
            <path d="M0 0 L12 7 L0 14 Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
