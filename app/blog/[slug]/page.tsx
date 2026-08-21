import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero, SectionHeading } from "@/components/page-hero";
import { ClosingCta } from "@/components/phone-cta";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import {
  POST_CATEGORIES,
  formatPostDate,
  lastModified,
  postBySlug,
  publishedPosts,
} from "@/lib/blog";
import { postText, showsDollarFigure } from "@/lib/blog/validate";
import { JsonLd, blogPostingSchema, faqPageSchema } from "@/lib/schema";
import { PILLARS } from "@/lib/site";

/*
  /blog/[slug] — one post.

  Structure is the AEO argument. The question is the h1, the answer is the first
  thing under it in full, and the body elaborates rather than builds up to a
  reveal. An answer engine quoting this site quotes that block or an FAQ entry;
  a post that withholds its answer for six paragraphs is a post that never gets
  cited. The reader gets the same deal, which is the point.

  Scheduling: publishedPosts() hides a future-dated post, so generateStaticParams
  does not prerender it and it is absent from the sitemap. `dynamicParams` is
  left on so that when its date arrives the route renders on demand instead of
  404ing until someone redeploys, and `revalidate` expires the listing and
  sitemap on the same clock. docs/CONTENT-MARKETING.md.
*/

export const revalidate = 3600;

/** A scheduled post must be able to render the hour it goes live, so unknown slugs are allowed through to notFound(). */
export const dynamicParams = true;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: lastModified(post),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const { default: Body } = await post.body();
  const pillar = PILLARS.find((p) => p.href === post.pillar);
  const needsDisclaimer = post.citesResults || showsDollarFigure(postText(post));

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd data={faqPageSchema(post)} />

      <PageHero
        eyebrow={POST_CATEGORIES[post.category].label}
        title={post.title}
        lede={post.answer}
      >
        <p className="mt-8 text-sm text-ink-muted">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          {post.updatedAt ? (
            <>
              {" · Updated "}
              <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
            </>
          ) : null}
        </p>
      </PageHero>

      <article className="mx-auto max-w-3xl px-gutter py-section">
        <Body />

        {needsDisclaimer ? <ResultsDisclaimer className="mt-14" /> : null}

        {pillar ? (
          <p className="rule-top mt-14 pt-8 text-base leading-relaxed text-ink-muted">
            {pillar.table}{" "}
            <Link
              href={pillar.href}
              className="decoration-accent-soft decoration-1 underline-offset-4 hover:underline"
            >
              More on {pillar.title.toLowerCase()}
            </Link>
            .
          </p>
        ) : null}
      </article>

      <section
        aria-labelledby="faq"
        className="border-y border-border bg-surface-raised py-section"
      >
        <div className="mx-auto max-w-3xl px-gutter">
          <SectionHeading eyebrow="Asked and answered" id="faq">
            The follow-up questions.
          </SectionHeading>

          <div className="mt-14 space-y-10">
            {post.faq.map((entry) => (
              <article key={entry.question} className="rule-top pt-8">
                <h3 className="font-display text-2xl leading-snug md:text-3xl">{entry.question}</h3>
                <p className="mt-4 text-base leading-relaxed text-ink-muted">{entry.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta
        heading={post.cta.heading}
        body={post.cta.body}
        placement={`closing-blog-${post.slug}`}
        intake={{
          source: `/blog/${post.slug}`,
          heading: "Ask about your own situation.",
          body: "What you’re looking at, and which side of it you’re on. She’ll take it from there.",
        }}
      />
    </>
  );
}
