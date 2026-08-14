import { lastModified } from "@/lib/blog";
import type { Post } from "@/lib/blog";
import { AGENT, BROKERAGE, SITE_URL, SOCIAL } from "@/lib/site";

/**
 * JSON-LD for the homepage. RealEstateAgent + the brokerage as the parent
 * organization — the structured data must not imply she is an independent firm.
 * CLAUDE.md §11.
 */
export function realEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: AGENT.name,
    jobTitle: AGENT.title,
    telephone: AGENT.phoneDisplay,
    url: SITE_URL,
    /* Ties this domain to the profile she has actually been posting from, which
       is what sameAs is for. Zillow belongs here too once §5's review counts are
       re-pulled and the profile URL is confirmed against CLAUDE.md §6. */
    sameAs: [SOCIAL.instagram.url],
    areaServed: [
      "Charlotte, NC",
      "Ballantyne, NC",
      "SouthPark, NC",
      "Steele Creek, NC",
      "Myers Park, NC",
      "Dilworth, NC",
      "South End, NC",
      "Pineville, NC",
      "Fort Mill, SC",
      "Tega Cay, SC",
      "Indian Land, SC",
      "Lake Wylie, SC",
      "Waxhaw, NC",
    ],
    parentOrganization: {
      "@type": "RealEstateAgent",
      name: BROKERAGE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: BROKERAGE.street,
        addressLocality: BROKERAGE.city,
        addressRegion: BROKERAGE.state,
        postalCode: BROKERAGE.zip,
        addressCountry: "US",
      },
    },
    hasCredential: BROKERAGE.licenses.map((l) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Real Estate License",
      recognizedBy: { "@type": "Organization", name: `${l.state} Real Estate Commission` },
      identifier: l.number,
    })),
  };
}

/**
 * BlogPosting for one post.
 *
 * `author` is her as a Person and `publisher` is the brokerage. That split is a
 * compliance requirement, not an SEO nicety: structured data naming
 * jasminegarcia.com as the publisher of its own content would assert that this
 * domain is a firm, which CLAUDE.md §7 forbids in every other surface too.
 *
 * `dateModified` falls back to `datePublished` rather than to build time.
 * Stamping every post as freshly modified on each deploy is a lie a crawler can
 * check, and it teaches it to ignore the field.
 */
export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: lastModified(post),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    author: {
      "@type": "Person",
      name: AGENT.name,
      jobTitle: AGENT.title,
      url: SITE_URL,
      worksFor: { "@type": "RealEstateAgent", name: BROKERAGE.name },
    },
    publisher: {
      "@type": "RealEstateAgent",
      name: BROKERAGE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: BROKERAGE.street,
        addressLocality: BROKERAGE.city,
        addressRegion: BROKERAGE.state,
        postalCode: BROKERAGE.zip,
        addressCountry: "US",
      },
    },
  };
}

/**
 * FAQPage from a post's `faq` entries — the AEO surface.
 *
 * Every answer here is rendered on the page in the same words. Emitting an
 * answer a visitor cannot see is both a structured-data violation and, on a
 * licensed broker's site, an advertising claim nobody reviewed.
 */
export function faqPageSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
