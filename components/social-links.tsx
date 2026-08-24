import { SOCIAL } from "@/lib/site";

/**
 * The only social surfaces on the site: links out, in her own words' place.
 *
 * Text, no glyphs. The footer asserts it draws no `<svg>` of its own
 * (tests/compliance.test.tsx §7) and the EHO and REALTOR® marks beside it are
 * text under the 2026-08-10 BIC approval, so a pair of brand icons here would be
 * the only borrowed artwork on the page. See lib/site.ts SOCIAL for why neither
 * feed is embedded.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <p className={className}>
      <span className="text-ink-muted">Follow along on </span>
      <a
        href={SOCIAL.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-accent-soft decoration-1 underline-offset-4 hover:decoration-accent"
      >
        Instagram, {SOCIAL.instagram.handle}
        <span className="sr-only"> (opens an external site)</span>
      </a>
      <span className="text-ink-muted"> or </span>
      <a
        href={SOCIAL.facebook.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-accent-soft decoration-1 underline-offset-4 hover:decoration-accent"
      >
        Facebook
        <span className="sr-only"> (opens an external site)</span>
      </a>
      <span className="text-ink-muted">.</span>
    </p>
  );
}
