// ESCENARIO B2C · Duermevela: colchones vendidos solo online, 100 noches de prueba.
import { ans, esc, fmtPct, crearBloque } from '../comun.js';

const NEGOCIO = {
  nombre: 'Duermevela',
  descripcion: 'Marca de colchones viscoelásticos que vende solo online en España. Un único modelo en 6 medidas, de 399 € (90x190) a 699 € (180x200). 100 noches de prueba, devolución gratuita, envío en 48 h, financiación en 3 plazos sin intereses.',
  que_es_convertir: 'Convertir = comprar en esta sesión (o, como mínimo, añadir al carrito y llegar al pago).',
  objetivo_de_la_landing: 'Decidir qué bloques mostrar a ESTE visitante para maximizar la probabilidad de compra hoy: no presionar con descuentos a quien acaba de descubrir la marca, no hacer perder tiempo con explicaciones a quien ya tiene el carrito hecho, y no regalar margen a quien iba a comprar igual.',
};

const PREGUNTAS = {
  convierte: { type: 'noul', instructions: '¿Es probable que este visitante compre (o llegue al pago) en esta misma sesión?' },
  etapa: { type: 'choice', instructions: '¿En qué etapa de compra está este visitante?', criteria: {
    frio: 'Acaba de descubrir la marca o el problema (duerme mal); curiosea.',
    tibio: 'Está comparando colchones, medidas, opiniones y precios; evalúa activamente.',
    caliente: 'Ya ha elegido; tiene carrito o ha llegado al pago; está a un paso de comprar.' } },
  angulo_hero: { type: 'choice', instructions: '¿Qué ángulo debe tener el titular principal (hero) para este visitante?', criteria: {
    inspiracional: 'Hablar de dormir mejor y del problema, sin precio ni tecnicismos.',
    comparativo: 'Posicionar frente a Emma, Ikea y la tienda física con cifras, medidas y precio.',
    cierre: 'Ir a rematar: tu colchón está a un clic, envío en 48 h, pago seguro.' } },
  cta_principal: { type: 'choice', instructions: '¿Cuál debe ser la llamada a la acción principal para este visitante?', criteria: {
    hacer_test: 'Hacer el test del sueño de 1 minuto (sin comprar nada).',
    ver_colchon: 'Ver el colchón, sus medidas y precios.',
    anadir_carrito: 'Añadir el colchón al carrito en la medida sugerida.',
    terminar_compra: 'Volver al carrito y terminar la compra.' } },
  mostrar_video: { type: 'noul', instructions: '¿Conviene mostrar el vídeo de 60 segundos del colchón (capas, prueba de presión)?' },
  mostrar_test: { type: 'noul', instructions: '¿Conviene mostrar el test interactivo "¿qué firmeza necesitas?"?' },
  prueba_social: { type: 'choice', instructions: '¿Qué tipo de prueba social encaja mejor con este visitante?', criteria: {
    ninguna: 'No mostrar prueba social.',
    opiniones: 'Opiniones verificadas de clientes con estrellas y medida comprada.',
    prensa: 'Logos y citas de medios y organizaciones de consumidores.',
    videos_clientes: 'Vídeos cortos de clientes desempaquetando y probando el colchón.' } },
  mostrar_comparativa: { type: 'noul', instructions: '¿Conviene mostrar la tabla comparativa frente a Emma, Ikea y la tienda física?' },
  mostrar_precios: { type: 'noul', instructions: '¿Conviene mostrar la tabla de medidas y precios (y el precio en el hero)?' },
  mostrar_garantia: { type: 'noul', instructions: '¿Conviene destacar las garantías (100 noches de prueba, devolución gratis, 10 años)?' },
  mostrar_financiacion: { type: 'noul', instructions: '¿Conviene mostrar la financiación en 3 plazos sin intereses?' },
  descuento: { type: 'noul', instructions: '¿Conviene ofrecer un cupón del 15 % con cuenta atrás? (Cuesta margen: solo si ayuda a cerrar a alguien que dudaba.)' },
  recuperar_carrito: { type: 'noul', instructions: '¿Conviene mostrar un aviso con los productos que dejó en el carrito para retomar la compra?' },
  upsell: { type: 'choice', instructions: '¿Qué complemento conviene sugerir?', criteria: {
    ninguno: 'No sugerir nada más.',
    almohada: 'Almohada viscoelástica a juego (49 €).',
    pack_sabanas: 'Pack de sábanas y protector (79 €).' } },
  captura_email: { type: 'noul', instructions: '¿Conviene mostrar un bloque para dejar el email a cambio de un 10 % en la primera compra?' },
  chat_humano: { type: 'noul', instructions: '¿Conviene mostrar un acceso directo por WhatsApp a una asesora del sueño?' },
};

const PERFILES = [
  {
    id: 'noa', nombre: 'Noa', apodo: 'La curiosa', emoji: '📱', color: '#5aa9ff',
    resumen: 'Llega desde un TikTok sobre «por qué te despiertas cansado», en el móvil, a las 23:05. Primera visita.',
    senales: {
      fuente: 'tiktok', contenido_origen: 'vídeo «por qué te despiertas cansado aunque duermas 8 horas»', dispositivo: 'movil',
      hora_local: 'miércoles 23:05', ciudad: 'Sevilla', visitas_previas: 0, paginas_vistas_en_sesion: 1,
      segundos_en_pagina: 6, scroll_pct: 10, opiniones_leidas: 0, carrito: null, llego_al_checkout: false,
      intento_cupon: false, suscrito_newsletter: false, compras_anteriores: 0,
      eventos: ['aterriza desde TikTok', 'sin interacción todavía'],
    },
  },
  {
    id: 'elena', nombre: 'Elena', apodo: 'La comparadora', emoji: '🔍', color: '#ffb347',
    resumen: 'Busca «mejor colchón viscoelástico 150x190 opiniones». Segunda visita, ha leído 12 opiniones y usado la guía de medidas.',
    senales: {
      fuente: 'google_busqueda', consulta: 'mejor colchón viscoelástico 150x190 opiniones', dispositivo: 'movil',
      hora_local: 'sábado 11:20', ciudad: 'Zaragoza', visitas_previas: 1, dias_desde_ultima_visita: 2,
      paginas_vistas_en_sesion: 5, rutas_vistas: ['/', '/colchon', '/opiniones', '/comparativa', '/medidas'],
      segundos_en_pagina: 190, scroll_pct: 85, opiniones_leidas: 12, medida_consultada: '150x190',
      carrito: null, llego_al_checkout: false, intento_cupon: false, suscrito_newsletter: false, compras_anteriores: 0,
      eventos: ['usó la guía de medidas (150x190)', 'abrió la comparativa con Emma', 'volvió desde una pestaña de emma-colchon.es'],
    },
  },
  {
    id: 'javier', nombre: 'Javier', apodo: 'El decidido', emoji: '🛒', color: '#7cf29c',
    resumen: 'Vuelve desde un anuncio de retargeting. Dejó en el carrito el colchón 150x190 y una almohada, llegó al pago y probó un cupón caducado.',
    senales: {
      fuente: 'retargeting_instagram', campana: 'retargeting carrito abandonado', dispositivo: 'escritorio',
      hora_local: 'martes 20:40', ciudad: 'Madrid', visitas_previas: 3, dias_desde_ultima_visita: 1,
      paginas_vistas_en_sesion: 2, rutas_vistas: ['/carrito', '/'], segundos_en_pagina: 45, scroll_pct: 30,
      opiniones_leidas: 4, carrito: { articulos: ['Colchón Duermevela 150x190 (599 €)', 'Almohada viscoelástica (49 €)'], total_eur: 648, abandonado_hace_horas: 26 },
      llego_al_checkout: true, intento_cupon: true, cupon_intentado: 'VERANO20 (caducado)', suscrito_newsletter: true, compras_anteriores: 0,
      eventos: ['llegó al pago y no completó', 'probó un cupón caducado', 'consultó la política de devolución', 'abrió el email de carrito abandonado'],
    },
  },
];

const FUENTES = {
  tiktok: 'TikTok', instagram_reel: 'Reel de Instagram', google_busqueda: 'Google («mejor colchón … opiniones»)', google_shopping: 'Google Shopping',
  retargeting_instagram: 'Anuncio de retargeting', newsletter: 'Newsletter', directo: 'Tráfico directo',
};

const LAB = [
  { k: 'fuente', t: 'Fuente de tráfico', tipo: 'select', opciones: FUENTES },
  { k: 'dispositivo', t: 'Dispositivo', tipo: 'select', opciones: { movil: 'Móvil', escritorio: 'Escritorio' } },
  { k: 'visitas_previas', t: 'Visitas previas', tipo: 'range', min: 0, max: 10 },
  { k: 'segundos_en_pagina', t: 'Segundos en la página', tipo: 'range', min: 0, max: 600, step: 5 },
  { k: 'scroll_pct', t: 'Scroll (%)', tipo: 'range', min: 0, max: 100, step: 5 },
  { k: 'opiniones_leidas', t: 'Opiniones leídas', tipo: 'range', min: 0, max: 30 },
  { k: 'carrito', t: 'Carrito (€, 0 = vacío)', tipo: 'range', min: 0, max: 800, step: 50, nulo: 0, transformar: v => ({ articulos: [`Colchón Duermevela (${v} €)`], total_eur: v, abandonado_hace_horas: 20 }) },
  { k: 'llego_al_checkout', t: 'Llegó al pago', tipo: 'bool' },
  { k: 'intento_cupon', t: 'Intentó un cupón', tipo: 'bool' },
  { k: 'suscrito_newsletter', t: 'Suscrito a la newsletter', tipo: 'bool' },
];

const ETIQ = { convierte: 'convierte', etapa: 'etapa', angulo_hero: 'ángulo hero', cta_principal: 'CTA principal', mostrar_video: 'vídeo', mostrar_test: 'test del sueño', prueba_social: 'prueba social', mostrar_comparativa: 'comparativa', mostrar_precios: 'medidas y precios', mostrar_garantia: 'garantías', mostrar_financiacion: 'financiación', descuento: 'cupón 15 %', recuperar_carrito: 'recuperar carrito', upsell: 'complemento', captura_email: 'captura email', chat_humano: 'asesora WhatsApp' };
const bloque = crearBloque(ETIQ);

const TXT = {
  hero: {
    inspiracional: { k: 'Para los que se despiertan cansados', h: 'Dormir bien no es un lujo. Es un colchón <em>que se adapta a ti.</em>', s: 'Viscoelástica de tres capas que reparte el peso y no da calor. Pruébalo 100 noches en tu casa: si no duermes mejor, lo recogemos gratis.' },
    comparativo: { k: 'Un solo modelo, sin catálogo de 40 colchones', h: 'La firmeza de Emma, <em>sin su precio.</em> Y sin tienda que te lo cobre.', s: 'Vendemos solo online y un único colchón en 6 medidas. Por eso el 150x190 cuesta 599 € y no 899 €. 100 noches de prueba, envío en 48 h.' },
    cierre: { k: 'Envío gratis en 48 h · pago seguro', h: 'Tu colchón está a un clic. <em>Pasado mañana, en tu cama.</em>', s: 'Lo entregamos en 48 h, lo pruebas 100 noches y si no te convence lo recogemos. Sin preguntas.' },
  },
  cta: {
    hacer_test: { t: '😴 Hacer el test del sueño (1 min)', n: 'Te decimos qué firmeza necesitas. Sin registro.' },
    ver_colchon: { t: 'Ver el colchón y las medidas', n: 'Un modelo, 6 medidas. Desde 399 €.' },
    anadir_carrito: { t: '🛒 Añadir el 150x190 al carrito', n: 'Envío gratis en 48 h · 100 noches de prueba.' },
    terminar_compra: { t: '✅ Terminar mi compra · 648 €', n: 'Tu carrito sigue guardado. Pago en 3 plazos disponible.' },
  },
};

const B = {
  nav: (cta, conPrecios) => `<div class="l-nav"><div class="l-logo"><i class="luna"></i>Duermevela</div><nav><span>El colchón</span><span>Opiniones</span>${conPrecios ? '<span>Medidas y precios</span>' : ''}<span>100 noches</span></nav><a class="l-btn ghost" href="#form">${cta.t.replace(/^[^\w]+\s/, '')}</a></div>`,
  hero: (hero, cta, ctaK, conPrecio, conVideo) => `
    <div class="hero-bg"></div>
    <div class="l-hero ${conVideo ? 'solo' : ''}">
      <div>
        <div class="eyebrow">${hero.k}</div>
        <h1 class="l-h1">${hero.h}</h1>
        <p class="l-sub">${hero.s}</p>
        <div class="l-ctas"><a class="l-btn ${ctaK === 'terminar_compra' ? 'ok' : ''}" href="#form">${cta.t}</a>${ctaK === 'hacer_test' ? '' : '<a class="l-btn sec" href="#">Cómo está hecho</a>'}</div>
        <div class="l-note">${cta.n}${conPrecio ? ' · <b>Desde 399 €</b>' : ''}</div>
      </div>
      ${conVideo ? '' : `<div class="mattress"><div class="glow"></div><div class="stack"><i></i><i></i><i></i></div><div class="badges"><span class="badge">☁️ 3 capas · 25 cm</span><span class="badge">🌙 100 noches de prueba</span><span class="badge">🚚 En tu casa en 48 h</span></div></div>`}
    </div>`,
  carrito: c => `<div class="l-carrito"><div class="ic">🛒</div><div class="t"><b>Tu carrito sigue aquí</b><span>${esc((c?.articulos || []).join(' + '))} · <b>${c?.total_eur ?? ''} €</b> · guardado hace ${c?.abandonado_hace_horas ?? '?'} h</span></div><a class="l-btn ok" href="#">Terminar la compra</a></div>`,
  oferta: () => `<div class="l-oferta"><div><b>−15 % con el código DUERME15</b> · solo hoy, en cualquier medida.</div><div class="cd">⏱ 05:59:12</div></div>`,
  video: () => `<div class="l-video"><div class="l-player noche"><div class="play">▶</div><div class="cap">Las tres capas y la prueba de presión, en 60 segundos</div><div class="dur">1:00</div></div></div>`,
  test: () => `<div class="l-sec"><div class="eyebrow">Test del sueño</div><h2>¿Qué firmeza necesitas?</h2><p class="lead">Tres preguntas y te decimos si el Duermevela es para ti (spoiler: hay un caso en el que no).</p>
    <div class="l-test">
      <div class="q"><b>¿Cómo duermes?</b><div class="opts"><span class="on">De lado</span><span>Boca arriba</span><span>Boca abajo</span></div></div>
      <div class="q"><b>¿Te despiertas con calor?</b><div class="opts"><span>Nunca</span><span class="on">A veces</span><span>Siempre</span></div></div>
      <div class="q"><b>¿Compartes cama?</b><div class="opts"><span>No</span><span class="on">Sí, y se mueve</span></div></div>
      <a class="l-btn" href="#">Ver mi resultado</a>
    </div></div>`,
  social: {
    opiniones: () => `<div class="l-sec"><div class="eyebrow">Opiniones verificadas</div><h2>4,8 sobre 5 en 3.214 opiniones</h2><p class="lead">Las buenas y las malas. Filtra por medida.</p><div class="l-testis tres">
      <div class="l-testi"><div class="stars">★★★★★</div>«Dormía fatal por la espalda. A la segunda semana dejé de despertarme de madrugada. Lo compré con miedo por no probarlo en tienda, no hacía falta.»<div class="who"><span class="av">M</span>Marta · 150x190 · Valencia</div></div>
      <div class="l-testi"><div class="stars">★★★★☆</div>«Muy cómodo, más firme de lo que esperaba. El envío tardó 3 días, no 2. Aun así lo recomiendo.»<div class="who"><span class="av">I</span>Iván · 135x190 · Bilbao</div></div>
      <div class="l-testi"><div class="stars">★★★★★</div>«Lo devolví a los 40 días porque me resultaba blando, y me lo recogieron sin preguntar. Volví a comprar la versión firme.»<div class="who"><span class="av">C</span>Carmen · 180x200 · Madrid</div></div></div></div>`,
    prensa: () => `<div class="l-sec"><p class="lead" style="text-align:center;margin:0 auto 18px;font-family:var(--font-s);font-style:italic;font-size:24px;color:var(--txt)">«El colchón online con mejor relación calidad-precio de 2026»</p>
      <div class="l-marquee"><div class="track">${['OCU', 'El País', 'Xataka', 'La Vanguardia', 'Trendencias', 'El Confidencial', 'OCU', 'El País', 'Xataka', 'La Vanguardia', 'Trendencias', 'El Confidencial'].map(n => `<span>${n}</span>`).join('')}</div></div></div>`,
    videos_clientes: () => `<div class="l-sec"><div class="eyebrow">Vídeos de clientes</div><h2>Clientes de verdad, en su casa</h2><p class="lead">Sin guion. Vídeos enviados por clientes a cambio de nada.</p><div class="l-ugc"><div class="v"><span>▶</span><b>Desempaquetado en 30 s</b></div><div class="v"><span>▶</span><b>«Un mes después»</b></div><div class="v"><span>▶</span><b>Prueba con la copa de vino</b></div></div></div>`,
  },
  comparativa: () => `<div class="l-sec"><div class="eyebrow">Comparativa</div><h2>Duermevela frente a las alternativas</h2><p class="lead">Colchón 150x190, precios de septiembre de 2026.</p>
    <table class="l-tabla"><tr><th></th><th>Tienda física</th><th>Emma</th><th>Ikea</th><th class="me">Duermevela</th></tr>
    <tr><td>Precio 150x190</td><td>desde 749 €</td><td>899 €</td><td>449 €</td><td class="me">599 €</td></tr>
    <tr><td>Noches de prueba</td><td class="ko">0</td><td class="ok">100</td><td class="ok">90</td><td class="me ok">100</td></tr>
    <tr><td>Recogida gratis si devuelves</td><td class="ko">no</td><td class="ok">sí</td><td class="ko">lo llevas tú</td><td class="me ok">sí</td></tr>
    <tr><td>Capa transpirable</td><td>depende</td><td class="ok">sí</td><td class="ko">no</td><td class="me ok">sí</td></tr>
    <tr><td>Garantía</td><td>2 años</td><td>10 años</td><td>10 años</td><td class="me">10 años</td></tr></table></div>`,
  precios: () => `<div class="l-sec"><div class="eyebrow">Medidas y precios</div><h2>Un colchón, seis medidas</h2><p class="lead">IVA y envío incluidos. Sin sorpresas en el pago.</p>
    <div class="l-medidas">${[['90x190', 399], ['105x190', 449], ['135x190', 549], ['150x190', 599, true], ['160x200', 649], ['180x200', 699]].map(([m, p, hi]) => `<div class="m ${hi ? 'hi' : ''}">${hi ? '<span class="rib">la más vendida</span>' : ''}<b>${m}</b><span>${p} €</span></div>`).join('')}</div></div>`,
  garantia: () => `<div class="l-garantia"><div><i>🌙</i><b>100 noches de prueba</b><span>En tu casa, con tus sábanas.</span></div><div><i>↩️</i><b>Devolución gratis</b><span>Lo recogemos y te devolvemos todo.</span></div><div><i>🛡️</i><b>10 años de garantía</b><span>Contra hundimientos y defectos.</span></div></div>`,
  financiacion: () => `<div class="l-fin"><div><b>3 × 199,67 €</b><span>sin intereses, con Klarna o tarjeta</span></div><div><b>0 € hoy</b><span>primer plazo a los 30 días</span></div><a class="l-btn sec" href="#">Ver condiciones</a></div>`,
  upsell: tipo => tipo === 'almohada'
    ? `<div class="l-upsell"><div class="img">🛏️</div><div class="t"><b>Añade la almohada a juego por 49 €</b><span>Misma viscoelástica, altura media. El 62 % de los clientes la añaden.</span></div><a class="l-btn sec" href="#">+ Añadir</a></div>`
    : `<div class="l-upsell"><div class="img">🧺</div><div class="t"><b>Pack sábanas + protector por 79 €</b><span>Algodón orgánico, a medida de tu colchón. Llega en el mismo envío.</span></div><a class="l-btn sec" href="#">+ Añadir</a></div>`,
  email: () => `<div class="l-sec" id="form"><div class="l-form"><div><h2>Un 10 % para tu primera compra</h2><p>Y la guía «Cómo elegir colchón sin que te la cuelen». Sin spam, prometido.</p></div><form onsubmit="return false"><input placeholder="Tu email" type="email"><a class="l-btn" href="#">Quiero mi 10 %</a><div class="tiny">Al enviar aceptas la política de privacidad.</div></form></div></div>`,
  whatsapp: () => `<a class="l-wa" href="#">💬 Asesora del sueño</a>`,
  footer: () => `<div class="l-foot"><span>© Duermevela · Barcelona</span><span>Privacidad · Envíos y devoluciones · Cookies</span></div>`,
};

/* ---- Orquestador: ESTE es el código que se muestra en la vista «Código en vivo» ---- */
function renderLanding(r, senales, cambios = new Set(), explicar = true) {
  const si = k => ans(r, k)?.noul >= 0.5;            // pregunta sí/no  → true / false
  const elige = k => ans(r, k)?.choice;              // pregunta choice → opción elegida
  const partes = [];
  const pinta = (id, k, html) => partes.push(bloque(id, k, r, html, cambios.has(id) ? 'changed' : ''));  // añade un bloque

  const hero = TXT.hero[elige('angulo_hero')] || TXT.hero.inspiracional;
  const ctaK = elige('cta_principal') || 'ver_colchon';
  const cta = TXT.cta[ctaK];

  pinta('nav', null, B.nav(cta, si('mostrar_precios')));
  if (si('recuperar_carrito') && senales.carrito) pinta('carrito', 'recuperar_carrito', B.carrito(senales.carrito));
  pinta('hero', 'angulo_hero', B.hero(hero, cta, ctaK, si('mostrar_precios'), si('mostrar_video')));
  if (si('descuento')) pinta('oferta', 'descuento', B.oferta());
  if (si('mostrar_video')) pinta('video', 'mostrar_video', B.video());
  if (si('mostrar_garantia')) pinta('garantia', 'mostrar_garantia', B.garantia());
  if (si('mostrar_test')) pinta('test', 'mostrar_test', B.test());
  const social = elige('prueba_social');
  if (social && social !== 'ninguna') pinta('social', 'prueba_social', B.social[social]());
  if (si('mostrar_comparativa')) pinta('comparativa', 'mostrar_comparativa', B.comparativa());
  if (si('mostrar_precios')) pinta('precios', 'mostrar_precios', B.precios());
  if (si('mostrar_financiacion')) pinta('financiacion', 'mostrar_financiacion', B.financiacion());
  const extra = elige('upsell');
  if (extra && extra !== 'ninguno') pinta('upsell', 'upsell', B.upsell(extra));
  if (si('captura_email')) pinta('email', 'captura_email', B.email());
  if (si('chat_humano')) pinta('wa', 'chat_humano', B.whatsapp());
  pinta('foot', null, B.footer());

  return `<div class="landing duermevela ${explicar ? '' : 'no-tags'}">${partes.join('')}</div>`;
}

const BLOQUE_DE = { carrito: ['recuperar_carrito'], hero: ['angulo_hero', 'cta_principal', 'mostrar_precios', 'mostrar_video'], oferta: ['descuento'], video: ['mostrar_video'], garantia: ['mostrar_garantia'], test: ['mostrar_test'], social: ['prueba_social'], comparativa: ['mostrar_comparativa'], precios: ['mostrar_precios'], financiacion: ['mostrar_financiacion'], upsell: ['upsell'], email: ['captura_email'], wa: ['chat_humano'] };

function resumenBloques(r) {
  const si = k => ans(r, k)?.noul >= .5, el = k => ans(r, k)?.choice;
  return [['carrito', si('recuperar_carrito')], ['cupón', si('descuento')], ['vídeo', si('mostrar_video')], ['garantías', si('mostrar_garantia')], ['test', si('mostrar_test')], ['social: ' + el('prueba_social'), el('prueba_social') !== 'ninguna'], ['comparativa', si('mostrar_comparativa')], ['precios', si('mostrar_precios')], ['financiación', si('mostrar_financiacion')], ['extra: ' + el('upsell'), el('upsell') !== 'ninguno'], ['email', si('captura_email')], ['WhatsApp', si('chat_humano')], ['CTA: ' + el('cta_principal'), true]];
}

export default {
  id: 'duermevela', nombre: 'Duermevela', tipo: 'B2C', url: 'duermevela.es', emoji: '🌙',
  descripcion: 'Colchones vendidos solo online, 100 noches de prueba',
  tema: { '--l-brand': '#3b4fd8', '--l-brand2': '#8ea2ff', '--l-soft': '#eef1ff' },
  NEGOCIO, PREGUNTAS, PERFILES, LAB, ETIQ, renderLanding, BLOQUE_DE, resumenBloques,
};
