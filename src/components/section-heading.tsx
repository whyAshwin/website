import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className,
}: {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p
        className={cn(
          "font-mono text-xs uppercase tracking-[0.3em] text-accent",
          align === "center" && "justify-center",
        )}
      >
        {kicker}
      </p>
      <h2 className="mt-3 text-[clamp(1.9rem,5vw,3rem)] font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-muted">{description}</p>
      )}
    </Reveal>
  );
}
