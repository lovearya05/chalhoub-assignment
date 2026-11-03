import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.API_PORT || 8787);
const routes = { '/catalog.json': ['../public/data/catalog.json', 'application/json'], '/task.png': ['../public/data/task.png', 'image/png'] };
const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const route = routes[new URL(req.url, 'http://localhost').pathname];
  if (req.method !== 'GET' || !route) { res.writeHead(404); res.end('Not found'); return; }
  try { const body = await readFile(new URL(route[0], import.meta.url)); res.writeHead(200, { 'Content-Type': route[1], 'Cache-Control': 'no-cache' }); res.end(body); }
  catch { res.writeHead(500); res.end('Unable to read catalog asset'); }
});
server.listen(port, '0.0.0.0', () => console.log(`Catalog API: http://localhost:${port}/catalog.json`));
server.on('error', error => { console.error(error.message); process.exit(1); });
