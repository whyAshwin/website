"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Bot, Globe2, Layers, Rocket, Wand2 } from "lucide-react";
import { profile } from "@/lib/content";
import { RevealGroup, revealItem } from "./reveal";
import { SectionHeading } from "./section-heading";
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

/**
 * The toolkit in the résumé's own three groups: the product craft, the
 * engineering he now does himself, and the tools holding it up. Kept as three
 * flowing lines of chips rather than one long wall — the dashed connector is
 * this card's motif, so a group's chips stay connected to each other and the
 * last one doesn't trail a dash into whitespace.
 */
const TOOLKIT = [
  {
    group: "Product",
    items: ["Discovery", "PRDs", "User research", "A/B testing", "Metrics", "GTM"],
  },
  {
    group: "AI & engineering",
    // Kept to the four that pair up into even rows: "Rapid MVP builds" would
    // orphan a row of its own, and the footnote below says the same thing
    // anyway.
    items: ["Agentic AI", "Prompt engineering", "SQL", "API integrations"],
  },
  {
    group: "Tools",
    items: ["Figma", "n8n", "JIRA", "Miro", "Zapier"],
  },
] as const;

/**
 * The watermark on the languages card, and its whole argument in one glance:
 * business and AI sit in the same list as the human greetings, because the
 * line underneath reads them the same way.
 *
 * Every word carries its own duration, delay and travel, so they drift out of
 * phase and the card never looks like a screenshot. The values are fixed
 * rather than random — randomness at render time would differ between the
 * server and the client and hydrate into a jump.
 *
 * The human languages stay bigger: the business and AI notes are the finer
 * layer underneath, which is also what keeps ten words legible in a card this
 * small.
 */
const LANGUAGES = [
  { text: "नमस्ते", pos: "right-[52%] top-[6%] text-xl", duration: 7.4, delay: 0, dx: 4, dy: -7 },
  { text: "こんにちは", pos: "right-[5%] top-[6%] text-xl", duration: 9.2, delay: 1.1, dx: -5, dy: -9 },
  { text: "ARR", pos: "left-[34%] top-[26%] text-sm", duration: 6.9, delay: 0.7, dx: 3, dy: -6 },
  { text: "churn", pos: "right-[9%] top-[27%] text-sm", duration: 8.1, delay: 2.3, dx: -4, dy: -8 },
  { text: "Hola", pos: "right-[34%] top-[42%] text-lg", duration: 8.6, delay: 1.7, dx: -4, dy: -6 },
  { text: "GTM", pos: "left-[6%] top-[43%] text-sm", duration: 7.7, delay: 3.1, dx: 4, dy: -9 },
  { text: "LLM", pos: "left-[38%] top-[61%] text-sm", duration: 8.8, delay: 2.0, dx: -3, dy: -5 },
  { text: "AI", pos: "left-[22%] top-[44%] text-base", duration: 7.1, delay: 0.4, dx: 3, dy: -7 },
  { text: "안녕", pos: "left-[10%] bottom-[14%] text-lg", duration: 9.0, delay: 2.7, dx: 4, dy: -6 },
  { text: "Hello", pos: "right-[8%] bottom-[9%] text-2xl", duration: 8.3, delay: 1.4, dx: -5, dy: -8 },
] as const;

export function Bento() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kicker="About"
        title="The short profile"
        description={profile.blurb}
        className="mb-10"
      />

      <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Feature card with photo */}
        <motion.div variants={revealItem} className="md:col-span-4 md:row-span-2">
          <SpotlightCard className="h-full rounded-3xl border border-line bg-surface">
            {/* `h-full` is load-bearing: the card stretches to whatever the
                grid row turns out to be (the Toolkit beside it decides that),
                and a fixed min-height alone left the photo 320px tall with a
                band of empty surface underneath it. */}
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl">
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
          <SpotlightCard className="flex h-full flex-col rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-muted">
              <Layers className="size-4 text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Toolkit</span>
            </div>
            <div className="mt-4 space-y-4">
              {TOOLKIT.map((group) => (
                <div key={group.group}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    {group.group}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item, i) => (
                      <span key={item} className="relative">
                        <span className="inline-flex rounded-lg bg-surface-3 px-2.5 py-1.5 font-mono text-xs text-fg/90">
                          {item}
                        </span>
                        {i < group.items.length - 1 && (
                          <FlowLine className="absolute -right-2 top-1/2 h-px w-2 -translate-y-1/2 opacity-70" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* The résumé names his build stack; naming it here is the whole
                point of the AI row above — he ships MVPs himself, with agents. */}
            <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              MVPs shipped with Vorflux &amp; OpenCode
            </p>
          </SpotlightCard>
        </motion.div>

        {/* Languages watermark — the card's thesis as texture, with a slow glow
            underneath so the type has some weather to move through. */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <SpotlightCard
            color="rgba(76,201,240,0.30)"
            className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-5"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
              <motion.div
                className="absolute -left-10 top-1/4 size-44 rounded-full bg-accent-2/15 blur-2xl"
                animate={
                  reduce ? undefined : { x: [0, 44, 0], y: [0, 28, 0], opacity: [0.45, 0.85, 0.45] }
                }
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
              />

              {LANGUAGES.map((word) => (
                <motion.span
                  key={word.text}
                  className={`absolute font-semibold ${
                    word.text === "AI" ? "text-poppy/20" : "text-white/[0.07]"
                  } ${word.pos}`}
                  animate={
                    reduce
                      ? undefined
                      : {
                          x: [0, word.dx, 0],
                          y: [0, word.dy, 0],
                          opacity: [0.65, 1, 0.65],
                        }
                  }
                  transition={{
                    duration: word.duration,
                    delay: word.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {word.text}
                </motion.span>
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
              <li className="flex gap-2">
                <Rocket className="mt-0.5 size-3.5 shrink-0 text-accent" />
                Automate the boring parts.
              </li>
            </ul>
          </SpotlightCard>
        </motion.div>

        {/* CTA card */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <a href="#contact" className="group block h-full">
            <SpotlightCard className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-accent/30 bg-accent/10 p-5">
              <p className="text-lg font-semibold leading-snug">
                Bring me the messy part.
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-sm text-accent">
                Let&apos;s talk
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </SpotlightCard>
          </a>
        </motion.div>

        {/* AI in production. The résumé leads with this and the page had
            nowhere to put it: the agent that reads a therapy session and
            writes the summary. Same shape as its neighbours — label, one
            thought, one number — because the grid reads as one voice. The
            number is plain text, not the animated Counter: a figure that
            renders as "0K+" in the HTML until someone scrolls to it would be
            a false claim to anything reading the page without a viewport. */}
        <motion.div variants={revealItem} className="md:col-span-2">
          <SpotlightCard className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-line bg-surface p-5">
            <div>
              <div className="flex items-center gap-2 text-muted">
                <Bot className="size-4 text-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                  AI in production
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                An agent reads the session&apos;s transcripts and reports into a 100-word summary
                before the therapist asks — so nobody has to repeat themselves.
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-gradient text-2xl font-semibold tracking-tight">15K+</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                sessions a month
              </span>
            </div>
          </SpotlightCard>
        </motion.div>
      </RevealGroup>
    </section>
  );
}
