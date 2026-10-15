"use client";

import { GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { education } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { RevealGroup, revealItem } from "./reveal";

export function Education() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeading kicker="Education" title="Where the thinking was formed" />

      <RevealGroup className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2" stagger={0.1}>
        {education.map((item) => (
          <motion.div
            key={item.degree}
            variants={revealItem}
            className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
            <div className="relative flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-2xl border border-line bg-surface-2 text-accent">
                <GraduationCap className="size-5" />
              </span>
              {item.score && (
                <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                  {item.score}
                </span>
              )}
            </div>
            <h3 className="relative mt-6 text-lg font-semibold leading-snug">{item.degree}</h3>
            <p className="relative mt-2 text-sm text-accent">{item.school}</p>
            <p className="relative mt-1 text-sm text-faint">{item.detail}</p>
            <p className="relative mt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {item.year}
            </p>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
