"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card that tilts in 3D toward the pointer, with an optional glare. */
export function TiltCard({
  children,
  className,
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 18, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ rotateX, rotateY, perspective: 900 }}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
