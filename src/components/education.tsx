"use client";

import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { education } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { RevealGroup, revealItem } from "./reveal";

export function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading kicker="Education" title="Where the thinking was formed" />

      <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2" stagger={0.1}>
        {education.map((item) => (
          <motion.div
            key={item.degree}
            variants={revealItem}
            className="group relative overflow-hidden rounded-3xl border border-line bg-surface"
          >
            {/* The per-card zoom sits on this wrapper and the hover push sits
                on the image, so the two transforms never fight over one element. */}
            <div
              className="absolute inset-0"
              style={
                item.zoom ? { transform: `scale(${item.zoom})`, transformOrigin: item.focus } : undefined
              }
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                style={{
                  objectPosition: item.focus,
                  filter: item.filter,
                  opacity: item.opacity,
                }}
                className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Flat dim, then a fade: the campus reads at the top, and by the
                time the type gets dense at the base it is on solid background. */}
            <div aria-hidden className="absolute inset-0 bg-bg/35" />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-transparent"
            />
            <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-accent/10 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex h-full flex-col p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface-2/80 text-accent backdrop-blur-sm">
                  <GraduationCap className="size-5" />
                </span>
                {item.score && (
                  <span className="rounded-full border border-accent/40 bg-bg/70 px-3 py-1 font-mono text-xs text-accent backdrop-blur-sm">
                    {item.score}
                  </span>
                )}
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-snug">{item.degree}</h3>
              <p className="mt-2 text-sm text-accent">{item.school}</p>
              <p className="mt-1 text-sm text-faint">{item.detail}</p>
              <p className="mt-auto pt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {item.year}
              </p>
            </div>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
