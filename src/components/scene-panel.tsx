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
 *
 * It is also a column that can be squeezed: the stage in the middle takes the
 * slack, everything else is sized to what it needs, so the card works at any
 * height without ever pushing the pair off the screen.
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
    <Reveal className="flex min-h-0 min-w-0 flex-1">
      <article
        className={cn(
          "flex h-full min-h-0 w-full min-w-0 flex-col rounded-3xl border bg-surface p-3 transition-colors duration-700 sm:p-4",
          good ? "border-[#3ddc84]/20" : "border-red-500/20",
        )}
      >
        <header className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em]",
              good
                ? "border-[#3ddc84]/30 bg-[#3ddc84]/10 text-[#3ddc84]"
                : "border-red-500/30 bg-red-500/10 text-red-300",
            )}
          >
            {badge}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
            {meta}
          </span>
        </header>

        <h3 className="mt-2 shrink-0 text-base font-semibold tracking-tight sm:text-lg lg:text-xl">
          {name}
        </h3>

        <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>

        {/* Reserved in `lh` so both panels land on the same stage height no
            matter how many lines each verdict and note happen to need — the
            pair is the point, so any difference between them reads as a
            mistake. Reserving the note's space too is what keeps the swap from
            placeholder to verdict from reflowing the card, and the height gate
            is where a short viewport decides the drawing matters more than the
            second beat: 3 lines of verdict always, plus the note's rule and
            margin and 2 more lines when there is room for it. */}
        <div className="mt-3 min-h-[3lh] shrink-0 [@media(min-height:750px)]:min-h-[calc(5lh+17px)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={hasRun ? "verdict" : "placeholder"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="line-clamp-3 text-pretty text-[11px] leading-relaxed text-fg/90 sm:text-xs lg:text-sm">
                {hasRun ? verdict : placeholder}
              </p>
              {hasRun && (
                <p className="mt-2 hidden border-t border-line pt-2 font-mono text-[10px] leading-relaxed text-faint [@media(min-height:750px)]:line-clamp-2">
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
            "mt-3 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:scale-[1.01] active:scale-[0.98] sm:text-sm",
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
