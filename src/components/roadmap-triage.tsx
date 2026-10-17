"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, ChevronRight, Minus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

type Kind = "compounding" | "enabler" | "bet" | "trap" | "vanity";

type Item = {
  id: string;
  /** Capacity slots this costs. */
  cost: 1 | 2;
  title: string;
  /** Who is asking, and what they bring. */
  ask: string;
  /** The pitch, verbatim. Stakeholders are persuasive by trade. */
  pitch: string;
  /** The evidence you'd actually have on hand. Two lines. */
  signals: [string, string];
  kind: Kind;
  /** Points if shipped. Traps can still be positive — saving revenue is real. */
  score: number;
  /** One concrete outcome fragment, for the net-effect chips. */
  delta: string;
  /** What actually happened if you shipped it. */
  shipped: string;
  /** What it cost you to leave it undone. */
  skipped: string;
};

type Scenario = {
  id: string;
  quarter: string;
  brief: string;
  slots: number;
  /** Best achievable score — the bar for a sharp quarter. */
  par: number;
  items: Item[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "q1",
    quarter: "Q1 · Activation",
    brief:
      "Activation is your top leak. The CEO just watched a competitor's AI demo. Eight things want your three slots.",
    slots: 3,
    par: 31,
    items: [
      {
        id: "onboarding",
        cost: 1,
        title: "Rebuild the first-run onboarding",
        ask: "Growth · the top funnel leak",
        pitch:
          "Users sign up, then stall at step two. We lose 40% of them before they ever see the point.",
        signals: [
          "Funnel shows a cliff at identity verification",
          "Support tickets say 'confusing' 3× more often on mobile",
        ],
        kind: "compounding",
        score: 12,
        delta: "Activation +11pts",
        shipped:
          "Activation +11pts in six weeks. No launch post. It compounds anyway.",
        skipped:
          "The leak kept leaking, and every downstream metric kept paying the tax.",
      },
      {
        id: "search",
        cost: 1,
        title: "Fix search ranking",
        ask: "Support + Data · top ticket driver",
        pitch:
          "One in five searches returns nothing. Users conclude the catalog is empty and leave.",
        signals: [
          "Zero-result rate: 19%",
          "Cheap — existing embeddings, no new infrastructure",
        ],
        kind: "compounding",
        score: 10,
        delta: "Zero-result 19% → 6%",
        shipped:
          "Zero-result rate 19% → 6%. Quiet, cheap, and it lifted conversion in the same quarter.",
        skipped:
          "One in five searches kept dead-ending on an empty page.",
      },
      {
        id: "pricing",
        cost: 1,
        title: "Repackage pricing into three tiers",
        ask: "Finance · expansion revenue",
        pitch:
          "Enterprise pays the same as a three-person team. We're leaving money on the table.",
        signals: [
          "Q4 test: three tiers converted better than five",
          "Finance can ship it in-product — no engineering",
        ],
        kind: "compounding",
        score: 9,
        delta: "Expansion rev +14%",
        shipped:
          "Expansion revenue +14% with zero new users. The least glamorous win on the board.",
        skipped: "Every enterprise account kept paying small-team prices.",
      },
      {
        id: "latency",
        cost: 2,
        title: "Halve p95 latency",
        ask: "Engineering · platform debt",
        pitch:
          "We patch the same bottleneck every sprint. It taxes every feature we try to build.",
        signals: [
          "Enabler: unblocks three items on this very list",
          "Moves no user-facing metric this quarter",
        ],
        kind: "enabler",
        score: 7,
        delta: "p95 −50% next quarter",
        shipped:
          "Invisible for six weeks. Next quarter, every feature shipped roughly 30% faster.",
        skipped: "You kept paying the same tax, every sprint, in every project.",
      },
      {
        id: "apex",
        cost: 2,
        title: "Bespoke export for Apex Retail",
        ask: "Sales · one account, 38% of ARR",
        pitch: "Apex calls this a dealbreaker. They renew in six weeks.",
        signals: [
          "One account. Custom schema, custom cadence",
          "Three eng-weeks, and nothing reusable for the other 400",
        ],
        kind: "trap",
        score: 8,
        delta: "1 account kept · 1 lock-in",
        shipped:
          "Apex renewed. You also sold your roadmap's freedom — now every large account expects its own build.",
        skipped:
          "Apex churned. Loud, and expensive — but you kept a roadmap that serves 400 accounts.",
      },
      {
        id: "ai",
        cost: 2,
        title: "Ship an AI copilot (beta)",
        ask: "CEO · the board deck",
        pitch:
          "Every competitor just shipped AI. We need one before the offsite.",
        signals: [
          "No user problem in the brief",
          "Two engineers, no PM, 'just figure it out'",
        ],
        kind: "vanity",
        score: 2,
        delta: "4% weekly use, flat",
        shipped:
          "A demo won the offsite and lost the user. 4% weekly use, then flat.",
        skipped:
          "The board asked about AI for two meetings. Then they asked about retention.",
      },
      {
        id: "darkmode",
        cost: 1,
        title: "Dark mode",
        ask: "400 upvotes · public board",
        pitch: "It's the single most-requested feature on the roadmap board.",
        signals: [
          "Requested loudly by the loudest 2%",
          "No metric attaches to it",
        ],
        kind: "vanity",
        score: 1,
        delta: "A feature, no metric",
        shipped:
          "Beloved by the people who asked for it. It moved no number you report on.",
        skipped: "The board stayed noisy. Nothing else changed.",
      },
      {
        id: "workspaces",
        cost: 1,
        title: "Match the competitor's 'Workspaces'",
        ask: "CEO · after a demo",
        pitch:
          "A competitor shipped Workspaces last week. We can't be seen to be behind.",
        signals: ["Zero inbound requests for it", "Their launch post: 12 likes"],
        kind: "vanity",
        score: -3,
        delta: "A feature nobody asked for",
        shipped:
          "You built a feature nobody asked for, to match a competitor nobody uses.",
        skipped: "Nothing happened. It was noise.",
      },
    ],
  },
  {
    id: "q2",
    quarter: "Q2 · Churn",
    brief:
      "Growth flattened and churn crept up. Everyone has a theory and a pet project. Three slots, again.",
    slots: 3,
    par: 24,
    items: [
      {
        id: "reliability",
        cost: 2,
        title: "Fix the checkout timeouts",
        ask: "Data · reliability",
        pitch:
          "0.8% of checkouts time out mid-payment. Support escalates them every single day.",
        signals: [
          "Each timeout costs ~$40 in refunds and re-orders",
          "Root cause is a known database contention bug",
        ],
        kind: "compounding",
        score: 11,
        delta: "Timeouts 0.8% → 0.1%",
        shipped:
          "Timeouts 0.8% → 0.1%. Refund spend fell $18K a quarter. Nobody wrote a blog post.",
        skipped:
          "The same 0.8% kept timing out, every day, in the most expensive part of the funnel.",
      },
      {
        id: "winback",
        cost: 1,
        title: "Win-back flow for churned accounts",
        ask: "Lifecycle · retention",
        pitch:
          "We lose 8% of accounts a month and never speak to them again.",
        signals: [
          "Exit interviews: most say 'we forgot we existed'",
          "The lifecycle tool is already paid for — and unused",
        ],
        kind: "compounding",
        score: 9,
        delta: "3.5% of churn recovered",
        shipped:
          "Recovered 3.5% of churn in the first month. Cheap, boring, compounding.",
        skipped:
          "Churned accounts stayed gone — silently, and in growing numbers.",
      },
      {
        id: "perf-mobile",
        cost: 1,
        title: "Make the app usable on slow Android",
        ask: "Support · mobile",
        pitch:
          "Half our users are on mid-range Android and the app takes eight seconds to load.",
        signals: [
          "Session length is 40% lower on slow devices",
          "Known wins: image pipeline, route splitting",
        ],
        kind: "compounding",
        score: 8,
        delta: "Load 8s → 3s",
        shipped:
          "Load time 8s → 3s on mid-range Android. Session length recovered with it.",
        skipped:
          "Half your users kept waiting eight seconds for a page that should take three.",
      },
      {
        id: "sso",
        cost: 1,
        title: "Real SSO — standard, not a custom build",
        ask: "Sales · enterprise checklist",
        pitch: "Every enterprise RFP asks for SSO. It's table stakes.",
        signals: [
          "Standard SAML — reusable across every account",
          "Unblocks six deals stuck in security review",
        ],
        kind: "enabler",
        score: 7,
        delta: "6 deals unblocked",
        shipped:
          "Six stuck deals cleared security review. Standard, reusable, invisible.",
        skipped: "Six enterprise deals stayed stuck in security review.",
      },
      {
        id: "api",
        cost: 2,
        title: "Public API v1",
        ask: "Sales · developer channel",
        pitch:
          "Our most technical customers keep asking to build on top of us.",
        signals: [
          "Twelve accounts asked, unprompted",
          "Opens a channel you can't cheaply un-ship",
        ],
        kind: "bet",
        score: 9,
        delta: "A channel you now own",
        shipped:
          "Two integrations launched on it in month one. You own a channel now.",
        skipped:
          "Every builder kept asking. A few started looking for a platform that would answer.",
      },
      {
        id: "reports",
        cost: 2,
        title: "Custom report builder",
        ask: "Sales · three prospects",
        pitch:
          "Three enterprise prospects say they'll sign — if they can build their own reports.",
        signals: [
          "'Three prospects' — none of them are in contract",
          "Last quarter's bespoke build, all over again",
        ],
        kind: "trap",
        score: 6,
        delta: "1 prospect · 1 lock-in",
        shipped:
          "One of the three signed. The other two didn't. You shipped a report builder nobody else uses.",
        skipped:
          "None of the three signed. None of them had asked before this deal.",
      },
      {
        id: "redesign",
        cost: 2,
        title: "Full visual redesign",
        ask: "Marketing · brand",
        pitch: "The product looks dated next to newer competitors.",
        signals: [
          "No usability data behind the brief",
          "Six eng-weeks that freeze the whole roadmap",
        ],
        kind: "vanity",
        score: 1,
        delta: "Prettier screenshots",
        shipped:
          "It looked better in screenshots. Users didn't notice, and you froze the roadmap for six weeks.",
        skipped: "It kept looking dated. Users kept using it anyway.",
      },
      {
        id: "nps",
        cost: 1,
        title: "Ship an NPS survey",
        ask: "Leadership · 'how do users feel?'",
        pitch: "We have no idea how users feel. Let's finally measure it.",
        signals: [
          "You already have usage data nobody reads",
          "A number with no owner and no action attached",
        ],
        kind: "vanity",
        score: -1,
        delta: "A number nobody acts on",
        shipped:
          "You got an NPS score. You still don't know what to do about it.",
        skipped:
          "You kept using behaviour instead of opinions. Nothing was lost.",
      },
    ],
  },
];

type Tone = "green" | "accent" | "amber" | "orange" | "red";

const TONE_COLOR: Record<Tone, string> = {
  green: "#22c55e",
  accent: "#7c6cff",
  amber: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
};

const TIER: Record<Tone, string> = {
  green: "Sharp",
  accent: "Solid",
  amber: "Mixed",
  orange: "Soft",
  red: "Off-brief",
};

function readRoadmap(
  shipped: Item[],
  skipped: Item[],
  remaining: number,
  par: number
) {
  const total = shipped.reduce((sum, item) => sum + item.score, 0);
  const ratio = par > 0 ? total / par : 0;

  let headline: string;
  let tone: Tone;
  if (ratio >= 0.95) {
    headline = "You optimized for compounding, not for applause.";
    tone = "green";
  } else if (ratio >= 0.7) {
    headline = "A strong quarter — one of those slots wasn't the sharpest.";
    tone = "accent";
  } else if (ratio >= 0.45) {
    headline = "Half a product quarter: one leak closed, two left open.";
    tone = "amber";
  } else if (ratio >= 0.2) {
    headline = "You shipped the loudest asks, not the biggest leaks.";
    tone = "orange";
  } else {
    headline = "A stakeholder-pleasing quarter, not a product one.";
    tone = "red";
  }

  const notes: string[] = [];

  const traps = shipped.filter((i) => i.kind === "trap" || i.kind === "vanity");
  if (traps.length > 0) {
    notes.push(
      `${traps.map((t) => t.title).join(" and ")} — built for whoever asked loudest, not for a number that moves.`
    );
  }

  const accrualSkipped = skipped.filter(
    (i) => i.kind === "compounding" || i.kind === "enabler"
  );
  if (accrualSkipped.length > 0) {
    notes.push(
      `${accrualSkipped[0].title} stayed broken — still broken at the end of the quarter.`
    );
  }

  if (remaining > 0) {
    notes.push(
      `You shipped with ${remaining} slot${remaining > 1 ? "s" : ""} unused. Restraint is a choice; idle capacity is a missed bet.`
    );
  }

  if (ratio >= 0.95) {
    notes.push("Nothing on that list will make a launch post. That's the point.");
  }

  return { total, headline, tone, notes };
}

export function RoadmapTriage() {
  const reduce = useReducedMotion();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  const scenario = SCENARIOS[scenarioIndex];
  const used = scenario.items
    .filter((item) => picked.includes(item.id))
    .reduce((sum, item) => sum + item.cost, 0);
  const remaining = scenario.slots - used;

  const shipped = scenario.items.filter((item) => picked.includes(item.id));
  const skipped = scenario.items.filter((item) => !picked.includes(item.id));
  const read = readRoadmap(shipped, skipped, remaining, scenario.par);

  const reset = (nextIndex: number) => {
    setScenarioIndex(((nextIndex % SCENARIOS.length) + SCENARIOS.length) % SCENARIOS.length);
    setPicked([]);
    setRevealed(false);
  };

  const toggle = (item: Item) => {
    if (revealed) return;
    setPicked((prev) => {
      if (prev.includes(item.id)) return prev.filter((id) => id !== item.id);
      if (item.cost > remaining) return prev;
      return [...prev, item.id];
    });
  };

  return (
    <section id="playground" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        kicker="Product playground"
        title="You have three slots. Eight people want them."
        description="Quarterly planning, compressed. Every card shows the pitch — and the evidence behind it. Spend your capacity, then live with what you skipped."
      />

      <Reveal className="mt-12">
        {/* Brief + capacity */}
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {scenario.quarter}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {scenario.brief}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                Capacity
              </p>
              <div className="mt-2 flex justify-end gap-1.5">
                {Array.from({ length: scenario.slots }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-2.5 w-6 rounded-full transition-colors duration-300",
                      i < used ? "bg-accent" : "bg-surface-3"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Backlog */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {scenario.items.map((item, index) => {
            const isPicked = picked.includes(item.id);
            const unaffordable = !isPicked && item.cost > remaining && !revealed;
            const isSkipped = revealed && !isPicked;
            const isShipped = revealed && isPicked;

            return (
              <label
                key={item.id}
                style={{
                  animationDelay: revealed && !reduce ? `${index * 55}ms` : undefined,
                }}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-5 transition-all duration-300",
                  revealed && "verdict-in",
                  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/60 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg",
                  !revealed &&
                    "cursor-pointer hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2",
                  !revealed && isPicked && "border-accent bg-accent/[0.07]",
                  !revealed && !isPicked && "border-line bg-surface",
                  unaffordable && "cursor-not-allowed opacity-40 hover:translate-y-0",
                  isSkipped && "border-line bg-surface opacity-55",
                  isShipped && "border-accent/60 bg-accent/[0.07]"
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isPicked}
                  disabled={revealed || unaffordable}
                  onChange={() => toggle(item)}
                />

                {/* Status row */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  {revealed ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em]",
                        isShipped ? "text-accent" : "text-faint"
                      )}
                    >
                      {isShipped ? (
                        <>
                          <Check className="size-3" /> Shipped
                        </>
                      ) : (
                        <>
                          <Minus className="size-3" /> Skipped
                        </>
                      )}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-md border transition-colors",
                        isPicked
                          ? "border-accent bg-accent text-bg"
                          : "border-line-strong text-transparent"
                      )}
                    >
                      <Check className="size-3.5" />
                    </span>
                  )}

                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    {item.cost} slot{item.cost > 1 ? "s" : ""}
                  </span>
                </div>

                <h3 className="text-base font-semibold leading-snug text-fg">
                  {item.title}
                </h3>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {item.ask}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  &ldquo;{item.pitch}&rdquo;
                </p>

                {/* Evidence (planning) or outcome (revealed) */}
                {!revealed ? (
                  <ul className="mt-auto space-y-1.5 border-t border-line pt-3">
                    {item.signals.map((signal) => (
                      <li
                        key={signal}
                        className="flex gap-2 font-mono text-[11px] leading-snug text-faint"
                      >
                        <span className="text-accent">▸</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className={cn(
                      "mt-auto border-t border-line pt-3 text-sm leading-relaxed",
                      isShipped ? "text-fg" : "text-faint"
                    )}
                  >
                    {isShipped ? item.shipped : item.skipped}
                  </p>
                )}
              </label>
            );
          })}
        </div>

        {/* Action / verdict */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          {!revealed ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                {picked.length === 0
                  ? "Nothing committed yet"
                  : `${used} of ${scenario.slots} slots committed`}
              </p>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                disabled={picked.length === 0}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all",
                  picked.length === 0
                    ? "cursor-not-allowed border border-line text-muted"
                    : "bg-accent text-bg hover:scale-[1.02] active:scale-95"
                )}
              >
                Ship the quarter
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : (
            <div className="verdict-in">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xl">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    The read
                  </p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl">
                    {read.headline}
                  </h3>
                  {read.notes.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {read.notes.map((note) => (
                        <li
                          key={note}
                          className="flex gap-2 text-sm leading-relaxed text-muted"
                        >
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="shrink-0 sm:text-right">
                  <div className="flex items-baseline gap-2 sm:justify-end">
                    <span
                      className="tabular-nums text-4xl font-bold leading-none"
                      style={{ color: TONE_COLOR[read.tone] }}
                    >
                      {read.total}
                    </span>
                    <span className="font-mono text-xs text-faint">
                      / {scenario.par}
                    </span>
                  </div>
                  <p
                    className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: TONE_COLOR[read.tone] }}
                  >
                    {TIER[read.tone]} quarter
                  </p>
                </div>
              </div>

              {/* Net effect */}
              <div className="mt-6 border-t border-line pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                  Net effect
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {shipped.map((item) => (
                    <span
                      key={item.id}
                      className={cn(
                        "rounded-full border px-3 py-1 font-mono text-[11px]",
                        item.score >= 5
                          ? "border-accent/40 bg-accent/10 text-accent-soft"
                          : item.score > 0
                            ? "border-line text-muted"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                      )}
                    >
                      {item.delta}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => reset(scenarioIndex)}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <RotateCcw className="size-4" />
                  Run it back
                </button>
                <button
                  type="button"
                  onClick={() => reset(scenarioIndex + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  Next quarter
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
