import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT ?? 4319);
const host = process.env.HOST ?? '127.0.0.1';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  let target;
  try {
    const url = new URL(request.url, `http://${host}:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target, 'index.html');
    const body = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[path.extname(target)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    const body = await readFile(path.join(root, '404.html'));
    response.writeHead(404, { 'Content-Type': mime['.html'] });
    response.end(request.method === 'HEAD' ? undefined : body);
  }
}).listen(port, host, () => console.log(`Portfolio preview: http://${host}:${port}`));
