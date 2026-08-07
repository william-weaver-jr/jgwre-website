/**
 * Single source of truth for the facts that appear across the site.
 *
 * Compliance-critical values live here so they cannot drift between pages.
 * Do not inline any of these in a component. See CLAUDE.md §7.
 */

export const SITE_URL = "https://jasminegarcia.com";

export const AGENT = {
  name: "Jasmine Garcia",
  title: "Broker / REALTOR®",
  /** Follow Up Boss tracking number. Confirmed. CLAUDE.md Locked Decision #6. */
  phoneDisplay: "(704) 200-9360",
  phoneHref: "tel:+17042009360",
  email: "TODO(verify)",
} as const;

/**
 * Brokerage identification. North Carolina requires this in a broker's
 * advertising and South Carolina has an equivalent rule. It must appear on
 * every page, and nothing may imply she operates independently.
 */
export const BROKERAGE = {
  name: "Stone Realty Group",
  street: "2459 Wilkinson Blvd, Suite 310",
  city: "Charlotte",
  state: "NC",
  zip: "28208",
  licenses: [
    { state: "NC", number: "334700" },
    { state: "SC", number: "125546" },
  ],
} as const;

/**
 * "Search Homes" points at the existing Stone Realty Group IDX — zero compliance
 * surface, no MLS data on this domain. CLAUDE.md Locked Decision #2.
 */
// TODO(verify): replace with the exact Stone Realty Group IDX search URL.
export const SEARCH_HOMES_URL = "https://mattstoneteam.com";

/**
 * Required adjacent to any page showing specific dollar outcomes. Body-text
 * weight and color — never a footnote, never small gray type.
 * Exact wording from docs/CASE-STUDIES.md. BIC must approve before launch.
 */
export const RESULTS_DISCLAIMER =
  "Results vary by property, seller, and market conditions. Past transaction outcomes are not a prediction or guarantee of results in any future transaction.";

/**
 * TCPA consent. Carried over verbatim from the team site.
 * Do not reword, shorten, or pre-check the associated checkbox. CLAUDE.md §7.
 */
export const TCPA_CONSENT =
  "I agree to be contacted by Stone Realty Group via call, email, and text for real estate services. To opt out, you can reply 'stop' at any time or reply 'help' for assistance. You can also click the unsubscribe link in the emails. Message and data rates may apply. Message frequency may vary.";
