import { MARKETS } from "@/lib/areas";
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
    /* Ties this domain to the profiles she has actually been posting from,
       which is what sameAs is for. Zillow matters more than Instagram here:
       Locked Decision #1 keeps all MLS data off this domain, so the profile
       holding most of her reviews is one of the few strong external signals
       the site can send. All three URLs are confirmed against CLAUDE.md §6.

       The §5 review counts are a separate open item (§12) and are still
       believed low — adding the profile here does not settle them. */
    sameAs: [SOCIAL.instagram.url, SOCIAL.facebook.url, SOCIAL.zillow.url],
    /* Derived from the §5 roster rather than restated. The hand-written list
       this replaces had already drifted — it was missing LoSo and Uptown, and
       stayed missing Rock Hill after §5 gained it. Two copies of the same
       facts is one copy too many.

       Charlotte leads because it is the metro these sit inside, and is not a
       market entry of its own. Lake Wylie's postal city is deliberately not
       added: "Clover, SC" here would assert she serves that town, which she
       does not — the note belongs on /areas, for a reader, not in structured
       data as a coverage claim. */
    areaServed: [
      "Charlotte, NC",
      ...MARKETS.map((market) => `${market.name}, ${market.state}`),
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
  return faqSchema(post.faq);
}

/**
 * The same FAQPage, from any question/answer pair.
 *
 * Area pages carry an FAQ for the same reason posts do, and there is no reason
 * for two implementations of one schema to drift apart.
 */
export function faqSchema(entries: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/**
 * BreadcrumbList for a page one level below a hub.
 *
 * Worth having now that /areas exists: it tells a crawler the hub is the parent
 * of fifteen possible children rather than an unrelated page, and it is what
 * produces the Home > Areas > Steele Creek trail in a result.
 */
export function breadcrumbSchema(trail: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
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
