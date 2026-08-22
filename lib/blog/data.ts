/**
 * The post registry — every blog post, its metadata, and where its body lives.
 *
 * Adding an entry here gives the post a route, a sitemap entry, a listing card,
 * FAQPage structured data, and enrollment in tests/compliance.test.tsx — with no
 * other file touched.
 *
 * ---------------------------------------------------------------------------
 * APPROVED 2026-08-21
 *
 * The one post below was written to prove the pipeline renders and passes §7
 * end to end; a pipeline that has never carried a post is not a working
 * pipeline. Jasmine has since read it in full and signed off on the revision,
 * so it ships with launch. docs/CONTENT-MARKETING.md §8 records what her review
 * changed and why both corrections generalize to the next batch.
 *
 * ---------------------------------------------------------------------------
 * Why metadata is TypeScript and only the body is MDX
 *
 * The alternative is YAML frontmatter, which is what almost every Next.js blog
 * does. It is worse here for one reason: frontmatter is untyped, so a post could
 * ship with no `answer`, a malformed date, or a single FAQ entry, and nothing
 * would notice until a reader hit the page. Everything on this site that carries
 * a compliance obligation is typed data with a test over it — lib/areas/data.ts,
 * lib/transactions/data.ts, lib/reviews/data.ts — and a post makes claims under
 * her license the same way an area page does.
 *
 * The cost is that adding a post means editing two files. The parity test in
 * index.test.ts makes forgetting the second one a build failure.
 *
 * ---------------------------------------------------------------------------
 * Scheduling
 *
 * `publishedAt` in the future means the post is written but not live. It is
 * absent from the listing, the sitemap, and generateStaticParams until that date
 * passes. That is the whole scheduling mechanism — batch four or five posts,
 * date them a week apart, merge once. See docs/CONTENT-MARKETING.md for the
 * revalidation that makes the date take effect without a redeploy.
 *
 * ---------------------------------------------------------------------------
 * What does NOT go here
 *
 * - Neighborhood and market content. It goes in lib/areas/data.ts. A post about
 *   Fort Mill competes with /areas/fort-mill for the same query and both rank
 *   worse for it. CLAUDE.md §11.
 * - Market updates and stat roundups. docs/CONTENT-PLAN.md rules them out by
 *   name, and lib/blog/validate.ts fails the build on them.
 * - Any figure not in CLAUDE.md §5 or docs/CASE-STUDIES.md. Write
 *   `TODO(verify)` and leave it. §6.
 * ---------------------------------------------------------------------------
 */

import type { Post } from "./types";

export const POSTS: readonly Post[] = [
  {
    slug: "what-you-can-negotiate-besides-price",
    title: "What can you negotiate besides price?",
    description:
      "Condition, closing costs, timing, inclusions, contingencies, and builder incentives are all terms. Price is only the one everybody watches.",
    category: "negotiation",
    targetQuery: "what can you negotiate when buying a house besides the price",
    answer:
      "Almost every term in a purchase contract is negotiable, not just the price. Condition and repairs, closing costs and concessions, the closing and possession dates, which appliances and fixtures stay, how long you get to inspect the place and walk away, and on new construction, what the builder is willing to put toward incentives. Which of these are available depends on the seller, which is why the useful question is what this seller is protecting rather than whether they will come down.",
    publishedAt: "2026-08-14",
    /* Case 2, quoted for what it was: a negotiation with no price reduction in it.
       No dollar figure appears, so no disclaimer is triggered — see citesResults
       in lib/blog/types.ts. docs/CASE-STUDIES.md permits this use, and Jasmine
       confirmed the retelling is accurate on 2026-08-21. */
    pillar: "/new-construction",
    faq: [
      {
        question: "Is everything in a real estate contract negotiable?",
        answer:
          "Most of the commercial terms are. Price, condition and repairs, closing costs, the closing and possession dates, inclusions, and how long you get to inspect the place and walk away are all things a buyer can ask about. What is not negotiable is anything the law or the lender fixes, and anything the particular seller has decided in advance to hold.",
      },
      {
        question: "Can you negotiate repairs instead of a lower price?",
        answer:
          "Often, yes, and sometimes a seller who will not move on price will move here. Repairs, servicing, a home warranty, or a credit toward the work each solve the same underlying problem in a different way, and a seller frequently treats them as coming from a different pocket than the sale price.",
      },
      {
        question: "Do you negotiate differently with a builder than with a homeowner?",
        answer:
          "Yes, because you are negotiating with a company rather than a household. A builder protects the recorded sale price because it sets the comparable for the rest of the community, which is what lets them raise prices in the later phases. They are usually more flexible on incentives, upgrade allowances, and lender tie-ins than on the number itself.",
      },
    ],
    cta: {
      heading: "Which of these exist in your transaction?",
      body: "That depends on the house and on who is selling it. A call, a Zoom, or a text is usually enough to sort the levers that are there from the ones that are not.",
    },
    body: () => import("@/content/blog/what-you-can-negotiate-besides-price.mdx"),
  },
];
