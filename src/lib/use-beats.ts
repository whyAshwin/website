"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { sfx, type Cue, type CueOptions } from "./audio";

export type Beat<P extends string> = {
  /** Milliseconds from the top of the run. */
  at: number;
  /** Move the scene to this state. Omit for a sound-only beat. */
  phase?: P;
  /** Fire this cue. */
  cue?: Cue;
  opts?: CueOptions;
};

/**
 * Runs a scene's script: a list of beats that move a phase label (which Motion
 * variants subscribe to) and fire sound cues on the exact same frame.
 *
 * Every state change lands inside a timer callback rather than the effect body,
 * so the run can be kicked off from a click or from a parent signal without
 * tripping the set-state-in-effect rule.
 */
export function useBeats<P extends string>(
  beats: readonly Beat<P>[],
  start: P,
  end: P,
  endCue?: Cue,
) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<P>(start);
  const [runId, setRunId] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  const run = useCallback(() => {
    if (typeof window === "undefined") return;
    clear();
    const push = (fn: () => void, at: number) =>
      timers.current.push(setTimeout(fn, at));

    // Honouring reduced motion means skipping the travel, not the information:
    // jump to the end state and play the cue that carries the meaning.
    if (reduce) {
      push(() => {
        setRunId((n) => n + 1);
        setPhase(end);
        if (endCue) sfx.play(endCue);
      }, 0);
      push(() => setHasRun(true), 0);
      return;
    }

    // Bumping the key remounts the animated tree at its opening pose, so a
    // replay reads as a real replay rather than a fast rewind.
    push(() => {
      setRunId((n) => n + 1);
      setPhase(start);
      setHasRun(true);
    }, 0);

    for (const beat of beats) {
      push(() => {
        if (beat.phase) setPhase(beat.phase);
        if (beat.cue) sfx.play(beat.cue, beat.opts);
      }, beat.at);
    }
  }, [beats, clear, end, endCue, reduce, start]);

  return { phase, runId, run, hasRun };
}
