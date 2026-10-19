"use client";

import { useSyncExternalStore } from "react";

/**
 * Every sound in the playground is synthesised rather than shipped as a file.
 * No assets to load, nothing to license, and each cue can be tuned to the
 * exact frame it lands on.
 *
 * The engine is deliberately small: an oscillator or a noise burst through a
 * filter, with an exponential envelope. That covers every cue below.
 */

export type Cue =
  | "whoosh"
  | "clack"
  | "plug"
  | "connected"
  | "deflate"
  | "deny"
  | "scan"
  | "tick"
  | "unlock"
  | "swipe";

export type CueOptions = {
  /** Scales the cue's own peak gain. */
  gain?: number;
  /** Detunes the cue, in semitones. Walks the scan ticks upward. */
  semitones?: number;
  /** Delays the cue, in seconds. */
  delay?: number;
};

type ToneSpec = {
  type?: OscillatorType;
  freq: number;
  /** Glide target. */
  to?: number;
  attack?: number;
  decay: number;
  peak?: number;
  filter?: { type: BiquadFilterType; freq: number; to?: number; q?: number };
};

type NoiseSpec = {
  attack?: number;
  decay: number;
  peak?: number;
  filter: { type: BiquadFilterType; freq: number; to?: number; q?: number };
};

/** How far the music player steps back while a cue plays. */
const DUCK_LEVEL = 0.18;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];

  private enabled = true;
  private listeners = new Set<() => void>();

  private ducking = false;
  private duckers = new Set<(ducking: boolean) => void>();
  private duckTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly volume = 0.85;

  /* ── Mute state, consumed through useSyncExternalStore ────────────── */

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.enabled;

  getServerSnapshot = () => true;

  toggle = () => this.setEnabled(!this.enabled);

  setEnabled(next: boolean) {
    if (next === this.enabled) return;
    this.enabled = next;
    // Turning sound back on happens on a click, which is exactly the gesture
    // the browser wants before it will let an AudioContext run.
    if (next) this.unlock();
    this.listeners.forEach((fn) => fn());
  }

  /* ── Ducking: the music player steps back while a cue plays ───────── */

  subscribeDuck = (fn: (ducking: boolean) => void) => {
    this.duckers.add(fn);
    return () => {
      this.duckers.delete(fn);
    };
  };

  private setDucking(next: boolean) {
    if (next === this.ducking) return;
    this.ducking = next;
    this.duckers.forEach((fn) => fn(next));
  }

  /** The level the music player should use right now. */
  get duckLevel() {
    return this.ducking ? DUCK_LEVEL : 1;
  }

  private duck(seconds: number) {
    this.setDucking(true);
    if (this.duckTimer) clearTimeout(this.duckTimer);
    this.duckTimer = setTimeout(
      () => this.setDucking(false),
      Math.min(4000, Math.max(140, seconds * 1000)),
    );
  }

  /* ── Lifecycle ────────────────────────────────────────────────────── */

  /**
   * Create or resume the context. Cheap and idempotent — call it liberally
   * from any user gesture; it is a no-op once the context is running.
   */
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;

      this.ctx = new Ctor();
      const out = this.ctx.createGain();
      out.gain.value = this.volume;
      out.connect(this.ctx.destination);
      this.out = out;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  play(cue: Cue, opts: CueOptions = {}) {
    if (typeof window === "undefined") return;
    // A muted cue is silent but must never be skipped silently-then-loud: the
    // check comes before anything is scheduled.
    if (!this.enabled) return;

    this.unlock();
    const ctx = this.ctx;
    if (!ctx || !this.out) return;

    // The very first cue can arrive in the same tick the context is created,
    // while it is still suspended. Resume, then fire.
    if (ctx.state === "suspended") {
      void ctx.resume().then(() => this.fire(cue, opts));
      return;
    }
    this.fire(cue, opts);
  }

  private fire(cue: Cue, opts: CueOptions) {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;

    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const gain = opts.gain ?? 1;
    const duration = this.render(ctx, out, cue, t0, gain, opts.semitones ?? 0);

    // Hold the duck a beat past the cue so overlapping cues don't flap it.
    this.persist(duration + 0.25);
  }

  /** Keeps the ducking state alive across the timer's own churn. */
  private persist(seconds: number) {
    this.duck(seconds);
  }

  /* ── Primitives ───────────────────────────────────────────────────── */

  private noise(ctx: AudioContext) {
    if (!this.noiseBuf) {
      const frames = Math.floor(ctx.sampleRate * 1.5);
      const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    }
    return this.noiseBuf;
  }

  /** A pitched blip with an exponential envelope and an optional filter sweep. */
  private tone(ctx: AudioContext, out: AudioNode, spec: ToneSpec, t0: number, gain: number) {
    const osc = ctx.createOscillator();
    osc.type = spec.type ?? "sine";
    osc.frequency.setValueAtTime(spec.freq, t0);
    if (spec.to && spec.to !== spec.freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, spec.to), t0 + spec.decay);
    }

    const unrouted = spec.filter ? this.filter(ctx, spec.filter, t0, spec.decay) : null;
    const env = ctx.createGain();
    const attack = spec.attack ?? 0.008;
    const peak = Math.max(0.0002, (spec.peak ?? 0.1) * gain);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + spec.decay);

    if (unrouted) {
      osc.connect(unrouted);
      unrouted.connect(env);
    } else {
      osc.connect(env);
    }
    env.connect(out);

    osc.start(t0);
    osc.stop(t0 + attack + spec.decay + 0.02);
    return attack + spec.decay;
  }

  /** A burst of white noise through a filter — air, clicks, whooshes. */
  private hiss(ctx: AudioContext, out: AudioNode, spec: NoiseSpec, t0: number, gain: number) {
    const src = ctx.createBufferSource();
    src.buffer = this.noise(ctx);
    src.loop = true;

    const attack = spec.attack ?? 0.006;
    const f = this.filter(ctx, spec.filter, t0, attack + spec.decay);

    const env = ctx.createGain();
    const peak = Math.max(0.0002, (spec.peak ?? 0.1) * gain);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + spec.decay);

    src.connect(f);
    f.connect(env);
    env.connect(out);

    src.start(t0);
    src.stop(t0 + attack + spec.decay + 0.02);
    return attack + spec.decay;
  }

  private filter(
    ctx: AudioContext,
    spec: { type: BiquadFilterType; freq: number; to?: number; q?: number },
    t0: number,
    span: number,
  ) {
    const f = ctx.createBiquadFilter();
    f.type = spec.type;
    f.Q.value = spec.q ?? 1;
    f.frequency.setValueAtTime(spec.freq, t0);
    if (spec.to) {
      f.frequency.exponentialRampToValueAtTime(Math.max(20, spec.to), t0 + Math.max(0.01, span));
    }
    return f;
  }

  /* ── The cues ─────────────────────────────────────────────────────── */

  private render(
    ctx: AudioContext,
    out: AudioNode,
    cue: Cue,
    t0: number,
    gain: number,
    semitones: number,
  ): number {
    const hz = (base: number) => base * Math.pow(2, semitones / 12);

    switch (cue) {
      // The mouse rolling over: air moving, then a soft clack as it lands.
      case "whoosh": {
        const d = this.hiss(
          ctx,
          out,
          { attack: 0.05, decay: 0.3, peak: 0.13, filter: { type: "bandpass", freq: 300, to: 1700, q: 1.3 } },
          t0,
          gain,
        );
        this.tone(ctx, out, { freq: 150, to: 62, decay: 0.3, peak: 0.06 }, t0, gain);
        return d;
      }

      case "clack": {
        const d = this.hiss(
          ctx,
          out,
          { attack: 0.001, decay: 0.06, peak: 0.2, filter: { type: "bandpass", freq: 880, q: 1.1 } },
          t0,
          gain,
        );
        this.tone(ctx, out, { freq: 152, to: 62, decay: 0.17, peak: 0.16 }, t0, gain);
        return d;
      }

      // The Lightning connector seating: two tiny metallic clicks, then weight.
      case "plug": {
        this.hiss(ctx, out, { attack: 0.001, decay: 0.028, peak: 0.24, filter: { type: "bandpass", freq: 2400, q: 2.4 } }, t0, gain);
        this.hiss(ctx, out, { attack: 0.001, decay: 0.024, peak: 0.19, filter: { type: "bandpass", freq: 3100, q: 2.6 } }, t0 + 0.035, gain);
        this.tone(ctx, out, { freq: 3900, decay: 0.09, peak: 0.035 }, t0 + 0.03, gain);
        this.tone(ctx, out, { freq: 168, to: 72, decay: 0.1, peak: 0.13 }, t0 + 0.03, gain);
        return 0.2;
      }

      // Charge accepted. Two soft ascending blips — the sound of a green LED.
      case "connected": {
        this.tone(ctx, out, { freq: hz(1180), decay: 0.1, peak: 0.07 }, t0, gain);
        this.tone(ctx, out, { freq: hz(1770), decay: 0.14, peak: 0.055 }, t0 + 0.075, gain);
        return 0.3;
      }

      // The punchline. Two detuned triangles sagging away, plus a weight drop.
      case "deflate": {
        const low = { type: "lowpass" as BiquadFilterType, freq: 1400, to: 380, q: 0.7 };
        this.tone(ctx, out, { type: "triangle", freq: hz(233), to: hz(110), decay: 0.62, peak: 0.1, filter: low }, t0, gain);
        this.tone(ctx, out, { type: "triangle", freq: hz(233) * 1.005, to: hz(110) * 1.005, decay: 0.62, peak: 0.08, filter: low }, t0, gain);
        this.tone(ctx, out, { freq: 78, to: 41, decay: 0.5, peak: 0.13 }, t0 + 0.05, gain);
        return 0.9;
      }

      // A refusal, in two flat syllables.
      case "deny": {
        const low = { type: "lowpass" as BiquadFilterType, freq: 620, q: 0.9 };
        this.tone(ctx, out, { type: "square", freq: hz(92), decay: 0.13, peak: 0.05, filter: low }, t0, gain);
        this.tone(ctx, out, { type: "square", freq: hz(92), decay: 0.13, peak: 0.05, filter: low }, t0 + 0.16, gain);
        return 0.35;
      }

      // TrueDepth reading a face: a band of air climbing, with a soft rise.
      case "scan": {
        this.hiss(ctx, out, { attack: 0.25, decay: 1.15, peak: 0.055, filter: { type: "bandpass", freq: 620, to: 2700, q: 5 } }, t0, gain);
        this.tone(ctx, out, { freq: hz(180), to: hz(760), decay: 1.3, peak: 0.045, attack: 0.2 }, t0, gain);
        this.tone(ctx, out, { freq: hz(2300), to: hz(3600), decay: 1.1, peak: 0.018, attack: 0.25 }, t0 + 0.1, gain);
        return 1.45;
      }

      // One dot landing. Pitched per tick so the sweep climbs.
      case "tick": {
        return this.tone(ctx, out, { freq: hz(2350), decay: 0.03, peak: 0.032, attack: 0.002 }, t0, gain);
      }

      // The payoff: a latch letting go, then a maj7 opening up.
      case "unlock": {
        this.hiss(ctx, out, { attack: 0.001, decay: 0.02, peak: 0.11, filter: { type: "bandpass", freq: 1900, q: 2.2 } }, t0, gain);
        this.hiss(ctx, out, { attack: 0.002, decay: 0.05, peak: 0.085, filter: { type: "bandpass", freq: 780, q: 1.2 } }, t0 + 0.02, gain);

        const chord: Array<[number, number, number, number]> = [
          [523.25, 0, 0.055, 1.5],
          [659.25, 0.045, 0.045, 1.5],
          [783.99, 0.08, 0.05, 1.6],
          [987.77, 0.125, 0.04, 1.7],
          [1318.51, 0.17, 0.03, 1.8],
        ];
        for (const [freq, at, peak, decay] of chord) {
          this.tone(ctx, out, { freq: hz(freq), decay, peak, attack: 0.012 }, t0 + at, gain);
          this.tone(ctx, out, { type: "triangle", freq: hz(freq) * 2, decay: decay * 0.55, peak: peak * 0.22, attack: 0.01 }, t0 + at, gain);
        }
        this.tone(ctx, out, { freq: hz(130.81), to: hz(196), decay: 0.7, peak: 0.09, attack: 0.05 }, t0, gain);
        this.tone(ctx, out, { freq: hz(3000), to: hz(5200), decay: 0.5, peak: 0.016, attack: 0.04 }, t0 + 0.06, gain);
        return 1.9;
      }

      // Swipe up, and the phone arriving.
      case "swipe": {
        const d = this.hiss(ctx, out, { attack: 0.03, decay: 0.22, peak: 0.07, filter: { type: "bandpass", freq: 420, to: 1500, q: 1.1 } }, t0, gain);
        this.tone(ctx, out, { freq: hz(220), to: hz(430), decay: 0.24, peak: 0.03 }, t0, gain);
        return d;
      }

      default: {
        const unhandled: never = cue;
        void unhandled;
        return 0;
      }
    }
  }
}

export const sfx = new SoundEngine();

/** Reactive mute state for the toggle in the playground header. */
export function useSoundEnabled() {
  return useSyncExternalStore(sfx.subscribe, sfx.getSnapshot, sfx.getServerSnapshot);
}
