import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  size = "default",
  className,
}: {
  /** Omit to drop the eyebrow line entirely. */
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /**
   * "compact" is for sections that have to fit a whole screen, not just a
   * column — it also yields the description on a viewport too short to hold
   * everything, so the content below it keeps its room.
   */
  size?: "default" | "compact";
  className?: string;
}) {
  const compact = size === "compact";

  return (
    <Reveal
      className={cn(
        compact ? "max-w-3xl" : "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker && (
        <p
          className={cn(
            "font-mono uppercase text-accent",
            compact ? "text-[10px] tracking-[0.24em]" : "text-xs tracking-[0.3em]",
          )}
        >
          {kicker}
        </p>
      )}
      <h2
        className={cn(
          "font-semibold tracking-tight",
          compact ? "text-[clamp(1.25rem,2.4vw,1.9rem)]" : "text-[clamp(1.9rem,5vw,3rem)]",
          // The margin belongs to the pair, not to the title.
          kicker && (compact ? "mt-2" : "mt-3"),
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-pretty text-muted",
            compact
              ? "mt-2 text-xs sm:text-sm [@media(max-height:859.98px)]:hidden"
              : "mt-4 text-balance",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
