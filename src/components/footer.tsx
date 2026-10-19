"use client";

import { profile } from "@/lib/content";
import { useCurrentYear } from "@/lib/use-current-year";

/**
 * The last line on the page, deliberately after the playground: a footer above
 * a full-screen section reads as a bug, and the credit is the closing joke.
 */
export function Footer() {
  const year = useCurrentYear();

  return (
    <footer className="relative mx-auto max-w-6xl px-6 pb-16">
      {/* The rule lives on the inner row so it spans the content grid, not the
          viewport — the same width as the contact panel above it. */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-xs text-faint sm:flex-row">
        <p className="font-mono">
          © {year} {profile.name}
        </p>
        <p className="font-mono">
          Built with{" "}
          {/* The credit is the joke: the stack is struck out, and the thing
              that actually did the work gets the only loud colour on the page.
              `<s>` because the claim is no longer accurate — not `<del>`,
              which would mean it was edited out of a document. */}
          <s className="line-through opacity-60">Next.js, Tailwind &amp; Framer Motion</s>{" "}
          <span className="text-poppy">🤖 AI</span>
        </p>
      </div>
    </footer>
  );
}
