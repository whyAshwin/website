import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_75%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface-2 text-accent">
          <Compass className="size-6" />
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-accent">404</p>
        <h1 className="mt-4 max-w-xl text-[clamp(1.9rem,5.5vw,3.25rem)] font-semibold leading-tight tracking-tight">
          This page drifted off the roadmap.
        </h1>
        <p className="mt-4 max-w-md text-balance text-muted">
          The link you followed doesn&apos;t exist — or it shipped and moved somewhere better.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </div>
    </main>
  );
}
