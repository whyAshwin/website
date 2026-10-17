"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
};

type ConfettiProps = {
  active?: boolean;
  count?: number;
  originX?: number; // 0-1
  originY?: number; // 0-1
  colors?: string[];
};

const DEFAULT_COLORS = ["#7c6cff", "#4cc9f0", "#f472b6", "#a3e635", "#ffffff"];

/**
 * Canvas confetti explosion. Fires once when `active` flips true.
 * Zero React re-renders during the burst (imperative RAF loop).
 */
export function Confetti({
  active = false,
  count = 70,
  originX = 0.5,
  originY = 0.3,
  colors = DEFAULT_COLORS,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(undefined);
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      const rect = canvas.getBoundingClientRect();
      const ox = rect.width * originX;
      const oy = rect.height * originY;
      const ps: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 6;
        ps.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          life: 1,
          decay: Math.random() * 0.02 + 0.012,
          size: Math.random() * 7 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      particlesRef.current = ps;
      startedRef.current = true;
    };

    const loop = () => {
      if (!active) {
        startedRef.current = false;
        particlesRef.current = [];
        const stopId = frameRef.current;
        if (stopId !== undefined) cancelAnimationFrame(stopId);
        return;
      }
      if (!startedRef.current) spawn();

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width * dpr, rect.height * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      let alive = 0;
      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.32;
        p.life -= p.decay;
        if (p.life > 0) {
          alive++;
          next.push(p);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      particlesRef.current = next;

      if (alive > 0) {
        frameRef.current = requestAnimationFrame(loop);
      } else {
        startedRef.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      const stopId = frameRef.current;
      if (stopId !== undefined) cancelAnimationFrame(stopId);
      window.removeEventListener("resize", resize);
    };
  }, [active, count, originX, originY, colors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[55] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
