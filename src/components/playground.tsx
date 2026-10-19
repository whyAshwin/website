"use client";

import { useEffect } from "react";
import { sfx } from "@/lib/audio";
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
 *
 * There is no section-level trigger: the heading spans the full width and each
 * card runs from its own button, so nothing on the page has to explain the
 * comparison before it is seen.
 */
export function Playground() {
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
      <SectionHeading
        size="compact"
        className="shrink-0 max-w-none"
        title="Two products. One question: what did it ask of you?"
        description="Same company, same decade, both in millions of hands. One adds a decision at the worst possible moment; the other never lets one form."
      />

      <div className="mt-4 flex min-h-0 flex-1 flex-row gap-3 sm:mt-6 sm:gap-4">
        <SceneMouse />
        <SceneFaceId />
      </div>
    </section>
  );
}
