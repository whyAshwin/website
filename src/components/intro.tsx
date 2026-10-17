"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { Rocket } from "lucide-react";

const STORAGE_KEY = "ab:intro-shown";
const BOOT_DURATION = 1200;
const COUNT_STEP = 520;
const LIFTOFF_HOLD = 1200;
const FADE = 700;
const SAFETY_TIMEOUT = 8000;

type Phase = "boot" | "count" | "liftoff" | "done";

type IntroState = {
  ready: boolean;
  finish: () => void;
};

const IntroContext = createContext<IntroState>({ ready: true, finish: () => {} });

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // Starts closed; the intro opens it on the client.
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready, finish }), [ready, finish]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

/**
 * One opening sequence, three beats:
 *   1. boot    — 000 → 100 counter
 *   2. count   — 3 · 2 · 1
 *   3. liftoff — warp starfield, then hand the page over
 *
 * Every beat owns its own timers, so advancing one beat can never cancel the
 * next beat's handoff. Removal is timer-driven (never frame-driven), so the
 * overlay can't be trapped by a background tab dropping animation frames.
 * Plays once per browser session.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const { finish } = useIntro();
  const [phase, setPhase] = useState<Phase>("boot");
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);

  // Beat 1 — boot counter (or skip straight through).
  useEffect(() => {
    if (phase !== "boot") return;

    if (reduce || sessionStorage.getItem(STORAGE_KEY)) {
      const skip = setTimeout(() => {
        finish();
        setPhase("done");
      }, 0);
      return () => clearTimeout(skip);
    }

    let frame = 0;
    let advanced = false;
    const start = performance.now();
    const advance = () => {
      if (advanced) return;
      advanced = true;
      setPhase("count");
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / BOOT_DURATION);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        advance();
      }
    };

    frame = requestAnimationFrame(tick);

    // Backstop: finish the beat even if rAF is suspended (background tab).
    const fallback = setTimeout(advance, BOOT_DURATION + 200);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [phase, reduce, finish]);

  // Beat 2 — countdown.
  useEffect(() => {
    if (phase !== "count") return;

    const t1 = setTimeout(() => setCountdown(2), COUNT_STEP);
    const t2 = setTimeout(() => setCountdown(1), COUNT_STEP * 2);
    const t3 = setTimeout(() => setPhase("liftoff"), COUNT_STEP * 3);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  // Beat 3 — liftoff, then hand the page over.
  useEffect(() => {
    if (phase !== "liftoff") return;

    sessionStorage.setItem(STORAGE_KEY, "1");
    const fade = setTimeout(() => {
      finish();
      setLeaving(true);
    }, LIFTOFF_HOLD);
    const unmount = setTimeout(() => setPhase("done"), LIFTOFF_HOLD + FADE);
    return () => {
      clearTimeout(fade);
      clearTimeout(unmount);
    };
  }, [phase, finish]);

  // Safety net: never trap the page if timers get throttled.
  useEffect(() => {
    if (phase === "done") return;
    const safety = setTimeout(() => {
      finish();
      setPhase("done");
    }, SAFETY_TIMEOUT);
    return () => clearTimeout(safety);
  }, [phase, finish]);

  if (phase === "done") return null;

  return (
    <div
      data-intro
      aria-hidden
      style={{ transitionDuration: `${FADE}ms` }}
      className={`fixed inset-0 z-[100] overflow-hidden bg-bg transition-opacity ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_75%)]" />

      {phase === "liftoff" && <Starfield />}

      <div className="relative flex h-full flex-col items-center justify-center gap-8">
        {phase === "boot" && (
          <>
            <div className="font-mono text-6xl font-semibold tabular-nums tracking-tighter sm:text-8xl">
              {String(progress).padStart(3, "0")}
            </div>
            <div className="h-px w-40 overflow-hidden bg-line">
              <div
                className="h-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-faint">
              Ashwin Baranwal
            </p>
          </>
        )}

        {phase === "count" && (
          <motion.span
            key={countdown}
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="select-none font-mono text-[clamp(7rem,24vw,13rem)] font-black tabular-nums text-accent"
          >
            {countdown}
          </motion.span>
        )}

        {phase === "liftoff" && (
          <div className="relative z-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <Rocket className="size-6 text-accent" />
              <span className="font-mono text-xl font-bold uppercase tracking-tighter text-accent">
                liftoff
              </span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
              Ashwin Baranwal · Product
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Warp starfield. Mounts with the liftoff beat and tears down with it. */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      speed: Math.random() * 0.5 + 0.15,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let fade = 0;
    let frame = 0;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      fade = Math.min(1, fade + 0.02);
      const mult = 1 + fade * 14;

      for (const s of stars) {
        s.y += (s.speed * mult) / 260;
        if (s.y > 1) {
          s.y = 0;
          s.x = Math.random();
        }
        const px = s.x * w;
        const py = s.y * h;
        const alpha = 0.3 + 0.5 * s.z;
        const size = 0.6 + s.z * 1.5;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        if (fade > 0.2) {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.35})`;
          ctx.fillRect(px, py, size, size * 8 * fade);
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
