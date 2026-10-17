"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Triple-click any heading to trigger a harsh design review:
 * red squiggly underline, shake, and a REJECTED stamp.
 * Click the heading again (or Esc) to restore.
 */
export function BlameState() {
  const [reviewed, setReviewed] = useState<HTMLElement | null>(null);

  const clear = useCallback(() => setReviewed(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const heading = target?.closest<HTMLHeadingElement>("h1,h2,h3");
      if (!heading) return;

      if (reviewed === heading) {
        setReviewed(null);
        return;
      }

      let count = 0;
      let timer: ReturnType<typeof setTimeout>;
      const onTriple = (ev: MouseEvent) => {
        const t = ev.target as HTMLElement | null;
        const h = t?.closest<HTMLHeadingElement>("h1,h2,h3");
        if (!h || h !== heading) return;
        count++;
        if (count === 1) timer = setTimeout(() => (count = 0), 400);
        if (count === 3) {
          clearTimeout(timer);
          count = 0;
          setReviewed(heading);
        }
      };
      heading.addEventListener("click", onTriple, { once: true });
      const rearm = () => {
        heading.addEventListener("click", onTriple, { once: true });
      };
      const t = setTimeout(rearm, 100);
      return () => clearTimeout(t);
    },
    [reviewed],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [handleClick]);

  if (!reviewed) return null;

  return <BlameBadge target={reviewed} />;
}

type BlameBadgeProps = { target: HTMLElement };

function BlameBadge({ target }: BlameBadgeProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const update = () => setRect(target.getBoundingClientRect());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(target);
    return () => ro.disconnect();
  }, [target]);

  if (!rect) return null;

  return (
    <span
      className="absolute z-[60] flex items-center gap-2 rounded-full bg-[#ef4444] px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg"
      style={{
        top: rect.top - 26,
        left: rect.left,
      }}
    >
      <X className="size-3.5" /> REJECTED
    </span>
  );
}
