"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Briefcase } from "lucide-react";
import { experience } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { SpotlightCard } from "./spotlight-card";
import { Reveal } from "./reveal";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        kicker="Experience"
        title="Building products that solve real problems"
        description="Every role on this list ends the same way: something live, a number that moved, and a call I'd defend in the room."
      />

      <div ref={ref} className="relative mt-14 pl-8 sm:pl-12">
        {/* Timeline rail */}
        <div className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px bg-line sm:left-[7px]" aria-hidden />
        <motion.div
          aria-hidden
          style={reduce ? { scaleY: 1 } : { scaleY }}
          className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-accent via-accent to-accent-2 sm:left-[7px]"
        />

        <div className="space-y-6">
          {experience.map((job, index) => (
            <Reveal key={`${job.company}-${job.period}`} delay={index * 0.04}>
              <article className="relative">
                {/* Node */}
                <span className="absolute -left-8 top-6 grid size-[15px] place-items-center rounded-full border border-line bg-bg sm:-left-12">
                  <span className="size-[7px] rounded-full bg-accent" />
                </span>

                <SpotlightCard className="rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold sm:text-xl">{job.role}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-accent">
                        <Briefcase className="size-3.5" />
                        <span className="font-medium">{job.company}</span>
                        {job.context && (
                          <span className="text-faint">· {job.context}</span>
                        )}
                      </p>
                    </div>
                    <span className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-xs text-muted">
                      {job.period}
                    </span>
                  </div>

                  {job.summary && (
                    <p className="mt-4 text-sm text-muted">{job.summary}</p>
                  )}

                  <ul className="mt-5 space-y-3">
                    {job.highlights.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {job.stack && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.stack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-surface-3 px-2 py-1 font-mono text-[11px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </SpotlightCard>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
