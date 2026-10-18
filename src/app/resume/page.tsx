import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Ashwin Baranwal — Product Manager résumé.",
};

export default function ResumePage() {
  return (
    <div className="flex h-svh flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <h1 className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
          Résumé
        </h1>
        <a
          href="/Ashwin_Baranwal_Product.pdf"
          download
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Download className="size-3.5" />
          Download
        </a>
      </div>
      <iframe
        src="/Ashwin_Baranwal_Product.pdf#view=FitH"
        title="Ashwin Baranwal résumé"
        className="h-full w-full flex-1 border-0 bg-surface"
      />
    </div>
  );
}
