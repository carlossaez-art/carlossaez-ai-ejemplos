# JEV — 10 casos de uso de negocio

Código del vídeo **[La IA que DECIDE, no que HABLA — 10 casos reales de negocio con JEV](https://youtu.be/H72rbLYLnmE)**.

Una app local que lanza **10 casos de negocio reales** contra [JEV](https://openrouter.ai/typesafe/jev-1.13)
(TypeSafe *System One*) y enseña la decisión, el tipo de decisión y la respuesta JSON en crudo.

> **La idea:** un LLM te devuelve texto que luego tienes que interpretar. JEV te devuelve
> **una decisión tipada** — una probabilidad, una opción de una lista cerrada o una puntuación
> en una rúbrica — con su nivel de confianza. Si lo que quieres es *enrutar, clasificar o priorizar*,
> no necesitas que la IA hable: necesitas que decida.

---

## Arrancarlo en 2 minutos

Necesitas **Node 22+** y una clave de [OpenRouter](https://openrouter.ai/keys).

```bash
git clone https://github.com/carlossaez-art/carlossaez-ai-ejemplos.git
cd carlossaez-ai-ejemplos/09-jev-10-casos-de-negocio

cp .env.example .env     # y pega tu clave dentro
npm start
```

Abre **http://localhost:4310**

No hay dependencias que instalar: el servidor usa solo módulos nativos de Node.

### Sobre la clave

La clave **vive solo en tu `.env` local** y la lee el servidor. El navegador nunca la ve:
`server.mjs` hace de proxy hacia OpenRouter. `.env` está en el `.gitignore`, así que no se sube.

---

## Los 3 tipos de decisión

Todo JEV se reduce a tres primitivas. Estos ejemplos están sacados tal cual de la app.

### 1. `noul` — probabilidad de SÍ (0 a 1)

Para preguntas de sí/no donde lo que quieres no es un "sí", sino **cuánto de sí**.

```js
listo: {
  type: 'noul',
  instructions: '¿Está listo para que le llame un comercial YA?'
}
```

Devuelve `{ noul: 0.87, confidence: ... }`. Tú decides el umbral: `>= 0.6` → llamar.

### 2. `choice` — elegir una opción de una lista cerrada

`criteria` es un **objeto**: cada clave es una opción y su valor **describe cuándo aplica**.
Esa descripción es lo que hace el trabajo, así que escríbela bien.

```js
ruta: {
  type: 'choice',
  instructions: 'Clasifica el ticket de soporte',
  criteria: {
    horario:           'pregunta por horarios de apertura o tienda física',
    estado_pedido:     'pregunta dónde está su pedido o seguimiento',
    devolucion:        'devolución, cambio o reembolso simple',
    incidencia_tecnica:'un error o fallo técnico del producto/servicio',
    queja_grave:       'queja fuerte, insultos, amenaza legal o pide un responsable'
  }
}
```

Devuelve `{ choice: 'estado_pedido', confidence: 0.93 }`.

**Truco del vídeo:** usa la `confidence` como interruptor de automatización.
Si `confidence >= 0.85` lo resuelve el bot; si no, lo ve un humano.

### 3. `score` — puntuar en una rúbrica ordenada

`criteria` es un **array ordenado** de niveles (de 2 a 10). La posición **es** la nota: el primero es 0.

```js
temperatura: {
  type: 'score',
  instructions: 'Temperatura del lead (interés real de compra)',
  criteria: ['frío', 'tibio', 'caliente']      // frío=0, tibio=1, caliente=2
}
```

Devuelve `{ score: 1.7, probabilities: [...], confidence: ... }`.

**Ojo, esto es lo bueno:** el `score` **puede caer entre dos niveles**. Un `1.7` es un lead
que ya casi está caliente. Con una clasificación normal habrías perdido ese matiz.

---

## Cómo se llama a la API

Todas las preguntas se evalúan **en paralelo contra un mismo `state`, en una sola llamada**.

```js
await fetch('https://openrouter.ai/api/alpha/decisions', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'typesafe/jev-1.13',
    state: 'Necesito una demo esta semana, mi jefe decide el viernes.',
    questions: {
      temperatura: { type:'score', instructions:'...', criteria:['frío','tibio','caliente'] },
      listo:       { type:'noul',  instructions:'¿Llamar YA?' }
    }
  })
})
```

El `state` es el contexto (el email, el ticket, la reseña…). Las `questions` son lo que
quieres decidir sobre él. Añadir preguntas **no multiplica las llamadas**.

---

## Los 10 casos incluidos

| # | Caso | Decide |
|---|---|---|
| 1 | 🎯 Ventas · Leads | temperatura (`score`) + llamar ya (`noul`) |
| 2 | 🎧 Soporte · Triaje | ruta del ticket (`choice`) |
| 3 | 💬 Moderación de comentarios | veredicto (`choice`) |
| 4 | 💡 Ideas de negocio | potencial (`score`) + viabilidad (`noul`) |
| 5 | 📬 Bandeja de entrada | prioridad (`score`) + si la respondes tú (`noul`) |
| 6 | ⭐ Reseñas | sentimiento (`score`) + responder en público (`noul`) |
| 7 | 👔 Selección de personal | encaje (`score`) + pasar a entrevista (`noul`) |
| 8 | 📉 Riesgo de baja | riesgo (`noul`) + urgencia (`score`) |
| 9 | ▶️ Titulares de YouTube | gancho (`score`) |
| 10 | 📮 Enrutado de mensajes | departamento (`choice`) |

Cada caso trae 10 ejemplos reales. El botón **`{ }` ver respuesta JEV** enseña el JSON tal cual llega.

---

## Coste y velocidad

Medido en el vídeo, con el modelo `typesafe/jev-1.13`:

- **~250–500 ms** por tanda de decisiones
- **~$0.000015** por decisión
- Los tokens de salida no se facturan

Compruébalo tú mismo: la app enseña el bloque `usage` real de cada llamada.

---

## Aviso

Esto es material **didáctico**, pensado para que lo trastees y lo adaptes. No es una librería
ni está pensado para producción tal cual. Si lo llevas a un caso real, mete tus propios límites,
reintentos y control de errores.

La API `alpha/decisions` de OpenRouter es, como dice su nombre, **alpha**: puede cambiar.

---

🎥 **[Carlos Sáez AI](https://www.youtube.com/@carlossaezai)** · ¿Dudas o se ha roto algo? Ábreme un *issue*.
