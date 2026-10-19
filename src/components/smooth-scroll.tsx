"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia smooth-scroll via Lenis, plus smooth in-page anchor navigation.
 * Disabled entirely when the user prefers reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      event.preventDefault();
      // No `offset` here on purpose: Lenis already subtracts the target's
      // `scroll-margin-top`, so passing the header height again would land the
      // section twice as far down (96 + 96 = 192px) and leave a dead band
      // under the header. One source of truth: the sections' `scroll-mt-24`.
      lenis.scrollTo(el as HTMLElement, { duration: 1.1 });
      history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
