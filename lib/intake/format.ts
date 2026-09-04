import { BRANCHES, SIDES, contactMethodLabel, labelFor } from "./questions";
import type { ContactMethod, IntakeAnswers, Side } from "./types";

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

/**
 * The preferred-contact line for the Follow Up Boss note and the notification
 * email, or nothing if the visitor did not say.
 *
 * One function rather than the same ternary in lib/fub.ts and in the route
 * handler. Those two build the same lead twice, from the same object, for two
 * different destinations — so the cheap failure is a preference that reaches the
 * CRM and not the inbox, or reads "A text" in one and "text" in the other. The
 * label has one source for the same reason the intake lines above do.
 */
export function formatContactMethod(method: ContactMethod | undefined): string | null {
  return method ? `Prefers: ${contactMethodLabel(method)}` : null;
}
