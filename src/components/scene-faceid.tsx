"use client";

import Image from "next/image";
import { useEffect, type CSSProperties } from "react";
import { MotionConfig, motion, useReducedMotion, type Variants } from "motion/react";
import { useBeats, type Beat } from "@/lib/use-beats";
import { fitScale } from "@/lib/fit";
import { ScenePanel } from "./scene-panel";

/**
 * Face ID. The whole story is that there is no story — nothing was pressed,
 * nothing was chosen, and the thing was already done.
 *
 * The sweep is the real one: the dots light clockwise from the top while a
 * scan line reads the face left to right. Ashwin's own portrait stands in for
 * the face, which keeps it honest and avoids borrowing a stranger's.
 */

type Phase = "idle" | "wake" | "scan" | "match" | "unlock" | "home";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TICK_COUNT = 44;
const FACE = 100; // px — the face circle, and the width the scan line crosses
const R_IN = 72;
const R_OUT = 90;

/**
 * The scene's design footprint, a little larger than the phone itself so the
 * handset never presses against the edges of the stage. Fitting the drawing to
 * this box is what lets the stage be whatever height the viewport has left.
 */
const DESIGN = { w: 220, h: 420 };
/** Scaled against the stage; a little headroom lets it fill a roomy screen. */
const FIT = fitScale(DESIGN.w, DESIGN.h, 1.15);

/** Radial ticks, first one at twelve o'clock, running clockwise. */
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const a = ((i / TICK_COUNT) * 360 - 90) * (Math.PI / 180);
  return {
    x1: 100 + R_IN * Math.cos(a),
    y1: 100 + R_IN * Math.sin(a),
    x2: 100 + R_OUT * Math.cos(a),
    y2: 100 + R_OUT * Math.sin(a),
  };
});

/** Each tick lights as the sweep reaches it, then settles in reverse. */
const TICK_VARIANTS: Variants[] = TICKS.map((_, i) => {
  const around = i / TICK_COUNT;
  return {
    idle: { stroke: "#2b2b34", opacity: 0.5 },
    wake: { stroke: "#2b2b34", opacity: 0.68, transition: { duration: 0.3 } },
    scan: {
      stroke: "#3ddc84",
      opacity: 1,
      transition: { delay: 0.05 + around * 0.82, duration: 0.22 },
    },
    match: {
      stroke: "#3ddc84",
      opacity: 1,
      transition: { delay: (1 - around) * 0.14, duration: 0.18 },
    },
    unlock: { stroke: "#3ddc84", opacity: 1, transition: { duration: 0.3 } },
    home: { stroke: "#3ddc84", opacity: 0.75, transition: { duration: 0.5 } },
  };
});

const TICK_BEATS = Array.from({ length: 10 }, (_, i): Beat<Phase> => ({
  at: 780 + i * 92,
  cue: "tick",
  opts: { semitones: i * 1.15, gain: 0.85 },
}));

const BEATS: readonly Beat<Phase>[] = [
  { at: 0, phase: "wake", cue: "swipe", opts: { gain: 0.5 } },
  { at: 620, phase: "scan", cue: "scan" },
  ...TICK_BEATS,
  // Softer than the scan's last dot so the ding that follows is the event, not
  // a second ping competing with it.
  { at: 1740, phase: "match", cue: "tick", opts: { semitones: 12, gain: 0.9 } },
  { at: 2060, phase: "unlock", cue: "unlock" },
  { at: 3000, phase: "home", cue: "swipe", opts: { gain: 0.6 } },
];

const PHONE: Variants = {
  idle: { rotateY: -7, rotateX: 3, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  wake: { rotateY: -7, rotateX: 3, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  scan: { rotateY: -7, rotateX: 3, y: 0 },
  match: { rotateY: -6, rotateX: 2.4, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  unlock: {
    rotateY: -2.5,
    rotateX: 0.8,
    y: -6,
    transition: { type: "spring", stiffness: 190, damping: 20 },
  },
  home: { rotateY: 0, rotateX: 0, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const GLYPH: Variants = {
  idle: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
  wake: { opacity: 0.9, scale: 1.04, transition: { duration: 0.5, ease: EASE_OUT } },
  scan: { opacity: 0, scale: 0.86, transition: { duration: 0.3 } },
  match: { opacity: 0, scale: 0.86 },
  unlock: { opacity: 0, scale: 0.86 },
  home: { opacity: 0, scale: 0.86 },
};

/** The padlock sits still while the phone works, then settles back. */
const LOCK: Variants = {
  idle: { opacity: 0.8, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  wake: { opacity: 0.95, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  scan: { opacity: 0.9, scale: 1 },
  match: { opacity: 1, scale: 1 },
  unlock: {
    opacity: 1,
    scale: [1, 1.14, 1],
    transition: { duration: 0.5, ease: EASE_OUT },
  },
  home: { opacity: 0, scale: 0.94, transition: { duration: 0.45, ease: EASE_OUT } },
};

const SCANNER: Variants = {
  idle: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  wake: { opacity: 0, scale: 0.92, transition: { duration: 0.3 } },
  scan: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  match: { opacity: 1, scale: 1.02, transition: { duration: 0.35, ease: EASE_OUT } },
  unlock: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  home: { opacity: 0, scale: 1.14, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** The scan line reads the face left to right, exactly once. */
const REVEAL: Variants = {
  idle: { clipPath: "inset(0 100% 0 0)" },
  wake: { clipPath: "inset(0 100% 0 0)" },
  scan: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.95, ease: "easeInOut" } },
  match: { clipPath: "inset(0 0% 0 0)" },
  unlock: { clipPath: "inset(0 0% 0 0)" },
  home: { clipPath: "inset(0 0% 0 0)" },
};

const LINE: Variants = {
  idle: { x: 0, opacity: 0 },
  wake: { x: 0, opacity: 0 },
  scan: {
    x: FACE,
    opacity: 1,
    transition: { duration: 0.95, ease: "easeInOut", opacity: { duration: 0.2 } },
  },
  match: { x: FACE, opacity: 0, transition: { duration: 0.35 } },
  unlock: { x: FACE, opacity: 0 },
  home: { x: FACE, opacity: 0 },
};

const WALLPAPER: Variants = {
  idle: { opacity: 0 },
  wake: { opacity: 0.08, transition: { duration: 0.5 } },
  scan: { opacity: 0.08 },
  match: { opacity: 0.12, transition: { duration: 0.4 } },
  unlock: { opacity: 0.55, transition: { duration: 0.8, ease: EASE_OUT } },
  home: { opacity: 1, transition: { duration: 0.9, ease: EASE_OUT } },
};

const GLOW: Variants = {
  idle: { opacity: 0 },
  wake: { opacity: 0 },
  scan: { opacity: 0.18, transition: { duration: 0.5 } },
  match: { opacity: 0.55, transition: { duration: 0.4 } },
  unlock: { opacity: 0.42, transition: { duration: 0.6 } },
  home: { opacity: 0.2, transition: { duration: 0.8 } },
};

export function SceneFaceId({ runSignal = 0 }: { runSignal?: number }) {
  const { phase, runId, run, hasRun } = useBeats(BEATS, "idle", "home", "unlock");
  const unlocked = phase === "unlock" || phase === "home";
  /** The shackle's flip is CSS, so it opts out of the movement by hand. */
  const reduce = useReducedMotion();

  useEffect(() => {
    if (runSignal === 0) return;
    run();
  }, [runSignal, run]);

  const label = !hasRun
    ? "An iPhone showing the Face ID mark, waiting."
    : unlocked
      ? "An iPhone that has been unlocked by Face ID — no button pressed, no code entered."
      : "An iPhone scanning a face with Face ID.";

  return (
    <ScenePanel
      tone="good"
      badge="Great product experience"
      name="Face ID"
      meta="2017 → today"
      placeholder="One decision, removed from your day."
      verdict="Thirty thousand infrared dots, one glance, and nothing was asked of you. No button, no code, no choice — it had already finished before you were done deciding to look."
      note="The work is enormous and completely invisible. That is the trick: the best interaction never becomes a decision in the first place."
      cta="Look at it"
      hasRun={hasRun}
      onRun={run}
    >
      <MotionConfig reducedMotion="user">
        {/* `container-type: size` is what the drawing measures itself against,
            and it also means the scene can never push the stage taller. */}
        <div
          role="img"
          aria-label={label}
          className="relative flex min-h-[96px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-3xl border border-line [container-type:size]"
          style={{
            background: "radial-gradient(120% 90% at 50% 100%, #141420 0%, #0b0b0f 62%)",
          }}
        >
          <motion.div
            key={runId}
            initial="idle"
            animate={phase}
            variants={PHONE}
            className="relative shrink-0 [scale:var(--fit)] [transition:scale_0.35s_cubic-bezier(0.16,1,0.3,1)]"
            style={
              { perspective: 1200, transformStyle: "preserve-3d", "--fit": FIT } as CSSProperties
            }
          >
            {/* The glow belongs to the phone, so it scales with it. */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 aspect-square w-[126%] rounded-full bg-accent/25 blur-3xl [translate:-50%_-50%]"
            />

            <div className="relative h-[386px] w-[190px] rounded-[34px] bg-[#1b1c22] p-[8px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              <div className="relative size-full overflow-hidden rounded-[27px] bg-black">
                {/* Wallpaper, waiting behind everything. */}
                <motion.div
                  aria-hidden
                  variants={WALLPAPER}
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 50% 0%, #4b3fd6 0%, #241a63 45%, #0a0a12 100%)",
                  }}
                />

                {/* Notch */}
                <div className="absolute left-1/2 top-0 z-20 h-[20px] w-[84px] -translate-x-1/2 rounded-b-[11px] bg-black">
                  <div className="absolute left-1/2 top-[7px] h-[3px] w-[34px] -translate-x-1/2 rounded-full bg-[#26262e]" />
                  <div className="absolute right-[13px] top-[7px] size-[4px] rounded-full bg-[#2c2e3a]" />
                </div>

                {/* Status bar */}
                <div className="absolute inset-x-0 top-0 z-10 flex h-[22px] items-center justify-between px-[16px] text-[9px] font-semibold leading-none text-white">
                  <span>9:41</span>
                  <span className="flex items-center gap-[3px]">
                    <span className="flex items-end gap-[1.5px]">
                      <span className="h-[3px] w-[2.5px] rounded-[1px] bg-white" />
                      <span className="h-[5px] w-[2.5px] rounded-[1px] bg-white" />
                      <span className="h-[7px] w-[2.5px] rounded-[1px] bg-white" />
                      <span className="h-[9px] w-[2.5px] rounded-[1px] bg-white/40" />
                    </span>
                    <svg viewBox="0 0 16 12" className="h-[9px] w-[12px] fill-white">
                      <path d="M8 10.4 1.1 3.9A10.4 10.4 0 0 1 8 1a10.4 10.4 0 0 1 6.9 2.9L8 10.4Z" />
                    </svg>
                    <span className="flex items-center gap-[1px]">
                      <span className="flex h-[9px] w-[17px] items-center rounded-[2.5px] border border-white/50 p-[1px]">
                        <span className="h-full w-[11px] rounded-[1px] bg-white" />
                      </span>
                      <span className="h-[4px] w-[1.5px] rounded-r-[1px] bg-white/50" />
                    </span>
                  </span>
                </div>

                {/* Padlock — drawn, so the shackle is a real hinge that swings
                    clear of the body. iOS animates one part here rather than
                    cross-fading two glyphs, which is what makes it read as a
                    lock flipping open instead of an icon being swapped.

                    Motion owns the fade and the pop on the wrapper, but it
                    writes `transform-origin` on SVG children and overwrites
                    anything set here, so the hinge rides the individual
                    `rotate` property instead — which Motion never touches.
                    `fill-box` pins the origin to the shackle's own corner:
                    0%/100% is the bottom of its left leg, the hinge, with no
                    magic numbers. The overshoot in the curve is the flip. */}
                <motion.div
                  aria-hidden
                  variants={LOCK}
                  className="absolute inset-x-0 top-[52px] z-10 flex justify-center text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-[17px]">
                    {/* Shackle first, body over it: the leg disappears into the
                        body when locked, and swings clear when it opens. */}
                    <path
                      d="M8.3 11.6V8.2a3.7 3.7 0 0 1 7.4 0v3.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      className={unlocked ? "[rotate:-46deg]" : "[rotate:0deg]"}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "0% 100%",
                        transition: reduce ? "none" : "rotate 460ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    />
                    <rect x="4" y="11.6" width="16" height="11.4" rx="3.8" fill="currentColor" />
                  </svg>
                </motion.div>

                {/* The Face ID mark, before anything starts. */}
                <motion.div
                  aria-hidden
                  variants={GLYPH}
                  className="absolute inset-x-0 top-[50%] flex justify-center [translate:0_-50%]"
                >
                  <svg viewBox="0 0 64 64" className="size-[74px] text-white/85">
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 23v-5a6 6 0 0 1 6-6h5" />
                      <path d="M41 12h5a6 6 0 0 1 6 6v5" />
                      <path d="M12 41v5a6 6 0 0 0 6 6h5" />
                      <path d="M41 52h5a6 6 0 0 0 6-6v-5" />
                      <path d="M24 25v6" />
                      <path d="M40 25v6" />
                      <path d="M32 25v11c0 2-1.4 3-3 3" />
                      <path d="M25 45c2.4 2.2 11.6 2.2 14 0" />
                    </g>
                  </svg>
                </motion.div>

                {/* The scan. */}
                <motion.div
                  aria-hidden
                  variants={SCANNER}
                  className="absolute inset-x-0 top-[50%] flex justify-center [translate:0_-50%]"
                >
                  <div className="relative size-[152px]">
                    <motion.div
                      variants={GLOW}
                      className="absolute inset-[10px] rounded-full bg-[#3ddc84] blur-2xl"
                    />

                    {/* The face itself. Every pixel of it is Ashwin's. */}
                    <div
                      className="absolute left-1/2 top-1/2 size-[100px] overflow-hidden rounded-full [translate:-50%_-50%] ring-1 ring-white/15"
                      style={{ backgroundColor: "#3a3a42" }}
                    >
                      <Image
                        src="/profile.jpg"
                        alt=""
                        fill
                        sizes="100px"
                        className="object-cover grayscale brightness-[0.5] contrast-[1.05]"
                      />
                      <motion.div variants={REVEAL} className="absolute inset-0">
                        <Image
                          src="/profile.jpg"
                          alt=""
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </motion.div>
                      <motion.span
                        variants={LINE}
                        className="absolute left-0 top-0 h-full w-[2px] bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.85)]"
                      />
                    </div>

                    {/* Radial ticks, the dots that say "I am reading you". */}
                    <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
                      {TICKS.map((t, i) => (
                        <motion.line
                          key={i}
                          x1={t.x1}
                          y1={t.y1}
                          x2={t.x2}
                          y2={t.y2}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          variants={TICK_VARIANTS[i]}
                        />
                      ))}
                    </svg>
                  </div>
                </motion.div>

                {/* Home indicator, and the swipe that finally asks something. */}
                <motion.div
                  aria-hidden
                  initial={{ y: 0, opacity: 0.5 }}
                  animate={{ y: unlocked ? -22 : 0, opacity: unlocked ? 1 : 0.5 }}
                  transition={{ duration: 0.55, ease: EASE_OUT, delay: unlocked ? 0.25 : 0 }}
                  className="absolute inset-x-0 bottom-[8px] z-10 flex justify-center"
                >
                  <span className="h-[4px] w-[62px] rounded-full bg-white/85" />
                </motion.div>

                {/* Glass glare. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </MotionConfig>
    </ScenePanel>
  );
}
