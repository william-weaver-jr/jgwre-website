import { BRANCHES, SIDES, labelFor } from "./questions";
import type { IntakeAnswers, Side } from "./types";

/**
 * Turn the intake answers into readable lines for the Follow Up Boss note and the
 * notification email.
 *
 * Option ids are for filtering; a human reading the lead should see the same words
 * the visitor tapped. Questions are emitted in the order they were asked, and
 * skipped ones are simply absent — a short list means she skipped ahead, which is
 * itself worth seeing.
 */
export function formatIntake(side: Side | undefined, intake: IntakeAnswers | undefined): string[] {
  if (!side) return [];

  const lines = [`Side of the table: ${SIDES.find((s) => s.value === side)?.label ?? side}`];
  if (!intake) return lines;

  for (const question of BRANCHES[side]) {
    const answer = intake[question.id];
    if (answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0)) {
      continue;
    }

    // `Array.isArray` does not narrow `readonly string[]`, so branch on the type.
    const value =
      typeof answer === "string"
        ? question.text
          ? answer
          : labelFor(question, answer)
        : answer.map((v) => labelFor(question, v)).join(", ");

    lines.push(`${question.label} ${value}`);
  }

  return lines;
}
