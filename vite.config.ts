import { defineConfig } from 'vite';

// GitHub Pages serves a project site from /<repo>/. The deploy workflow passes that
// path in BASE_PATH (empty once a custom domain is set); dev and preview stay on '/'.
const segment = (process.env.BASE_PATH ?? '').replace(/^\/+|\/+$/g, '');
const base = segment ? `/${segment}/` : '/';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      // 404.html lives at the root (not public/) so Vite rewrites its URLs with the base.
      input: { main: 'index.html', notFound: '404.html' },
    },
  },
});
