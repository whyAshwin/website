"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * The shell both scenes share. Keeping it in one place is what makes the two
 * panels read as a matched pair — the contrast is the content, so the framing
 * has to be identical and only the verdict may differ.
 */
export function ScenePanel({
  tone,
  badge,
  name,
  meta,
  placeholder,
  verdict,
  note,
  cta,
  hasRun,
  onRun,
  children,
}: {
  tone: "bad" | "good";
  badge: string;
  name: string;
  meta: string;
  placeholder: string;
  verdict: string;
  note: string;
  cta: string;
  hasRun: boolean;
  onRun: () => void;
  children: ReactNode;
}) {
  const good = tone === "good";

  return (
    <Reveal className="h-full">
      <article
        className={cn(
          "flex h-full flex-col rounded-4xl border bg-surface p-5 transition-colors duration-700 sm:p-6",
          good ? "border-[#3ddc84]/20" : "border-red-500/20",
        )}
      >
        <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
              good
                ? "border-[#3ddc84]/30 bg-[#3ddc84]/10 text-[#3ddc84]"
                : "border-red-500/30 bg-red-500/10 text-red-300",
            )}
          >
            {badge}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            {meta}
          </span>
        </header>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{name}</h3>

        <div className="mt-5">{children}</div>

        {/* Reserved so the card doesn't jump when the verdict lands. */}
        <div className="mt-5 flex-1 lg:min-h-[172px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={hasRun ? "verdict" : "placeholder"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sm leading-relaxed text-fg/90">
                {hasRun ? verdict : placeholder}
              </p>
              {hasRun && (
                <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-faint">
                  {note}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onRun}
          className={cn(
            "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.01] active:scale-[0.98]",
            good ? "bg-[#3ddc84] text-[#052e1b]" : "bg-red-700 text-white",
          )}
        >
          {hasRun ? (
            <RotateCcw className="size-4" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
          {hasRun ? `Run it again` : cta}
        </button>
      </article>
    </Reveal>
  );
}
