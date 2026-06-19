import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
            res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
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
