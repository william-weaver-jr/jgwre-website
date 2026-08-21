import { displayName, type Review, type ReviewTransaction } from "@/lib/reviews";
import { SOCIAL } from "@/lib/site";

/**
 * One review, whole.
 *
 * There is no truncation here on purpose — no line-clamp, no "read more", no
 * character limit. Three of these carry a disclosed material connection (her
 * brother, a nine-year friendship, a friendship that grew out of the sale) and
 * the disclosure lives inside the client's own sentence. Cut the quote anywhere
 * and the disclosure is what gets cut. CLAUDE.md §7 and lib/reviews/types.ts.
 *
 * The byline is `displayName()` — first name + last initial. A full name beside
 * a neighborhood and a purchase year identifies where a client lives.
 *
 * The platform label in the caption links out where there is somewhere honest
 * to send the reader. That is the only outbound link on a review, and it sits
 * after the quote rather than beside a CTA on purpose: this page's argument is
 * that nothing here is trimmed or arranged, and a link is what makes that
 * claim checkable. It is not a promo for the platform.
 */

const PLATFORM_LABEL: Record<Review["platform"], string> = {
  google: "Google",
  zillow: "Zillow",
};

/**
 * "Bought a Single Family home in Fort Mill, SC" — degrades as fields drop out.
 *
 * Zillow's own phrasing is "a Townhouse home", which reads badly. This line is
 * platform metadata rather than the client's words, so it gets fixed here; the
 * body never would.
 */
function transactionLine(transaction: ReviewTransaction): string {
  const role = transaction.role.charAt(0).toUpperCase() + transaction.role.slice(1);
  const what =
    transaction.propertyType === "Townhouse"
      ? "a townhouse"
      : transaction.propertyType === "Single Family"
        ? "a single-family home"
        : "a home";
  const where = transaction.location ? ` in ${transaction.location}` : "";
  return `${role} ${what}${where}`;
}

/**
 * Where "Zillow" or "Google" should point, and what a screen reader hears.
 *
 * Two different granularities, deliberately not smoothed over. Google gives a
 * permalink to the individual review, so `sourceUrl` goes straight to it.
 * Zillow publishes no per-review URL at all, so the best available destination
 * is her profile — the hint says so rather than implying a permalink.
 *
 * The hint also carries the byline, because a page of fifty reviews otherwise
 * ends up with fifty links whose accessible name is the word "Zillow", and it
 * contains "external", which tests/accessibility.test.tsx requires of anything
 * opening in a new tab.
 */
function platformDestination(
  review: Review,
): { href: string; hint: string } | null {
  const platform = PLATFORM_LABEL[review.platform];

  if (review.sourceUrl) {
    return {
      href: review.sourceUrl,
      hint: `read ${displayName(review)}\u2019s review on ${platform}`,
    };
  }

  if (review.platform === "zillow") {
    return {
      href: SOCIAL.zillow.url,
      hint: `${displayName(review)}\u2019s review is on her Zillow profile`,
    };
  }

  return null;
}

export function ReviewCard({ review }: { review: Review }) {
  const paragraphs = review.body.split("\n").filter(Boolean);
  const destination = platformDestination(review);

  return (
    <figure className="rule-gold break-inside-avoid pt-6">
      <blockquote className="space-y-4 text-base leading-relaxed">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </blockquote>

      <figcaption className="mt-5 text-sm text-ink-muted">
        <span className="text-ink">{displayName(review)}</span>
        {review.transaction ? (
          <>
            {" · "}
            {transactionLine(review.transaction)}
            {" · "}
            {review.transaction.year}
          </>
        ) : null}
        {" · "}
        {destination ? (
          <a
            href={destination.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-accent-soft decoration-1 underline-offset-4 hover:decoration-accent"
          >
            {PLATFORM_LABEL[review.platform]}
            <span className="sr-only">, {destination.hint} (opens an external site)</span>
          </a>
        ) : (
          PLATFORM_LABEL[review.platform]
        )}
      </figcaption>
    </figure>
  );
}
