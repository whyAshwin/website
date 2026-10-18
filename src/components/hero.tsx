"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { profile, socials } from "@/lib/content";
import { useIntro } from "./intro";
import { BackgroundBeams } from "./background-beams";
import { HeroPortrait } from "./hero-portrait";
import { SocialIcon } from "./social-icon";

export function Hero() {
  const { ready } = useIntro();
  const reduce = useReducedMotion();
  const show = ready || Boolean(reduce);

  // Compose the hero subtitle without splicing a lowercase fragment into a
  // finished sentence ("...by product. listening closely...").
  const blurbParts = profile.blurb.split(" — ");
  const blurbTail = blurbParts.length > 1 ? blurbParts.slice(1).join(" — ") : null;
  const heroTail = blurbTail
    ? blurbTail.charAt(0).toUpperCase() + blurbTail.slice(1)
    : profile.blurb;

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
            {profile.tagline} <span className="text-fg">{heroTail}</span>
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
          <HeroPortrait show={show} />
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

