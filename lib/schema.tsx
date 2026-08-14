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

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
