# Foundation for an Animation-Heavy, Hi-Res Portfolio

> Goal: lots of motion, micro-interactions and reactive components, high-res media —
> **without** it feeling janky or slow. Everything below exists to make "crazy" still hit 60fps
> and stay maintainable.

> **⚠️ Direction update (see `INSPIRATION.md`).** We now have a concrete target:
> radnaabazar.com. It's built on **Next.js + Tailwind + Framer Motion + shadcn/ui +
> Aceternity/Magic UI**, with an **intro curtain**, **glass music player**, **neon-green
> accent on near-black**, and a **monospace** personality. This supersedes the generic
> "Astro-first" recommendation below — plan on **Framer Motion as the primary animation
> engine** and **Aceternity/Magic UI components** as our starting vocabulary.

---

## 0. The one rule that governs everything

**Pick the right tool per effect, and keep the heavy ones off the critical path.**

| Effect type | Best tool | Why |
|---|---|---|
| Scroll-linked, timeline, pinned stories | **GSAP + ScrollTrigger** | frame-accurate, scrub, pinning |
| Reactive component micro-interactions | **Motion** (ex-Framer Motion) | declarative, layout/gesture anims |
| Continuous / simple reveals | **CSS** (transitions, `@keyframes`, scroll-driven animations) | free, GPU, runs off main thread |
| Page-to-page transitions | **View Transitions API** / Astro `<ClientRouter />` | native, no JS needed for the fade |
| 3D / shaders / particles | **Three.js + React Three Fiber + drei** | WebGL, post-processing |
| Physics gimmicks | **Rapier** / **Matter.js** | real collisions for draggable toys |
| Vector micro-animations (icon states, mascot) | **Rive** (or Lottie) | tiny files, interactive state machines |
| Per-character text effects | **SplitType** + GSAP | split, then stagger |
| Smooth inertia scrolling | **Lenis** | makes everything feel expensive |

---

## 1. Runtime & toolchain

- **Node LTS** via `fnm` (fast, version-pinned) — *not currently installed*
- **pnpm** workspace (fast, disk-efficient)
- **TypeScript** everywhere (own components, typed content)
- **Vite** under the hood (instant HMR)

## 2. Framework & rendering model — the key decision

Recommendation: **Astro + React islands**.

- **Astro** renders static HTML → perfect first paint and SEO (we keep the Cloudflare Pages deploy).
- **Islands** (`client:load` / `client:visible` / `client:idle`) mean each interactive toy ships its own JS **only when needed** — the single most important lever for keeping an animation-heavy site fast.
- **React** for islands because the animation/media ecosystem (Motion, R3F, drei, cmdk) is strongest there. (Svelte is a fine alternative with great built-in motion.)

Shell stays static; interactivity is opt-in per component.

## 3. Animation layer

```
gsap + ScrollTrigger     scroll timelines, pinning, scrub, stagger
motion                   reactive component anims, layout, gestures, drag
lenis                    smooth scroll (wire into GSAP ticker)
split-type               text splitting for char/word reveals
@rive-app/react-canvas   interactive vector micro-animations  (or lottie-react)
canvas-confetti          celebrations / easter eggs
embla-carousel           draggable carousels
cmdk                     command palette (⌘K) micro-feature
```

Plus native, zero-dependency superpowers:
- **CSS scroll-driven animations** (`animation-timeline: view()/scroll()`) — reveals with no JS
- **`@property`** — animatable gradients/mesh backgrounds
- **View Transitions** — shared-element morphs between pages
- **Web Animations API** — imperative control when GSAP is overkill
- **Pointer Events** — custom cursor follower, magnetic buttons, tilt

## 4. Interaction / "gimmick" kit (the micro-feature menu)

Cursor follower · magnetic buttons · 3D tilt cards · grain/noise overlay · animated mesh
gradient · marquee · scroll progress bar · command palette (⌘K) · theme toggle with view-
transition · number count-ups · sticky-scroll storytelling · draggable cards · hover video
previews · easter eggs (konami, confetti, hidden terminal) · optional micro-sounds + haptics.

Each is a small, isolated island — so they're independently loadable and testable.

## 5. Hi-res visuals pipeline (critical)

This is where "super high res" is won or lost:

- **Build-time image optimization** via `astro:assets` + **sharp** → AVIF/WebP + `srcset` + explicit `width`/`height` + **LQIP blur placeholders**.
- **Retina-first** source images (2–3×) downscaled per breakpoint; never ship a 1536px JPEG into a 400px box (what the current site does).
- **Cloudflare Images / Image Resizing** as the edge CDN (we're already on Cloudflare Pages) for dynamic variants.
- **Video**: `<video>` with AV1/WebM + MP4, poster frame, `preload="none"`, lazy; or Mux/Cloudflare Stream for real reels.
- **3D/GLB**: Draco/meshopt-compressed, KTX2 textures, lazy-loaded on visibility.
- **Fonts**: **variable** fonts, self-hosted `.woff2` subset, `font-display: swap` (current site uses blocking `@import` — fix).
- **Icons**: single SVG sprite instead of repeated inline paths.

## 6. Design system foundation

- Design **tokens** as CSS custom properties: color, type scale, spacing, radii, shadows, easing curves, durations.
- Typography: one variable body face + one display face; fluid `clamp()` scale.
- Motion tokens: named easings/durations so every animation feels like one product.
- Theming via `data-theme` + CSS vars (enables the light/dark toggle for free).

## 7. Performance guardrails (non-negotiable here)

- **Budgets**: initial JS < ~180 KB gzip; LCP < 2.5s; CLS < 0.1; INP < 200ms.
- Animate **only** `transform` / `opacity` (+ `filter` sparingly); never layout properties.
- Heavy libs (three, gsap plugins, rive) **dynamically imported** on interaction/visibility.
- `will-change` used surgically and removed after.
- **Lighthouse CI** + **Playwright visual/reduced-motion snapshots** in CI to stop regressions.
- Respect `prefers-reduced-motion` as a global kill-switch (CSS *and* JS).

## 8. Accessibility (mandatory, not optional, with this much motion)

- Real `<button>`s / ARIA on custom widgets (command palette, toggles, tabs, carousels).
- `:focus-visible` states on every interactive element; full keyboard operability.
- Contrast-checked palette; `aria-label` on icon-only controls.
- Reduced-motion + `prefers-contrast` support.

## 9. Content layer

- Case studies & experience as **typed content** (Astro Content Collections / Markdown-MDX),
  so adding one is a file, not a copy-paste of HTML.
- Migrate the current hard-coded 5 roles + 6 case studies into this.

## 10. Dev experience, QA, deployment

- **Biome** (lint+format) + TypeScript typecheck; **Playwright** for visual/interaction tests.
- **Cloudflare Pages** with per-branch preview deploys; keep `/resume` route; add `404`.
- Cloudflare Web Analytics (privacy-friendly, zero-cookie).

---

## Recommended manifest (what we actually install)

| Layer | Choice |
|---|---|
| Node + pnpm | `fnm`, Node LTS, `pnpm` |
| Build | **Astro 5** + TypeScript + Vite |
| Islands | **React 19** |
| Styling | **Tailwind v4** + CSS custom-property tokens |
| Motion | `gsap`, `lenis`, `motion`, `split-type` |
| 3D/media | `three`, `@react-three/fiber`, `@react-three/drei` |
| Gimmicks | `canvas-confetti`, `embla-carousel`, `cmdk`, Rive/Lottie |
| Quality | `biome`, `playwright` |
| Fonts | `@fontsource-variable/*` |
| Deploy | `@astrojs/cloudflare` (or static) |

**Tiers**
- **Core (must-have):** Astro+React, Tailwind, gsap+ScrollTrigger, lenis, motion, image pipeline, tokens, reduced-motion.
- **Signature (the "crazy"):** R3F/three, Rive, split-text, confetti, custom cursor + magnetics, view transitions, ⌘K.
- **Experimental (spike later):** Rapier physics, shader backgrounds, Web Audio micro-sounds, haptics.

---

## Sequencing

1. Install Node + pnpm, scaffold Astro + React + Tailwind, set tokens. → *verify a blank page renders.*
2. Wire Lenis + GSAP ticker + reduced-motion kill-switch.
3. Build the image pipeline + migrate real photos at full res.
4. Rebuild sections as islands; add motion layer by layer.
5. Add signature gimmicks one per PR (keeps perf reviewable).
6. Wire Playwright/Lighthouse CI + Cloudflare preview deploys.

---

## Decisions I need

1. **Greenlight Astro + React islands?** (alternative: Vite + React SPA — simpler mental model, worse first paint/SEO.)
2. **Install Node + pnpm now?** (required for everything above.)
3. **Styling:** Tailwind v4 *(recommended)* or hand-written CSS modules + tokens?
4. **How far into 3D?** subtle depth/parallax vs a full WebGL hero — affects budget and time a lot.
