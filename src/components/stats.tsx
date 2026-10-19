"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { stats } from "@/lib/content";
import { Reveal } from "./reveal";

function Counter({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Bottom-only margin: a single "-15%" shrinks the root on every side, which
  // silently excluded the narrow first-column numbers from ever triggering.
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  // Null until the count starts, so the served HTML — and anyone reading the
  // page without a viewport — gets the real figure rather than "0". The swap
  // to zero happens when the observer fires, which is before the number is on
  // screen, so the count still reads as a count.
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    // Backstop: guarantee the final number even if frames are throttled.
    const settle = setTimeout(() => setDisplay(value), 1900);
    return () => {
      controls.stop();
      clearTimeout(settle);
    };
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {Math.round(reduce ? value : (display ?? value))}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="hairline mb-12" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="group">
              <div className="text-gradient text-[clamp(2rem,6vw,3.25rem)] font-semibold tracking-tight">
                <Counter
                  value={stat.value}
                  prefix={"prefix" in stat ? stat.prefix : undefined}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-fg">{stat.label}</p>
              <p className="mt-0.5 font-mono text-xs text-faint">{stat.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
