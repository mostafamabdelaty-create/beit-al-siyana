import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rewriteHtmlPlugin = () => ({
  name: 'rewrite-html',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.endsWith('.html') && !req.url.endsWith('/index.html')) {
        req.url = '/';
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), rewriteHtmlPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
