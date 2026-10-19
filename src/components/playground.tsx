"use client";

import { useEffect, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { sfx, useSoundEnabled } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { SceneMouse } from "./scene-mouse";
import { SceneFaceId } from "./scene-faceid";

/**
 * Two decisions, set side by side. The pair is the point: one product adds a
 * decision to your day, the other removes one, and neither ships as a bug.
 */
export function Playground() {
  const soundOn = useSoundEnabled();
  const [signal, setSignal] = useState(0);

  // Warm the audio context on the first interaction anywhere on the page, so a
  // cue never has to race the context's resume() from a cold start.
  useEffect(() => {
    const warm = () => sfx.unlock();
    window.addEventListener("pointerdown", warm, { once: true, passive: true });
    window.addEventListener("keydown", warm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", warm);
      window.removeEventListener("keydown", warm);
    };
  }, []);

  return (
    <section id="playground" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          kicker="Product playground"
          title="Two products. One question: what did it ask of you?"
          description="Same company, same decade, both in millions of hands. One hands you a decision at the worst possible moment; the other never lets a decision form. Run them."
        />

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSignal((n) => n + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="size-3.5 fill-current" />
            Run both
          </button>

          <button
            type="button"
            aria-pressed={soundOn}
            onClick={sfx.toggle}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
              soundOn ? "border-line-strong text-fg" : "border-line text-faint",
            )}
          >
            {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            {soundOn ? "Sound on" : "Sound off"}
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <SceneMouse runSignal={signal} />
        <SceneFaceId runSignal={signal} />
      </div>

      <p className="mt-10 max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-muted">
        A good product decision removes a decision. A bad one adds one, and hands it over at the exact
        moment you have the least room to make it. Both scenes are drawn in the browser — no footage,
        no screenshots, and every sound synthesised on the spot.
      </p>
    </section>
  );
}
