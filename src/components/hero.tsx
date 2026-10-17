"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { profile, socials } from "@/lib/content";
import { useIntro } from "./intro";
import { BackgroundBeams } from "./background-beams";

export function Hero() {
  const { ready } = useIntro();
  const reduce = useReducedMotion();
  const show = ready || Boolean(reduce);

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-16">
      <BackgroundBeams />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[560px] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.span
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted backdrop-blur"
          >
            <Sparkles className="size-3.5 text-accent" />
            {profile.role}
          </motion.span>

          <motion.h1
            animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(14px)" }}
            transition={{ duration: 0.9, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[clamp(2.6rem,8vw,5.2rem)] font-semibold leading-[0.98] tracking-tight"
          >
            <span className="text-muted">Hi, I&apos;m</span>{" "}
            <span className="group relative inline-block cursor-pointer overflow-hidden align-bottom">
              <span className="relative z-10 inline-block transition-colors duration-500 group-hover:text-bg">
                {profile.name}
              </span>
              <span className="absolute inset-0 z-0 origin-left scale-x-0 rounded-[6px] bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
          </motion.h1>

          <motion.p
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted lg:mx-0"
          >
            {profile.tagline} <span className="text-fg">{profile.blurb.split(" — ")[1]}</span>
          </motion.p>

          <motion.div
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
            >
              Say hi
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#work"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold text-fg transition-colors hover:bg-white/5"
            >
              See my work
            </a>
          </motion.div>

          <motion.div
            animate={show ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-9 flex items-center justify-center gap-3 lg:justify-start"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid size-10 place-items-center rounded-full border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ── Portrait ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 flex justify-center lg:order-2"
        >
          <div className="relative size-[280px] sm:size-[360px] lg:size-[420px]">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-accent/25 blur-3xl" />
            {/* Rotating dashed ring */}
            <motion.svg
              viewBox="0 0 500 500"
              className="absolute inset-0 size-full text-accent"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              <circle
                cx="250"
                cy="250"
                r="244"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="26 14 0 0"
                opacity="0.7"
              />
            </motion.svg>
            {/* Counter-rotating thin ring */}
            <motion.svg
              viewBox="0 0 500 500"
              className="absolute inset-0 size-full text-accent-2"
              animate={reduce ? undefined : { rotate: -360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              aria-hidden
            >
              <circle
                cx="250"
                cy="250"
                r="230"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 10"
                opacity="0.35"
              />
            </motion.svg>

            {/* Photo */}
            <div className="absolute inset-6 overflow-hidden rounded-full border border-line-strong bg-surface-2">
              <motion.div
                initial={{ filter: "blur(24px)", scale: 1.12 }}
                animate={show ? { filter: "blur(0px)", scale: 1 } : undefined}
                transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative size-full"
              >
                <Image
                  src="/profile.jpg"
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 360px, 420px"
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Status chip */}
            <motion.div
              animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="glass absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Open to product roles
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-line-strong to-transparent" />
      </motion.div>
    </section>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = { className: "size-4", viewBox: "0 0 24 24", fill: "currentColor" };
  switch (name) {
    case "mail":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L6 22H2.9l7.5-8.6L2.4 2h6.6l4.5 6.6L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z" />
        </svg>
      );
    case "medium":
      return (
        <svg {...common}>
          <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
        </svg>
      );
    default:
      return null;
  }
}
