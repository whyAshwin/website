# ashwinbaranwal.com

Personal portfolio for **Ashwin Baranwal** — Product Manager.
Built with an animation-first architecture: scroll choreography, magnetic hovers, a curtain
preloader, a glass music island and a reactive bento grid.

## Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, static export)              |
| Language   | TypeScript                                                    |
| Styling    | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`)     |
| Motion     | `motion` (Framer Motion) — reveals, layout, springs, gestures  |
| Scrolling  | `lenis` (inertia smooth scroll + smooth anchors)               |
| Icons      | `lucide-react`                                                 |
| Fonts      | Geist + Geist Mono (via `next/font`)                           |

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build -> out/ (static export)
pnpm start        # preview that build locally (serves out/)
pnpm lint         # eslint
```

## Deploy

Hosted on **Cloudflare Pages**, project `website`, production branch `main`.
The project builds the repo — the settings it relies on are:

| Setting                  | Value        |
| ------------------------ | ------------ |
| Build command            | `pnpm build` |
| Build output directory   | `out`        |
| `NODE_VERSION` (env var) | `22`         |

`next.config.ts` sets `output: "export"`, so `pnpm build` emits a fully static
`out/` directory: one HTML file per route, hashed JS/CSS, and a copy of
`public/`. There is no server runtime. Push to `main` and Cloudflare rebuilds
and publishes it; pull requests and other branches get preview URLs.

Node 22 (the minimum this Next version accepts) is recorded in `.nvmrc` and in
the Pages project's `NODE_VERSION`.

## Design tokens

All colour, type, radius, easing and animation tokens live in one place —
`src/app/globals.css` under `@theme`. Tailwind generates utilities from them, so
`bg-surface`, `text-accent`, `border-line` and `animate-marquee` are always in sync.

- Background `#08080b`, surfaces `#0e0e13` → `#1c1c26`
- Accent `#7c6cff` (carried over from the previous site's violet identity), secondary `#4cc9f0`
- Easing: `--ease-out-expo`, `--ease-in-out-quint`

## Structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, metadata/OG, IntroProvider, Preloader, SmoothScroll
│   ├── globals.css             # design tokens + custom utilities
│   ├── (site)/
│   │   ├── layout.tsx          # site chrome: Nav + MusicPlayer
│   │   └── page.tsx            # section composition
│   └── resume/page.tsx         # full-bleed résumé viewer
├── components/                 # one file per effect / section
└── lib/
    ├── content.ts              # all copy & data (single source of truth)
    └── utils.ts                # cn()
```

## Content

Everything editable lives in `src/lib/content.ts` — profile, stats, experience,
projects, education and socials. Update that file, not the components.

## Accessibility & performance notes

- `prefers-reduced-motion` is respected throughout (`useReducedMotion`), and Lenis is
  disabled for those users.
- The preloader has a safety timeout so a throttled/background tab can never trap the page.
- Images use `next/image` with `unoptimized` (a static export has no optimizer);
  every asset is already a web-sized JPEG. The portrait is `priority`, the rest lazy.
- `legacy/` holds the previous static site for reference (history preserved via `git mv`).
