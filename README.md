# portfolyo-me

Single-page personal site with a dark, refined, minimal
flow-field background and a small parameter panel.

## Stack

- **[Astro 6](https://astro.build)** — static output, zero-JS shell.
- **[OGL](https://github.com/oframe/ogl)** + a hand-written GLSL flow field (`src/scripts/fluid.ts`) — full-viewport WebGL background, loaded as a deferred, gated, code-split chunk.
- **Geist Sans + Geist Mono** (self-hosted Latin variable woff2, `public/fonts/`).
- Hosted on **GitHub Pages** as the project site `https://shiru2.github.io/portfolyo-me/`.

The WebGL chunk loads after paint and is skipped under `prefers-reduced-motion`,
`save-data`, or when WebGL is unavailable. The static CSS poster is the
fallback, so the page is complete without JS.

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # static build → dist/
npm run preview   # serve the built dist/
```

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml` (build + deploy via
GitHub Pages actions).

1. **Repo → Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Pages URL:** `https://shiru2.github.io/portfolyo-me/`
3. **Enable “Enforce HTTPS”** once the certificate is issued.

`astro.config.mjs` sets the project Pages URL and `base: '/portfolyo-me'`.

## Structure

```
src/
  layouts/Base.astro     # <head>, meta/OG, font preload, poster canvas, deferred boot
  pages/index.astro      # content (hero, statement, selected work, projects, links)
  scripts/boot.ts        # tiny: reveals, corner index, email reveal, gated fluid loader
  scripts/fluid.ts       # OGL curl-noise flow field (pointer/touch interaction)
  styles/global.css      # design tokens, type, motion, components
public/                  # .nojekyll, fonts/, favicon, og.jpg
.agents/research/        # the research dossier this design was built from (00–08)
```

## Before launch — confirm (see `.agents/research/00-SYNTHESIS.md`)

- Public email address (currently a placeholder in `index.astro`).
- X handle (`@hayato_tkgs` vs `@hpp_ricecake`), PhD wording.
- Exact co-authors, order, and ACL Anthology URLs for the selected publications
  (marked `TODO` in `src/pages/index.astro`).
