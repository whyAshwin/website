"use client";

import { useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AlertTriangle, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

type SimInputs = {
  acquisition: number; // visitors / mo
  activation: number; // %
  retention: number; // % / mo
  arpu: number; // $ per user
};

const DEFAULTS: SimInputs = { acquisition: 25000, activation: 35, retention: 60, arpu: 12 };

type Slider = {
  key: keyof SimInputs;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
};

const SLIDERS: Slider[] = [
  { key: "acquisition", label: "Monthly visitors", unit: "/mo", min: 1000, max: 100000, step: 1000 },
  { key: "activation", label: "Activation rate", unit: "%", min: 0, max: 100, step: 5 },
  { key: "retention", label: "Month-1 retention", unit: "%", min: 0, max: 100, step: 5 },
  { key: "arpu", label: "Revenue per user", unit: "$", min: 0, max: 200, step: 5 },
];

// 270° gauge arc: starts bottom-left (135°) and sweeps clockwise to bottom-right (45°).
const GAUGE_R = 38;
const GAUGE_C = 50;
const ARC_PATH = `M ${GAUGE_C + GAUGE_R * Math.cos((135 * Math.PI) / 180)} ${
  GAUGE_C + GAUGE_R * Math.sin((135 * Math.PI) / 180)
} A ${GAUGE_R} ${GAUGE_R} 0 1 1 ${GAUGE_C + GAUGE_R * Math.cos((45 * Math.PI) / 180)} ${
  GAUGE_C + GAUGE_R * Math.sin((45 * Math.PI) / 180)
}`;
const ARC_LENGTH = 2 * Math.PI * GAUGE_R * 0.75;

function verdictFor(health: number) {
  if (health < 30) return { label: "Dumpster fire", emoji: "💀", color: "#ef4444" };
  if (health < 60) return { label: "On life support", emoji: "🆘", color: "#f97316" };
  if (health < 80) return { label: "Getting there", emoji: "📈", color: "#f59e0b" };
  return { label: "Growth loop", emoji: "🚀", color: "#22c55e" };
}

export function PMSimulator() {
  const reduce = useReducedMotion();
  const [inputs, setInputs] = useState<SimInputs>(DEFAULTS);
  const [shipCount, setShipCount] = useState(0);

  const newUsers = inputs.acquisition * (inputs.activation / 100);
  const mau = Math.round(newUsers * (inputs.retention / 100));
  const ltv = Math.round(inputs.arpu * 12 * (inputs.retention / 100));
  const health = Math.round(
    inputs.activation * 0.4 +
      inputs.retention * 0.4 +
      Math.min(inputs.acquisition / 100000, 1) * 100 * 0.2
  );

  const verdict = useMemo(() => verdictFor(health), [health]);

  // Metrics render straight from the derived values — instant, always correct,
  // and never dependent on animation frames.
  const needleAngle = -135 + (health / 100) * 270;
  const arcOffset = ARC_LENGTH * (1 - health / 100);
  const arcTransition = reduce
    ? "none"
    : "stroke-dashoffset 0.45s cubic-bezier(0.16,1,0.3,1), stroke 0.45s ease";
  const needleTransition = reduce
    ? "none"
    : "transform 0.5s cubic-bezier(0.16,1,0.3,1)";

  const slider = (s: Slider) => {
    const value = inputs[s.key];
    const pct = ((value - s.min) / (s.max - s.min)) * 100;
    return (
      <div key={s.key} className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor={`sim-${s.key}`}
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            {s.label}
          </label>
          <span
            className={cn(
              "tabular-nums text-sm font-semibold",
              s.key === "arpu" ? "text-accent" : "text-fg"
            )}
          >
            {value}
            {s.unit}
          </span>
        </div>
        <input
          id={`sim-${s.key}`}
          type="range"
          min={s.min}
          max={s.max}
          step={s.step}
          value={value}
          onChange={(e) =>
            setInputs((d) => ({ ...d, [s.key]: Number(e.target.value) }))
          }
          className="range-accent w-full"
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-surface-3) ${pct}%)`,
          }}
        />
      </div>
    );
  };

  return (
    <section
      id="playground"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24"
    >
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Product playground
        </p>
        <h2 className="mt-3 text-[clamp(1.9rem,5vw,3rem)] font-semibold tracking-tight">
          Play PM for a minute
        </h2>
        <p className="mt-4 text-balance text-muted">
          Tweak the levers and watch the gauge, verdict, and metrics react.
          Build something worth shipping.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="space-y-6 lg:col-span-4">
          {SLIDERS.map(slider)}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => health >= 80 && setShipCount((n) => n + 1)}
              disabled={health < 80}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-fg transition-all",
                health >= 80
                  ? "border-accent bg-accent/10 hover:bg-accent/20"
                  : "cursor-not-allowed text-muted"
              )}
            >
              {health >= 80 ? (
                <>
                  <Rocket className="size-4" /> Ship it
                </>
              ) : (
                <>
                  <AlertTriangle className="size-4" /> Fix the product first
                </>
              )}
            </button>
            <p className="mt-2 font-mono text-[11px] text-faint">
              Shippable at 80+ health · shipped {shipCount}×
            </p>
          </div>
        </div>

        {/* Readout */}
        <div className="lg:col-span-8">
          <div className="glass-strong relative overflow-hidden rounded-[2.5rem] border border-line p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-40 -top-40 size-[400px] rounded-full bg-accent/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-20 size-[320px] rounded-full bg-accent-2/10 blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center gap-7">
              {/* Gauge */}
              <div className="relative size-48 sm:size-56">
                <svg viewBox="0 0 100 100" className="size-full overflow-visible">
                  <path
                    d={ARC_PATH}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d={ARC_PATH}
                    fill="none"
                    stroke={verdict.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: ARC_LENGTH,
                      strokeDashoffset: arcOffset,
                      transition: arcTransition,
                    }}
                  />
                  <g
                    style={{
                      transformOrigin: "50px 50px",
                      transform: `rotate(${needleAngle}deg)`,
                      transition: needleTransition,
                    }}
                  >
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="24"
                      stroke={verdict.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="24" r="3" fill={verdict.color} />
                  </g>
                  <circle cx="50" cy="50" r="4.5" fill={verdict.color} />
                </svg>

                <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center">
                  <span className="tabular-nums text-4xl font-bold leading-none text-fg sm:text-5xl">
                    {health}
                  </span>
                  <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-faint">
                    product health
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{verdict.emoji}</span>
                <span
                  className="text-xl font-semibold tracking-tight sm:text-2xl"
                  style={{ color: verdict.color }}
                >
                  {verdict.label}
                </span>
              </div>

              <div className="grid w-full grid-cols-3 gap-4 border-t border-line pt-8 text-center">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    New users / mo
                  </div>
                  <div className="mt-1 tabular-nums text-xl font-semibold text-fg sm:text-2xl">
                    {Math.round(newUsers).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    MAU
                  </div>
                  <div className="mt-1 tabular-nums text-xl font-semibold text-fg sm:text-2xl">
                    {Math.round(mau).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    LTV / yr
                  </div>
                  <div className="mt-1 tabular-nums text-xl font-semibold text-accent sm:text-2xl">
                    ${Math.round(ltv).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
