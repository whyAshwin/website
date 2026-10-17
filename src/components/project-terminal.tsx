"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * Hover a case-study card → a glitchy terminal slides up revealing
 * Problem / Fix / Result / Metric, typed out line by line.
 */
export function ProjectTerminal({ detail, children, className }: ProjectTerminalProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");
  const frame = useRef<number>(undefined);

  const lines = [
    `> problem   ${detail.problem}`,
    `> fix       ${detail.fix}`,
    `> result    ${detail.result}`,
    `> metric    ${detail.metric}`,
  ];

  const startTyping = () => {
    if (open) return;
    setOpen(true);
    setTyped("");
    setLine(0);
    typeNext();
  };

  const stopTyping = () => {
    if (!open) return;
    const stopId = frame.current;
    if (stopId !== undefined) cancelAnimationFrame(stopId);
    setOpen(false);
    setLine(0);
    setTyped("");
  };

  const typeNext = () => {
    if (line >= lines.length) return;
    const target = lines[line];
    let i = 0;
    const tick = () => {
      i++;
      setTyped(target.slice(0, i));
      if (i < target.length) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setLine((l) => l + 1);
        setTimeout(() => typeNext(), 220);
      }
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const stopId = frame.current;
    if (stopId !== undefined) cancelAnimationFrame(stopId);
  }, []);

  if (reduce) {
    return (
      <div className={cn("relative group", className)}>
        <Terminal className="size-4 text-accent opacity-40 group-hover:opacity-100" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative group cursor-pointer", className)}
      onMouseEnter={startTyping}
      onMouseLeave={stopTyping}
    >
      {children}
      <Terminal className="size-4 text-accent opacity-40 group-hover:opacity-100" />

      {open && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-line bg-surface p-4 shadow-2xl shadow-black/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="size-3.5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-tighter text-muted">
              case terminal
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-xs leading-tight">
            {lines.slice(0, line).map((l, i) => (
              <div key={i} className="text-faint">
                {l}
              </div>
            ))}
            {typed && (
              <div className="text-accent">
                {typed}<span className="animate-pulse">█</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
