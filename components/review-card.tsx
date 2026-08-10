import { displayName, type Review, type ReviewTransaction } from "@/lib/reviews";

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

export function ReviewCard({ review }: { review: Review }) {
  const paragraphs = review.body.split("\n").filter(Boolean);

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
        {PLATFORM_LABEL[review.platform]}
      </figcaption>
    </figure>
  );
}
