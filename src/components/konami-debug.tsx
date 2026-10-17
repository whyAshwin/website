"use client";

import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";

const KEYS = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const TARGET = KEYS.map((k) => k.toLowerCase()).join("");

/**
 * Konami code easter egg: ↑↑↓↓←→←→BA
 * Toggles debug mode — rulers, grid, FPS counter, SHIP IT banner.
 */
export function KonamiDebug() {
  const [debug, setDebug] = useState(false);
  const [fps, setFps] = useState(0);
  const buffer = useRef<string[]>([]);
  const styleEl = useRef<HTMLStyleElement | null>(null);
  const frameRef = useRef<number>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      buffer.current = [...buffer.current.slice(-9), e.key];
      const joined = buffer.current.join("").toLowerCase();
      if (joined.endsWith(TARGET)) {
        setDebug((d) => !d);
        buffer.current = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!debug) {
      styleEl.current?.remove();
      styleEl.current = null;
      const stopId = frameRef.current;
      if (stopId !== undefined) cancelAnimationFrame(stopId);
      return;
    }

    const el = document.createElement("style");
    el.id = "ab-debug";
    el.textContent = `
      * {
        outline: 1px solid rgba(124,108,255,0.35) !important;
        outline-offset: -1px !important;
      }
      body {
        background-image: radial-gradient(rgba(124,108,255,0.07) 1px, transparent 1px) !important;
        background-size: 24px 24px !important;
      }
    `;
    document.head.appendChild(el);
    styleEl.current = el;

    let last = performance.now();
    let frames = 0;
    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      styleEl.current?.remove();
      styleEl.current = null;
      const stopId = frameRef.current;
      if (stopId !== undefined) cancelAnimationFrame(stopId);
    };
  }, [debug]);

  if (!debug) return null;

  return (
    <div
      data-debug
      className="fixed inset-0 z-[9999] pointer-events-none selection:bg-accent selection:text-bg"
    >
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-accent via-accent to-accent-2 px-6 py-2 text-center text-[10px] font-bold tracking-[0.5em] text-bg uppercase">
        SHIP IT
      </div>
      <div className="fixed top-4 left-4 z-[10000] glass rounded-lg border border-accent/40 px-3 py-1.5 text-xs font-mono text-accent">
        <Activity className="size-3.5 mr-1.5 text-accent" /> {fps} fps
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000] text-[10px] text-faint font-mono tracking-tighter">
        Konami debug mode — rulers &amp; grid on
      </div>
    </div>
  );
}
