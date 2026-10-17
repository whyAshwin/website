"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Code2, Terminal } from "lucide-react";

type CaseDetail = {
  problem: string;
  fix: string;
  result: string;
  metric: string;
};

type ProjectTerminalProps = {
  detail: CaseDetail;
  children: React.ReactNode;
  className?: string;
};

const LINE_PAUSE = 220;

/**
 * Hover (or keyboard-focus) a case-study card and a terminal slides up,
 * typing out Problem / Fix / Result / Metric one line at a time.
 *
 * The detail is also exposed to assistive tech through a visually hidden
 * block, and the card content always renders — including under reduced motion,
 * where the hover panel is skipped entirely.
 */
export function ProjectTerminal({ detail, children, className }: ProjectTerminalProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [typing, setTyping] = useState("");

  const lines = useMemo(
    () => [
      `> problem   ${detail.problem}`,
      `> fix       ${detail.fix}`,
      `> result    ${detail.result}`,
      `> metric    ${detail.metric}`,
    ],
    [detail.problem, detail.fix, detail.result, detail.metric],
  );

  // Typing engine. Runs only while open, and is fully torn down on leave —
  // both the frame handle and the inter-line timer are cleared, so nothing
  // keeps ticking after the pointer leaves. State is only written from
  // frame/timer callbacks, never from the effect body.
  useEffect(() => {
    if (!open || reduce) return;

    let raf = 0;
    let timer = 0;
    let cancelled = false;
    let line = 0;
    let char = 0;

    const step = () => {
      if (cancelled) return;
      if (line >= lines.length) return;

      const target = lines[line];
      if (char < target.length) {
        char += 1;
        setTyping(target.slice(0, char));
        raf = requestAnimationFrame(step);
        return;
      }

      // Line finished — commit it and stall briefly before the next one.
      char = 0;
      line += 1;
      setTyping("");
      setDone((prev) => (prev.includes(target) ? prev : [...prev, target]));
      if (line < lines.length) {
        timer = window.setTimeout(step, LINE_PAUSE);
      }
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [open, reduce, lines]);

  const start = () => {
    if (reduce || open) return;
    setDone([]);
    setTyping("");
    setOpen(true);
  };

  const stop = () => setOpen(false);

  return (
    <div
      className={cn("group/term relative", className)}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      {children}

      {/* Hover affordance, anchored to the card instead of floating below it */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 z-10 grid size-7 place-items-center rounded-lg border border-line bg-surface/85 text-accent opacity-0 backdrop-blur transition-opacity duration-300 group-hover/term:opacity-100"
      >
        <Terminal className="size-3.5" />
      </span>

      {/* Always readable by screen readers / on no-hover devices */}
      <p className="sr-only">Case study — {lines.join(" ")}</p>

      {open && !reduce && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-line bg-surface p-4 shadow-2xl shadow-black/50"
        >
          <div className="mb-2 flex items-center gap-2">
            <Code2 className="size-3.5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-tighter text-muted">
              case terminal
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-xs leading-tight">
            {done.map((lineText) => (
              <div key={lineText} className="text-faint">
                {lineText}
              </div>
            ))}
            {typing && (
              <div className="text-accent">
                {typing}
                <span className="animate-pulse">█</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
