// ESCENARIO B2B · Mesa Llena: software de reservas para restaurantes.
import { ans, esc, fmtPct, crearBloque } from '../comun.js';


const NEGOCIO = {
  nombre: 'Mesa Llena',
  descripcion: 'Software de reservas, lista de espera, recordatorios anti no-show y fidelización para restaurantes en España. Sin comisiones por comensal.',
  planes: 'Básico 39 €/local/mes, Pro 79 €/local/mes, Grupos a medida a partir de 10 locales (implantación en 48 h y responsable de cuenta).',
  que_es_convertir: 'Convertir = agendar una demo, iniciar la prueba gratuita o dejar datos de contacto válidos.',
  objetivo_de_la_landing: 'Decidir qué bloques mostrar a ESTE visitante concreto para maximizar la probabilidad de que convierta hoy, sin abrumar a quien acaba de llegar ni hacer perder tiempo a quien ya está decidido.',
};

// Cada clave es una decisión. JEV las responde todas en una sola llamada.
const PREGUNTAS = {
  convierte: { type: 'noul', instructions: '¿Es probable que este visitante convierta (demo, prueba o contacto) en esta misma sesión?' },
  etapa: { type: 'choice', instructions: '¿En qué etapa de compra está este visitante?', criteria: {
    frio: 'Acaba de descubrir el problema o el producto; curiosea, no está evaluando comprar.',
    tibio: 'Está comparando opciones y precios; evalúa activamente.',
    caliente: 'Ya conoce el producto y está a un paso de decidir; busca cerrar.' } },
  angulo_hero: { type: 'choice', instructions: '¿Qué ángulo debe tener el titular principal (hero) para este visitante?', criteria: {
    educativo: 'Explicar el problema y el beneficio de forma sencilla, sin hablar de precio.',
    comparativo: 'Posicionar frente a alternativas (TheFork, teléfono, otros) y dar cifras y precio.',
    directo: 'Ir al grano: implantación, plazos, siguiente paso para contratar.' } },
  cta_principal: { type: 'choice', instructions: '¿Cuál debe ser la llamada a la acción principal para este visitante?', criteria: {
    guia_gratis: 'Descargar una guía gratuita a cambio del email (compromiso mínimo).',
    prueba_gratis: 'Empezar una prueba gratuita de 14 días.',
    agendar_demo: 'Reservar una demo de 20 minutos con el equipo.',
    hablar_ahora: 'Hablar ahora mismo con una persona (WhatsApp o llamada).' } },
  mostrar_video: { type: 'noul', instructions: '¿Conviene mostrar un vídeo explicativo de 90 segundos a este visitante?' },
  mostrar_como_funciona: { type: 'noul', instructions: '¿Conviene mostrar la sección "cómo funciona en 3 pasos"?' },
  prueba_social: { type: 'choice', instructions: '¿Qué tipo de prueba social encaja mejor con este visitante?', criteria: {
    ninguna: 'No mostrar prueba social.',
    testimonios: 'Testimonios cortos de restaurantes pequeños.',
    caso_grupo: 'Caso de éxito detallado de un grupo con varios locales, con cifras.',
    logos: 'Fila de logos de clientes conocidos.' } },
  mostrar_comparativa: { type: 'noul', instructions: '¿Conviene mostrar la tabla comparativa frente a TheFork, CoverManager y el teléfono?' },
  mostrar_precios: { type: 'noul', instructions: '¿Conviene mostrar la tabla de precios en esta visita?' },
  plan_destacado: { type: 'choice', instructions: 'Si se muestran precios, ¿qué plan debe aparecer destacado?', criteria: {
    basico: 'Básico, 39 €/local/mes.', pro: 'Pro, 79 €/local/mes.', grupos: 'Grupos, a medida a partir de 10 locales.' } },
  mostrar_roi: { type: 'noul', instructions: '¿Conviene mostrar la calculadora de retorno (dinero recuperado por no-shows evitados)?' },
  formulario: { type: 'choice', instructions: '¿Qué longitud debe tener el formulario para este visitante?', criteria: {
    solo_email: 'Un único campo de email.',
    corto: 'Nombre, email y nombre del restaurante.',
    completo: 'Nombre, email, teléfono, empresa, número de locales y fecha preferida para la demo.' } },
  descuento: { type: 'noul', instructions: '¿Conviene mostrar una oferta con fecha límite (primer mes gratis si contrata esta semana)?' },
  contacto_humano: { type: 'noul', instructions: '¿Conviene mostrar un acceso directo a una persona real (WhatsApp y responsable de cuenta con nombre y foto)?' },
  mostrar_faq: { type: 'noul', instructions: '¿Conviene mostrar la sección de preguntas frecuentes?' },
};

const PERFILES = [
  {
    id: 'lucia', nombre: 'Lucía', apodo: 'La curiosa', emoji: '📱', color: '#5aa9ff',
    resumen: 'Dueña de un bistró. Llega desde un reel a las 23:14, en el móvil, primera visita.',
    senales: {
      fuente: 'instagram_reel', campana: 'reel «3 errores que vacían tu sala»', dispositivo: 'movil',
      hora_local: 'domingo 23:14', ciudad: 'Valencia', visitas_previas: 0, paginas_vistas_en_sesion: 1,
      segundos_en_pagina: 8, scroll_pct: 15, veces_que_vio_precios: 0, empresa_identificada: null,
      num_locales: null, demo_previa: false, eventos: ['aterriza desde el reel', 'sin interacción todavía'],
    },
  },
  {
    id: 'marcos', nombre: 'Marcos', apodo: 'El comparador', emoji: '🔍', color: '#ffb347',
    resumen: 'Gerente de 2 locales. Busca «software reservas restaurante precio», segunda visita, ya vio precios.',
    senales: {
      fuente: 'google_busqueda', consulta: 'software reservas restaurante precio', dispositivo: 'escritorio',
      hora_local: 'martes 12:40', ciudad: 'Madrid', visitas_previas: 1, dias_desde_ultima_visita: 5,
      paginas_vistas_en_sesion: 4, rutas_vistas: ['/', '/precios', '/vs-thefork', '/'],
      segundos_en_pagina: 160, scroll_pct: 80, veces_que_vio_precios: 1, empresa_identificada: null,
      num_locales: 2, demo_previa: false,
      eventos: ['abrió el chat sin escribir', 'abandonó el formulario con nombre y email escritos'],
    },
  },
  {
    id: 'andana', nombre: 'Grupo Andana', apodo: 'El decidido', emoji: '🏢', color: '#7cf29c',
    resumen: 'Cadena de 14 restaurantes. Llega desde el email de seguimiento tras la demo, sexta visita.',
    senales: {
      fuente: 'email', campana: 'seguimiento post-demo', dispositivo: 'escritorio',
      hora_local: 'martes 10:30', ciudad: 'Barcelona', visitas_previas: 5, paginas_vistas_en_sesion: 3,
      rutas_vistas: ['/precios', '/condiciones', '/'], segundos_en_pagina: 240, scroll_pct: 95,
      veces_que_vio_precios: 3, empresa_identificada: 'Grupo Andana (grupoandana.com)', num_locales: 14,
      demo_previa: true, dias_desde_demo: 3,
      eventos: ['descargó el PDF de condiciones', 'usó la calculadora de retorno con 14 locales', 'CRM: oportunidad en fase «propuesta»'],
    },
  },
];

// Opciones del modo laboratorio (señales editables en vivo).
const FUENTES = {
  instagram_reel: 'Reel de Instagram', tiktok: 'TikTok', google_organico_blog: 'Google (artículo del blog)',
  google_busqueda: 'Google («software reservas precio»)', retargeting_ads: 'Anuncio de retargeting',
  linkedin: 'LinkedIn', email: 'Email de seguimiento post-demo', directo: 'Tráfico directo',
};

// Controles del laboratorio (señales editables en vivo)
const LAB = [
  { k: 'fuente', t: 'Fuente de tráfico', tipo: 'select', opciones: FUENTES },
  { k: 'dispositivo', t: 'Dispositivo', tipo: 'select', opciones: { movil: 'Móvil', escritorio: 'Escritorio' } },
  { k: 'visitas_previas', t: 'Visitas previas', tipo: 'range', min: 0, max: 10 },
  { k: 'paginas_vistas_en_sesion', t: 'Páginas en la sesión', tipo: 'range', min: 1, max: 15 },
  { k: 'segundos_en_pagina', t: 'Segundos en la página', tipo: 'range', min: 0, max: 600, step: 5 },
  { k: 'scroll_pct', t: 'Scroll (%)', tipo: 'range', min: 0, max: 100, step: 5 },
  { k: 'veces_que_vio_precios', t: 'Veces que vio /precios', tipo: 'range', min: 0, max: 6 },
  { k: 'num_locales', t: 'Nº de locales (0 = desconocido)', tipo: 'range', min: 0, max: 30, nulo: 0 },
  { k: 'demo_previa', t: 'Ya hizo una demo', tipo: 'bool' },
  { k: 'empresa_identificada', t: 'Empresa identificada por IP', tipo: 'bool', texto: 'empresa detectada por IP (dominio corporativo)' },
];

const ETIQ = { convierte: 'convierte', etapa: 'etapa', angulo_hero: 'ángulo hero', cta_principal: 'CTA principal', mostrar_video: 'vídeo', mostrar_como_funciona: 'cómo funciona', prueba_social: 'prueba social', mostrar_comparativa: 'comparativa', mostrar_precios: 'precios', plan_destacado: 'plan destacado', mostrar_roi: 'calculadora ROI', formulario: 'formulario', descuento: 'oferta límite', contacto_humano: 'contacto humano', mostrar_faq: 'FAQ' };

const bloque = crearBloque(ETIQ);

const TXT = {
  hero: {
    educativo: { k: 'Para restaurantes que pierden reservas', h: 'Deja de perder mesas por no poder <em>coger el teléfono</em>', s: 'Mesa Llena atiende, confirma y recuerda las reservas por ti, también mientras estás en sala. Sin comisiones por comensal.' },
    comparativo: { k: 'Reservas · lista de espera · reseñas', h: 'Como TheFork, pero <em>sin comisiones</em> ni depender de nadie', s: 'Tu propio sistema de reservas y recordatorios desde 39 € al mes por local. Los clientes son tuyos, no de un marketplace.' },
    directo: { k: 'Implantación en 48 horas', h: 'Mesa Llena en todos tus locales <em>esta misma semana</em>', s: 'Migración de tus reservas actuales, formación del equipo y un responsable de cuenta con nombre y apellidos. Sin permanencia.' },
  },
  cta: {
    guia_gratis: { t: '📘 Descargar la guía gratis', n: '«7 errores que vacían tu sala entre semana». Sin registro, solo tu email.' },
    prueba_gratis: { t: 'Empezar la prueba de 14 días', n: 'Sin tarjeta. Cancela cuando quieras.' },
    agendar_demo: { t: '📅 Agendar una demo de 20 min', n: 'Te enseñamos el panel con tus propios horarios y mesas.' },
    hablar_ahora: { t: '💬 Hablar ahora por WhatsApp', n: 'Respondemos en menos de 5 minutos en horario de oficina.' },
  },
  // El texto del formulario sigue a la CTA; el número de campos, a la decisión «formulario».
  form: {
    guia_gratis: { h: 'Te mandamos la guía al momento', p: 'Sin llamadas comerciales. Solo la guía, en PDF.', c: 'Enviarme la guía' },
    prueba_gratis: { h: 'Empieza tu prueba gratuita', p: '14 días con todas las funciones. Configurado en 10 minutos.', c: 'Crear mi cuenta' },
    agendar_demo: { h: 'Reserva tu demo personalizada', p: 'Cuéntanos cuántos locales tienes y preparamos la demo con tus datos reales.', c: 'Reservar demo' },
    hablar_ahora: { h: 'Te escribimos hoy mismo', p: 'Déjanos cómo localizarte y Carlos te contacta en menos de una hora laboral.', c: 'Que me contacten' },
  },
};



const B = {
  nav: (cta, conPrecios) => `<div class="l-nav"><div class="l-logo"><i></i>Mesa Llena</div><nav><span>Producto</span><span>Clientes</span>${conPrecios ? '<span>Precios</span>' : ''}<span>Blog</span></nav><a class="l-btn ghost" href="#form">${cta.t.replace(/^[^\w]+\s/, '')}</a></div>`,
  hero: (hero, cta, ctaK, conVideo) => `
    <div class="hero-bg"></div>
    <div class="l-hero ${conVideo ? 'solo' : ''}">
      <div>
        <div class="eyebrow">${hero.k}</div>
        <h1 class="l-h1">${hero.h}</h1>
        <p class="l-sub">${hero.s}</p>
        <div class="l-ctas"><a class="l-btn ${ctaK === 'hablar_ahora' ? 'wa' : ''}" href="#form">${cta.t}</a>${ctaK === 'guia_gratis' ? '' : '<a class="l-btn sec" href="#">Ver cómo funciona</a>'}</div>
        <div class="l-note">${cta.n}</div>
      </div>
      ${conVideo ? '' : `<div class="panel-mock"><div class="chip">+23 % ocupación</div>
        <div class="ph"><b>Hoy · viernes</b><span>42 reservas · 3 en espera</span></div>
        <div class="row"><span>🍽️ 21:00 · Pérez ×4</span><b>confirmada</b></div>
        <div class="row"><span>🍽️ 21:30 · García ×2</span><b class="w">recordatorio enviado</b></div>
        <div class="row"><span>⏳ Lista de espera · 3 grupos</span><b class="i">aviso por WhatsApp</b></div>
        <div class="row"><span>⭐ Reseña nueva en Google</span><b>4,8 ★</b></div>
        <div class="bars"><i style="height:35%"></i><i style="height:50%"></i><i style="height:42%"></i><i style="height:70%"></i><i style="height:88%"></i><i style="height:100%"></i><i style="height:64%"></i></div>
      </div>`}
    </div>`,
  video: () => `<div class="l-video"><div class="l-player"><div class="play">▶</div><div class="cap">Cómo funciona Mesa Llena, explicado por una dueña de restaurante</div><div class="dur">1:32</div></div></div>`,
  oferta: () => `<div class="l-oferta"><div><b>Primer mes gratis</b> en todos tus locales si activas Mesa Llena antes del viernes.</div><div class="cd">⏱ 2 d 14 h 05 m</div></div>`,
  humano: locales => `<div class="l-humano" style="margin-top:26px"><div class="av">C</div><div class="t"><b>Carlos, tu responsable de cuenta</b><span>Ya conoces el panel de la demo. Si quieres, cerramos hoy el calendario de implantación de tus ${locales} locales.</span></div><a class="l-btn wa" href="#">💬 Escribir a Carlos</a></div>`,
  pasos: () => `<div class="l-sec"><div class="eyebrow">Cómo funciona</div><h2>Tres pasos y tu sala se llena sola</h2><p class="lead">Sin app que descargar, sin informático, sin cambiar de teléfono.</p>
    <div class="l-bento">
      <div class="b big"><div class="n">1</div><h3>Conectas tu Google y tu web</h3><p>Los clientes reservan desde donde ya te encuentran: Google, Instagram o tu propia web. En 10 minutos.</p><div class="art"><span></span><span></span><span></span></div></div>
      <div class="b"><div class="n">2</div><h3>Mesa Llena confirma y recuerda</h3><p>WhatsApp automático 24 h antes. Los no-shows bajan un 40 % de media.</p></div>
      <div class="b"><div class="n">3</div><h3>Rellenas los huecos</h3><p>Lista de espera inteligente y campañas a clientes que hace tiempo que no vuelven.</p></div>
    </div></div>`,
  social: {
    testimonios: () => `<div class="l-sec"><div class="eyebrow">Clientes</div><h2>Restaurantes como el tuyo</h2><p class="lead">Sin equipo de marketing, sin informático.</p><div class="l-testis">
        <div class="l-testi">«Antes perdía 4 o 5 reservas cada viernes porque no llegaba al teléfono. Ahora entran solas y la gente viene.»<div class="who"><span class="av">A</span>Ana · La Cantina de Ruzafa, Valencia</div></div>
        <div class="l-testi">«Los recordatorios por WhatsApp nos han quitado casi todos los plantones. Se paga solo el primer fin de semana.»<div class="who"><span class="av">J</span>Jordi · Bar Bodega Gràcia, Barcelona</div></div></div></div>`,
    caso_grupo: () => `<div class="l-sec"><div class="eyebrow">Caso de éxito</div><h2>Grupo Sal &amp; Brasa: 9 locales, un solo panel</h2><p class="lead">Implantación en 48 h en todos los locales. Datos de los primeros 90 días.</p>
        <div class="l-caso"><div><h3>Un panel para 9 restaurantes</h3><p>Reservas centralizadas, lista de espera compartida entre locales cercanos y recordatorios automáticos. La dirección ve la ocupación de todo el grupo en tiempo real.</p><p>«Ahora sé cada mañana qué local va flojo y muevo la campaña ese mismo día.» — Dirección de operaciones</p></div>
        <div class="l-kpis"><div class="l-kpi"><b>−41 %</b><span>no-shows</span></div><div class="l-kpi"><b>+23 %</b><span>ocupación entre semana</span></div><div class="l-kpi"><b>48 h</b><span>implantación por local</span></div><div class="l-kpi"><b>0 €</b><span>comisiones por comensal</span></div></div></div></div>`,
    logos: () => `<div class="l-sec"><div class="l-stats"><div class="l-stat"><b>1.200+</b><span>restaurantes en España</span></div><div class="l-stat"><b>−41 %</b><span>de no-shows de media</span></div><div class="l-stat"><b>48 h</b><span>para estar funcionando</span></div></div>
      <p class="lead" style="text-align:center;margin:26px auto 14px">Ya llenan sus mesas con nosotros</p>
      <div class="l-marquee"><div class="track">${['Sal & Brasa', 'La Cantina', 'Grupo Terraza', 'Casa Lola', 'Bodega Gràcia', 'Mar de Fondo', 'Sal & Brasa', 'La Cantina', 'Grupo Terraza', 'Casa Lola', 'Bodega Gràcia', 'Mar de Fondo'].map(n => `<span>${n}</span>`).join('')}</div></div></div>`,
  },
  comparativa: () => `<div class="l-sec"><div class="eyebrow">Comparativa</div><h2>Mesa Llena frente a lo que usas hoy</h2><p class="lead">Sin letra pequeña.</p>
    <table class="l-tabla"><tr><th></th><th>Teléfono</th><th>TheFork</th><th>CoverManager</th><th class="me">Mesa Llena</th></tr>
    <tr><td>Comisión por comensal</td><td class="ok">0 €</td><td class="ko">hasta 2 €</td><td class="ok">0 €</td><td class="me ok">0 €</td></tr>
    <tr><td>Recordatorios por WhatsApp</td><td class="ko">no</td><td class="ko">solo email</td><td class="ok">sí</td><td class="me ok">sí</td></tr>
    <tr><td>Los datos del cliente son tuyos</td><td class="ok">sí</td><td class="ko">no</td><td class="ok">sí</td><td class="me ok">sí</td></tr>
    <tr><td>Precio por local</td><td>—</td><td>desde 79 €</td><td>desde 89 €</td><td class="me">desde 39 €</td></tr>
    <tr><td>Permanencia</td><td>—</td><td class="ko">12 meses</td><td class="ko">6 meses</td><td class="me ok">ninguna</td></tr></table></div>`,
  precios: plan => `<div class="l-sec"><div class="eyebrow">Precios</div><h2>Claros, por local y sin comisiones</h2><p class="lead">IVA no incluido. Sin permanencia.</p>
    <div class="l-planes">
      <div class="l-plan ${plan === 'basico' ? 'hi' : ''}">${plan === 'basico' ? '<span class="rib">recomendado para ti</span>' : ''}<h3>Básico</h3><div class="pr">39 €<small>/local/mes</small></div><ul><li>Reservas web y Google</li><li>Recordatorios por WhatsApp</li><li>1 local</li></ul><a class="l-btn ${plan === 'basico' ? '' : 'sec'}" href="#form">Empezar prueba</a></div>
      <div class="l-plan ${plan === 'pro' ? 'hi' : ''}">${plan === 'pro' ? '<span class="rib">recomendado para ti</span>' : ''}<h3>Pro</h3><div class="pr">79 €<small>/local/mes</small></div><ul><li>Todo lo del Básico</li><li>Lista de espera y campañas</li><li>Reseñas y fidelización</li><li>Hasta 5 locales</li></ul><a class="l-btn ${plan === 'pro' ? '' : 'sec'}" href="#form">Empezar prueba</a></div>
      <div class="l-plan ${plan === 'grupos' ? 'hi' : ''}">${plan === 'grupos' ? '<span class="rib">recomendado para ti</span>' : ''}<h3>Grupos</h3><div class="pr">a medida<small> desde 10 locales</small></div><ul><li>Panel multi-local</li><li>Implantación en 48 h</li><li>Responsable de cuenta</li><li>SLA y facturación única</li></ul><a class="l-btn ${plan === 'grupos' ? '' : 'sec'}" href="#form">Pedir propuesta</a></div>
    </div></div>`,
  roi: locales => `<div class="l-sec"><div class="eyebrow">Calculadora</div><h2>¿Cuánto dinero recuperas?</h2><p class="lead">Estimación con un ticket medio de 28 € por comensal y un 40 % menos de no-shows.</p>
    <div class="l-roi"><div>
      <label>Locales <input type="range" class="roi" data-r="loc" min="1" max="30" value="${locales}"><output>${locales}</output></label>
      <label>Cubiertos al día por local <input type="range" class="roi" data-r="cub" min="20" max="300" step="10" value="120"><output>120</output></label>
      <label>No-shows actuales (%) <input type="range" class="roi" data-r="ns" min="2" max="30" value="12"><output>12</output></label>
    </div><div class="res"><b id="roi-res">—</b><span>recuperados al mes, aprox.</span></div></div></div>`,
  faq: () => `<div class="l-sec l-faq"><div class="eyebrow">Dudas</div><h2>Preguntas frecuentes</h2>
    <details><summary>¿Tengo que dejar TheFork o Google para usar Mesa Llena?</summary><p>No. Puedes mantenerlos y centralizar todo en un solo panel. Muchos clientes acaban dejando las comisiones cuando ven que el 70 % de las reservas ya entran directas.</p></details>
    <details><summary>¿Qué pasa con mis reservas actuales?</summary><p>Las importamos nosotros el día de la activación. No pierdes ninguna.</p></details>
    <details><summary>¿Hay permanencia?</summary><p>No. Se factura mes a mes y puedes cancelar desde el panel.</p></details>
    <details><summary>¿Funciona para varios locales?</summary><p>Sí, el plan Pro cubre hasta 5 y el plan Grupos añade panel multi-local y responsable de cuenta.</p></details></div>`,
  form: (formK, form, senales) => {
    const campos = formK === 'solo_email' ? `<input placeholder="Tu email" type="email"><a class="l-btn" href="#">${form.c}</a>`
      : formK === 'corto' ? `<input placeholder="Nombre"><input placeholder="Email" type="email"><input placeholder="Nombre del restaurante"><a class="l-btn" href="#">${form.c}</a>`
      : `<div class="g2"><input placeholder="Nombre y apellidos"><input placeholder="Email de empresa" type="email"></div><div class="g2"><input placeholder="Teléfono"><input placeholder="Empresa" value="${esc((senales.empresa_identificada || '').split(' (')[0])}"></div><div class="g2"><input placeholder="Nº de locales" value="${senales.num_locales || ''}"><select><option>Fecha preferida para la demo</option><option>Mañana 10:00</option><option>Mañana 16:00</option><option>Jueves 10:00</option></select></div><a class="l-btn" href="#">${form.c}</a>`;
    return `<div class="l-sec" id="form"><div class="l-form"><div><h2>${form.h}</h2><p>${form.p}</p></div><form onsubmit="return false">${campos}<div class="tiny">Al enviar aceptas la política de privacidad. Nada de spam.</div></form></div></div>`;
  },
  whatsapp: () => `<a class="l-wa" href="#">💬 WhatsApp con Carlos</a>`,
  footer: () => `<div class="l-foot"><span>© Mesa Llena · Valencia</span><span>Privacidad · Condiciones · Cookies</span></div>`,
};


function renderLanding(r, senales, cambios = new Set(), explicar = true) {
  const si = k => ans(r, k)?.noul >= 0.5;            // pregunta sí/no  → true / false
  const elige = k => ans(r, k)?.choice;              // pregunta choice → opción elegida
  const partes = [];
  const pinta = (id, k, html) => partes.push(bloque(id, k, r, html, cambios.has(id) ? 'changed' : ''));  // añade un bloque

  const hero = TXT.hero[elige('angulo_hero')] || TXT.hero.educativo;
  const ctaK = elige('cta_principal') || 'prueba_gratis';
  const cta = TXT.cta[ctaK];
  const locales = senales.num_locales || 3;

  pinta('nav', null, B.nav(cta, si('mostrar_precios')));
  pinta('hero', 'angulo_hero', B.hero(hero, cta, ctaK, si('mostrar_video')));
  if (si('mostrar_video')) pinta('video', 'mostrar_video', B.video());
  if (si('descuento')) pinta('oferta', 'descuento', B.oferta());
  if (si('contacto_humano')) pinta('humano', 'contacto_humano', B.humano(locales));
  if (si('mostrar_como_funciona')) pinta('pasos', 'mostrar_como_funciona', B.pasos());
  const social = elige('prueba_social');
  if (social && social !== 'ninguna') pinta('social', 'prueba_social', B.social[social]());
  if (si('mostrar_comparativa')) pinta('comparativa', 'mostrar_comparativa', B.comparativa());
  if (si('mostrar_precios')) pinta('precios', 'mostrar_precios', B.precios(elige('plan_destacado')));
  if (si('mostrar_roi')) pinta('roi', 'mostrar_roi', B.roi(locales));
  if (si('mostrar_faq')) pinta('faq', 'mostrar_faq', B.faq());
  pinta('form', 'formulario', B.form(elige('formulario'), TXT.form[ctaK], senales));
  if (si('contacto_humano')) pinta('wa', null, B.whatsapp());
  pinta('foot', null, B.footer());

  return `<div class="landing mesallena ${explicar ? '' : 'no-tags'}">${partes.join('')}</div>`;
}


const BLOQUE_DE = { hero: ['angulo_hero', 'cta_principal', 'mostrar_video'], video: ['mostrar_video'], oferta: ['descuento'], humano: ['contacto_humano'], pasos: ['mostrar_como_funciona'], social: ['prueba_social'], comparativa: ['mostrar_comparativa'], precios: ['mostrar_precios', 'plan_destacado'], roi: ['mostrar_roi'], faq: ['mostrar_faq'], form: ['formulario'] };

// Resumen de bloques para la vista «Comparar» (etiqueta, activo)
function resumenBloques(r) {
  const si = k => ans(r, k)?.noul >= .5, el = k => ans(r, k)?.choice;
  return [['vídeo', si('mostrar_video')], ['pasos', si('mostrar_como_funciona')], ['social: ' + el('prueba_social'), el('prueba_social') !== 'ninguna'], ['comparativa', si('mostrar_comparativa')], ['precios', si('mostrar_precios')], ['ROI', si('mostrar_roi')], ['FAQ', si('mostrar_faq')], ['oferta', si('descuento')], ['humano', si('contacto_humano')], ['form: ' + el('formulario'), true], ['CTA: ' + el('cta_principal'), true]];
}

export default {
  id: 'mesallena', nombre: 'Mesa Llena', tipo: 'B2B', url: 'mesallena.app', emoji: '🍽️',
  descripcion: 'Software de reservas y anti no-show para restaurantes',
  tema: { '--l-brand': '#e8552b', '--l-brand2': '#ffb347', '--l-soft': '#fff4ee' },
  NEGOCIO, PREGUNTAS, PERFILES, LAB, ETIQ, renderLanding, BLOQUE_DE, resumenBloques,
};
