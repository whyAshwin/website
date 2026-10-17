"use client";

import { useCallback, useMemo, useState } from "react";
import { animate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
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

export function PMSimulator() {
  const [inputs, setInputs] = useState<SimInputs>(DEFAULTS);
  const [shipCount, setShipCount] = useState(0);

  const newUsers = inputs.acquisition * (inputs.activation / 100);
  const mau = Math.round(newUsers * (inputs.retention / 100));
  const ltv = Math.round((inputs.arpu * 12) * (inputs.retention / 100));
  const health = Math.round(
    inputs.activation * 0.4 + inputs.retention * 0.4 +
      Math.min(inputs.acquisition / 100000, 1) * 100 * 0.2
  );

  const verdict = useMemo(() => {
    if (health < 30) return { label: "Dumpster fire", emoji: "💀", color: "#ef4444" };
    if (health < 60) return { label: "On life support", emoji: "🆘", color: "#f97316" };
    if (health < 80) return { label: "Getting there", emoji: "📈", color: "#f59e0b" };
    return { label: "Growth loop", emoji: "🚀", color: "#22c55e" };
  }, [health]);

  const reduce = useReducedMotion();
  const healthValue = useMotionValue(health);
  const needle = useTransform(
    useSpring(healthValue, { stiffness: 340, damping: 26, mass: 0.5 }),
    [0, 100],
    ["-135deg", "135deg"]
  );

  const [counters, setCounters] = useState({ newUsers: 0, mau: 0, ltv: 0 });
  const show = reduce ? { newUsers, mau, ltv } : counters;

  // Live-animated counters on change
  useCallback(() => {
    if (reduce) return;
    const targets = [
      { key: "newUsers", target: newUsers },
      { key: "mau", target: mau },
      { key: "ltv", target: ltv },
    ];
    const controllers = targets.map(({ key, target }) =>
      animate(0, target, {
        duration: 0.7,
        onUpdate: (v) =>
          setCounters((c) => ({ ...c, [key]: v })),
      })
    );
    return () => controllers.forEach((c) => c.stop());
  }, [newUsers, mau, ltv, reduce]);

  const handleShip = () => {
    if (health >= 80) {
      setShipCount((n) => n + 1);
    }
  };

  const slider = (s: Slider) => {
    const value = inputs[s.key];
    const pct = ((value - s.min) / (s.max - s.min)) * 100;
    return (
      <div key={s.key} className="space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{s.label}</span>
          <span
            className={cn(
              "tabular-nums font-semibold",
              s.key === "arpu" ? "text-accent" : "text-fg"
            )}
          >
            {value}{s.unit}
          </span>
        </div>
        <input
          type="range"
          min={s.min}
          max={s.max}
          step={s.step}
          value={value}
          onChange={(e) =>
            setInputs((d) => ({ ...d, [s.key]: Number(e.target.value) }))
          }
          className="w-full h-2 bg-surface-3 rounded-full appearance-none cursor-pointer accent-accent"
        />
        <div
          className="relative h-1 w-full bg-surface-3 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-accent via-accent-2 to-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
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
          Tweak the levers. Watch the health needle and verdict react. Build
          something worth shipping.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          {SLIDERS.map(slider)}

          <div className="pt-2">
            <button
              onClick={handleShip}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-fg transition-all hover:bg-surface-3 hover:border-accent/50",
                health >= 80 && "border-accent bg-accent/10 hover:bg-accent/20"
              )}
            >
              {health >= 80 ? (
                <>
                  <Rocket className="size-4" /> Ship it
                </>
              ) : (
                <>
                  <AlertTriangle className="size-4 text-muted" /> Fix the product first
                </>
              )}
            </button>
            <p className="mt-2 font-mono text-[11px] text-faint">
              Shippable at 80+ health · ships:{shipCount}
            </p>
          </div>
        </div>

        {/* Health readout */}
        <div className="lg:col-span-8">
          <div className="glass-strong rounded-[2.5rem] border border-line p-8 sm:p-12 relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[400px] rounded-full bg-accent/10 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 size-[320px] rounded-full bg-accent-2/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <svg
                  className="w-full h-full rotate-[-90deg]"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={verdict.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: "264",
                      strokeDashoffset: `${264 - (health / 100) * 264}`,
                      transition: "stroke-dashoffset 0.5s ease",
                    }}
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="12"
                    stroke={verdict.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      transformOrigin: "50px 50px",
                      transform: `rotate(${needle} )`,
                    }}
                  />
                  <circle cx="50" cy="50" r="4" fill={verdict.color} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="tabular-nums text-[clamp(2.5rem,6vw,4rem)] font-bold text-fg">
                    {health}
                  </span>
                  <span className="font-mono text-xs text-muted">product health</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[clamp(2rem,5vw,3rem)]">{verdict.emoji}</span>
                <span
                  className={cn(
                    "font-semibold tracking-tight",
                    verdict.color.includes("ef4444") || verdict.color.includes("f97316")
                      ? "text-fg"
                      : "text-fg"
                  )}
                >
                  {verdict.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-line">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    New users / mo
                  </div>
                  <div className="tabular-nums text-xl font-semibold text-fg">
                    {Math.round(show.newUsers).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    MAU
                  </div>
                  <div className="tabular-nums text-xl font-semibold text-fg">
                    {show.mau.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    LTV / yr
                  </div>
                  <div className="tabular-nums text-xl font-semibold text-accent">
                    ${show.ltv.toLocaleString()}
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
