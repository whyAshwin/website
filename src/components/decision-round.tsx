"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, ChevronRight, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Confetti } from "./confetti";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

type Decision = {
  id: string;
  scenario: string;
  question: string;
  options: [string, string];
  correct: 0 | 1;
  /** The one-line "why", shown the instant you answer. */
  why: string;
  /** Supporting arithmetic or consequence. */
  detail?: string;
};

/**
 * Five decisions. The tempting answer is the wrong one every time —
 * that's the point. Answer on instinct, get the reason immediately.
 */
const DECISIONS: Decision[] = [
  {
    id: "signup-lift",
    scenario: "Growth",
    question: "A new landing page lifted signups 12%. Ship the next iteration?",
    options: [
      "Ship it — a 12% lift is worth chasing",
      "Hold — check whether those signups activated first",
    ],
    correct: 1,
    why: "More people at the door only matters if they stop leaving at the same step.",
    detail:
      "Activation is 22%. Twelve percent more signups at the same 22% is 2.6% more users. The leak is downstream.",
  },
  {
    id: "upvotes",
    scenario: "Roadmap",
    question:
      "A feature has 400 upvotes on the board. It's used by 2% of accounts. Build the follow-up?",
    options: [
      "Check who's actually using it before building more",
      "Build it — 400 people asked for it",
    ],
    correct: 0,
    why: "Requests are votes. Usage is evidence. Four hundred asked; two in a hundred use it.",
  },
  {
    id: "nps",
    scenario: "Metrics",
    question: "NPS dropped 12 points this quarter. What's your first move?",
    options: [
      "Check whether retention and revenue moved too",
      "Read the survey comments",
    ],
    correct: 0,
    why: "NPS is an opinion on a delay. If behaviour didn't move, you're debugging noise.",
  },
  {
    id: "revenue",
    scenario: "P&L",
    question: "Revenue is up 30%. Active users are flat. How do you read the quarter?",
    options: [
      "Strong quarter — revenue is what counts",
      "Suspicious — check pricing and churn",
    ],
    correct: 1,
    why: "Flat usage with rising revenue usually means you raised prices on whoever stayed.",
    detail: "That's a leak you only get to run once.",
  },
  {
    id: "competitor",
    scenario: "Strategy",
    question:
      "A competitor shipped a feature last week. No customer of yours has asked for it.",
    options: [
      "Match it — we can't be seen to fall behind",
      "Ask why they shipped it, not what they shipped",
    ],
    correct: 1,
    why: "Their roadmap isn't your evidence. Ship reasons, not features.",
  },
];

function verdictFor(score: number, total: number) {
  if (score === total)
    return {
      headline: "You read behaviour, not noise.",
      note: "That's most of the job.",
      color: "#22c55e",
    };
  if (score / total >= 0.8)
    return {
      headline: "Strong instinct.",
      note: "One of those is the trap most people walk straight into.",
      color: "#7c6cff",
    };
  if (score / total >= 0.6)
    return {
      headline: "Half instinct, half reflex.",
      note: "Worth knowing which answers were which.",
      color: "#f59e0b",
    };
  if (score / total >= 0.4)
    return {
      headline: "You answered the question that was asked.",
      note: "The job is answering the one underneath it.",
      color: "#f97316",
    };
  return {
    headline: "You picked the loudest option almost every time.",
    note: "That's the instinct this whole job is about unlearning.",
    color: "#ef4444",
  };
}

export function DecisionRound() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const decision = DECISIONS[step];
  const answered = choice !== null;
  const score = history.filter(Boolean).length;
  const isLast = step === DECISIONS.length - 1;
  const verdict = verdictFor(score, DECISIONS.length);

  const answer = (index: number) => {
    if (answered) return;
    setChoice(index);
    setHistory((prev) => [...prev, index === decision.correct]);
  };

  const next = () => {
    if (isLast) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
    setChoice(null);
  };

  const replay = () => {
    setStep(0);
    setChoice(null);
    setHistory([]);
    setDone(false);
  };

  return (
    <section id="playground" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        kicker="Product playground"
        title="Five decisions. Two answers each."
        description="Answer on instinct — about three seconds each. Then find out whether you were reading the product or the pitch."
      />

      <Reveal className="mt-12">
        <div className="mx-auto max-w-3xl">
          {!done ? (
            <div
              key={step}
              className="verdict-in rounded-3xl border border-line bg-surface p-6 sm:p-8"
            >
              {/* Progress */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {DECISIONS.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-colors duration-300",
                        i < history.length
                          ? history[i]
                            ? "bg-accent"
                            : "bg-red-500/60"
                          : i === step
                            ? "bg-surface-3"
                            : "bg-surface-2"
                      )}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  {step + 1} / {DECISIONS.length}
                </span>
              </div>

              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {decision.scenario}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl">
                {decision.question}
              </h3>

              <div className="mt-6 space-y-3">
                {decision.options.map((option, i) => {
                  const isCorrect = i === decision.correct;
                  const isChosen = choice === i;
                  const wrongPick = answered && isChosen && !isCorrect;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => answer(i)}
                      disabled={answered}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm transition-all duration-300 sm:text-base",
                        wrongPick
                          ? "border-red-500/50 bg-red-500/10"
                          : answered && isCorrect
                            ? "border-accent bg-accent/10"
                            : answered
                              ? "border-line bg-surface-2 opacity-45"
                              : "cursor-pointer border-line bg-surface-2 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-3"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-md border font-mono text-[11px]",
                          wrongPick
                            ? "border-red-500/50 text-red-400"
                            : answered && isCorrect
                              ? "border-accent bg-accent text-bg"
                              : "border-line-strong text-faint"
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {answered && isCorrect && (
                        <Check className="size-4 shrink-0 text-accent" />
                      )}
                      {wrongPick && <X className="size-4 shrink-0 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div
                  className={cn(
                    "verdict-in mt-5 rounded-2xl border p-4 sm:p-5",
                    history[history.length - 1]
                      ? "border-accent/40 bg-accent/[0.07]"
                      : "border-red-500/30 bg-red-500/[0.07]"
                  )}
                >
                  <p
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.22em]",
                      history[history.length - 1] ? "text-accent" : "text-red-400"
                    )}
                  >
                    {history[history.length - 1] ? "Right call" : "Not quite"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fg">
                    {decision.why}
                  </p>
                  {decision.detail && (
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-faint">
                      {decision.detail}
                    </p>
                  )}
                </div>
              )}

              {answered && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    {isLast ? "See how you did" : "Next decision"}
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="verdict-in rounded-3xl border border-line bg-surface p-8 text-center sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Your instinct
              </p>
              <div className="mt-4 flex items-baseline justify-center gap-1.5">
                <span
                  className="tabular-nums text-6xl font-bold leading-none"
                  style={{ color: verdict.color }}
                >
                  {score}
                </span>
                <span className="text-xl text-faint">/ {DECISIONS.length}</span>
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                {verdict.headline}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                {verdict.note}
              </p>

              <div className="mt-6 flex items-center justify-center gap-1.5">
                {history.map((ok, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-8 rounded-full",
                      ok ? "bg-accent" : "bg-red-500/60"
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={replay}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <RotateCcw className="size-4" />
                Go again
              </button>
            </div>
          )}
        </div>
      </Reveal>

      {done && !reduce && score >= 4 && (
        <Confetti active originY={0.45} count={90} />
      )}
    </section>
  );
}
