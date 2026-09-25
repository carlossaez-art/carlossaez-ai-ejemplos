// Servidor mínimo: sirve /public y hace de proxy a JEV vía OpenRouter.
// La clave vive sólo aquí (proceso Node); el navegador nunca la ve.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.JEV_MODEL || 'typesafe/jev-1.13';
const PORT = Number(process.env.PORT || 4360);
const ENDPOINT = 'https://openrouter.ai/api/alpha/decisions';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4' };

const json = (res, status, obj) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };

createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/decide') {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', async () => {
      try {
        if (!KEY) return json(res, 500, { error: 'Falta OPENROUTER_API_KEY en .env' });
        const { state, questions } = JSON.parse(body || '{}');
        if (!state || !questions) return json(res, 400, { error: 'Faltan state o questions' });
        const t0 = Date.now();
        const r = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: MODEL, state, questions }),
        });
        const data = await r.json();
        data._ms = Date.now() - t0;
        console.log(`[decide] ${r.status} ${data._ms} ms  ${data.usage?.input_tokens ?? '?'} tok  ${data.usage?.cost ?? '?'} $`);
        json(res, r.status, data);
      } catch (e) { json(res, 500, { error: String(e) }); }
    });
    return;
  }
  let p = req.url.split('?')[0];
  if (p === '/' || p === '/ejemplo-2' || p === '/ejemplo-1' || p === '/visor') p = '/index.html';   // rutas de escenario
  readFile(join(__dirname, 'public', p))
    .then(buf => { res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(buf); })
    .catch(() => { res.writeHead(404); res.end('not found'); });
}).listen(PORT, () => {
  console.log(`\nLanding adaptativa con JEV \u2192 http://localhost:${PORT}   modelo ${MODEL}\n`);
  if (!KEY) {
    console.log('\u26a0\ufe0f  Falta OPENROUTER_API_KEY: la landing no podra decidir nada.');
    console.log('   Arreglalo en 30 segundos:\n');
    console.log('     cp .env.example .env');
    console.log('     # y pega tu clave de https://openrouter.ai/keys\n');
  }
});
