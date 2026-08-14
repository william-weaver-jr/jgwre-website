import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { POST_CATEGORIES, formatPostDate, publishedPosts } from "@/lib/blog";
import type { PostCategory } from "@/lib/blog";
import { GUIDE_TITLE } from "@/lib/intake";

/*
  /blog — the listing.

  Two categories, both extensions of the USP: what is askable, and how the
  process actually works. No market updates and no neighborhood posts;
  docs/CONTENT-PLAN.md rules out the first and lib/areas owns the second.

  lib/blog/data.ts is empty, so today this page renders its own empty state
  rather than a grid of nothing. That is deliberate — the route resolves, the
  pipeline is provably wired, and no placeholder post ships to make it look
  populated.

  Revalidation, not a redeploy, is what makes a scheduled post appear. See the
  note in app/blog/[slug]/page.tsx.
*/

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "What's askable",
  description:
    "Notes on what is negotiable in a real estate transaction, and how the process actually works. Written for the person who has done this once.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = publishedPosts();
  const categories = Object.keys(POST_CATEGORIES) as PostCategory[];

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title={
          <>
            The other side of the table
            <span className="block italic">has read all of this already.</span>
          </>
        }
        lede="Short pieces on what is negotiable, when it is negotiable, and how a transaction actually runs. No market roundups — those date in a month and every agent publishes them."
      />

      {posts.length === 0 ? (
        <section aria-labelledby="empty" className="mx-auto max-w-6xl px-gutter py-section">
          <SectionHeading eyebrow="Nothing published yet" id="empty">
            The first posts are being written.
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            Until then, {GUIDE_TITLE.toLowerCase()} covers the ground these posts will
            expand on, one lever at a time.{" "}
            <Link
              href="/negotiation"
              className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
            >
              Read it here
            </Link>
            .
          </p>
        </section>
      ) : (
        categories.map((category) => {
          const inCategory = posts.filter((post) => post.category === category);
          if (inCategory.length === 0) return null;

          return (
            <section
              key={category}
              aria-labelledby={category}
              className="mx-auto max-w-6xl px-gutter py-section"
            >
              <SectionHeading eyebrow={POST_CATEGORIES[category].label} id={category}>
                {POST_CATEGORIES[category].blurb}
              </SectionHeading>

              <div className="mt-14 space-y-10">
                {inCategory.map((post) => (
                  <article key={post.slug} className="rule-top pt-8">
                    <p className="eyebrow">
                      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                      {post.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}

      <ClosingCta
        heading="A question these do not answer?"
        body="The specific one about your specific house is the one worth asking out loud. Ten minutes on the phone covers more than any post can."
        placement="closing-blog"
        intake={{
          source: "/blog",
          heading: "Ask it here instead.",
          body: "What you are looking at, and whether you are buying or selling. Then your details.",
        }}
      />
    </>
  );
}
