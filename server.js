const fs = require('fs');
const path = require('path');
const http = require('http');

const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 4173);
const assetPrefixes = ['books/', 'covers/', 'assets/'];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.rar': 'application/vnd.rar'
};

function contentDisposition(filename) {
  const asciiFallback = filename.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_') || 'download.rar';
  const encoded = encodeURIComponent(filename)
    .replace(/['()]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/\*/g, '%2A');
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

function resolvePath(requestPath) {
  const safePath = decodeURIComponent(requestPath).replace(/^\/+/, '');
  const filePath = path.join(distDir, safePath || 'index.html');

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  if (assetPrefixes.some((prefix) => safePath.startsWith(prefix))) {
    return null;
  }

  return path.join(distDir, 'index.html');
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const requestPath = url.pathname;
  const filePath = resolvePath(requestPath);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('File not found');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': contentType };

    if (ext === '.rar') {
      const downloadName = url.searchParams.get('filename') || path.basename(filePath);
      headers['Content-Disposition'] = contentDisposition(downloadName);
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    res.end(content);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`Static server running at http://0.0.0.0:${port}`);
});
