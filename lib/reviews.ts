/**
 * Client reviews — the canonical dataset.
 *
 * ONE source of truth, many renderers. /reviews, the home page pair, the pillar
 * pages, and review JSON-LD all read from here. Nothing gets retyped into a
 * component: retyping is how a testimonial quietly drifts from what the client
 * actually wrote, and CLAUDE.md §7 forbids altering testimonial wording.
 *
 * `body` is verbatim. Typos, line breaks, and emphasis stay as posted. If a
 * review needs shortening to fit a layout, the layout is wrong.
 *
 * ---------------------------------------------------------------------------
 * Why this is a file and not a database
 *
 * Reviews are read-only, identical for every visitor, and change a few times a
 * month. There is no dynamic requirement, so these render at build time. Google
 * has no usable review API for this (Places returns at most five, truncated,
 * and its terms restrict storing them) and Zillow has none at all — so a "live"
 * integration is not on the table regardless.
 *
 * This shape is the eventual CMS document type. When Sanity or Payload lands
 * (CLAUDE.md §12), the fields move across unchanged and only the loader is
 * replaced. Keep it serializable: no JSX, no functions.
 * ---------------------------------------------------------------------------
 */

/** Where the review was posted. Attribution has to be accurate. */
export type ReviewPlatform = "google" | "zillow";

export type Review = {
  /**
   * Stable dedupe key: `platform-author-slug`. The same client often posts to
   * both Google and Zillow. Two entries are the same testimonial only if the
   * text matches; if she wrote different words on each platform they are
   * separate reviews and both may run, but never both on the same page.
   */
  id: string;
  /** Reviewer name exactly as it appears on the platform. */
  author: string;
  rating: 5;
  platform: ReviewPlatform;
  /**
   * The profile the review sits on. Some of hers are on the Stone Realty Group
   * page rather than her own, which changes nothing about attribution but does
   * mean the §5 review counts (42 Zillow / 62 Google) may be undercounting.
   */
  postedOn: string;
  /** ISO date. Platforms show relative times, so most of these are inferred. */
  date: string;
  /** `month` means the day is a guess from a relative timestamp. */
  datePrecision: "day" | "month";
  body: string;
  /**
   * True when the review states a specific dollar figure or financial outcome.
   * Any page rendering one of these must carry <ResultsDisclaimer /> adjacent.
   * CLAUDE.md §7.
   */
  statesDollarOutcome: boolean;
  /**
   * A material connection to Jasmine — family, employment, anything the FTC
   * endorsement guides would want disclosed. The disclosure lives inside the
   * verbatim text, which is why these must run whole and must never be pulled
   * as an excerpt: cropping the quote strips the disclosure.
   */
  materialConnection?: string;
  /** TODO(verify): permalink to the review. Needed before launch. */
  sourceUrl?: string;
  /**
   * Reviewer-attached photo, recorded for provenance only. DO NOT RENDER.
   * These are googleusercontent CDN URLs — unstable, hotlink-hostile, and the
   * photograph belongs to the reviewer, not to us. If she wants images beside
   * reviews, get written permission and self-host, or use her own photography.
   */
  photoSourceUrl?: string;
};

export const REVIEWS: readonly Review[] = [
  {
    id: "google-matthew-swecker",
    author: "Matthew Swecker",
    rating: 5,
    platform: "google",
    postedOn: "Stone Realty Group",
    date: "2026-08-09",
    datePrecision: "day",
    body: "Jasmine Garcia did an incredible job throughout my whole homebuying process. She was patient and informative while I narrowed my search and provided great insights when I zeroed in on what I was looking for. Never pushy, she wants you to love your home. Her most coveted skill is likely her ability to negotiate. In all, we negotiated about 30k in concessions, including a lower offer price and foundation work the house needed. I would highly recommend her!!",
    statesDollarOutcome: true,
    photoSourceUrl:
      "https://lh3.googleusercontent.com/grass-cs/ACvplmMowkJslVxgFNWlRyrC8D-CdTNzJLRxypYpmjzdlKVxDvUCM99N6ZJYJdTRhOibfV2JQMDTb0aUxLW-psvLC7Yea46DK5IeHUm1KJrEbEfbUsfrmixoAxRKHHSLv-iMUxDniA14rn8-eHst=s3758-w3758-h1696-rw",
  },
  {
    id: "google-josh-garcia",
    author: "Josh Garcia",
    rating: 5,
    platform: "google",
    postedOn: "Stone Realty Group",
    date: "2026-06-01",
    datePrecision: "month",
    body: "When it was time for my fiancée and I to make the leap into homeownership, there was no doubt we wanted to work with my sister, Jasmine Garcia. She was everything I had always heard she was as an agent and more. Jasmine is very knowledgeable about the home buying process, an excellent negotiator, and a great communicator. She always made herself available to answer our questions and never once made us feel overwhelmed or inexperienced during the process.\nFrom start to finish, she guided us every step of the way, helping us secure an amazing lender, homeowner’s insurance, and so much more. She made what could have been a stressful experience feel seamless and exciting, and I truly felt like I never had to worry about anything.\nThe best part was making it to the closing table without having to bring any additional money down and actually receiving a refund back. I truly cannot recommend Jasmine enough for any future homebuyers, especially first time buyers looking for someone they can fully trust and rely on throughout the entire process.",
    statesDollarOutcome: true,
    materialConnection: "Her brother. He discloses it himself in the first sentence.",
    photoSourceUrl:
      "https://lh3.googleusercontent.com/grass-cs/ACvplmMdw737shNqEY36JmQ24OS7_2UmxDiQqRDsAObGu3QpHcJTf85ZDgDsvbSYGw8fjj4wqrL_9zAxqOKI1F4Dc38FrY_xpHihFMR71Amy3cHNtd48OHyr6lVMLEiyUT4OFxfDQ3eVSPBSi-Y=s3758-w3758-h1696-rw",
  },
];

/** True when any review in the set requires the results disclaimer beside it. */
export function needsResultsDisclaimer(reviews: readonly Review[]): boolean {
  return reviews.some((review) => review.statesDollarOutcome);
}

/**
 * Reviews safe to pull as a short quote. A review carrying a disclosed material
 * connection is not — the disclosure is in the sentence, and an excerpt drops it.
 */
export function quotableReviews(reviews: readonly Review[]): Review[] {
  return reviews.filter((review) => !review.materialConnection);
}
