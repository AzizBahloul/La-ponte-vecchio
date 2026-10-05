/**
 * Resolve a file from `public/` (e.g. `/media/hero.webp`) against the deploy base.
 * On GitHub Pages the site lives under `/<repo>/`, so a bare `/media/...` would 404.
 * Vite rewrites URLs in `index.html` and CSS by itself, but not strings built in TS.
 */
export const asset = (path: string): string => import.meta.env.BASE_URL + path.replace(/^\/+/, '');
