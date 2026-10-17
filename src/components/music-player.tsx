"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

type Track = {
  title: string;
  artist: string;
  src: string;
  img: string;
};

/** The playlist, in order. Files live in /public/music. */
const PLAYLIST: Track[] = [
  {
    title: "Aruarian Dance",
    artist: "Nujabes",
    src: "/music/nujabes-aruarian-dance.mp3",
    img: "/music/nujabes-aruarian-dance.jpg",
  },
  {
    title: "A Town with Ocean View",
    artist: "Ghibli",
    src: "/music/kiki.mp3",
    img: "/music/kiki.jpg",
  },
  {
    title: "Christina",
    artist: "Steins;Gate",
    src: "/music/steins-gate-christina-i.mp3",
    img: "/music/steins-gate-christina-i.jpg",
  },
  {
    title: "Lullaby Of Resembool",
    artist: "Full Metal Alchemist Brotherhood",
    src: "/music/lullaby-of-resembool.mp3",
    img: "/music/lullaby-of-resembool.jpg",
  },
  {
    title: "Promise",
    artist: "Akira Yamaoka",
    src: "/music/promise.mp3",
    img: "/music/promise.jpg",
  },
];

/** Frosted-glass surface shared by the pill and the expanded panel. */
const GLASS: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 100%)",
  boxShadow:
    "0 8px 32px 0 rgba(0,0,0,0.4), inset 0 1px 1px 0 rgba(255,255,255,0.15), 0 1px 0 0 rgba(255,255,255,0.1)",
};

const GLASS_CLASS =
  "border border-white/30 backdrop-blur-2xl backdrop-saturate-200 text-white";

/** Sky → fuchsia → amber, the fill used on both progress bars. */
const BAR_FILL =
  "bg-gradient-to-r from-sky-400 via-fuchsia-500 to-amber-300";

function format(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Glass "now playing" widget: a circular pill that expands into a full player.
 * A single <audio> element is driven imperatively so nothing re-mounts mid-track.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = PLAYLIST[index];
  const progress = duration > 0 ? (time / duration) * 100 : 0;

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  /** Swap tracks. A stable callback, so listeners are attached once. */
  const go = useCallback((delta: number) => {
    setIndex((i) => (i + delta + PLAYLIST.length) % PLAYLIST.length);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  const seek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setTime(value);
  }, []);

  // Media events. `go` is stable; the handlers below never go stale.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setTime(audio.currentTime);
    const onMeta = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => go(1);
    const onError = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [go]);

  // Reload whenever the source changes, resuming if we were playing.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (playingRef.current) {
      void audio.play().catch(() => setPlaying(false));
    }
  }, [index]);

  const art = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={track.img}
      alt={track.title}
      width={64}
      height={64}
      draggable={false}
      className={cn(
        "object-cover",
        open
          ? "size-16 rounded-2xl shadow-lg"
          : "size-11 rounded-full lg:size-8 lg:rounded-lg 2xl:size-9 2xl:rounded-xl"
      )}
    />
  );

  const playIcon = playing ? (
    <Pause className="size-3.5 fill-current 2xl:size-4" />
  ) : (
    <Play className="size-3.5 translate-x-px fill-current 2xl:size-4" />
  );

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={GLASS}
            className={cn(
              "fixed z-[70] inset-x-0 bottom-0 rounded-t-3xl px-5 pt-5 pb-8",
              "lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-80 lg:rounded-3xl lg:p-4",
              GLASS_CLASS
            )}
          >
            {/* Drag handle — mobile only */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/30 lg:hidden" />

            <div className="flex items-start gap-3">
              <div className="relative shrink-0">{art}</div>

              <div className="min-w-0 flex-1">
                <p
                  title={track.title}
                  className="line-clamp-1 font-mono text-base font-bold leading-tight"
                >
                  {track.title}
                </p>
                <p
                  title={track.artist}
                  className="line-clamp-1 font-mono text-xs font-medium text-white/60"
                >
                  {track.artist}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Collapse player"
                className="shrink-0 rounded-full p-1 text-white/70 transition-colors hover:text-white"
              >
                <ChevronDown className="size-5" />
              </button>
            </div>

            {/* Scrubber */}
            <div className="mt-4">
              <div className="flex w-full items-center gap-2">
                <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-white/70">
                  {format(time)}
                </span>

                <div className="group relative h-4 flex-1">
                  <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/25" />
                  <div
                    className={cn(
                      "absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[length:200%_100%] animate-shimmer shadow-[0_0_10px_rgba(217,70,239,0.55)] transition-[width] duration-150",
                      BAR_FILL
                    )}
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-opacity duration-150 group-hover:opacity-100"
                    style={{ left: `${progress}%` }}
                  />
                  <input
                    type="range"
                    aria-label="Seek"
                    min={0}
                    max={duration || 0}
                    step="any"
                    value={time}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
                  />
                </div>

                <span className="w-9 shrink-0 font-mono text-[10px] tabular-nums text-white/70">
                  {format(duration)}
                </span>
              </div>
            </div>

            {/* Transport */}
            <div className="mt-3 flex items-center justify-center gap-8 lg:mt-2 lg:gap-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous track"
                className="text-white/90 transition-colors hover:text-white active:scale-95"
              >
                <SkipBack className="size-[22px] fill-current" />
              </button>

              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                className="flex size-12 items-center justify-center rounded-full bg-white/90 text-indigo-900 shadow-md transition-all hover:bg-white active:scale-95 lg:size-11"
              >
                {playing ? (
                  <Pause className="size-[22px] fill-current" />
                ) : (
                  <Play className="size-[22px] translate-x-px fill-current" />
                )}
              </button>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next track"
                className="text-white/90 transition-colors hover:text-white active:scale-95"
              >
                <SkipForward className="size-[22px] fill-current" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pill"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label="Open music player"
              aria-expanded={false}
              onClick={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
              style={GLASS}
              className={cn(
                "group fixed bottom-24 left-4 z-[70] cursor-pointer overflow-hidden rounded-full p-1",
                "lg:bottom-6 lg:left-6 lg:rounded-xl lg:p-0 2xl:rounded-2xl",
                GLASS_CLASS
              )}
            >
              <div className="flex items-center lg:gap-1.5 lg:p-1.5 lg:pr-2.5 2xl:gap-2 2xl:p-2 2xl:pr-3">
                {art}

                <div className="hidden min-w-0 max-w-[6.5rem] lg:block">
                  <p className="line-clamp-1 font-mono text-[11px] font-bold leading-tight">
                    {track.title}
                  </p>
                  <p className="line-clamp-1 font-mono text-[9px] font-medium leading-tight text-white/60">
                    {track.artist}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                  className="ml-0.5 hidden size-7 shrink-0 items-center justify-center rounded-full bg-white/90 text-indigo-900 shadow transition-all hover:bg-white active:scale-95 lg:flex 2xl:ml-1 2xl:size-8"
                >
                  {playIcon}
                </button>

                <ChevronUp className="-ml-0.5 hidden size-3.5 shrink-0 text-white/50 transition-colors group-hover:text-white/80 lg:block 2xl:ml-0 2xl:size-4" />
              </div>

              {/* Progress hairline along the bottom of the pill */}
              <div className="absolute inset-x-0 bottom-0 hidden h-0.5 bg-white/15 lg:block">
                <div
                  className={cn("h-full transition-[width] duration-150", BAR_FILL)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
