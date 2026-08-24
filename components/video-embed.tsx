import { SectionHeading } from "@/components/page-hero";
import { VideoFacade } from "@/components/video-facade";
import {
  embedUrl,
  formatDuration,
  spokenDuration,
  watchUrl,
  type Video,
  type VideoPlacement,
} from "@/lib/video";

/**
 * One video, on one page, in the copy written for that page.
 *
 * The reusable pattern. A page never composes a video block itself — it asks
 * lib/video for the placement registered against its route and hands it here,
 * so a new video is an entry in lib/video/data.ts and nothing else. That is the
 * point: the channel publishes irregularly and the site cannot be re-laid-out
 * every time it does.
 *
 * Server component. The only thing that runs on the client is the facade's
 * click handler.
 */
export function VideoEmbed({
  video,
  placement,
  className = "",
}: {
  video: Video;
  placement: VideoPlacement;
  /** Background and border, so the page keeps control of its own section rhythm. */
  className?: string;
}) {
  const facade = (
    <VideoFacade
      embedSrc={embedUrl(video, true)}
      title={video.title}
      spokenLength={spokenDuration(video.durationSeconds)}
      displayLength={formatDuration(video.durationSeconds)}
      poster={video.poster}
    />
  );

  /*
    The link out is not decoration. It is the escape hatch for anyone who would
    rather watch on YouTube — on a phone, in the app, with their own captions
    and playback speed — and it is the only route to the channel from this page.
  */
  const watchOnYouTube = (
    <a
      href={watchUrl(video)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block underline decoration-accent-soft decoration-1 underline-offset-4 hover:decoration-accent"
    >
      Watch on YouTube ({formatDuration(video.durationSeconds)})
      <span className="sr-only"> (opens an external site)</span>
    </a>
  );

  if (placement.variant === "card") {
    return (
      <section aria-labelledby={placement.id} className={className}>
        <p className="eyebrow">{placement.eyebrow}</p>
        <h2 id={placement.id} className="mt-3 font-display text-2xl leading-snug md:text-3xl">
          {placement.heading}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.2fr] sm:items-start">
          {facade}
          <div>
            <p className="text-base leading-relaxed">{placement.intro}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{video.summary}</p>
            <p className="mt-4 text-sm">{watchOnYouTube}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={placement.id} className={className}>
      <div className="mx-auto max-w-6xl px-gutter py-section">
        <SectionHeading eyebrow={placement.eyebrow} id={placement.id}>
          {placement.heading}
        </SectionHeading>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-start">
          {facade}

          <div className="max-w-md">
            <p className="text-lg leading-relaxed">{placement.intro}</p>
            {/*
              The summary is the accessibility answer and the SEO answer at once:
              it is what a visitor who will not press play reads, and it is the
              string VideoObject declares. lib/schema.tsx emits this same text —
              structured data describing something the page does not say is both
              a markup violation and an advertising claim nobody reviewed.
            */}
            <p className="mt-5 text-base leading-relaxed text-ink-muted">{video.summary}</p>
            <p className="mt-6 text-base">{watchOnYouTube}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
