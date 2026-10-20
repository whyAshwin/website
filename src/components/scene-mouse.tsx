"use client";

import { type CSSProperties } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { X } from "lucide-react";
import { useBeats, type Beat } from "@/lib/use-beats";
import { fitScale } from "@/lib/fit";
import { ScenePanel } from "./scene-panel";

/**
 * Magic Mouse. The celebrated part of the story is the whole top surface — one
 * seamless piece of glass you never think about. The joke is underneath it.
 *
 * The flip is a real 180° rotation about the mouse's long axis, so the underside
 * rides in as the back face of a flip card and ends up reading correctly.
 */

type Phase = "idle" | "lift" | "flip" | "cable" | "plug" | "charge" | "dead";

const ORDER: Phase[] = ["idle", "lift", "flip", "cable", "plug", "charge", "dead"];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
/** Slight overshoot, so the mouse lands like it has weight. */
const EASE_FLIP: [number, number, number, number] = [0.22, 1.16, 0.34, 1];

/**
 * The scene's design footprint, in the scene's own pixels. The mouse is 320
 * wide, but its cable swings a further 280 to the right, so the box that has
 * to land on screen is wider than the mouse. Fitting against that box is what
 * keeps a length of cable visible on a narrow screen; the rest running off the
 * edge is deliberate.
 */
const DESIGN = { w: 410, h: 200 };
/** Scaled against the stage; a little headroom lets it fill a roomy screen. */
const FIT = fitScale(DESIGN.w, DESIGN.h, 1.35);

/**
 * Deliberately over-long. Roughly a second of it is the mouse rotating over,
 * and the beat that matters is the quiet one at the end.
 */
const BEATS: readonly Beat<Phase>[] = [
  { at: 0, phase: "lift" },
  { at: 380, phase: "flip", cue: "whoosh" },
  { at: 1010, cue: "clack" },
  { at: 1400, phase: "cable", cue: "whoosh", opts: { gain: 0.4 } },
  { at: 2100, phase: "plug", cue: "plug" },
  { at: 2480, phase: "charge", cue: "connected" },
  { at: 3100, phase: "dead", cue: "deflate" },
  { at: 3460, cue: "deny", opts: { gain: 0.75 } },
];

/** Apple's mark, from simple-icons (CC0), in a 24×24 box. */
const APPLE =
  "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";

/* ── Variants. Every phase is spelled out on every element, because Motion
      only forwards a phase label to children that declare it. ───────────── */

const FLIP: Variants = {
  idle: { rotateX: 0, rotateZ: 0, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  lift: { rotateX: -17, rotateZ: -3, y: -13, transition: { duration: 0.34, ease: EASE_OUT } },
  flip: { rotateX: 180, rotateZ: 0, y: 0, transition: { duration: 0.66, ease: EASE_FLIP } },
  cable: { rotateX: 180, rotateZ: 0, y: 0, transition: { duration: 0.3 } },
  plug: { rotateX: 180, rotateZ: 0, y: 0, transition: { duration: 0.3 } },
  charge: { rotateX: 180, rotateZ: 1.6, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  dead: { rotateX: 176, rotateZ: 4, y: 9, transition: { duration: 0.8, ease: EASE_OUT } },
};

const DRAW: Variants = {
  idle: { pathLength: 0 },
  lift: { pathLength: 0 },
  flip: { pathLength: 0 },
  cable: { pathLength: 1, transition: { duration: 0.55, ease: EASE_OUT } },
  plug: { pathLength: 1 },
  charge: { pathLength: 1 },
  dead: { pathLength: 1 },
};

/**
 * The connector drops into the port from in front of the underside face. It
 * does not slide in from the side — there is no side wall to plug into.
 */
const PLUG: Variants = {
  idle: { y: -16, opacity: 0 },
  lift: { y: -16, opacity: 0 },
  flip: { y: -16, opacity: 0 },
  cable: { y: -16, opacity: 1, transition: { duration: 0.15 } },
  plug: { y: 0, opacity: 1, transition: { duration: 0.22, ease: EASE_OUT } },
  charge: { y: 0, opacity: 1 },
  dead: { y: 0, opacity: 1 },
};

/**
 * One path for the lead: it rises straight out of the connector, then bends
 * away over the mouse. Drawn once and reused so the shadow and the cable can
 * never drift apart.
 */
const CABLE = "M 286 56 C 286 26 300 10 346 4 C 430 -6 526 4 606 14";

const LED: Variants = {
  idle: { opacity: 0 },
  lift: { opacity: 0 },
  flip: { opacity: 0 },
  cable: { opacity: 0 },
  plug: { opacity: 0 },
  charge: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } },
  dead: { opacity: 1 },
};

const HALO: Variants = {
  idle: { opacity: 0 },
  lift: { opacity: 0 },
  flip: { opacity: 0 },
  cable: { opacity: 0 },
  plug: { opacity: 0 },
  charge: { opacity: 0.3, transition: { duration: 0.5 } },
  dead: { opacity: 0.22 },
};

export function SceneMouse() {
  const { phase, runId, run, hasRun } = useBeats(BEATS, "idle", "dead", "deflate");
  const step = ORDER.indexOf(phase);
  const at = (p: Phase) => step >= ORDER.indexOf(p);

  const idle = phase === "idle";
  const dead = at("dead");

  const label = !hasRun
    ? "A Magic Mouse, right side up and completely blank on top."
    : dead
      ? "The Magic Mouse flipped over, its charging cable plugged into a port on the underside — and unusable while it charges."
      : "The Magic Mouse flipping over."

  return (
    <ScenePanel
      tone="bad"
      badge="Bad product experience"
      name="Magic Mouse"
      meta="2015 → today"
      placeholder="One decision, hidden in the hardware."
      verdict="The port is on the underside, so charging it means putting it down. It's the only thing on the desk that asks you to stop working so it can top itself up."
      note="The defence is real: two minutes buys nine hours. That's a good number. It's also a decision you have to make at 9:04am with the deck due."
      cta="Charge it"
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
            background: "radial-gradient(120% 90% at 50% 0%, #17171f 0%, #0b0b0f 62%)",
          }}
        >
          <motion.div
            aria-hidden
            animate={idle ? { y: [0, -4, 0] } : { y: 0 }}
            transition={idle ? { duration: 5.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            className="relative h-[168px] w-[320px] shrink-0 [scale:var(--fit)] [transition:scale_0.35s_cubic-bezier(0.16,1,0.3,1)]"
            style={{ perspective: 1100, "--fit": FIT } as CSSProperties}
          >
            {/* Contact shadow — measured against the mouse, not the stage, so it
                keeps its place however tall the stage gets. */}
            <motion.div
              aria-hidden
              animate={{ opacity: idle ? 0.5 : 0.65, scaleX: idle ? 1 : 1.06 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-[-16px] left-1/2 h-[16px] w-[72%] rounded-[50%] bg-black/70 blur-xl [translate:-50%_0]"
            />

            <motion.div
              key={runId}
              initial="idle"
              animate={phase}
              variants={FLIP}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Top: one seamless surface. Nothing to press, nothing to see. */}
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <svg viewBox="0 0 320 168" className="size-full">
                  <defs>
                    <linearGradient id="mm-top" x1="0.15" y1="0" x2="0.85" y2="1">
                      <stop offset="0%" stopColor="#fdfdff" />
                      <stop offset="38%" stopColor="#eeeff3" />
                      <stop offset="72%" stopColor="#dcdde3" />
                      <stop offset="100%" stopColor="#c0c3cb" />
                    </linearGradient>
                    <radialGradient id="mm-sheen" cx="0.34" cy="0.16" r="0.74">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                      <stop offset="46%" stopColor="#ffffff" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect x="1" y="1" width="318" height="166" rx="80" fill="url(#mm-top)" />
                  <rect x="1" y="1" width="318" height="166" rx="80" fill="url(#mm-sheen)" />
                  <rect
                    x="1"
                    y="1"
                    width="318"
                    height="166"
                    rx="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>

              {/* Underside. Pre-rotated so the flip card lands it the right way up. */}
              <div
                className="absolute inset-0 [backface-visibility:hidden]"
                style={{ transform: "rotateX(180deg)" }}
              >
                <svg viewBox="0 0 320 168" className="size-full overflow-visible">
                  <defs>
                    <linearGradient id="mm-belly" x1="0.15" y1="0" x2="0.85" y2="1">
                      <stop offset="0%" stopColor="#e8e9ee" />
                      <stop offset="50%" stopColor="#d2d5dc" />
                      <stop offset="100%" stopColor="#a7abb5" />
                    </linearGradient>
                    <linearGradient id="mm-rail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2b2b31" />
                      <stop offset="100%" stopColor="#0c0c10" />
                    </linearGradient>
                    <linearGradient id="mm-cable" x1="0" y1="0" x2="0.4" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="55%" stopColor="#edeff3" />
                      <stop offset="100%" stopColor="#c3c6ce" />
                    </linearGradient>
                    <linearGradient id="mm-plug" x1="0.2" y1="0" x2="0.85" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="58%" stopColor="#f2f4f7" />
                      <stop offset="100%" stopColor="#d3d7de" />
                    </linearGradient>
                    <filter id="mm-blur" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                  </defs>

                  <rect x="1" y="1" width="318" height="166" rx="80" fill="url(#mm-belly)" />
                  <rect
                    x="1"
                    y="1"
                    width="318"
                    height="166"
                    rx="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1.3"
                  />

                  {/* The two glide rails that make it a mouse. */}
                  <rect x="46" y="20" width="228" height="13" rx="6.5" fill="url(#mm-rail)" />
                  <rect x="46" y="135" width="228" height="13" rx="6.5" fill="url(#mm-rail)" />

                  <g transform="translate(126 84) scale(1.5) translate(-12 -12)" opacity="0.4">
                    <path d={APPLE} fill="#5c6069" />
                  </g>

                  {/* Regulatory text, suggested rather than set. */}
                  <g fill="#7b7f89" opacity="0.5">
                    <rect x="154" y="70" width="70" height="2.6" rx="1.3" />
                    <rect x="154" y="78" width="54" height="2.6" rx="1.3" />
                    <rect x="154" y="86" width="44" height="2.6" rx="1.3" />
                    <rect x="154" y="94" width="60" height="2.6" rx="1.3" />
                  </g>

                  {/* Charge indicator */}
                  <circle cx="248" cy="84" r="5.4" fill="#191a1f" />
                  <motion.circle variants={HALO} cx="248" cy="84" r="10" fill="#3ddc84" />
                  <motion.circle variants={LED} cx="248" cy="84" r="3.8" fill="#3ddc84" />

                  {/* The port is a slot in this face, a few millimetres in from
                      the nose — not in the side wall. The connector goes into
                      it perpendicular to the underside, which is precisely why
                      the mouse has to lie on its back to charge. */}
                  <rect x="278" y="66" width="16" height="36" rx="8" fill="#1b1c22" />
                  <rect x="281" y="68" width="10" height="32" rx="5" fill="#07070a" />
                  <rect x="281" y="68" width="10" height="5" rx="2.5" fill="#3c3e46" opacity="0.85" />

                  {/* Lead and connector travel together: the plug hovers just
                      off the face while the cable draws itself in, then settles
                      into the slot. Sharing the group keeps the cable attached
                      to the shell the whole way down. */}
                  <motion.g variants={PLUG}>
                    <motion.path
                      d={CABLE}
                      fill="none"
                      stroke="#000000"
                      strokeWidth="11"
                      strokeLinecap="round"
                      opacity="0.4"
                      filter="url(#mm-blur)"
                      transform="translate(5 10)"
                      variants={DRAW}
                    />
                    <motion.path
                      d={CABLE}
                      fill="none"
                      stroke="url(#mm-cable)"
                      strokeWidth="9"
                      strokeLinecap="round"
                      variants={DRAW}
                    />
                    <motion.path
                      d={CABLE}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.55"
                      variants={DRAW}
                    />

                    {/* The connector, seen down its axis: the shell stands up
                        out of the slot, wider at the cable end, lit from the
                        top-left, with the cable entering behind a collar. */}
                    <ellipse
                      cx="274"
                      cy="94"
                      rx="23"
                      ry="19"
                      fill="#000000"
                      opacity="0.42"
                      filter="url(#mm-blur)"
                    />
                    <path
                      d="M 267 74 Q 267 60 281 60 L 291 60 Q 305 60 305 74 L 301 98 Q 299 106 291 106 L 281 106 Q 273 106 271 98 Z"
                      fill="url(#mm-plug)"
                    />
                    <path
                      d="M 270 77 Q 270 64 282 64 L 290 64"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <rect x="279" y="52" width="14" height="12" rx="6" fill="#e4e7ec" />
                  </motion.g>
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* The punchline. */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: dead ? 1 : 0 }}
            transition={{ duration: 0.6, delay: dead ? 0.2 : 0 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(72% 60% at 50% 58%, rgba(239,68,68,0.16), transparent 72%)",
            }}
          />

          <div className="pointer-events-none absolute bottom-3 left-1/2 [translate:-50%_0]">
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 1.35, rotate: -15 }}
              animate={dead ? { opacity: 1, scale: 1, rotate: -6 } : { opacity: 0, scale: 1.35, rotate: -15 }}
              transition={{ duration: 0.32, delay: dead ? 0.34 : 0, ease: EASE_OUT }}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-red-500/60 bg-bg/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-red-300 backdrop-blur-sm sm:text-[10px]"
            >
              <X className="size-3.5" />
              Unusable while charging
            </motion.span>
          </div>
        </div>
      </MotionConfig>
    </ScenePanel>
  );
}
