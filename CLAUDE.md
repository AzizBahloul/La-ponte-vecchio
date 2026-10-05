# La Ponte Vecchio

Demo single-page site for a family pizzeria in Cesson-Sévigné. Vite + vanilla TypeScript, GSAP
(ScrollTrigger) + Lenis for scroll animation. Site copy is in **French**: keep it French. All
content is hardcoded mock data (demo for the restaurant).

## Commands

- `npm run dev`: dev server
- `npm run typecheck`: `tsc` (strict, no emit)
- `npm run build`: typecheck + production build to `dist/`

Run `npm run build` before calling a change done. There are no tests.

## Deploy

GitHub Pages via `.github/workflows/deploy.yml`: every push to `main` builds and publishes `dist/`
(Settings → Pages → Source must stay "GitHub Actions"). The site is served from
`/La-ponte-vecchio/`, so the workflow passes `BASE_PATH` to `vite.config.ts` (empty on a custom domain).
It also passes `SITE_ORIGIN`, which makes `og:image` absolute (crawlers ignore relative URLs).

- Media paths built in TS go through `asset()` from `src/lib/asset.ts` (`src/data/` keeps plain
  `/media/x.webp`). Never emit a bare `/media/...` from a template: it 404s on Pages.
- `index.html`, `404.html` and CSS are rewritten by Vite. `404.html` is at the repo root (not
  `public/`) for that reason; use `%BASE_URL%` in its links, not `/`.
- Check a deploy locally: `BASE_PATH=/La-ponte-vecchio npm run build && BASE_PATH=/La-ponte-vecchio npm run preview`.

## Structure

- `index.html`: shell only (meta, JSON-LD, `#app`).
- `src/data/`: **all content** (restaurant info + hours, menu, plat du jour, story steps, gallery,
  reviews, booking config). Edit text/prices/photos here, never in section files.
- `src/sections/<name>.ts`: each exports `renderX()` (markup via the `html` tagged template, which
  escapes interpolations) and `mountX()` (behaviour + section-specific animation). Page order is in
  `src/main.ts`.
- `src/animations/`: `scroll.ts` (Lenis ↔ ScrollTrigger, anchor links, scroll lock), `reveal.ts`
  (declarative `data-reveal` / `data-parallax` attributes), `videos.ts` (play loops only in view).
- `src/styles/`: `tokens.css` (colours, radii, easings, z-index), `base.css`, `components.css`,
  `sections/<name>.css`, all imported by `main.css`.
- `public/media/`: photos (webp) and short muted mp4 loops. Sources: Unsplash, Pexels, Mixkit.
- `docs/`: the original one-file mock-up (`maquette-originale.html`) and the launch roadmap.

## Rules

- Every animation must have a reduced-motion path: wrap GSAP in
  `gsap.matchMedia()` with `MQ.motion` / `MQ.desktop` from `src/lib/motion.ts`. Pinned or scrubbed
  scenes are desktop only; mobile gets native scroll.
- Never use `window.addEventListener('scroll')`: use ScrollTrigger or IntersectionObserver.
- Animate only `transform`, `opacity`, `clip-path` (and SVG attrs in the charbon scene).
- No em-dash or en-dash in visible copy. Hours read "12 h à 14 h".
- Keep brand tokens (ocra, sauce, basil, slate, crust-gold/coal); one shape system (pill controls,
  20px media, 10px inputs). Icons come from `@phosphor-icons/core` via `src/lib/icons.ts`.
- Fonts are self-hosted via Fontsource (RGPD): don't add Google Fonts or other CDN requests.
- Phones: the hero must fit the first screen (`100svh`; the arch photo takes the leftover height, the
  wordmark then the lede drop on short screens). Réserver on phones is the bottom bar in `footer.ts`
  (it steps aside over the hero buttons and the booking form), so the nav pill does not repeat it.
- La carte is a printed-menu card (`menu.ts` / `menu.css`): dietary info is small marks plus a legend,
  filters are small and instant (no replay), and the motion (rules drawn, rows written) belongs to the
  card entrance and the category switch only.
- Don't `git commit` or `git push` unless asked.

## Design workflow (mandatory for any UI work)

For every visual/UI task (new section, redesign, polish, animation, new asset), use the installed
design skills instead of improvising. Invoke them with the Skill tool before writing markup/CSS:

| Need | Skill |
|---|---|
| Overall design, critique, audit, polish, harden, colorize, layout, typography | `impeccable` |
| Distinctive aesthetic direction, avoiding templated defaults | `frontend-design:frontend-design` |
| Visual taste / anti-"AI slop" rules | `design-taste-frontend` |
| Warm, premium look (fits a restaurant) | `high-end-visual-design`, `minimalist-ui` |
| Restyling what already exists | `redesign-existing-projects` |
| Palettes, font pairings, UX guidelines, charts | `ui-ux-pro-max:ui-ux-pro-max` |
| Motion and interaction (design-engineering craft) | `emil-design-eng`, `animate`, `improve-animations`, `review-animations`, `find-animation-opportunities`, `animation-vocabulary` |
| Mobile web feel | `mobile-native` |
| Stress-testing the UI | `break-ui` |
| Brand identity, logo/colors/voice | `brandkit`, `ui-ux-pro-max:brand` |
| Mockup → code | `image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile` |
| Large outputs must not be truncated | `full-output-enforcement` |

Process: pick direction (`impeccable` / `design-taste-frontend`) → build → motion
(`emil-design-eng`) → verify (`break-ui`, `design:accessibility-review`). Combine skills; don't
stop at the first one.
