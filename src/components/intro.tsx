"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const PANELS = 6;
const STORAGE_KEY = "ab:intro-shown";
const COUNT_DURATION = 1100;
const CURTAIN_DURATION = 900;
const SAFETY_TIMEOUT = 3200;

type IntroState = {
  ready: boolean;
  finish: () => void;
};

const IntroContext = createContext<IntroState>({ ready: true, finish: () => {} });

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // Starts closed; the curtain opens it on the client.
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready, finish }), [ready, finish]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function Preloader() {
  const reduce = useReducedMotion();
  const { finish } = useIntro();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  // Count up, then start the curtain. All state updates happen inside
  // animation-frame / timer callbacks, never synchronously during the effect.
  useEffect(() => {
    if (reduce || sessionStorage.getItem(STORAGE_KEY)) {
      const skip = setTimeout(() => setExiting(true), 0);
      return () => clearTimeout(skip);
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setExiting(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  // Curtain out, then hand the page over.
  useEffect(() => {
    if (!exiting) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    const done = setTimeout(() => {
      finish();
      setVisible(false);
    }, CURTAIN_DURATION);
    return () => clearTimeout(done);
  }, [exiting, finish]);

  // Safety net: never let the curtain trap the page if frames are throttled.
  useEffect(() => {
    const safety = setTimeout(() => setExiting(true), SAFETY_TIMEOUT);
    return () => clearTimeout(safety);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden>
          {/* Curtain panels */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANELS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 origin-top bg-accent"
                initial={{ y: "0%" }}
                animate={exiting ? { y: "-101%" } : { y: "0%" }}
                transition={{
                  duration: 0.85,
                  delay: exiting ? i * 0.06 : 0,
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            ))}
          </div>

          {/* Foreground UI */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-bg"
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.35, delay: exiting ? 0.35 : 0 }}
          >
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_75%)]" />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative font-mono text-6xl font-semibold tracking-tighter tabular-nums sm:text-8xl"
            >
              {String(progress).padStart(3, "0")}
            </motion.div>
            <div className="relative h-px w-40 overflow-hidden bg-line">
              <motion.div className="h-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
            <p className="relative font-mono text-[10px] uppercase tracking-[0.35em] text-faint">
              Ashwin Baranwal
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
