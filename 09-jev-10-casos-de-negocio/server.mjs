import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY = process.env.OPENROUTER_API_KEY;
const PORT = 4310;
const MODEL = 'typesafe/jev-1.13';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };

const server = createServer((req, res) => {
  // --- API: proxy a JEV (la key nunca sale al navegador) ---
  if (req.method === 'POST' && req.url === '/api/decide') {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', async () => {
      try {
        if (!KEY) { res.writeHead(500, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ error: 'Falta OPENROUTER_API_KEY en .env' })); }
        const { state, questions } = JSON.parse(body || '{}');
        const t0 = Date.now();
        const r = await fetch('https://openrouter.ai/api/alpha/decisions', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: MODEL, state, questions }),
        });
        const data = await r.json();
        data._ms = Date.now() - t0;
        res.writeHead(r.status, { 'content-type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: String(e) }));
      }
    });
    return;
  }
  // --- estáticos ---
  const p = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  readFile(join(__dirname, 'public', p))
    .then(buf => { res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(buf); })
    .catch(() => { res.writeHead(404); res.end('not found'); });
});

server.listen(PORT, () => {
  if (KEY) {
    console.log(`\nJEV Decide → http://localhost:${PORT}   (key OK ✓)\n`);
  } else {
    console.log(`\nJEV Decide → http://localhost:${PORT}\n`);
    console.log('⚠️  Falta OPENROUTER_API_KEY, asi que las decisiones no van a funcionar.');
    console.log('   Arreglalo en 30 segundos:\n');
    console.log('     cp .env.example .env');
    console.log('     # y pega tu clave de https://openrouter.ai/keys\n');
  }
});
