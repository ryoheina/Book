import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function contentDisposition(filename) {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_') || 'download.rar';
  const encoded = encodeURIComponent(filename)
    .replace(/['()]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/\*/g, '%2A');
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'book-download-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/books/') && req.url.includes('.rar')) {
            const [pathname, search = ''] = req.url.split('?');
            const params = new URLSearchParams(search);
            const downloadName = params.get('filename') || path.basename(pathname);
            res.setHeader('Content-Disposition', contentDisposition(downloadName));
            res.setHeader('Cache-Control', 'no-cache');
          }
          next();
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
