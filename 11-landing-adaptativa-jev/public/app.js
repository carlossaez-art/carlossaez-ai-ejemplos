import { ans, prob, fmtPct, esc } from './comun.js';

/* ---------------- escenario según la ruta ---------------- */
const RUTAS = { '/': 'mesallena', '/ejemplo-1': 'mesallena', '/ejemplo-2': 'duermevela' };
const ESCENARIOS = [{ id: 'mesallena', ruta: '/', nombre: 'Mesa Llena', tipo: 'B2B', emoji: '🍽️' }, { id: 'duermevela', ruta: '/ejemplo-2', nombre: 'Duermevela', tipo: 'B2C', emoji: '🌙' }];
const VISOR = location.pathname === '/visor';
const escenarioId = VISOR ? (new URLSearchParams(location.search).get('e') || 'mesallena') : (RUTAS[location.pathname] || 'mesallena');
const E = (await import(`./escenarios/${escenarioId}.js`)).default;
const { NEGOCIO, PREGUNTAS, PERFILES, LAB, ETIQ, renderLanding, BLOQUE_DE, resumenBloques } = E;

const $ = s => document.querySelector(s);

const estado = {
  perfil: null, senales: null, respuesta: null, anterior: null, cache: {},
  llamadas: 0, ms: [], coste: 0,
  explicar: true, vista: 'single', lab: false, codigo: false, trazaId: 0,
};

/* ---------------- llamada a JEV ---------------- */
async function decidir(senales) {
  const state = { negocio: NEGOCIO, visitante: senales };
  const r = await fetch('/api/decide', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ state, questions: PREGUNTAS }) });
  const data = await r.json();
  if (!r.ok || !data.answers) throw new Error(data.error?.message || data.error || JSON.stringify(data).slice(0, 200));
  estado.llamadas++; estado.ms.push(data._ms); estado.coste += data.usage?.cost || 0;
  return data;
}
const si = (r, k) => ans(r, k)?.noul >= .5;
const elige = (r, k) => ans(r, k)?.choice;

/* ---------------- panel: cabecera y perfiles ---------------- */
function pintarCabecera() {
  document.title = `${E.nombre} · landing adaptativa con JEV`;
  $('#brand-esc').textContent = `· ${E.nombre}`;
  $('#escenarios').innerHTML = ESCENARIOS.map(e => `<a href="${e.ruta}" class="${e.id === E.id ? 'active' : ''}">${e.emoji} ${e.nombre}<small>${e.tipo}</small></a>`).join('');
  $('#browser-url').textContent = E.url;
  Object.entries(E.tema || {}).forEach(([k, v]) => $('#view-single').style.setProperty(k, v));
  Object.entries(E.tema || {}).forEach(([k, v]) => $('#view-compare').style.setProperty(k, v));
}

function pintarPerfiles() {
  $('#perfiles').innerHTML = PERFILES.map((p, i) => `
    <button class="perfil ${estado.perfil?.id === p.id ? 'active' : ''}" data-id="${p.id}" style="--p:${p.color}">
      <span class="em">${p.emoji}</span>
      <span><span class="nm">${p.nombre}</span><span class="ap">${p.apodo}</span><div class="rs">${p.resumen}</div></span>
      <kbd class="kbd">${i + 1}</kbd>
    </button>`).join('');
  document.querySelectorAll('.perfil').forEach(b => b.onclick = () => seleccionar(b.dataset.id));
}

function pintarSenales() {
  const j = esc(JSON.stringify(estado.senales, null, 2))
    .replace(/&quot;([^&]+)&quot;:/g, '<span class="k">"$1"</span>:')
    .replace(/: &quot;([^&]*)&quot;/g, ': <span class="s">"$1"</span>')
    .replace(/: (-?\d+(\.\d+)?)/g, ': <span class="n">$1</span>')
    .replace(/: (true|false)/g, ': <span class="b">$1</span>')
    .replace(/: null/g, ': <span class="nul">null</span>');
  $('#senales').innerHTML = j;
}

/* ---------------- panel: laboratorio (controles definidos por el escenario) ---------------- */
function pintarLab() {
  const s = estado.senales, lab = $('#lab');
  lab.hidden = !estado.lab; $('#btn-lab').classList.toggle('active', estado.lab);
  $('#btn-lab').textContent = estado.lab ? 'Cerrar laboratorio' : '🎛 Laboratorio: ajustar señales';
  if (!estado.lab) return;
  lab.innerHTML = LAB.map(c => {
    if (c.tipo === 'range') { const v = typeof s[c.k] === 'object' && s[c.k] ? (s[c.k].total_eur ?? 0) : (s[c.k] ?? 0); return `<label>${c.t}<input type="range" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${v}"><output>${v}</output></label>`; }
    if (c.tipo === 'select') return `<label>${c.t}<select data-k="${c.k}">${Object.entries(c.opciones).map(([v, t]) => `<option value="${v}" ${s[c.k] === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
    return `<label class="toggle">${c.t}<select data-k="${c.k}" data-bool="1"><option value="false" ${!s[c.k] ? 'selected' : ''}>no</option><option value="true" ${s[c.k] ? 'selected' : ''}>sí</option></select></label>`;
  }).join('');
  lab.querySelectorAll('[data-k]').forEach(el => {
    el.oninput = () => {
      const c = LAB.find(x => x.k === el.dataset.k); let v = el.value;
      if (c.tipo === 'range') { v = Number(v); el.nextElementSibling.textContent = v; if (c.nulo !== undefined && v === c.nulo) v = null; else if (c.transformar) v = c.transformar(v); }
      if (c.tipo === 'bool') { v = v === 'true'; if (c.texto) v = v ? (estado.perfil?.senales[c.k] || c.texto) : null; }
      estado.senales = { ...estado.senales, [c.k]: v, editado_en_laboratorio: true };
      pintarSenales();
      clearTimeout(pintarLab.t); pintarLab.t = setTimeout(() => ejecutar(), 450);
    };
  });
}

/* ---------------- panel: decisiones ---------------- */
function pintarDecisiones() {
  const r = estado.respuesta, prev = estado.anterior;
  if (!r) { $('#decisiones').innerHTML = ''; return; }
  const conv = ans(r, 'convierte')?.noul ?? 0;
  const g = $('#gauge-num'); g.textContent = fmtPct(conv);
  g.style.color = conv >= .6 ? 'var(--ok)' : conv >= .3 ? 'var(--warn)' : 'var(--bad)';
  const et = ans(r, 'etapa');
  $('#gauge-etapa').innerHTML = et ? Object.entries(et.probabilities).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span class="chip" style="${k === et.choice ? 'border-color:var(--acc2);color:#fff' : ''}"><i style="background:${k === et.choice ? 'var(--acc2)' : ''}"></i>${k} ${fmtPct(v)}</span>`).join('') + `<span class="chip muted">confianza ${fmtPct(et.confidence)}</span>` : '';
  $('#decisiones').innerHTML = Object.keys(PREGUNTAS).filter(k => k !== 'convierte' && k !== 'etapa').map(k => {
    const a = ans(r, k); if (!a) return '';
    const cambiado = prev && JSON.stringify({ c: ans(prev, k)?.choice, n: ans(prev, k)?.noul >= .5 }) !== JSON.stringify({ c: a.choice, n: a.noul >= .5 });
    if (a.type === 'noul') {
      const yes = a.noul >= .5;
      return `<div class="dec ${cambiado ? 'changed' : ''}"><span class="q">${ETIQ[k]}</span><span class="a ${yes ? 'yes' : 'no'}"><b>${yes ? 'sí' : 'no'}</b><span class="bar"><i style="width:${a.noul * 100}%"></i></span></span><span class="p">${fmtPct(a.noul)}</span></div>`;
    }
    const p = a.probabilities?.[a.choice] ?? 0;
    return `<div class="dec ${cambiado ? 'changed' : ''}"><span class="q">${ETIQ[k]}</span><span class="a"><b>${String(a.choice).replace(/_/g, ' ')}</b><span class="bar"><i style="width:${p * 100}%"></i></span></span><span class="p">${fmtPct(p)}</span></div>`;
  }).join('');
  const avg = estado.ms.length ? Math.round(estado.ms.reduce((a, b) => a + b, 0) / estado.ms.length) : 0;
  $('#stats').innerHTML = `<span>última <b>${r._ms} ms</b></span><span>media <b>${avg} ms</b></span><span>llamadas <b>${estado.llamadas}</b></span><span>coste total <b>${estado.coste.toFixed(5)} $</b></span><span>modelo <b>${esc(r.model)}</b></span>`;
  $('#toolbar-status').textContent = `${Object.keys(PREGUNTAS).length} decisiones tipadas en 1 llamada · ${r._ms} ms · ${r.usage?.input_tokens ?? '?'} tokens de entrada`;
}

/* ---------------- landing ---------------- */
function activarRoi(root) {
  const calc = () => {
    const v = k => Number(root.querySelector(`.roi[data-r=${k}]`)?.value || 0);
    root.querySelectorAll('.roi').forEach(i => (i.nextElementSibling.textContent = i.value));
    const rec = v('loc') * v('cub') * 30 * (v('ns') / 100) * 0.4 * 28;
    const out = root.querySelector('#roi-res'); if (out) out.textContent = Math.round(rec).toLocaleString('es-ES') + ' €';
  };
  root.querySelectorAll('.roi').forEach(i => (i.oninput = calc)); if (root.querySelector('.roi')) calc();
}

function cambios(prev, r) {
  const set = new Set(); if (!prev) return set;
  const val = (x, k) => { const a = ans(x, k); return a?.type === 'noul' ? a.noul >= .5 : a?.choice; };
  for (const [b, ks] of Object.entries(BLOQUE_DE)) if (ks.some(k => val(prev, k) !== val(r, k))) set.add(b);
  return set;
}

function pintarLanding() {
  const r = estado.respuesta; if (!r) return;
  const root = $('#landing');
  root.innerHTML = renderLanding(r, estado.senales, cambios(estado.anterior, r), estado.explicar);
  activarRoi(root);
  $('#browser-who').textContent = estado.perfil ? `${estado.perfil.emoji} viendo la web como ${estado.perfil.nombre}${estado.senales.editado_en_laboratorio ? ' (señales editadas)' : ''}` : '';
  $('#view-single').scrollTop = 0;
  pintarVisor();
  if (estado.codigo) trazar();
}

/* ---------------- CÓDIGO EN VIVO ---------------- */
// Muestra el código REAL de renderLanding (toString) y lo recorre línea a línea con las respuestas de JEV.
const CABECERA = "const r = await decidir(senales);   // ← JEV responde las preguntas tipadas";
const resaltar = src => esc(src)
  .replace(/\/\/.*$/g, m => `<span class="cm">${m}</span>`)
  .replace(/'([^']*)'/g, `<span class="st">'$1'</span>`)
  .replace(/\b(const|if|return|function|new)\b/g, `<span class="kw">$1</span>`)
  .replace(/\b(si|elige|pinta|partes\.push|decidir)\(/g, `<span class="fn">$1</span>(`);
const lineasCodigo = () => [CABECERA, ...renderLanding.toString().split('\n')];

function pintarCodigo() {
  $('#code-body').innerHTML = lineasCodigo().map((l, i) => `<div class="ln dim" data-i="${i}"><span class="no">${i + 1}</span><span class="src">${resaltar(l)}</span></div>`).join('');
}

// Qué decide cada línea y qué bloque pinta. `vars` = variables asignadas con elige('k') en líneas anteriores.
function analizarLinea(l, r, vars) {
  const keys = [...l.matchAll(/(si|elige)\('([a-z_]+)'\)/g)].map(m => m[2]);
  const asign = l.match(/const (\w+) = elige\('([a-z_]+)'\)/); if (asign) vars[asign[1]] = asign[2];
  const esIf = /^\s*if \(/.test(l);
  let tomada = true;
  for (const [v, k] of Object.entries(vars)) { const m = l.match(new RegExp(`\\b${v} !== '(\\w+)'`)); if (m) { keys.push(k); if (esIf) tomada = tomada && elige(r, k) !== m[1]; } }
  if (esIf && /senales\.carrito/.test(l)) tomada = tomada && !!estado.senales?.carrito;
  const bloque = l.match(/pinta\('([a-z]+)'/)?.[1] || null;
  const anns = keys.map(k => {
    const a = ans(r, k); if (!a) return '';
    if (a.type === 'noul') { const v = a.noul >= .5; if (esIf) tomada = tomada && v; return `${v ? 'sí' : 'no'} · ${fmtPct(a.noul)}`; }
    return `"${a.choice}" · ${fmtPct(a.probabilities?.[a.choice] ?? 0)}`;
  }).filter(Boolean);
  return { keys, bloque, esIf, tomada, ann: anns.join('  ') };
}

const dormir = ms => new Promise(res => setTimeout(res, ms));

async function trazar() {
  const r = estado.respuesta; if (!r || !estado.codigo) return;
  const id = ++estado.trazaId;
  pintarCodigo();
  const landing = $('#landing .landing'); if (!landing) return;
  landing.classList.add('trazando');
  landing.querySelectorAll('.vis').forEach(e => e.classList.remove('vis'));
  const lineas = lineasCodigo(), cont = $('#code-body'), vars = {};
  const velocidad = () => Number($('#code-speed').value);
  for (let i = 0; i < lineas.length; i++) {
    if (id !== estado.trazaId) return;              // llegó otra decisión: abortar esta traza
    const l = lineas[i], el = cont.querySelector(`.ln[data-i="${i}"]`);
    const info = analizarLinea(l, r, vars);
    cont.querySelectorAll('.ln.run').forEach(e => e.classList.remove('run'));
    el.classList.add('run'); el.classList.remove('dim');
    el.scrollIntoView({ block: 'nearest' });
    const interesante = i === 0 || info.keys.length || info.bloque;
    if (i === 0) el.insertAdjacentHTML('beforeend', `<span class="ann">${r._ms} ms · ${Object.keys(r.answers).length} respuestas</span>`);
    if (info.ann) el.insertAdjacentHTML('beforeend', `<span class="ann">→ ${info.ann}</span>`);
    if (info.keys.length) el.classList.add(info.esIf ? (info.tomada ? 'taken' : 'skip') : 'eval');
    else if (info.bloque) el.classList.add(info.tomada ? 'taken' : 'skip');
    if (info.bloque && info.tomada) { const b = landing.querySelector(`.bloque[data-b="${info.bloque}"]`); if (b) { b.classList.add('vis'); b.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
    await dormir(interesante ? velocidad() : Math.min(velocidad() / 4, 120));
  }
  cont.querySelectorAll('.ln.run').forEach(e => e.classList.remove('run'));
  landing.classList.remove('trazando');
}

function setCodigo(on) {
  estado.codigo = on;
  $('#code').hidden = !on; $('#view-single').classList.toggle('code-mode', on); $('#btn-code').classList.toggle('active', on);
  if (on) { setVista('single'); pintarCodigo(); trazar(); }
  else { estado.trazaId++; $('#landing .landing')?.classList.remove('trazando'); }
}

/* ---------------- comparar ---------------- */
async function pintarComparar() {
  const faltan = PERFILES.filter(p => !estado.cache[p.id]);
  if (faltan.length) {
    overlay(true, `JEV está decidiendo para ${faltan.length} visitante${faltan.length > 1 ? 's' : ''}…`);
    try { await Promise.all(faltan.map(async p => { estado.cache[p.id] = await decidir(p.senales); })); }
    catch (e) { alert('Error de JEV: ' + e.message); }
    overlay(false);
    if (estado.respuesta) pintarDecisiones();
  }
  $('#compare').innerHTML = PERFILES.map(p => {
    const r = estado.cache[p.id]; if (!r) return '';
    const conv = ans(r, 'convierte')?.noul ?? 0;
    return `<div class="cmp" style="--p:${p.color}"><div class="cmp-head"><div class="nm">${p.emoji} ${p.nombre}<small>${p.apodo}</small></div><div class="pr" style="color:${conv >= .6 ? 'var(--ok)' : conv >= .3 ? 'var(--warn)' : 'var(--bad)'}">${fmtPct(conv)}</div></div>
      <div class="cmp-bloques">${resumenBloques(r).map(([t, v]) => `<span class="${v ? 'on' : ''}">${String(t).replace(/_/g, ' ')}</span>`).join('')}</div>
      <div class="cmp-body">${renderLanding(r, p.senales, new Set(), estado.explicar)}</div></div>`;
  }).join('');
  document.querySelectorAll('#compare .landing').forEach(activarRoi);
}

/* ---------------- flujo ---------------- */
function overlay(on, txt) { $('#overlay').hidden = !on; if (txt) $('#overlay-text').textContent = txt; }

async function ejecutar() {
  overlay(true, `JEV está decidiendo la landing para ${estado.perfil?.nombre || 'este visitante'}…`);
  try {
    const r = await decidir(estado.senales);
    estado.anterior = estado.respuesta; estado.respuesta = r;
    if (!estado.senales.editado_en_laboratorio) estado.cache[estado.perfil.id] = r;
    pintarDecisiones(); pintarLanding();
  } catch (e) {
    $('#toolbar-status').textContent = 'Error de JEV: ' + e.message;
    $('#landing').innerHTML = `<div style="padding:40px;color:#c0392b;font-family:var(--mono)">No se ha podido decidir: ${esc(e.message)}<br><br>No se inventan decisiones. Revisa la clave en .env y vuelve a intentarlo.</div>`;
  }
  overlay(false);
}

function seleccionar(id) {
  estado.perfil = PERFILES.find(p => p.id === id);
  estado.senales = structuredClone(estado.perfil.senales);
  pintarPerfiles(); pintarSenales(); pintarLab();
  setVista('single');
  ejecutar();
}

function setVista(v) {
  estado.vista = v;
  document.querySelectorAll('.tab[data-view]').forEach(t => t.classList.toggle('active', t.dataset.view === v));
  $('#view-single').hidden = v !== 'single'; $('#view-compare').hidden = v !== 'compare';
  if (v === 'compare') pintarComparar();
}

/* ---------------- eventos ---------------- */
document.querySelectorAll('.tab[data-view]').forEach(t => (t.onclick = () => setVista(t.dataset.view)));
$('#btn-decidir').onclick = () => estado.senales && ejecutar();
$('#btn-lab').onclick = () => { estado.lab = !estado.lab; pintarLab(); };
$('#btn-code').onclick = () => setCodigo(!estado.codigo);
$('#btn-replay').onclick = () => trazar();
$('#chk-explicar').onchange = e => { estado.explicar = e.target.checked; pintarLanding(); if (estado.vista === 'compare') pintarComparar(); };
document.addEventListener('keydown', e => {
  if (e.target.matches('input,select,textarea')) return;
  if (['1', '2', '3'].includes(e.key)) seleccionar(PERFILES[Number(e.key) - 1].id);
  if (e.key.toLowerCase() === 'c') setVista(estado.vista === 'compare' ? 'single' : 'compare');
  if (e.key.toLowerCase() === 'p') $('#app').classList.toggle('nopanel');
  if (e.key.toLowerCase() === 'v') setCodigo(!estado.codigo);
  if (e.key.toLowerCase() === 'l') { estado.lab = !estado.lab; pintarLab(); }
  if (e.key.toLowerCase() === 'e') { $('#chk-explicar').checked = !$('#chk-explicar').checked; $('#chk-explicar').dispatchEvent(new Event('change')); }
});

/* ---------------- modo VISOR (/visor): landing a pantalla completa + desplegable flotante ---------------- */
function montarVisor() {
  $('#app').classList.add('visor');
  const ui = document.createElement('div'); ui.className = 'visor-ui'; ui.id = 'visor-ui';
  ui.innerHTML = `
    <span class="visor-dot"></span>
    <label>Visitante <select id="visor-perfil">${PERFILES.map(p => `<option value="${p.id}">${p.emoji} ${p.nombre} · ${p.apodo.toLowerCase()}</option>`).join('')}</select></label>
    <label>Web <select id="visor-esc">${ESCENARIOS.map(e => `<option value="${e.id}" ${e.id === E.id ? 'selected' : ''}>${e.emoji} ${e.nombre}</option>`).join('')}</select></label>
    <span class="visor-stat" id="visor-stat">—</span>
    <button class="visor-btn" id="visor-tags" title="Etiquetas de JEV (E)">etiquetas</button>`;
  document.body.appendChild(ui);
  $('#visor-perfil').onchange = e => seleccionar(e.target.value);
  $('#visor-esc').onchange = e => { location.href = `/visor?e=${e.target.value}`; };
  $('#visor-tags').onclick = () => { $('#chk-explicar').checked = !$('#chk-explicar').checked; $('#chk-explicar').dispatchEvent(new Event('change')); };
}
function pintarVisor() {
  if (!VISOR) return;
  const r = estado.respuesta; if (!r) return;
  const conv = ans(r, 'convierte')?.noul ?? 0;
  $('#visor-stat').innerHTML = `convierte <b style="color:${conv >= .6 ? 'var(--ok)' : conv >= .3 ? 'var(--warn)' : 'var(--bad)'}">${fmtPct(conv)}</b> · ${elige(r, 'etapa')} · ${r._ms} ms`;
  $('#visor-perfil').value = estado.perfil?.id;
  $('#visor-tags').classList.toggle('active', estado.explicar);
}

pintarCabecera(); pintarPerfiles();
if (VISOR) { montarVisor(); seleccionar(PERFILES[0].id); }
if (!VISOR) $('#landing').innerHTML = `<div style="padding:60px;text-align:center;color:#5b6274"><div style="font-size:40px">👆</div><p style="font-size:18px;max-width:420px;margin:12px auto">Elige quién entra en ${E.url}. JEV decidirá en tiempo real qué versión de la landing se pinta.</p></div>`;
