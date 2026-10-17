"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket } from "lucide-react";

/**
 * Once-per-session launch sequence: countdown, liftoff, starfield warp.
 * Replaces the curtain moment with something that actually moves.
 */
export function LaunchSequence() {
  const [stage, setStage] = useState<"count" | "liftoff" | "done">(
    sessionStorage.getItem("ab:launch-shown") === "1" ? "done" : "count"
  );
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (stage !== "count") return;

    const t1 = setTimeout(() => setCount(2), 900);
    const t2 = setTimeout(() => setCount(1), 1800);
    const t3 = setTimeout(() => setStage("liftoff"), 2800);
    const t4 = setTimeout(() => {
      sessionStorage.setItem("ab:launch-shown", "1");
      setStage("done");
    }, 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stage]);

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      {stage === "count" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-bg flex items-center justify-center"
        >
          <span
            className="font-mono text-[clamp(8rem,25vw,14rem)] font-black text-accent select-none"
          >
            {count}
          </span>
        </motion.div>
      )}
      {stage === "liftoff" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gradient-to-b from-bg via-surface to-black flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4 animate-pulse-glow">
              <Rocket className="size-6 text-accent animate-[bounce_1s_infinite]" />
              <span className="font-mono text-xl font-bold text-bg tracking-tighter uppercase">
                liftoff
              </span>
            </div>
            <p className="text-faint font-mono text-xs uppercase tracking-[0.3em]">
              ashwin baranwal · product
            </p>
          </div>

          <canvas
            className="absolute inset-0 z-0"
            width="1920"
            height="1080"
            style={{ width: "100vw", height: "100vh" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Tiny warp starfield drawn imperatively. */
(() => {
  if (typeof document === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";

  const ctx = canvas.getContext("2d")!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    z: Math.random(),
    speed: Math.random() * 0.6 + 0.2,
    size: Math.random() * 1.5 + 0.5,
  }));

  let warp = false;
  let frame: number | undefined;

  window.addEventListener("keydown", (e) => {
    if (e.key === "w") warp = true;
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "w") warp = false;
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#08080b";
    ctx.fillRect(0, 0, rect.width, rect.height);

    const mult = warp ? 14 : 1.2;
    for (const s of stars) {
      s.y += s.speed * mult;
      if (s.y > rect.height) {
        s.y = -20;
        s.x = Math.random() * rect.width;
      }
      const alpha = warp ? 0.9 : 0.4 + 0.3 * s.z;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * (warp ? 2 : 1), 0, Math.PI * 2);
      ctx.fill();
      if (warp) {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
        ctx.fillRect(s.x, s.y + s.size, 2, s.speed * 8);
      }
    }
    frame = requestAnimationFrame(draw);
  };
  frame = requestAnimationFrame(draw);

  return () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    canvas.remove();
  };
})();
