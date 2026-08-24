import { MARKETS } from "@/lib/areas";
import { lastModified } from "@/lib/blog";
import type { Post } from "@/lib/blog";
import { PHOTOS, imageObject } from "@/lib/images";
import { AGENT, BROKERAGE, SITE_URL, SOCIAL } from "@/lib/site";
import { embedUrl, isoDuration, thumbnailUrl, watchUrl } from "@/lib/video";
import type { Video } from "@/lib/video";

/**
 * Stable node identifiers.
 *
 * Without these, every schema on the site emits an anonymous node, and a
 * consumer has no way to know that the author of a blog post, the author of the
 * video, and the subject of the home page are one person rather than three
 * people who share a name. Given how common her name is, that is not a
 * theoretical concern — see the note on `personSchema()` below.
 */
export const PERSON_ID = `${SITE_URL}/#jasmine-garcia`;
export const BROKERAGE_ID = `${SITE_URL}/#brokerage`;

/**
 * The brokerage, defined once.
 *
 * It was written out four times in this file and the copies had already begun
 * to differ in shape. Now `parentOrganization`, `worksFor`, and `publisher` all
 * name the same node, and a consumer resolving `@id` sees one organization
 * rather than four that happen to share an address.
 */
function brokerageNode() {
  return {
    "@type": "RealEstateAgent",
    "@id": BROKERAGE_ID,
    name: BROKERAGE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: BROKERAGE.street,
      addressLocality: BROKERAGE.city,
      addressRegion: BROKERAGE.state,
      postalCode: BROKERAGE.zip,
      addressCountry: "US",
    },
  };
}

/**
 * JSON-LD for the homepage. Her, as one entity.
 *
 * ---------------------------------------------------------------------------
 * Why this node carries two types
 *
 * It used to be `RealEstateAgent` alone, which describes a practice but never
 * says a human being is involved. The obvious fix — a second `Person` node —
 * is worse than it looks: two nodes carrying the same name and the same phone
 * number assert that two entities exist, which is the opposite of what this
 * markup is for. So there is one node, typed as both.
 *
 * The reason it matters here more than it would on most agent sites is that
 * "Jasmine Garcia" is a heavily contested name. A search for it returns a
 * dancer, an author, and a designer before it returns a Charlotte broker. An
 * answer engine resolving the name has several well-linked candidates, and
 * repeating her name in copy does nothing to help it choose — this is a graph
 * problem, not a density problem. What actually disambiguates her is the pair
 * of licence numbers in `hasCredential`, which are unique and publicly
 * verifiable, plus `worksFor` and `sameAs`.
 *
 * `parentOrganization` and `worksFor` both point at the brokerage because each
 * is the type-appropriate property for one of the two types. Neither is
 * decoration: CLAUDE.md §7 forbids any implication that she operates
 * independently, and adding `Person` makes this node read less like a firm than
 * it did before, not more.
 *
 * DELIBERATELY ABSENT: `award`. §5 documents three recognitions, and none of
 * them belongs here. Two are internal Stone Realty Group awards whose scope has
 * to be stated in words to be honest, and schema.org `award` has nowhere to put
 * a scope. The third is a *nomination*, and an `award` field asserting it would
 * claim a win she has not been given. Structured data is advertising; the same
 * rules apply. See RECOGNITION in lib/site.ts.
 * ---------------------------------------------------------------------------
 */
export function realEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "RealEstateAgent"],
    "@id": PERSON_ID,
    name: AGENT.name,
    jobTitle: AGENT.title,
    telephone: AGENT.phoneDisplay,
    url: SITE_URL,
    /* Factual and documented, in the register of BRAND-VOICE.md rather than the
       register of a meta description. No statistic appears here on purpose:
       every figure in §5 is a separate claim, they are already known to be out
       of date (§12), and a number in structured data is a number nobody reviews
       again. */
    description: `${AGENT.name} is a ${AGENT.title} with ${BROKERAGE.name}, licensed in North Carolina and South Carolina, representing buyers and sellers across Charlotte and the NC/SC border.`,
    /* The same photograph the home page hero shows. Dimensions come free from
       the static import — the second reason lib/images.ts exists. */
    image: { "@type": "ImageObject", ...imageObject(PHOTOS.portraitWarm, SITE_URL) },
    /* Practice areas, not expertise claims. Every entry maps to a documented
       pillar in §5 — new construction (17 closings), relocation (18), the
       NC/SC border (12 in the Fort Mill corridor), and the seller side. Do not
       add a topic here that §5 does not support; this is the same rule that
       governs copy, and structured data is not exempt from it. */
    knowsAbout: [
      "Real estate negotiation",
      "New construction representation",
      "Relocation to Charlotte, North Carolina",
      "North Carolina and South Carolina real estate",
      "Seller representation",
      "Buyer representation",
    ],
    worksFor: { "@id": BROKERAGE_ID },
    /* Ties this domain to the profiles she has actually been posting from,
       which is what sameAs is for. Zillow matters more than Instagram here:
       Locked Decision #1 keeps all MLS data off this domain, so the profile
       holding most of her reviews is one of the few strong external signals
       the site can send. All three URLs are confirmed against CLAUDE.md §6.

       The §5 review counts are a separate open item (§12) and are still
       believed low — adding the profile here does not settle them. */
    sameAs: [
      SOCIAL.instagram.url,
      SOCIAL.facebook.url,
      SOCIAL.zillow.url,
      SOCIAL.youtube.url,
      /* Named here and nowhere else on the site — it is corroboration, not a
         surface. The display name differs there; lib/site.ts says why that is
         not a problem and why `alternateName` is still not set. */
      SOCIAL.linkedin.url,
    ],
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
    parentOrganization: brokerageNode(),
    /* The strongest disambiguator on the page. A licence number is unique,
       publicly checkable against the state commission, and belongs to exactly
       one person — which is more than can be said for the name. */
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
    /* Carries `@id` so this is the same person the home page describes, rather
       than a second Jasmine Garcia who happens to work at the same brokerage.
       The descriptive fields stay: a consumer that reads only this page's
       markup still gets a complete author, and one that reads both resolves
       them into one node. */
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AGENT.name,
      jobTitle: AGENT.title,
      url: SITE_URL,
      worksFor: { "@id": BROKERAGE_ID },
    },
    publisher: brokerageNode(),
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

/**
 * VideoObject for one video, emitted on its primary placement only.
 *
 * Two rules travel with this, and both are the same rule the FAQ schema above
 * states: what is declared here is rendered on the page in the same words, and
 * it is emitted once.
 *
 * `description` is `video.summary` — the string components/video-embed.tsx puts
 * on screen. Declaring a description a visitor cannot see is a structured-data
 * violation, and on a licensed broker's site it is also an advertising claim
 * nobody reviewed. The YouTube description is never used: it is written for a
 * different reader and, on the home tour, opens with language
 * docs/BRAND-VOICE.md bans outright.
 *
 * `author` is her as a Person and `publisher` is the brokerage, matching
 * blogPostingSchema above. That split is the §7 requirement, not an SEO nicety —
 * naming jasminegarcia.com as the publisher of its own video would assert this
 * domain is a firm. The video is hosted on her channel; `publisher` describes
 * who is advertising, which is Stone Realty Group either way.
 *
 * Only the placement marked `primary` in lib/video/data.ts calls this. The same
 * VideoObject on two URLs invites a crawler to pick the wrong canonical, and the
 * pages are not duplicates it could resolve between — they each host one asset.
 */
export function videoObjectSchema(video: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.summary,
    thumbnailUrl: [thumbnailUrl(video, SITE_URL)],
    uploadDate: video.publishedAt,
    duration: isoDuration(video.durationSeconds),
    embedUrl: embedUrl(video),
    url: watchUrl(video),
    /* Carries `@id` so this is the same person the home page describes, rather
       than a second Jasmine Garcia who happens to work at the same brokerage.
       The descriptive fields stay: a consumer that reads only this page's
       markup still gets a complete author, and one that reads both resolves
       them into one node. */
    author: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AGENT.name,
      jobTitle: AGENT.title,
      url: SITE_URL,
      worksFor: { "@id": BROKERAGE_ID },
    },
    publisher: brokerageNode(),
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
