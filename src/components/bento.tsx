"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Globe2, Layers, Rocket, Wand2 } from "lucide-react";
import { RevealGroup, revealItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";

/** A short animated dashed line whose dashes travel along its length. */
function FlowLine({ vertical = false, className = "" }: { vertical?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const size = vertical ? "1px 8px" : "8px 1px";
  const gradient = `repeating-linear-gradient(${vertical ? "to bottom" : "to right"}, var(--color-accent) 0 6px, transparent 6px 14px)`;
  return (
    <motion.span
      aria-hidden
      className={className}
      style={{
        backgroundImage: gradient,
        backgroundSize: size,
        borderRadius: 999,
      }}
      animate={reduce ? undefined : { backgroundPositionX: vertical ? 0 : [0, -14], backgroundPositionY: vertical ? [0, -14] : 0 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    />
  );
}

const toolkit = ["Discovery", "PRDs", "Figma", "SQL", "A/B Testing", "n8n", "Analytics", "GTM"];

export function Bento() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
      <header className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">About</p>
        <h2 className="mt-3 text-[clamp(1.9rem,5vw,3rem)] font-semibold tracking-tight">
          The short profile
        </h2>
      </header>

      <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Feature card with photo */}
        <motion.div variants={revealItem} className="md:col-span-4 md:row-span-2">
          <SpotlightCard className="h-full rounded-3xl border border-line bg-surface">
            <div className="relative min-h-[320px] overflow-hidden rounded-3xl">
              <Image
                src="/gallery/field.jpg"
                alt="Ashwin in the field"
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover opacity-60 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
              <div className="relative flex h-full min-h-[320px] flex-col justify-end p-7">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  Ground → Grid
                </p>
                <h3 className="mt-3 max-w-md text-2xl font-semibold leading-snug sm:text-3xl">
                  I move between the shop floor and the roadmap — learning from the field, designing
                  with clarity.
                </h3>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Toolkit with flowing connectors */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <SpotlightCard className="h-full rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-muted">
              <Layers className="size-4 text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Toolkit</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {toolkit.map((item, i) => (
                <span key={item} className="relative">
                  <span className="inline-flex rounded-lg bg-surface-3 px-2.5 py-1.5 font-mono text-xs text-fg/90">
                    {item}
                  </span>
                  {i < toolkit.length - 1 && (
                    <FlowLine className="absolute -right-2 top-1/2 h-px w-2 -translate-y-1/2 opacity-70" />
                  )}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Languages watermark */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <SpotlightCard className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-5">
            <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
              {[
                ["Hello", "right-[10%] bottom-[12%] text-2xl"],
                ["नमस्ते", "left-[8%] top-[14%] text-xl"],
                ["こんにちは", "right-[6%] top-[8%] text-xl"],
                ["안녕", "left-[12%] bottom-[16%] text-lg"],
                ["Hola", "right-[30%] top-[46%] text-lg"],
              ].map(([word, pos], i) => (
                <span
                  key={i}
                  className={`absolute font-semibold text-white/[0.07] ${pos}`}
                >
                  {word}
                </span>
              ))}
            </div>
            <div className="relative flex h-full flex-col justify-between gap-6">
              <Globe2 className="size-5 text-accent-2" />
              <p className="text-lg font-semibold leading-snug">
                Fluent in the language of users — and of the business.
              </p>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Principles */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <SpotlightCard className="h-full rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-muted">
              <Wand2 className="size-4 text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Principles</span>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li className="flex gap-2">
                <Rocket className="mt-0.5 size-3.5 shrink-0 text-accent" />
                Ship, then sharpen.
              </li>
              <li className="flex gap-2">
                <Rocket className="mt-0.5 size-3.5 shrink-0 text-accent" />
                Talk to users, always.
              </li>
              <li className="flex gap-2">
                <Rocket className="mt-0.5 size-3.5 shrink-0 text-accent" />
                Make complexity disappear.
              </li>
            </ul>
          </SpotlightCard>
        </motion.div>

        {/* CTA card */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <a href="#contact" className="group block h-full">
            <SpotlightCard className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-accent/30 bg-accent/10 p-5">
              <p className="text-lg font-semibold leading-snug">
                Got a problem worth solving?
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-sm text-accent">
                Let&apos;s talk
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </SpotlightCard>
          </a>
        </motion.div>
      </RevealGroup>
    </section>
  );
}
