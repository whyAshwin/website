"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const TRACK = { title: "Ambient Focus", artist: "ashwin.fm" };

/** A4=440. A soft, slowly-evolving pad — no audio asset required. */
const CHORD = [110, 164.81, 220, 277.18, 329.63]; // A2, E3, A3, C#4, E4

/**
 * Glass "now playing" widget. Playback is a Web-Audio synth pad so the site
 * ships zero audio bytes; it starts only after a user gesture.
 */
export function MusicPlayer() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ master: GainNode; stop: () => void } | null>(null);

  const stop = useCallback(() => {
    const nodes = nodesRef.current;
    const ctx = ctxRef.current;
    if (nodes && ctx) {
      nodes.master.gain.cancelScheduledValues(ctx.currentTime);
      nodes.master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      setTimeout(() => nodes.stop(), 1200);
    }
    nodesRef.current = null;
  }, []);

  const start = useCallback(() => {
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.6;
    filter.connect(master);

    // Slow tremolo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain).connect(master.gain);

    const oscillators = CHORD.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      osc.detune.value = (i - 2) * 4;
      const gain = ctx.createGain();
      gain.gain.value = 0.14 / (i + 1);
      osc.connect(gain).connect(filter);
      osc.start();
      return osc;
    });
    lfo.start();

    master.gain.setTargetAtTime(0.16, ctx.currentTime, 1.6);

    nodesRef.current = {
      master,
      stop: () => {
        oscillators.forEach((o) => o.stop());
        lfo.stop();
        filter.disconnect();
        master.disconnect();
      },
    };
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      start();
      setPlaying(true);
    }
  }, [playing, start, stop]);

  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className={cn("glass-strong overflow-hidden rounded-2xl", open ? "w-[250px] p-3" : "p-2")}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Collapse music player" : "Open music player"}
            className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-line"
          >
            <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/50 to-accent-2/30">
              <Waves className="size-4 text-fg" />
            </span>
            {playing && !reduce && (
              <span className="absolute inset-x-0 bottom-0 flex h-3 items-end justify-center gap-[2px] pb-1">
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] rounded-full bg-accent"
                    animate={{ height: [3, 11, 5, 12, 4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                  />
                ))}
              </span>
            )}
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25 }}
                className="min-w-0"
              >
                <p className="truncate font-mono text-xs font-semibold">{TRACK.title}</p>
                <p className="truncate text-[11px] text-faint">{TRACK.artist}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {open && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={toggle}
                aria-label={playing ? "Pause ambience" : "Play ambience"}
                className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-accent text-bg transition-transform hover:scale-105 active:scale-95"
              >
                {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
