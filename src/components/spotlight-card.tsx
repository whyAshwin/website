"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a soft radial spotlight that follows the pointer,
 * driven by CSS custom properties (no re-render).
 */
export function SpotlightCard({
  children,
  className,
  color = "rgba(124,108,255,0.30)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn("group/spot relative overflow-hidden", className)}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 66%)`,
        }}
      />
      {children}
    </div>
  );
}
