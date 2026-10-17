"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { DodgingButton } from "@/components/dodging-button";
import { profile, socials } from "@/lib/content";
import { useCurrentYear } from "@/lib/use-current-year";
import { Reveal } from "./reveal";
import { Magnetic } from "./magnetic";
import { SocialIcon } from "./social-icon";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const year = useCurrentYear();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-surface px-6 py-16 sm:px-14">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

        <Reveal className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Contact</p>
          <h2 className="mt-4 text-[clamp(2.2rem,6vw,3.8rem)] font-semibold leading-[1.02] tracking-tight">
            Let&apos;s build something <span className="text-gradient">worth using</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance text-muted">
            Open to product roles, interesting intros, or just geeking out on builds. I&apos;d love to
            hear from you.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.2}>
              <DodgingButton onClick={copyEmail}>
              {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4 text-accent" />}
              {copied ? "Copied!" : profile.email}
            </DodgingButton>
            </Magnetic>

            <a
              href={profile.resume}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
            >
              <FileText className="size-4" />
              View résumé
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid size-10 place-items-center rounded-full border border-line text-muted transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-xs text-faint sm:flex-row">
        <p className="font-mono">© {year} {profile.name}</p>
        <p className="font-mono">
          Built with Next.js, Tailwind &amp; Framer Motion
        </p>
      </footer>
    </section>
  );
}
