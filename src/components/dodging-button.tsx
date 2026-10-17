"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { Confetti } from "./confetti";

type DodgingButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  /** How close (px) the cursor must get before it runs away. */
  threshold?: number;
  /** Clicks needed while it dodges before it gives up. */
  dodgesToCatch?: number;
  className?: string;
};

/**
 * Button that dodges your cursor. Catch it (click it a few times while it
 * runs) and it surrenders — confetti fires and your onClick runs.
 */
export function DodgingButton({
  children,
  onClick,
  threshold = 130,
  dodgesToCatch = 3,
  className,
}: DodgingButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [dodges, setDodges] = useState(0);
  const [caught, setCaught] = useState(false);
  const caughtRef = useRef(false);
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.4 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });

  const handleMove = useCallback(
    (event: PointerEvent) => {
      if (caughtRef.current) return;
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
        const push = (threshold - dist) * 0.9 + 40;
        x.set(Math.cos(angle) * push);
        y.set(Math.sin(angle) * push);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [threshold, x, y],
  );

  useEffect(() => {
    document.addEventListener("pointermove", handleMove, { passive: true });
    return () => document.removeEventListener("pointermove", handleMove);
  }, [handleMove]);

  const handleClick = () => {
    if (caughtRef.current) {
      onClick?.();
      return;
    }

    const next = dodges + 1;
    setDodges(next);

    // Give it a playful little jump on every attempt.
    x.set((Math.random() - 0.5) * 90);
    y.set((Math.random() - 0.5) * 90);

    if (next >= dodgesToCatch) {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        setOrigin({
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        });
      }
      caughtRef.current = true;
      setCaught(true);
      x.set(0);
      y.set(0);
      setTimeout(() => onClick?.(), 420);
    }
  };

  return (
    <>
      <motion.button
        ref={ref}
        type="button"
        style={{ x: sx, y: sy }}
        onClick={handleClick}
        className={cn(
          "relative inline-flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-fg transition-colors hover:border-accent/50",
          caught && "border-accent bg-accent/15",
          className,
        )}
      >
        {children}
      </motion.button>
      {caught && (
        <Confetti active count={110} originX={origin.x} originY={origin.y} />
      )}
    </>
  );
}
