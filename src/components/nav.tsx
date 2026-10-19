"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X, FileText } from "lucide-react";
import { sections } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy. What leaves the band matters as much as what enters it: the
  // intro and the playground aren't nav sections, so without the removal pass
  // the last section that was lit stayed lit through a whole screen of them.
  // Non-null only while a nav section owns the middle of the viewport.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const inBand = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });
        // Sections are contiguous, so only a boundary ever puts two in the band.
        setActive(sections.map((s) => s.id).find((id) => inBand.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Scroll progress rail */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      />

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={cn(
            "flex w-full max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500",
            scrolled ? "glass-strong shadow-2xl shadow-black/40" : "border border-transparent",
          )}
        >
          <Link href="#top" className="group flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-accent font-mono text-sm font-bold text-bg">
              A
            </span>
            <span className="font-mono text-sm tracking-tight">
              ashwin<span className="text-accent">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active === section.id ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {active === section.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{section.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* The breakpoint class lives on a wrapper: Magnetic sets
                display:inline-block inline, which would beat `hidden`. */}
            <div className="hidden sm:block">
              <Magnetic strength={0.25}>
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <FileText className="size-3.5" />
                  Resume
                </Link>
              </Magnetic>
            </div>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-line text-fg md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-strong fixed inset-x-4 top-20 z-40 rounded-2xl p-2 md:hidden"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-white/5 hover:text-fg"
              >
                {section.label}
              </a>
            ))}
            <Link
              href="/resume"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-bg"
            >
              Resume
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
