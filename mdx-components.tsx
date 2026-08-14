import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * How MDX prose renders. Next looks for this file at the project root.
 *
 * Post bodies are plain markdown — headings, paragraphs, lists, blockquotes,
 * links. The styling lives here rather than in the posts so that a writer never
 * touches a class name and every post is typographically identical. CLAUDE.md §4:
 * Tailwind utilities and design tokens only, no inline styles.
 *
 * Two rules are load-bearing beyond looks:
 *
 * - No `h1`. The page supplies the single `<h1>` from the post title in
 *   lib/blog/data.ts, so a body heading starts at `h2`. CLAUDE.md §10 wants one
 *   `h1` per page and tests/compliance.test.tsx fails the build on a second one.
 * - `blockquote` is exempt from the banned-language and claim scanning in
 *   tests/compliance.test.tsx, matching how testimonials are treated site-wide.
 *   Quote a client or a contract in one; never park our own copy there to duck
 *   a rule.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="mt-16 font-display text-3xl leading-tight md:text-4xl scroll-mt-24"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mt-12 font-display text-2xl leading-snug md:text-3xl scroll-mt-24" {...props} />
    ),
    p: (props) => <p className="mt-5 text-base leading-relaxed text-ink-muted" {...props} />,
    ul: (props) => (
      <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink-muted" {...props} />
    ),
    ol: (props) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-5 text-base leading-relaxed text-ink-muted"
        {...props}
      />
    ),
    li: (props) => <li className="pl-1" {...props} />,
    strong: (props) => <strong className="font-medium text-ink" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="rule-gold mt-10 pt-6 font-display text-2xl leading-snug md:text-3xl"
        {...props}
      />
    ),
    hr: () => <hr className="mt-14 border-border" />,
    /* Internal links route through next/link; external ones stay anchors. */
    a: ({ href = "", ...props }) =>
      href.startsWith("/") ? (
        <Link
          href={href}
          className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
          {...props}
        />
      ) : (
        <a
          href={href}
          rel="noopener noreferrer"
          className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
          {...props}
        />
      ),
    ...components,
  };
}
