"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const TRIPLE_MS = 450;

/**
 * Triple-click any heading to trigger a harsh design review: squiggly red
 * underline, a shake, and a REJECTED stamp. Click the heading again, click the
 * stamp, or press Esc to restore.
 */
export function BlameState() {
  const [reviewed, setReviewed] = useState<HTMLElement | null>(null);
  const reviewedRef = useRef<HTMLElement | null>(null);
  const tracker = useRef<{ el: HTMLElement | null; count: number; at: number }>({
    el: null,
    count: 0,
    at: 0,
  });

  const clear = useCallback(() => {
    reviewedRef.current = null;
    setReviewed(null);
  }, []);

  // Esc restores.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear]);

  // Triple-click a heading to reject it; click it again to restore.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const heading = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "h1,h2,h3"
      );
      if (!heading) return;

      if (reviewedRef.current === heading) {
        clear();
        return;
      }

      const now = Date.now();
      const t = tracker.current;
      t.count = t.el === heading && now - t.at < TRIPLE_MS ? t.count + 1 : 1;
      t.el = heading;
      t.at = now;

      if (t.count >= 3) {
        t.count = 0;
        reviewedRef.current = heading;
        setReviewed(heading);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [clear]);

  // Paint the squiggle + shake onto the reviewed heading.
  useEffect(() => {
    if (!reviewed) return;
    reviewed.classList.add("blame-reviewed");
    return () => reviewed.classList.remove("blame-reviewed");
  }, [reviewed]);

  if (!reviewed) return null;

  return <BlameBadge target={reviewed} onDismiss={clear} />;
}

type BlameBadgeProps = {
  target: HTMLElement;
  onDismiss: () => void;
};

function BlameBadge({ target, onDismiss }: BlameBadgeProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const update = () => setRect(target.getBoundingClientRect());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(target);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  if (!rect) return null;

  return (
    <button
      type="button"
      onClick={onDismiss}
      style={{ top: Math.max(8, rect.top - 30), left: rect.left }}
      className="fixed z-[90] flex items-center gap-1.5 rounded-full bg-[#ef4444] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
    >
      <X className="size-3.5" /> Rejected
    </button>
  );
}
