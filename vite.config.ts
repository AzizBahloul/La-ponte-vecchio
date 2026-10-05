import { defineConfig, type Plugin } from 'vite';

// GitHub Pages serves a project site from /<repo>/. The deploy workflow passes that
// path in BASE_PATH (empty once a custom domain is set); dev and preview stay on '/'.
const segment = (process.env.BASE_PATH ?? '').replace(/^\/+|\/+$/g, '');
const base = segment ? `/${segment}/` : '/';

// Link-preview crawlers (WhatsApp, Facebook) ignore a relative og:image. The workflow passes
// the site origin in SITE_ORIGIN; without it (local build) the path is left relative.
const origin = (process.env.SITE_ORIGIN ?? '').replace(/\/+$/, '');

const absoluteOgImage = (): Plugin => ({
  name: 'absolute-og-image',
  transformIndexHtml: {
    order: 'post', // after Vite has prefixed the base
    handler: (html) =>
      origin ? html.replace(/(<meta property="og:image" content=")(\/[^"]*")/, `$1${origin}$2`) : html,
  },
});

export default defineConfig({
  base,
  plugins: [absoluteOgImage()],
  build: {
    rollupOptions: {
      // 404.html lives at the root (not public/) so Vite rewrites its URLs with the base.
      input: { main: 'index.html', notFound: '404.html' },
    },
  },
});
