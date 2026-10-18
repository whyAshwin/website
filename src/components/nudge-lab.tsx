"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  Bell,
  Flame,
  Gift,
  Heart,
  Megaphone,
  Package,
  Repeat,
  Sparkles,
  Tag,
  Wallet,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const MAX = 12;

/**
 * A model, not a measurement — the shape is the point.
 *
 * Opens climb with every nudge and saturate. Retention holds for a while,
 * then starts paying for that pressure. Multiply the two and the number of
 * people actually still there peaks early, then falls.
 */
const opens = (n: number) => 10 + 3.2 * (1 - Math.exp(-n / 2.6));
const retention = (n: number) => Math.max(3, 42 - Math.pow(Math.max(0, n - 2), 1.3) * 1.3);
const stillHere = (n: number) => (opens(n) * 1000 * retention(n)) / 100;

/** Where the two curves multiply out best. Derived, never hand-picked. */
const BEST = (() => {
  let best = 0;
  for (let n = 0; n <= MAX; n++) if (stillHere(n) > stillHere(best)) best = n;
  return best;
})();

/**
 * The app only ever had three things worth saying. Everything after that is
 * inventory it has to move. That's the whole argument, visible at a glance.
 */
const MESSAGES = [
  { icon: Package, text: "Out for delivery today" },
  { icon: Wallet, text: "You saved ₹120 today" },
  { icon: Sparkles, text: "3 saved items got cheaper" },
  { icon: Heart, text: "We miss you — come back?" },
  { icon: Zap, text: "Don't lose your streak!" },
  { icon: Tag, text: "SALE ends tonight" },
  { icon: Flame, text: "2 hours left to claim" },
  { icon: Bell, text: "Just checking in 👀" },
  { icon: Gift, text: "We picked something" },
  { icon: Megaphone, text: "You haven't opened today" },
  { icon: AlertTriangle, text: "Your cart is lonely" },
  { icon: Repeat, text: "Still here. Still waiting." },
] as const;

/** The first three earn the right to be sent. Then the well runs dry. */
const toneOf = (i: number): "useful" | "filler" | "junk" =>
  i < 3 ? "useful" : i < 5 ? "filler" : "junk";

const START = 9; // what a growth team ships, and gets praised for

function verdictFor(n: number) {
  if (n === 0) return { label: "Silence", text: "Nobody's annoyed. Nobody's reminded, either." };
  if (n < BEST)
    return { label: "Restraint", text: "Quiet, respected — and leaving opens on the table." };
  if (n === BEST)
    return { label: "The floor", text: "The most opens, and the most people still around." };
  if (n <= 5)
    return {
      label: "Spending credit",
      text: "The first three messages earned the rest. These are eating into that.",
    };
  if (n <= 8)
    return {
      label: "Buying opens",
      text: "This number looks like growth. It's borrowed against next month.",
    };
  return {
    label: "The loudest option",
    text: "A shout-out in the growth review — and a third of them gone by week four.",
  };
}

const keptColor = (ratio: number) =>
  ratio >= 0.97 ? "#4cc9f0" : ratio >= 0.9 ? "#7c6cff" : ratio >= 0.75 ? "#f5a524" : "#ef4444";

export function NudgeLab() {
  const reduce = useReducedMotion();
  const [nudges, setNudges] = useState(START);
  const [touched, setTouched] = useState(false);
  const [found, setFound] = useState(false);

  const nowOpens = opens(nudges);
  const nowKept = stillHere(nudges);
  const bestKept = stillHere(BEST);
  const atPeak = nudges === BEST;
  const revealed = found || atPeak;
  const gap = Math.round((1 - nowKept / bestKept) * 100);
  const extraOpens = Math.round((nowOpens / opens(BEST) - 1) * 100);
  const keptRatio = nowKept / bestKept;
  const verdict = verdictFor(nudges);

  const onLever = (value: number) => {
    setNudges(value);
    setTouched(true);
    if (value === BEST) setFound(true);
  };

  return (
    <section id="playground" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        kicker="Product playground"
        title="One lever. Two numbers that disagree."
        description="Every growth team can make the first number climb. Drag the lever and watch what the second one does about it."
      />

      <Reveal className="mt-12">
        <div className="rounded-4xl border border-line bg-surface p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-x-12 lg:gap-y-8">
            {/* ── The lever, and what it moves ──────────────────── */}
            <div className="order-1 lg:col-start-2 lg:row-start-1 lg:row-end-2">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="nudge-lever"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
                >
                  Nudges per day
                </label>
                <span className="font-mono text-[11px] tabular-nums text-muted">
                  {nudges} / {MAX}
                </span>
              </div>

              <div className="relative mt-3 h-8">
                {/* Visual track, inset to match the thumb's radius. */}
                <div className="pointer-events-none absolute inset-x-[11px] top-1/2 h-2 -translate-y-1/2 rounded-full bg-surface-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-deep to-accent transition-[width] duration-300 ease-out"
                    style={{ width: `${(nudges / MAX) * 100}%` }}
                  />
                  {revealed && (
                    <span
                      className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-accent-2/70"
                      style={{ left: `${(BEST / MAX) * 100}%` }}
                    />
                  )}
                </div>

                <input
                  id="nudge-lever"
                  type="range"
                  min={0}
                  max={MAX}
                  step={1}
                  value={nudges}
                  onChange={(e) => onLever(Number(e.target.value))}
                  aria-label="Notifications per day"
                  aria-valuetext={`${nudges} notifications per day`}
                  className="lever absolute inset-0 h-full w-full cursor-grab"
                />
              </div>

              <div className="mt-1.5 h-4">
                {!touched && (
                  <motion.span
                    animate={reduce ? undefined : { x: [-3, 3, -3] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-faint"
                  >
                    ← drag me
                  </motion.span>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Meter
                  label="Opening the app"
                  value={`${nowOpens.toFixed(1)}K`}
                  note="daily active users"
                  fill={(nowOpens / opens(MAX)) * 100}
                  color="#7c6cff"
                />
                <Meter
                  label="Still here in 30 days"
                  value={Math.round(nowKept).toLocaleString("en-IN")}
                  note={`${retention(nudges).toFixed(0)}% retention`}
                  fill={keptRatio * 100}
                  color={keptColor(keptRatio)}
                  highlight={atPeak}
                />
              </div>
            </div>

            {/* ── One user, one day ─────────────────────────────── */}
            <div className="order-2 lg:col-start-1 lg:row-start-1 lg:row-end-3">
              <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
                One user · one day
              </p>

              <motion.div
                animate={reduce || nudges < 8 ? { x: 0 } : { x: [0, -1.5, 1.5, -1, 1, 0] }}
                transition={
                  reduce || nudges < 8
                    ? { duration: 0.2 }
                    : { duration: 0.5, repeat: Infinity, repeatDelay: 2.2 }
                }
                className="mx-auto w-full max-w-[248px]"
              >
                <div
                  className={cn(
                    "relative h-[380px] overflow-hidden rounded-[2.4rem] border bg-surface-2 p-2.5 transition-colors duration-500 lg:h-[420px]",
                    nudges >= 9
                      ? "border-red-500/35"
                      : nudges >= 6
                        ? "border-amber-400/25"
                        : "border-line-strong"
                  )}
                >
                  <div className="absolute left-1/2 top-3 z-10 h-1 w-14 -translate-x-1/2 rounded-full bg-surface-3" />

                  <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-[1.9rem] bg-bg/70 p-3 pt-7">
                    {nudges >= 9 && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(120% 70% at 50% 0%, rgba(239,68,68,0.16), transparent 70%)",
                        }}
                      />
                    )}

                    <AnimatePresence initial={false}>
                      {MESSAGES.slice(0, nudges).map((message, i) => {
                        const tone = toneOf(i);
                        const Icon = message.icon;
                        return (
                          <motion.div
                            key={message.text}
                            initial={reduce ? false : { opacity: 0, y: -10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                              "relative flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 backdrop-blur-sm",
                              tone === "useful"
                                ? "border-accent/30 bg-accent/[0.09]"
                                : tone === "filler"
                                  ? "border-line bg-surface-3/70"
                                  : "border-red-500/20 bg-red-500/[0.06]"
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                tone === "useful"
                                  ? "text-accent"
                                  : tone === "filler"
                                    ? "text-muted"
                                    : "text-red-400/80"
                              )}
                            />
                            <span className="truncate text-[11px] leading-tight text-fg/90">
                              {message.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {nudges === 0 && (
                      <div className="grid flex-1 place-items-center">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                          no pings today
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  {nudges} {nudges === 1 ? "notification" : "notifications"} today
                </p>
              </motion.div>
            </div>

            {/* ── The verdict ───────────────────────────────────── */}
            <div className="order-3 flex items-end lg:col-start-2 lg:row-start-2 lg:row-end-3">
              <div
                className="w-full rounded-3xl border p-4 transition-colors duration-500 sm:p-5"
                style={{
                  borderColor: atPeak
                    ? "color-mix(in oklab, #4cc9f0 45%, transparent)"
                    : "var(--color-line)",
                  background: atPeak
                    ? "color-mix(in oklab, #4cc9f0 7%, transparent)"
                    : "var(--color-surface-2)",
                }}
              >
                <div className="flex flex-wrap items-center gap-x-2">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: atPeak ? "#4cc9f0" : "var(--color-accent)" }}
                  >
                    {verdict.label}
                  </span>
                  {revealed && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      · peak at {BEST}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm leading-relaxed text-fg">{verdict.text}</p>

                {gap > 1 && (
                  <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-muted">
                    {extraOpens > 0 && (
                      <span className="text-accent">+{extraOpens}% more opens</span>
                    )}
                    {extraOpens > 0 && <span className="text-faint"> buys </span>}
                    <span style={{ color: keptColor(keptRatio) }}>−{gap}% fewer people</span>
                    <span className="text-faint"> still around</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="mt-8 border-t border-line pt-5 font-mono text-[10px] leading-relaxed text-faint">
            A model, not a measurement. The shape is the point: opens and people are not the same
            number, and only one of them is the product.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Meter({
  label,
  value,
  note,
  fill,
  color,
  highlight,
}: {
  label: string;
  value: string;
  note: string;
  fill: number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-4 transition-colors duration-500 sm:p-5",
        highlight ? "border-accent-2/40 bg-accent-2/[0.05]" : "border-line bg-surface-2"
      )}
    >
      <p className="min-h-[30px] font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        {label}
      </p>
      <p
        className="mt-2 text-3xl font-semibold tabular-nums tracking-tight transition-colors duration-500 sm:text-4xl"
        style={{ color }}
      >
        {value}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full transition-[width,background-color] duration-500 ease-out"
          style={{ width: `${Math.max(2, Math.min(100, fill))}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-2 font-mono text-[10px] text-faint">{note}</p>
    </div>
  );
}
