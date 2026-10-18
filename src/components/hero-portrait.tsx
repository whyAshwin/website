"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "@/lib/content";

/**
 * Greetings cycled by tapping the portrait — the same seven, in the same
 * order, as the reference.
 */
const GREETINGS = [
  "glad you're here 🌌",
  "thanks for stopping by 🙇",
  "stay a while, wander around ✨",
  "well, hello there 👋",
  "make yourself at home 🍵",
  "curiosity brought you here - nice 🚀",
  "have a lovely day ✨",
] as const;

/** The perimeter ring's travelling-dash keyframes. */
const RING_DASHES = ["15 120 25 25", "16 25 92 72", "4 250 22 22"];

/**
 * The hero portrait. A dashed ring travels around the perimeter while it
 * rotates back and forth; hovering reveals a greeting pill, and tapping it
 * cycles to the next greeting.
 *
 * The photo is deliberately inert: hover and press are variant labels on the
 * button, and only the ring wrapper subscribes to them, so the portrait and
 * the pill never move.
 */
export function HeroPortrait({ show }: { show: boolean }) {
  const reduce = useReducedMotion();
  const [greeting, setGreeting] = useState(0);

  const ringStates = reduce
    ? { rest: { scale: 1 }, hover: { scale: 1 }, tap: { scale: 1 } }
    : { rest: { scale: 1 }, hover: { scale: 1.01 }, tap: { scale: 0.985 } };

  return (
    <div className="relative size-[280px] sm:size-[360px] lg:size-[420px]">
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-accent/25 blur-3xl" />

      <motion.button
        type="button"
        onClick={() => setGreeting((g) => (g + 1) % GREETINGS.length)}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap="tap"
        aria-label={`Photo. Tap to cycle greeting: ${GREETINGS[greeting]}`}
        className="group absolute inset-0 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {/* Perimeter: the dash pattern travels while the ring rotates, then
            reverses. The only element that reacts to hover and press. */}
        <motion.div
          variants={ringStates}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="absolute inset-0"
        >
          <svg
            viewBox="0 0 506 506"
            fill="transparent"
            className="absolute inset-0 size-full text-accent"
            aria-hidden
          >
            <motion.circle
              cx="253"
              cy="253"
              r="250"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: "24 10 0 0" }}
              animate={
                reduce
                  ? { strokeDasharray: "24 10 0 0" }
                  : { strokeDasharray: RING_DASHES, rotate: [120, 360] }
              }
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            />
          </svg>
        </motion.div>

        {/* Portrait. The circle clips everything inside it, so the greeting
            below can never spill past the photo's edge. */}
        <div className="absolute inset-6 overflow-hidden rounded-full border border-line-strong bg-surface-2">
          <motion.div
            initial={{ filter: "blur(24px)", scale: 1.12 }}
            animate={show ? { filter: "blur(0px)", scale: 1 } : undefined}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative size-full"
          >
            <Image
              src="/profile.jpg"
              alt={profile.name}
              fill
              priority
              sizes="(max-width: 1024px) 360px, 420px"
              className="object-cover"
            />
          </motion.div>

          {/* Greeting pill — hidden until hover, flips its text on click.
              `w-max` is load-bearing: without it the pill would size against
              the 50% of space left of its `left-1/2` anchor and wrap far
              earlier than it needs to. The circle is ~65% wide at the pill's
              baseline, so the 58% cap guarantees it stays inside the photo
              while still fitting the long greetings on two lines. */}
          <span className="pointer-events-none absolute bottom-[12%] left-1/2 w-max max-w-[58%] -translate-x-1/2 overflow-hidden rounded-full bg-black/50 px-3 py-1 text-center text-[10px] uppercase leading-snug tracking-[0.15em] text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={greeting}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="block"
              >
                {GREETINGS[greeting]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </motion.button>
    </div>
  );
}
