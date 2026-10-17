"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Confetti } from "./confetti";

type DodgingButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  threshold?: number;
  dodgesToCatch?: number;
  className?: string;
  caughtLabel?: string;
};

/**
 * Button that dodges your cursor. Catch it (click N times while it runs)
 * and it surrenders — confetti + your onClick fires.
 */
export function DodgingButton({
  children,
  onClick,
  threshold = 150,
  dodgesToCatch = 5,
  className,
  caughtLabel = "Got you!",
}: DodgingButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [dodges, setDodges] = useState(0);
  const [caught, setCaught] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 360, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 360, damping: 28, mass: 0.4 });

  const handleMove = useCallback(
    (event: PointerEvent) => {
      if (caught) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < threshold) {
        const angle = Math.atan2(dy, dx) || Math.random() * Math.PI * 2;
        const push = (threshold - dist) * 0.8 + Math.random() * 40;
        x.set(Math.cos(angle) * push);
        y.set(Math.sin(angle) * push);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [caught, threshold, x, y],
  );

  const handleClick = (event: React.MouseEvent) => {
    if (caught) {
      onClick?.();
      return;
    }
    event.preventDefault();
    const next = dodges + 1;
    setDodges(next);
    const el = ref.current;
    if (el) {
      x.set((Math.random() - 0.5) * 70);
      y.set((Math.random() - 0.5) * 70);
    }
    if (next >= dodgesToCatch) {
      setCaught(true);
      setTimeout(() => {
        onClick?.();
      }, 500);
    }
  };

  useEffect(() => {
    document.addEventListener("pointermove", handleMove, { passive: true });
    return () => document.removeEventListener("pointermove", handleMove);
  }, [handleMove]);

  return (
    <>
      <motion.button
        ref={ref}
        style={{ x: sx, y: sy, display: "inline-block" }}
        onClick={handleClick}
        disabled={caught}
        className={cn(
          "relative flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-accent/50",
          caught && "bg-accent text-bg border-accent shadow-lg shadow-accent/25",
          className,
        )}
      >
        <span className="relative z-10">
          {caught ? (
            <>
              <Check className="size-4" /> {caughtLabel}
            </>
          ) : (
            children
          )}
        </span>
        {!caught && (
          <span className="absolute -inset-px rounded-full border border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.button>
      {caught && (
        <Confetti
          active
          count={100}
          originX={0.5}
          originY={0.2}
          colors={["#7c6cff", "#4cc9f0", "#f472b6", "#a3e635", "#fff"]}
        />
      )}
    </>
  );
}
