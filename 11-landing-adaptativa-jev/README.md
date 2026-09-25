# Landing adaptativa — la web que se pinta sola para cada visitante

Código del vídeo **[Landing Pages con IA: JEV + CLAUDE crean webs ULTRAPERSONALIZADAS](https://youtu.be/j3uyWpB0Ay0)**.

**La misma landing se pinta distinta según la probabilidad de que el visitante convierta.**
Quien decide qué bloques mostrar no es una regla escrita a mano, sino **Jev 1.13** (TypeSafe AI) a través de OpenRouter:
una sola llamada, 15 decisiones tipadas con probabilidad, unos 300 ms y un coste de ~0,00007 $.

Dos negocios inventados, cada uno en su ruta:

| Ruta | Negocio | Tipo | Perfiles |
|---|---|---|---|
| `/` | **Mesa Llena**, software de reservas y anti no-show para restaurantes | B2B | Lucía (curiosa), Marcos (comparador), Grupo Andana (decidido) |
| `/ejemplo-2` | **Duermevela**, colchones vendidos solo online con 100 noches de prueba | B2C | Noa (curiosa), Elena (comparadora), Javier (decidido, carrito abandonado) |
| `/visor` | **Modo visor para grabar**: landing a pantalla completa, sin panel, con un desplegable flotante de visitante y de web (`/visor?e=duermevela`) | — | los del escenario elegido |

El sistema visual de las landings está en `public/landing.css` (base compartida + identidad por marca: `.mesallena` y `.duermevela`).
Cada escenario vive en `public/escenarios/<id>.js`: contexto del negocio, preguntas para Jev, perfiles, controles del laboratorio,
piezas HTML y su `renderLanding()`. Para añadir un tercero basta con copiar uno y registrarlo en `RUTAS` de `public/app.js` y en `server.mjs`.

## Arranque

```bash
git clone https://github.com/carlossaez-art/carlossaez-ai-ejemplos.git
cd carlossaez-ai-ejemplos/11-landing-adaptativa-jev

cp .env.example .env     # pega tu clave de https://openrouter.ai/keys
npm start
```

Abre http://localhost:4360. Sin dependencias; Node 22+.

## Cómo funciona

1. Eliges quién entra en la web (teclas `1` `2` `3`):
   - **Lucía, la curiosa**: reel de Instagram, móvil, domingo 23:14, primera visita, 8 segundos.
   - **Marcos, el comparador**: Google «software reservas restaurante precio», segunda visita, ya vio precios, abandonó el formulario.
   - **Grupo Andana, el decidido**: email post-demo, 14 locales, sexta visita, descargó las condiciones, oportunidad en fase propuesta.
2. Las señales del visitante (lo que cualquier web sabe: fuente, dispositivo, visitas, scroll, páginas vistas, empresa por IP, CRM…)
   se envían como `state` a Jev junto con el contexto del negocio.
3. Jev responde **15 o 16 preguntas tipadas** en paralelo (en el escenario): si va a convertir, la etapa de compra, el ángulo del titular,
   la CTA principal, si mostrar vídeo, cómo funciona, qué prueba social, comparativa, precios, plan destacado, calculadora ROI,
   longitud del formulario, oferta con fecha límite, contacto humano y FAQ.
4. La landing se renderiza a partir de esas decisiones. Cada bloque lleva una etiqueta con la decisión y su probabilidad (tecla `E` para ocultarlas).

## Atajos de teclado

- `V` abre **Código en vivo**: a la izquierda se muestra el código real de `renderLanding()` (leído con `toString()`, no una copia)
  y se recorre línea a línea con las respuestas de JEV: cada `if` se pone en verde (se ejecuta) o rojo (se salta) con la
  decisión y su probabilidad al lado, y el bloque correspondiente aparece en la landing en ese mismo instante. Slider de velocidad y botón «Repetir».
- `L` abre el laboratorio de señales (también con el botón morado del panel).

- `P` oculta el panel y deja la landing a pantalla completa (lo que vería el visitante).
- `C` muestra las tres landings lado a lado con la probabilidad de conversión de cada una.
- **Ajustar señales** abre el laboratorio: mueve «segundos en página», «veces que vio precios» o marca «ya hizo una demo»
  y la landing se recompone en vivo; los bloques que cambian parpadean en naranja y las filas de decisiones cambiadas se marcan.
- El panel muestra latencia, tokens, coste acumulado y el modelo real que ha respondido.

## Garantías

- La clave vive en `.env` y sólo la lee el proceso Node; el navegador llama a `/api/decide`.
- Si la API falla, se muestra el error: **no se inventan decisiones**.
- Cada decisión que ves en pantalla viene literalmente de la respuesta de Jev (`answers.<pregunta>`); el mapeo decisión → bloque está en `renderLanding` de cada escenario.

## Nota honesta

Jev no «sabe» que Lucía no va a comprar: estima una probabilidad calibrada a partir de las señales que le damos.
Con las mismas señales, un LLM generativo tardaría segundos y devolvería texto que habría que parsear; Jev devuelve
directamente el tipo pedido (sí/no, opción, nivel) con su probabilidad, que es lo que hace viable decidir la UI en el tiempo de carga de la página.

---

🎥 **[Carlos Sáez AI](https://www.youtube.com/@carlossaezai)** · ¿Dudas o se ha roto algo? Ábreme un *issue*.
