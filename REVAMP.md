# Website Revamp — Plan & Prep

> Working branch: **`revamp`** (branched from `main` @ `658b12a`)
> Nothing on `main` is touched until we merge.

---

## 1. Objective

Completely rebuild the personal portfolio so it is faster, more accessible, easier to
update, and tells a sharper product story — without breaking the `/resume` route or the
existing deployment.

---

## 2. Where we are today (audit)

**Stack:** plain static site — no build step, no framework, no dependencies installed.

```
index.html              405 lines   single long page (hero → contact)
css/style.css           981 lines   dark gradient theme, 3 Google Fonts, all inline
js/main.js              183 lines   nav, mobile menu, smooth scroll, scroll fx
resume.html              24 lines   full-page <iframe> of the PDF (?v=5)
resume/index.html        17 lines   meta-refresh redirect to /resume.html
_routes.json                        Cloudflare Pages route: /resume -> /resume.html
deploy.txt                          generic deploy notes (GH Pages / Netlify / custom domain)
package.json                        only a `serve` dev script (needs Node, which isn't installed)
assets/                  2.2 MB     1 PDF + 5 images
```

**Sections:** Hero, About, Experience (5 roles), Education (2), Product Case Studies (6),
Contact (email/phone/LinkedIn + 5 social links).

**Deployment:** Cloudflare Pages (implied by `_routes.json`), also documented for GitHub Pages.

---

## 3. Problems worth fixing

**Bugs / broken behavior**
- `js/main.js` scroll animation targets `.timeline-item` and `.contact-item` — **neither exists**, so most entrance animations never run.
- "Home" nav link (`#hero`) **never gets the active state** — the hero is `.hero`, not `.section`, so the scroll-spy skips it.
- Redundant/incorrect scroll-spy conditions in `updateActiveNavLink()`.
- 3 case-study cards link to `href="#"` (WhatsApp Chatbot, Purplle, Lenskart) — dead ends.

**Content & privacy**
- Personal **phone number is public** in plain text (`tel:` + WhatsApp deep link).
- 4 unused images (`IMG_0634*.JPEG`, ~1.75 MB) shipped in the repo — one is a byte-identical duplicate of `profile-picture.jpg`.
- Two overlapping resume entry points (`/resume.html` and `/resume/`).

**Performance**
- 2.2 MB of images, no resizing/compression, no lazy-loading, no `width`/`height` (layout shift).
- Fonts loaded via CSS `@import` (blocks render) instead of `<link>` with `display=swap`.

**SEO / sharing**
- No `<meta name="description">`, no Open Graph / Twitter cards, no favicon, no canonical URL.
- `<title>` is generic; no structured data.

**Accessibility**
- `nav-toggle` is a bare `<div>` — no button role, `aria-expanded`, or `aria-label`.
- Decorative SVGs and social icons have no accessible names.
- Low-contrast text (`--text-muted #666` on `#0a0a0b`) — likely fails WCAG AA.
- No skip link; animation ignores `prefers-reduced-motion` for CSS keyframes.

**Maintainability**
- All content hard-coded in one HTML file; repeating any role/case study means copy-paste.
- No components, no partials, no content source.

---

## 4. Proposed plan

### Phase 0 — Prep (this commit)
- [x] Create `revamp` branch
- [x] Write this plan
- [ ] Confirm design direction + tech choice (see §6)
- [ ] Decide on Node/install (needed only for a build step)

### Phase 1 — Foundation
- [ ] Decide stack (§6) and scaffold clean structure
- [ ] Set up local preview (`python3 -m http.server` works today; Node if we add a build)
- [ ] Establish design tokens (color, type scale, spacing) as CSS custom properties
- [ ] Add favicon + OG/Twitter meta + description

### Phase 2 — Content & structure
- [ ] Move content out of markup into a single editable source (JSON/Markdown) — or a component per section
- [ ] Rewrite/trim copy; make the product story the hero
- [ ] Turn case studies into first-class pages or an expandable section
- [ ] Consolidate the two resume entry points into one

### Phase 3 — Build the UI
- [ ] Rebuild Hero, About, Experience, Education, Work/Case Studies, Contact
- [ ] Responsive from 320px up; new visual design per §6
- [ ] Reusable components/partials; remove all dead code

### Phase 4 — Polish
- [ ] Compress + resize images (target < 300 KB total), lazy-load, set dimensions
- [ ] Accessibility pass: keyboard nav, focus states, ARIA, contrast, reduced motion
- [ ] Perf pass + Lighthouse check
- [ ] Verify 404 + `/resume` route still work on Cloudflare Pages

### Phase 5 — Ship
- [ ] Preview deploy / local review
- [ ] Merge `revamp` → `main` and deploy

---

## 5. New structure (proposed)

```
/                      home (one-page + anchors)
/work/<slug>           case study pages (optional, if we go multi-page)
/resume                single resume route (PDF or HTML)
/assets                optimized images
/src                   only if we add a build step (components, styles, content)
```

---

## 6. Open decisions (need your call)

1. **Tech stack**
   - **A. Clean static** — hand-written semantic HTML + modern CSS + a little vanilla JS. Zero build, zero deps, deploys anywhere. *(Fastest, lowest risk.)*
   - **B. Astro** — components, content collections, MDX case studies, still outputs static. Needs Node.
   - **C. Vite/React/Next** — most power, most overhead; overkill for a portfolio.

2. **Design direction**
   - Keep the current **dark gradient** look (just fix/refine it)?
   - Switch to a **clean light / editorial** look?
   - Give me a **reference site** you like and I'll match the feel.

3. **Case studies** — one-page cards (as now), or full dedicated pages per case study?

4. **Resume** — keep the PDF embed, or rebuild it as a styled HTML page too?

5. **Phone number** — keep public, or remove and route contact through email/LinkedIn only?

---

## 7. Preview locally

Node isn't installed, but Python works:

```sh
cd "/Users/professormac/Documents/Default Project"
python3 -m http.server 8000
# open http://localhost:8000
```

We can `brew install node` if we pick a stack that needs it (B or C).
