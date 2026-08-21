"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ResultsDisclaimer } from "@/components/results-disclaimer";
import { readUtm, track } from "@/lib/analytics";
import {
  BRANCHES,
  SIDES,
  SIDE_TO_LEAD_TYPE,
  selectLevers,
  type IntakeQuestion,
  type Side,
} from "@/lib/intake";
import type { Lead } from "@/lib/lead";
import { AGENT, TCPA_CONSENT } from "@/lib/site";

/**
 * The intake. docs/CONTACT-STRATEGY.md §3.
 *
 * Three steps, contact details last. Steps 1 and 2 are taps and collect no personal
 * information; step 3 is the only place anything is typed that a visitor would
 * hesitate over. Every step-2 question is skippable.
 *
 * The questions are the ones Jasmine asks in the first two minutes of a call. Asking
 * them here is the entire point — a form that produces a lead she knows nothing
 * about is worth less than half as many leads she can call prepared.
 *
 * Radios and checkboxes underneath the chips, not buttons with ARIA: keyboard
 * navigation, grouping, and screen reader semantics all come free and correct.
 * CLAUDE.md §10.
 */

type Answers = Record<string, string | string[]>;

type Step = "side" | "details" | "contact" | "done";

export function ContactIntake({
  source,
  heading,
  body,
  leadType,
  prefill,
  hairline = true,
  className = "",
}: {
  /** Page slug the lead came from, e.g. "/new-construction". */
  source: string;
  heading: string;
  body: string;
  /**
   * Overrides the lead type derived from step 1. Used where the page itself defines
   * the type regardless of the answers — `/negotiation` is always `guide`.
   */
  leadType?: Lead["leadType"];
  /** Answers the page already knows. A prefilled side starts the visitor at step 2. */
  prefill?: { side?: Side; answers?: Answers };
  /** Off where the block already sits under a rule, so the line isn't doubled. */
  hairline?: boolean;
  className?: string;
}) {
  const formId = useId();
  const [step, setStep] = useState<Step>(prefill?.side ? "details" : "side");
  const [side, setSide] = useState<Side | null>(prefill?.side ?? null);
  const [answers, setAnswers] = useState<Answers>(prefill?.answers ?? {});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  const questions = side ? BRANCHES[side] : [];
  const levers = useMemo(
    () => (step === "done" && side ? selectLevers(side, answers) : []),
    [step, side, answers],
  );

  // Move focus to the heading on every step change so the change is announced and
  // keyboard users are not left at the bottom of the previous step.
  useEffect(() => {
    if (started.current) headingRef.current?.focus();
    started.current = true;
  }, [step]);

  function chooseSide(next: Side) {
    setSide(next);
    setAnswers({});
    setStep("details");
    track("intake_step", { step: 2, side: next, page: source });
  }

  function setAnswer(question: IntakeQuestion, value: string, checked: boolean) {
    setAnswers((current) => {
      if (!question.multi) return { ...current, [question.id]: value };

      const existing = Array.isArray(current[question.id]) ? (current[question.id] as string[]) : [];
      const updated = checked
        ? [...existing, value]
        : existing.filter((entry) => entry !== value);

      return { ...current, [question.id]: updated };
    });
  }

  function goToContact() {
    setStep("contact");
    track("intake_step", { step: 3, side: side ?? "unknown", page: source });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const filled = Object.fromEntries(
      Object.entries(answers).filter(([, value]) =>
        Array.isArray(value) ? value.length > 0 : value !== "",
      ),
    );

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? "") || undefined,
      source,
      leadType: leadType ?? (side ? SIDE_TO_LEAD_TYPE[side] : "general"),
      side: side ?? undefined,
      intake: Object.keys(filled).length ? filled : undefined,
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
      utm: readUtm(),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { ok: boolean; error?: string } = await response.json();

      if (!response.ok || !result.ok) {
        setError(result.error ?? `Something went wrong. Please call ${AGENT.phoneDisplay}.`);
        setSubmitting(false);
        return;
      }

      track("intake_submit", { side: side ?? "unknown", leadType: payload.leadType, page: source });
      setStep("done");
    } catch {
      setError(`We couldn’t send that. Please call ${AGENT.phoneDisplay}.`);
    } finally {
      setSubmitting(false);
    }
  }

  const stepNumber = step === "side" ? 1 : step === "details" ? 2 : 3;

  return (
    // `start` is the target the sticky mobile bar and every "Start here" link scroll
    // to. One intake per page, so the id is fixed rather than generated.
    <div
      id="start"
      className={`scroll-mt-24 bg-surface-sunken ${hairline ? "rule-gold" : ""} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-gutter py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">{step === "done" ? "What’s on the table" : "Start here"}</p>
          <h2
            id={`${formId}-heading`}
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 font-display text-4xl leading-tight md:text-5xl"
          >
            {step === "done" ? "Here’s what I’d be asking about." : heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            {step === "done"
              ? "Nothing here is a prediction. These are the questions worth putting to the other side of your particular table, and they’re the ones we’ll start with."
              : body}
          </p>
        </div>

        {step === "done" ? (
          <Confirmation levers={levers.map((lever) => lever.text)} />
        ) : (
          <>
            <p className="mt-10 text-sm text-ink-muted" aria-live="polite">
              Step {stepNumber} of 3
            </p>

            {step === "side" ? (
              <SideStep onChoose={chooseSide} name={`${formId}-side`} />
            ) : null}

            {step === "details" && side ? (
              <DetailsStep
                formId={formId}
                questions={questions}
                answers={answers}
                onAnswer={setAnswer}
                onBack={() => setStep("side")}
                onContinue={goToContact}
                lockedSide={Boolean(prefill?.side)}
              />
            ) : null}

            {step === "contact" ? (
              <ContactStep
                formId={formId}
                onSubmit={onSubmit}
                onBack={() => setStep("details")}
                submitting={submitting}
                error={error}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------- */

function SideStep({ onChoose, name }: { onChoose: (side: Side) => void; name: string }) {
  return (
    <fieldset className="mt-6 border-0 p-0">
      <legend className="text-lg text-ink">Which side of the table are you on?</legend>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SIDES.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="peer sr-only"
              onChange={() => onChoose(option.value)}
            />
            <span className="block h-full rounded-sm border border-border bg-surface-raised px-5 py-4 transition-colors hover:border-accent-soft peer-checked:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
              <span className="block font-display text-2xl leading-none">{option.label}</span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-muted">
                {option.note}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DetailsStep({
  formId,
  questions,
  answers,
  onAnswer,
  onBack,
  onContinue,
  lockedSide,
}: {
  formId: string;
  questions: readonly IntakeQuestion[];
  answers: Answers;
  onAnswer: (question: IntakeQuestion, value: string, checked: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
  lockedSide: boolean;
}) {
  return (
    <div className="mt-6">
      <div className="grid gap-10">
        {questions.map((question) => (
          <Question
            key={question.id}
            formId={formId}
            question={question}
            answers={answers}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button type="button" size="xl" onClick={onContinue} className="w-full sm:w-auto">
          Continue
        </Button>
        {/*
          The escape hatch from docs/CONTACT-STRATEGY.md §4. A visitor who just wants
          to send a message must never be trapped behind the qualifying questions —
          that is the failure mode the whole stepped design risks.
        */}
        <button
          type="button"
          onClick={onContinue}
          className="text-sm text-ink-muted underline decoration-accent-soft underline-offset-4 hover:text-ink"
        >
          Skip these and just take my details
        </button>
        {!lockedSide ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-ink-muted underline decoration-accent-soft underline-offset-4 hover:text-ink sm:ml-auto"
          >
            Back
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Question({
  formId,
  question,
  answers,
  onAnswer,
}: {
  formId: string;
  question: IntakeQuestion;
  answers: Answers;
  onAnswer: (question: IntakeQuestion, value: string, checked: boolean) => void;
}) {
  const inputId = `${formId}-${question.id}`;

  if (question.text) {
    return (
      <div>
        <label htmlFor={inputId} className="block text-lg text-ink">
          {question.label}
        </label>
        {question.help ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{question.help}</p>
        ) : null}
        <input
          id={inputId}
          type="text"
          value={typeof answers[question.id] === "string" ? (answers[question.id] as string) : ""}
          onChange={(event) => onAnswer(question, event.target.value, true)}
          className="mt-4 w-full max-w-md rounded-sm border border-border bg-surface-raised px-4 py-3 text-base text-ink placeholder:text-ink-muted"
          autoComplete="off"
        />
      </div>
    );
  }

  const selected = answers[question.id];

  return (
    <fieldset className="border-0 p-0">
      <legend className="text-lg text-ink">{question.label}</legend>
      {question.help ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{question.help}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {question.options?.map((option) => {
          const checked = Array.isArray(selected)
            ? selected.includes(option.value)
            : selected === option.value;

          return (
            <label key={option.value} className="cursor-pointer">
              <input
                type={question.multi ? "checkbox" : "radio"}
                name={inputId}
                value={option.value}
                checked={checked}
                onChange={(event) => onAnswer(question, option.value, event.target.checked)}
                className="peer sr-only"
              />
              <span className="block rounded-sm border border-border bg-surface-raised px-4 py-2.5 text-sm transition-colors hover:border-accent-soft peer-checked:border-accent peer-checked:bg-surface peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ContactStep({
  formId,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  formId: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const field =
    "mt-2 w-full rounded-sm border border-border bg-surface-raised px-4 py-3 text-base text-ink";

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-2xl" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-name`} className="block text-sm font-medium text-ink">
            Name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className="block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-sm font-medium text-ink">
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-message`} className="block text-sm font-medium text-ink">
            Anything you’d add{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <textarea id={`${formId}-message`} name="message" rows={3} className={field} />
        </div>
      </div>

      {/* Honeypot. Real users never see it; bots fill it. CLAUDE.md §9. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/*
        TCPA consent, verbatim from lib/site.ts. Never reworded, never shortened,
        never pre-checked. CLAUDE.md §7 — this is build-breaking if it drifts.
      */}
      <div className="mt-8 flex gap-3">
        <input
          id={`${formId}-consent`}
          name="consent"
          type="checkbox"
          required
          className="mt-1 size-5 shrink-0 accent-primary"
        />
        <label
          htmlFor={`${formId}-consent`}
          className="text-sm leading-relaxed text-ink-muted"
        >
          {TCPA_CONSENT}{" "}
          <Link
            href="/privacy-policy"
            className="text-accent underline decoration-accent-soft underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-6 border-l-2 border-accent pl-4 text-base text-ink">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="xl" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : "Send this to Jasmine"}
        </Button>
        <span className="text-sm text-ink-muted">or</span>
        <Button asChild variant="outlineInk" size="xl" className="w-full sm:w-auto">
          <a href={AGENT.phoneHref} data-cta-placement="intake-contact-step">
            <span className="sr-only">Call {AGENT.name} at </span>
            {AGENT.phoneDisplay}
          </a>
        </Button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ink-muted underline decoration-accent-soft underline-offset-4 hover:text-ink sm:ml-auto"
        >
          Back
        </button>
      </div>
    </form>
  );
}

function Confirmation({ levers }: { levers: readonly string[] }) {
  return (
    <div className="mt-10">
      <ol className="max-w-3xl border-t border-border">
        {levers.map((lever, index) => (
          <li key={lever} className="flex gap-6 border-b border-border py-6">
            <span className="figure-plain shrink-0 text-sm text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-lg leading-relaxed text-ink">{lever}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted">
        Your details are with Jasmine. She’ll call you from {AGENT.phoneDisplay}. If you’d
        rather not wait, that number takes calls and texts.
      </p>

      <div className="mt-8">
        <Button asChild variant="phone" size="xl">
          <a href={AGENT.phoneHref} data-cta-placement="intake-confirmation">
            <span className="sr-only">Call {AGENT.name} at </span>
            {AGENT.phoneDisplay}
          </a>
        </Button>
      </div>

      {/*
        Required adjacent, even though nothing above states a dollar figure. The
        levers describe what can be asked for, and the disclaimer is what keeps that
        from being read as what will be obtained. CLAUDE.md §7.
      */}
      <ResultsDisclaimer className="mt-10" />
    </div>
  );
}
