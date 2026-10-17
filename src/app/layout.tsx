import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IntroProvider, Preloader } from "@/components/intro";
import SmoothScroll from "@/components/smooth-scroll";
import { KonamiDebug } from "@/components/konami-debug";
import { BlameState } from "@/components/blame-state";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ashwinbaranwal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashwin Baranwal — Product Manager",
    template: "%s — Ashwin Baranwal",
  },
  description:
    "Product Manager shaped by the market and sharpened by product. I thrive where real-world hustle meets structured thinking.",
  keywords: [
    "Ashwin Baranwal",
    "Product Manager",
    "Product Management",
    "Fintech",
    "B2B Marketplace",
    "IIM Sirmaur",
    "Portfolio",
  ],
  authors: [{ name: "Ashwin Baranwal", url: siteUrl }],
  creator: "Ashwin Baranwal",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Ashwin Baranwal — Product Manager",
    description:
      "A curious mind shaped by the market, sharpened by product. Selected work, experience and case studies.",
    images: [{ url: "/profile.jpg", width: 1536, height: 1182, alt: "Ashwin Baranwal" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@whyashwin",
    title: "Ashwin Baranwal — Product Manager",
    description: "A curious mind shaped by the market, sharpened by product.",
    images: ["/profile.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="grain relative min-h-svh">
        <IntroProvider>
          <Preloader />
          <BlameState />
          <KonamiDebug />
          <SmoothScroll />
          {children}
        </IntroProvider>
      </body>
    </html>
  );
}
