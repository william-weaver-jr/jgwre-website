import Image from "next/image";
import Link from "next/link";

import { locationLabel, sideLabel, type Transaction } from "@/lib/transactions";
import { publishableReviewById } from "@/lib/reviews";

/**
 * One closed transaction, as a ledger row rather than a listing card.
 *
 * The distinction is the whole design: a listing card sells a house, and this
 * page is not selling houses — it is evidence about how she works. So no price
 * chips, no photo grid, no "SOLD" badge stamped across a thumbnail. Hairline
 * rule, eyebrow, place, and the one thing that was negotiated.
 *
 * Mobile-first: a single column of rows on a phone. The desktop grid is added
 * by the page, not here.
 */
export function TransactionRow({ transaction }: { transaction: Transaction }) {
  /* publishable-, not plain reviewById: a review still behind an openQuestion
     resolves fine but is not rendered on /reviews, and linking to it would
     promise the visitor something that page does not show. */
  const review = transaction.reviewId ? publishableReviewById(transaction.reviewId) : undefined;
  const meta = [
    transaction.propertyType,
    transaction.builder,
    transaction.month
      ? new Date(transaction.year, transaction.month - 1).toLocaleString("en-US", {
          month: "long",
        })
      : undefined,
  ].filter(Boolean);

  return (
    <article className="rule-gold break-inside-avoid pt-6">
      <p className="eyebrow">{sideLabel(transaction.side)}</p>

      <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
        {locationLabel(transaction)}
      </h3>

      <p className="mt-2 text-sm text-ink-muted">{meta.join(" · ")}</p>

      {transaction.photo ? (
        <Image
          src={transaction.photo.src}
          alt={transaction.photo.alt}
          width={transaction.photo.width}
          height={transaction.photo.height}
          sizes="(min-width: 768px) 44vw, calc(100vw - 3.5rem)"
          className="mt-5 h-auto w-full"
        />
      ) : null}

      {transaction.lever ? (
        <p className="mt-4 max-w-md text-base leading-relaxed">{transaction.lever}</p>
      ) : null}

      {review ? (
        <p className="mt-4 text-sm">
          <Link
            href="/reviews"
            className="decoration-accent-soft decoration-1 underline-offset-[6px] hover:underline"
          >
            The client wrote about this one
          </Link>
        </p>
      ) : null}
    </article>
  );
}
