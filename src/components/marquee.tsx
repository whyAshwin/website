"use client";

import { cn } from "@/lib/utils";

/** Infinite horizontal marquee. Content is duplicated for a seamless loop. */
export function Marquee({
  items,
  className,
  reverse = false,
  pauseOnHover = true,
}: {
  items: React.ReactNode[];
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div className={cn("marquee-mask group relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <div key={i} className="flex items-center">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
