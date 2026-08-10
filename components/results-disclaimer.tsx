import { RESULTS_DISCLAIMER } from "@/lib/site";

/**
 * Required adjacent to any block showing transaction outcomes — CLAUDE.md §7 and
 * docs/CASE-STUDIES.md. Body weight, body color, immediately below the figures.
 * Never a footnote, never small gray type, never in the footer.
 *
 * Wording approved by the BIC 2026-08-10 and pinned by tests/compliance.test.tsx.
 */
export function ResultsDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`max-w-3xl border-l-2 border-accent pl-5 text-base leading-relaxed text-ink ${className}`}
    >
      {RESULTS_DISCLAIMER}
    </p>
  );
}
