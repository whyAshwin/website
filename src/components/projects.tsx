"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { projects } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { ProjectTerminal } from "@/components/project-terminal";
import { RevealGroup, revealItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { TiltCard } from "./tilt-card";

export function Projects() {
  return (
    <section id="work" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        kicker="Selected work"
        title="Case studies & builds"
        description="Teardowns, prototypes and shipped MVPs — the thinking behind the pixels."
      />

      <RevealGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
        {projects.map((project) => (
          <motion.div key={project.title} variants={revealItem} className="h-full">
            <TiltCard className="h-full">
              <ProjectTerminal readout={project.readout}>
                <SpotlightCard
                  className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6"
                  color={`${project.accent}33`}
                >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover/spot:opacity-70"
                  style={{ background: project.accent }}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[11px]"
                    style={{ borderColor: `${project.accent}55`, color: project.accent }}
                  >
                    {project.tag}
                  </span>
                  <span className="font-mono text-[11px] text-faint">{project.year}</span>
                </div>

                <h3 className="relative mt-5 text-xl font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                {project.status === "progress" ? (
                  <div className="relative mt-6">
                    <span className="inline-flex items-center gap-2 font-mono text-xs text-faint">
                      <Clock className="size-3.5" />
                      In progress
                    </span>
                  </div>
                ) : project.links?.length ? (
                  <div className="relative mt-6 flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </SpotlightCard>
            </ProjectTerminal>
          </TiltCard>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
