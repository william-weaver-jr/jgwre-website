/**
 * The intake questions behind every form on the site. See docs/CONTACT-STRATEGY.md §3.
 *
 * Structure, not prose: steps 1 and 2 are taps, contact details come last. The
 * questions are the ones Jasmine asks in the first two minutes of a call, so the
 * call can start at minute three.
 */

/** Step 1. The only question with no wrong answer, and the only one with no PII. */
export type Side = "buying" | "selling" | "both" | "relocating" | "deciding";

/**
 * Step 3. How she should reach them.
 *
 * Optional, and that is the whole design. It is asked at the point the visitor
 * is already handing over a name, an email and a phone number, so anything that
 * adds a required decision there is bought at the cost of completions. An
 * unanswered preference is a real answer — it means they do not mind.
 */
export type ContactMethod = "call" | "text" | "email";

/** One step-2 answer. Multi-select questions hold an array. */
export type AnswerValue = string | readonly string[];

export type IntakeAnswers = Readonly<Record<string, AnswerValue>>;

export type IntakeQuestion = {
  /** Key in `IntakeAnswers`. Also the FUB field name, so keep it readable. */
  id: string;
  label: string;
  /** Rendered under the label. Used to name the specific markets in a group. */
  help?: string;
  /** Checkboxes instead of radios. */
  multi?: boolean;
  /**
   * A short free-text field instead of chips. Used once, for "coming from where" —
   * fifty states will not fit in a chip row and the answer is worth having.
   */
  text?: boolean;
  options?: readonly { value: string; label: string }[];
};

/**
 * A question worth asking, surfaced on the confirmation screen.
 *
 * `text` is copy and gets reviewed as copy. It is phrased as something to ask,
 * never as an outcome — CLAUDE.md §7 bans any implied guarantee, and "here is what
 * I would ask" is both compliant and a stronger read than a promise would be.
 *
 * `sides` and `requires` are mechanical matching, not copy.
 */
export type LeverRule = {
  id: string;
  /**
   * Category, used only to keep one topic from filling all three slots. A border
   * buyer who is also buying resale should see the state-line question, not a
   * third resale question.
   */
  group:
    | "new-construction"
    | "resale"
    | "financing"
    | "timeline"
    | "border"
    | "relocation"
    | "selling"
    | "general";
  sides: readonly Side[];
  /** Optional gate on one step-2 answer. Matches inside arrays for multi-selects. */
  requires?: { question: string; value: string };
  text: string;
};
