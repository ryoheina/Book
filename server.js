const fs = require('fs');
const path = require('path');
const http = require('http');

const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 4173);

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
  '.txt': 'text/plain; charset=utf-8'
};

function resolvePath(requestPath) {
  const safePath = decodeURIComponent(requestPath).replace(/^\/+/, '');
  const basePath = path.join(distDir, safePath || 'index.html');
  return fs.existsSync(basePath) && fs.statSync(basePath).isFile()
    ? basePath
    : path.join(distDir, 'index.html');
}

http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  const filePath = resolvePath(requestPath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`Static server running at http://0.0.0.0:${port}`);
});
