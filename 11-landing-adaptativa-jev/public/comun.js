// Utilidades compartidas por la app y los escenarios.
export const fmtPct = x => Math.round(x * 100) + ' %';
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const ans = (r, k) => r?.answers?.[k];
export const prob = (r, k) => { const a = ans(r, k); if (!a) return 0; return a.type === 'noul' ? a.noul : (a.probabilities?.[a.choice] ?? a.confidence ?? 0); };

// Envuelve el HTML de un bloque con su etiqueta de decisión (k = pregunta que lo justifica; null = sin etiqueta).
export const crearBloque = ETIQ => (id, k, r, html, extraClass = '') => {
  const a = k ? ans(r, k) : null;
  const tag = a ? `<span class="tag"><i style="background:${a.type === 'noul' ? (a.noul >= .5 ? 'var(--ok)' : 'var(--bad)') : 'var(--acc2)'}"></i>${ETIQ[k] || k}: ${a.type === 'noul' ? (a.noul >= .5 ? 'sí' : 'no') : String(a.choice).replace(/_/g, ' ')} · ${fmtPct(prob(r, k))}</span>` : '';
  return `<section class="bloque ${extraClass}" data-b="${id}">${tag}<div class="wrap">${html}</div></section>`;
};
