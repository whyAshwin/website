# Reference Breakdown — radnaabazar.com

> What the site is actually made of, and how we reproduce each effect in our revamp.
> (Verified by inspecting the live DOM, network, and computed styles — not guessed.)

## Proven stack (evidence-based)

| Piece | Detected |
|---|---|
| Framework | **Next.js (App Router)** — `/_next/static/chunks/app/[locale]/(main)/page-*.js` |
| Language | React + TypeScript |
| Styling | **Tailwind CSS** (utility classes throughout) |
| Components | **shadcn/ui + Radix UI** (`radix-*` ids, `data-state`) + **Aceternity UI / Magic UI** patterns |
| Animation | **Framer Motion** (inline `transform`/`opacity` styles, presence) |
| Icons | `lucide-react` + `react-icons` (FontAwesome) |
| Route loader | **NProgress** (green bar, `#00ff99`) |
| Images | `next/image` → AVIF/WebP, `srcset` 640/828/1080/1920 |
| i18n | `/en /mn /jp /ko` routes + `hreflang` alternates |
| Analytics | Vercel Insights + Speed Insights + Cloudflare Insights |
| SEO | OG/Twitter, **JSON-LD `Person`**, favicons, webmanifest, `theme-color` |

## Design system

- **Accent:** `#00ff99` (neon green) — buttons, links, glows, progress bar
- **Background:** `rgb(15, 14, 26)` deep navy-black
- **Surface:** `rgb(22, 22, 29)` cards, `border-white/10–20`, `rounded-2xl/3xl`
- **Type:** **JetBrains Mono** everywhere (monospace = technical, "engineer" feel)
- **Texture:** glassmorphism (`backdrop-blur-2xl backdrop-saturate-200`), glows, grid overlays

---

## Signature effects — decoded, with the recipe

### 1. The intro animation (the opening curtain) ⭐
A fixed full-screen preloader of **6 vertical green panels** (`bg-green-800`), plus a
solid `bg-primary` curtain that fades. Panels slide up/out on a stagger, then the
page reveals underneath, with the NProgress bar and hero elements animating in.

**How we build it:** fixed overlay → 6 column divs → Framer Motion `staggerChildren`
(~0.08s) animating `y: '0%' → '-100%'` with `ease: [0.76, 0, 0.24, 1]`, then unmount
after `onAnimationComplete`. Gate hero animations on a `ready` state. Session-storage
flag so it only plays once per visit.

### 2. Floating glass nav + segmented pill
Sticky glass header; a **Professional / Personal** segmented control where the active
tab is a glass pill that slides between labels.

**How:** Radix/shadcn tabs + a `layoutId` Framer Motion highlight that morphs between
positions — the classic "magic move" trick.

### 3. Hero portrait
- Photo **blur-to-sharp** on load (`filter: blur(20px) → 0`).
- A **rotating dashed circle** drawn as SVG (`stroke-dasharray="24 10 0 0"`, `#00ff99`)
  spinning slowly around the photo (motion `rotate` + `repeat: Infinity`).
- Circular gradient ring + glow shadow.
- Tappable — cycles a greeting ("glad you're here 🌌").

### 4. Background beams
Two mirrored clusters of **3 rotated radial-gradient beams** (`rotate(±45deg)`,
`1380px` tall, layered opacities) behind the hero, slowly drifting.

**How:** absolutely-positioned divs with radial gradients, animated `x/y/opacity`
via Framer Motion — the Aceternity "Background Beams" recipe.

### 5. Animated stat counters
Four stats (Age, Years, Projects, Deployed) that **count up** while un-blurring as
they enter the viewport.

**How:** `useInView` + `useMotionValue`/`animate` to tween the number, paired with a
`blur → 0` + `y` reveal.

### 6. Bento grid "Short Profile"
Asymmetric bento cards; on hover the content **translates right** and border brightens
to accent. Decorative layers inside:
- blurred accent/white blobs (`blur-3xl`)
- a faint **multi-language "hello" watermark** (Hello / こんにちは / Сайн уу / 안녕 …)
- **animated dashed "circuit" connectors** between tech chips — made with
  `repeating-linear-gradient` + a `bento-flow-y`/`x` keyframe animation (little glowing
  dashes that travel along the line).

### 7. Gooey animated gradient blob
A card containing multi-color radial-gradient blobs blended with `mix-blend-mode`,
wrapped in an SVG **gooey filter** (`feGaussianBlur` + `feColorMatrix` + `feBlend`)
and `blur(40px)` — the "animated gradient background" effect. CSS custom properties
(`--first-color`…`--pointer-color`, `--size`) drive it, and a **pointer-following**
blob tracks the cursor.

### 8. Conic-gradient spinning border button
"Copy my email" button with an `inset-[-1000%]` span painted with a
`conic-gradient` spinning via `animation: spin 2s linear infinite`, clipped by the
rounded frame — an infinite glowing border.

### 9. Grid-pattern + mask backgrounds
`bg-grid-white/[0.03]` grid overlays and `mask-image: radial-gradient(...)` to fade
grids/beams to black at the edges. Plus SVG `grid.svg` textures in cards.

### 10. Project cards
Full-cover background image + icon stack, with hover lift and a bg texture; CTAs to
live site / GitHub. Images are `next/image` with real responsive `srcset`.

### 11. Music player 🎧
Fixed **bottom-left glass widget** (`backdrop-blur-2xl`, white gradient, `rounded-xl`)
that expands on click into a player — album art (`nujabes-aruarian-dance.jpg`),
track title/artist, controls. Lo-fi background music is a known "vibe" micro-feature.

**How:** a small React island with an `<audio>` element (or `use-sound`/Howler),
persisted open/closed state, autoplay blocked until first interaction (browser policy).

### 12. Journey timeline
Year-grouped entries (2023 → 2025) with prose + image pairs that reveal on scroll.

### 13. Everything else
Language switcher (globe dropdown → Radix menu), CV dropdown, footer "Let's Talk" CTA,
social link row, `/personal` alternate site mode.

---

## What this means for us

**Stack shift.** This reference is **Next.js + Tailwind + Framer Motion + shadcn +
Aceternity/Magic UI**. To reach this visual bar fast, we should lean on the same
component ecosystem rather than hand-rolling everything:

- **Framer Motion (`motion`)** becomes the *primary* animation tool (not just for micro-interactions).
- Adopt **shadcn/ui** (Radix primitives) for accessible menus/tabs/dialogs.
- Pull **Aceternity UI / Magic UI** patterns: Background Beams, Bento Grid, Animated
  Gradient, Text Generate, Tracing Beam, Sparkles, Meteors, Marquee, Spotlight.
- Add **NProgress**-style route feedback and the **intro curtain**.
- Add a **glass music player** micro-feature.
- Adopt the **accent color strategy** (one neon accent on near-black) and **monospace** personality.

**Revised recommended stack**

| Layer | Choice |
|---|---|
| Framework | **Next.js (App Router) + TS** *(matches reference; strongest component ecosystem)* — or Astro+React islands if we want a lighter payload |
| Styling | Tailwind v4 + shadcn/ui |
| Motion | `motion` (Framer Motion) + GSAP/ScrollTrigger for scrub + **Lenis** |
| Components | Aceternity UI + Magic UI (copy-in, then adapt to our brand) |
| Icons | `lucide-react` |
| Media | `next/image` (or sharp) + Cloudflare Images |
| Audio | `use-sound` / Howler for the player |
| Deploy | Vercel (as reference) **or** Cloudflare Pages (current) |

**Brand note:** we shouldn't clone this 1:1 — we'd swap the neon-green/monospace
"engineer" identity for *your* product-manager identity. But we keep the *craft*:
one accent, one personality, obsessive motion detail, and glass + glow surfaces.
