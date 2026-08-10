/**
 * Client reviews — the canonical dataset.
 *
 * ONE source of truth, many renderers. /reviews, the home page pair, the pillar
 * pages, and review JSON-LD all read from here. Nothing gets retyped into a
 * component: retyping is how a testimonial quietly drifts from what the client
 * actually wrote, and CLAUDE.md §7 forbids altering testimonial wording.
 *
 * `body` is verbatim. Typos, capitalization, line breaks, and the occasional
 * banned-by-our-styleguide phrase all stay as posted — those are the client's
 * words, not ours. If a review needs shortening to fit a layout, the layout is
 * wrong.
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
 *
 * Names: `author` records the byline exactly as posted, because that is what
 * makes a review verifiable against the platform. The site never prints it.
 * `displayName()` renders first name + last initial — enough to read as a real
 * person, not enough to be a findable identification of a client's address.
 * Attribution is not testimonial wording, so shortening it is not a §7 edit.
 */

/** Where the review was posted. Attribution has to be accurate. */
export type ReviewPlatform = "google" | "zillow";

/**
 * Zillow's own generated transaction line ("Bought a Single Family home in 2022
 * in Montclaire, Charlotte, NC"). Platform metadata, not the client's words, so
 * it is stored structured and capitalization is normalized.
 *
 * Useful beyond decoration: it is what lets a pillar or area page pull the
 * reviews that actually match its argument.
 */
export type ReviewTransaction = {
  role: "bought" | "sold" | "bought and sold";
  propertyType: "Single Family" | "Townhouse";
  year: number;
  /** Neighborhood, city, state as applicable. */
  location: string;
};

export type Review = {
  /**
   * Stable dedupe key: `platform-author-slug`. The same client often posts to
   * both Google and Zillow. Two entries are the same testimonial only if the
   * text matches; if she wrote different words on each platform they are
   * separate reviews and both may run, but never both on the same page.
   */
  id: string;
  /** Byline exactly as posted. Never rendered — use `displayName()`. */
  author: string;
  rating: 5;
  platform: ReviewPlatform;
  /**
   * The profile the review sits on. Some of hers are on the Stone Realty Group
   * page rather than her own, which changes nothing about attribution but does
   * mean the §5 review counts (42 Zillow / 62 Google) may be undercounting.
   */
  postedOn: string;
  /** ISO date. Zillow prints exact dates; Google shows relative times. */
  date: string;
  /** `month` means the day is a guess from a relative timestamp. */
  datePrecision: "day" | "month";
  transaction?: ReviewTransaction;
  body: string;
  /**
   * True when the review states a specific dollar figure or financial outcome.
   * Any page rendering one of these must carry <ResultsDisclaimer /> adjacent.
   * CLAUDE.md §7.
   */
  statesDollarOutcome: boolean;
  /**
   * A material connection to Jasmine — family, employment, anything the FTC
   * endorsement guides would want disclosed. Where the disclosure lives inside
   * the verbatim text, the review must run whole and must never be pulled as an
   * excerpt: cropping the quote strips the disclosure.
   */
  materialConnection?: string;
  /**
   * Blocks publication until answered. `publishableReviews()` filters these out,
   * so an unresolved review can sit in the dataset without risk of shipping.
   */
  openQuestion?: string;
  /** TODO(verify): permalink to the review. Wanted before launch. */
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
  // ------------------------------------------------------------------ ZILLOW
  {
    id: "zillow-brittany-turner",
    author: "Brittany turner",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-01-31",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Townhouse",
      year: 2022,
      location: "Oxford Hunt, Charlotte, NC",
    },
    body: "We used Jasmine for our first home purchase and she was excellent!! She was extremely responsive and helpful with all the plot twists that occur during the home buying process. She was also able to help us negotiate through crazy market prices and secure our home with multiple offers in. Would highly recommend using her if you’re looking to buy a new home.",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-mckenna-jahns",
    author: "McKenna Jahns",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-02-24",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Montclaire, Charlotte, NC",
    },
    body: "Jasmine was amazing! She was extremely quick to respond, answered all the questions I had as a first time home buyer, and advocated for me to ensure the process moved extremely smoothly. Would absolutely recommend her to anyone looking to purchase a home!",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-saquanna-carter",
    author: "Saquanna Carter",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-04-08",
    datePrecision: "day",
    transaction: {
      role: "sold",
      propertyType: "Single Family",
      year: 2022,
      location: "Coulwood West, Charlotte, NC",
    },
    body: "I am glad we crossed paths with Jasmine. She helped me and my husband find our first brand new home!! Promised to help us find a home and she did. Kept a open line of communication and checked in often. I would recommend her to anyone who is looking for their dream home.",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-harrist245034",
    author: "harrist245034",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-04-30",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Coulwood West, Charlotte, NC",
    },
    body: "Jasmine was amazing throughout our entire home buying process. Our closing process was extended due to the home being new construction but Jasmine and her team did such a great job keeping us up to date with all necessary information at all times. There was a minor issue towards closing that was handled very well by Jasmine and the rest of the Matt Stone team that we are very appreciative for. We would 100% recommend Jasmine for your home buying process!",
    statesDollarOutcome: false,
    openQuestion:
      "TODO(verify): generic Zillow username. Needs the client's real name before it can run.",
  },
  {
    id: "zillow-steven-holt",
    author: "Steven Holt",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-05-02",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Dallas, NC",
    },
    body: "Jasmine got me more than I could ask for. Very quick on questions I had through the process. We closed faster than expected. We told Jasmine what we were looking for and within a week we were putting in an offer. Ty",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-sms2rcks",
    author: "sms2rcks",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-07-27",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Charlotte, NC",
    },
    body: "Was a pleasure to work with Jasmine! She helped me through the process and was very responsive! The closing was very straightforward & she had many resources we used during the due diligence period!",
    statesDollarOutcome: false,
    openQuestion:
      "TODO(verify): generic Zillow username. Needs the client's real name before it can run.",
  },
  {
    id: "zillow-user3842511",
    author: "user3842511",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-08-26",
    datePrecision: "day",
    transaction: {
      role: "bought and sold",
      propertyType: "Single Family",
      year: 2022,
      location: "Rock Hill, SC",
    },
    body: "It was such a pleasure working with Jasmine Garcia. She understood what we were looking for in a home as well as the current market. She was very attentive to getting answers to questions we had and never left us hanging. We have worked with over 6 realators over the years and Jasmine was by far the best realtor we have worked with. We would highly recommend her to anyone looking to buy or sell a home!",
    statesDollarOutcome: false,
    openQuestion:
      "TODO(verify): generic Zillow username. Needs the client's real name before it can run.",
  },
  {
    id: "zillow-cori-halter",
    author: "Cori Halter",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-12-01",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Prosperity Village, Charlotte, NC",
    },
    body: "I cannot say enough about Jasmine Garcia. Her talent for both figuring out the kind of home we wanted and then finding it in record time was simply amazing. To add to the challenge, we are moving to Charlotte from out of state. She remained calm, paid attention to details and was kind, confident and gave us OUTSTANDING service. I will always use her for any future real estate needs.",
    statesDollarOutcome: false,
  },
  {
    /**
     * The relocation pillar's anchor. Phoenix buyers, Hurricane Ian showing —
     * docs/BRAND-VOICE.md §5 calls for this exact review on /relocation as
     * direct evidence that everyone at the table is local except the client.
     */
    id: "zillow-kathy-hannan",
    author: "Kathy Hannan",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-12-01",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Prosperity Village, Charlotte, NC",
    },
    body: "Jasmine at Matt Stone Realty was amazing to work with! From 2,000 miles away in Phoenix, she made the home searching and buying process seamless! We flew to Charlotte to get boots on the ground and look at “potential” homes. She knew what we were looking for better than we did! We found the perfect house! Jasmine even came out in torrential rain from Hurricane Ian so we could see the house one more time before we flew back to Phoenix with stars in our eyes! She never missed a beat and has kept an eye on our new home for us until we get there! Thanks Jasmine!",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-shayna-quilty-yoder",
    author: "Shayna Quilty-Yoder",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2022-12-14",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2022,
      location: "Idlewild Farms, Charlotte, NC",
    },
    body: "Jasmine Garcia helped us buy our first home, and she was wonderful. She was proactive about making sure we had all of the information we needed, and was very responsive, even when she was traveling out of the country for a few days. Jasmine demonstrated her knowledge of the area and of the real estate field without ever coming across as pushy. She checked in regularly during the closing process to make sure everything was going smoothly, and even sent us a thoughtful housewarming gift. I've already recommended her to a friend who's looking to buy a home, and I would recommend her to anyone who asks.",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-andrew-korpics",
    author: "Andrew Korpics",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2023-03-16",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Townhouse",
      year: 2023,
      location: "Rock Hill, SC",
    },
    body: "Jasmine Garcia was the absolute best to work with! Highly professional and made my home search such an enjoyable process. Jasmine is always available and does a fantastic job of giving useful recommendations throughout the process. If you are not using her as your realtor, then you are missing out on one of the best in business!",
    statesDollarOutcome: false,
  },
  {
    id: "zillow-rayraycs",
    author: "rayraycs",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2023-05-19",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2023,
      location: "Charlotte, NC",
    },
    body: "Jasmine was our realtor and provided such professionalism and knowledge on the home buying process. She is super sweet and kind and most definitely works in the best interest of the client. She was supportive on our decisions and made the process smooth and worry free.",
    statesDollarOutcome: false,
    openQuestion:
      "TODO(verify): generic Zillow username. Needs the client's real name before it can run.",
  },
  {
    id: "zillow-maggie-jean",
    author: "Maggie Jean",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2023-06-11",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2023,
      location: "Concord, NC",
    },
    body: "Thank you, Jasmine Garcia, for doing all of the virtual tours for us while we were trying to find a house from afar. You were sure to promptly schedule for us and then went above and beyond by taking videos for us and posting them as well. Purchasing a house long distance is quite trying, but we made it work! Please send our many thanks to Andy Wilfong for his thorough communication, quick responses, and steady support as well. We couldn't have done it without you!",
    statesDollarOutcome: false,
    openQuestion:
      "TODO(verify): names a third party (Andy Wilfong) who has not agreed to appear on this site. Confirm he is fine with it, or run this review only on a page where the reference reads as team credit.",
  },
  {
    id: "zillow-jennifer-garcia",
    author: "Jennifer Garcia",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2023-06-22",
    datePrecision: "day",
    transaction: {
      role: "sold",
      propertyType: "Single Family",
      year: 2023,
      location: "Lancaster, SC",
    },
    body: "Jasmine Garcia was a phenomenal realtor who helped us every step of the way. Helped sell our home fairly quickly but also helped us find our new home. Keep up the great work. Thanks for all your help.",
    statesDollarOutcome: false,
    openQuestion:
      "TODO(verify): shares Jasmine's surname. Garcia is common and this is probably coincidence, but her brother also reviewed her, and unlike his this review discloses nothing. Confirm the relationship. If they are related, it needs a disclosure the client's own words do not provide — which likely means not running it.",
  },
  {
    /**
     * The strongest relocation review on the site and one of the few outside
     * the case studies that names a negotiated figure. Florida to Charlotte.
     */
    id: "zillow-tanner-mathewson",
    author: "Tanner Mathewson",
    rating: 5,
    platform: "zillow",
    postedOn: "Zillow profile",
    date: "2023-11-14",
    datePrecision: "day",
    transaction: {
      role: "bought",
      propertyType: "Single Family",
      year: 2023,
      location: "Mount Holly, NC",
    },
    body: "Our realtor, Jasmine, proved to be an indispensable asset during our relocation from Florida to the Charlotte metro. Upon reaching out to the Matt Stone Team, we were promptly connected with her, and from that point forward, our experience was nothing short of exceptional. She exhibited kindness, expertise, and unwavering availability - even when she was out of town. Jasmine took the time to inform and educate us about the various areas and neighborhoods in Charlotte. Her insights into the current real estate market were invaluable, and she consistently prioritized our needs and desires in a new home. With Jasmine's guidance, we discovered our home in a wonderful neighborhood, providing the perfect setting for our family to settle down. Throughout the entire home-buying process, Jasmine maintained excellent communication with us, ensuring a smooth and transparent experience. One of her standout qualities was her impressive negotiation skills, which ultimately resulted in securing a substantial $20,000 in savings for our new home. We extend our heartfelt gratitude to Jasmine and the Matt Stone Team for contributing to a seamless and successful relocation process. Her dedication and expertise made a significant difference, and we couldn't be more pleased with the outcome.",
    statesDollarOutcome: true,
  },

  // ------------------------------------------------------------------ GOOGLE
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
];

/**
 * First name + last initial, title-cased — "Brittany T.", "Shayna Q.".
 *
 * Single-token bylines return unchanged, which only happens for the unresolved
 * Zillow usernames. Those carry an `openQuestion` and never reach a page.
 */
export function displayName(review: Review): string {
  const parts = review.author.trim().split(/\s+/);
  const first = parts[0];
  const titled = first.charAt(0).toUpperCase() + first.slice(1);
  if (parts.length === 1) return review.author;
  return `${titled} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

/** Everything cleared to appear on the site. Start every query here. */
export function publishableReviews(reviews: readonly Review[] = REVIEWS): Review[] {
  return reviews.filter((review) => !review.openQuestion);
}

/** True when any review in the set requires the results disclaimer beside it. */
export function needsResultsDisclaimer(reviews: readonly Review[]): boolean {
  return reviews.some((review) => review.statesDollarOutcome);
}

/**
 * Reviews safe to pull as a short quote. A review carrying a disclosed material
 * connection is not — the disclosure is in the sentence, and an excerpt drops it.
 */
export function quotableReviews(reviews: readonly Review[] = REVIEWS): Review[] {
  return publishableReviews(reviews).filter((review) => !review.materialConnection);
}

/** Look one up by id — for a page that anchors on a specific review. */
export function reviewById(id: string): Review | undefined {
  return REVIEWS.find((review) => review.id === id);
}
