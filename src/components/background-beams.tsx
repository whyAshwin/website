"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Mirrored clusters of rotated radial-gradient "beams" that slowly drift —
 * the backdrop behind the hero.
 */
export function BackgroundBeams() {
  const reduce = useReducedMotion();

  const beam = (delay: number, mirror = false) =>
    reduce ? null : (
      <motion.div
        key={delay}
        className="pointer-events-none absolute top-0 h-[920px] w-[520px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(124,108,255,0.28) 0%, rgba(124,108,255,0.10) 45%, transparent 80%)",
          transform: `rotate(${mirror ? 45 : -45}deg)`,
          [mirror ? "right" : "left"]: 0,
          transformOrigin: mirror ? "top right" : "top left",
        }}
        animate={{ opacity: [0.25, 0.6, 0.25], y: [-30, 20, -30] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
      />
    );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_72%)]"
    >
      {beam(0)}
      {beam(1.6)}
      {beam(3.1)}
      {beam(0.6, true)}
      {beam(2.2, true)}
      {beam(3.8, true)}
    </div>
  );
}
