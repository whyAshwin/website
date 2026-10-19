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
 *
 * The whole thing is built to land on one screen — the section claims a
 * viewport and the cards take whatever height is left, so the comparison is
 * never split across a scroll. The height has to be definite rather than a
 * minimum: an auto-height flex column just grows to fit its contents, which is
 * exactly the problem. Padding the top and bottom keeps the nav and the music
 * player clear of the cards, and the min-height stops the cards collapsing to
 * nothing on a viewport too short to hold them.
 *
 * Below `lg` the player's pill sits high, in its mobile safe-area position, and
 * it will sit over the bottom-left corner of the left card. Reserving the whole
 * safe area (~150px) would cost every short viewport the drawing it came for,
 * so the overlap is deliberate: the pill covers the card's corner and a strip
 * of the left card's button edge, but the label is centred and the button stays
 * usable, which is a cheaper trade than a smaller scene on every phone.
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
    <section
      id="playground"
      className="relative mx-auto flex h-svh min-h-[37rem] max-w-6xl scroll-mt-20 flex-col justify-center px-4 pb-20 pt-20 sm:min-h-[36rem] sm:px-6"
    >
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <SectionHeading
          size="compact"
          kicker="Product playground"
          title="Two products. One question: what did it ask of you?"
          description="Same company, same decade, both in millions of hands. One adds a decision at the worst possible moment; the other never lets one form."
        />

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSignal((n) => n + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-sm"
          >
            <Play className="size-3.5 fill-current" />
            Run both
          </button>

          <button
            type="button"
            aria-pressed={soundOn}
            onClick={sfx.toggle}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
              soundOn ? "border-line-strong text-fg" : "border-line text-faint",
            )}
          >
            {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            {soundOn ? "Sound on" : "Sound off"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-row gap-3 sm:mt-6 sm:gap-4">
        <SceneMouse runSignal={signal} />
        <SceneFaceId runSignal={signal} />
      </div>
    </section>
  );
}
