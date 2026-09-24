# Profesor de ajedrez con IA — avatar que te ve, te escucha y te responde

Código del vídeo **[Creé un PROFESOR con IA y me vacila!](https://youtu.be/na6kcuRhVeg)**.

Un profesor con **cara, voz española y conversación en tiempo real**: le hablas por el micro
y te contesta hablando, mirándote, con el tablero de tu partida al lado.

No es un chat. No es un vídeo generado. Es una conversación.

**Stack:** [Tavus CVI](https://platform.tavus.io) (avatar en tiempo real) +
[ElevenLabs](https://elevenlabs.io) (voz española) + [Daily.co](https://daily.co) (la videollamada, lo pone Tavus).

---

## ⚠️ Lee esto antes de nada: los minutos

El plan gratuito de Tavus trae **unos 25 minutos de conversación AL MES**. No son 25 minutos
de uso: son 25 minutos de **reloj corriendo**, y se van volando:

- Cada prueba cuenta
- Cada toma que repites cuenta
- **Dejarte la pestaña abierta cuenta**

Este proyecto trae tres defensas puestas de fábrica, y no las quites:

| Protección | Qué hace |
|---|---|
| `max_call_duration: 300` | Corta sola a los 5 minutos |
| `participant_absent_timeout: 30` | Corta si nadie entra en 30 s |
| `/api/end` al colgar | Cierra la sesión de verdad al salir |

Y antes de ponerte a grabar:

```bash
npm run uso     # te avisa si tienes conversaciones abiertas gastando minutos ahora mismo
```

---

## Montarlo

Necesitas **Node 22+**, una cuenta de [Tavus](https://platform.tavus.io) y otra de
[ElevenLabs](https://elevenlabs.io). Ambas tienen plan gratuito.

```bash
git clone https://github.com/carlossaez-art/carlossaez-ai-ejemplos.git
cd carlossaez-ai-ejemplos/07-profesor-ia-tavus-elevenlabs
npm install

cp .env.example .env      # pega tus dos claves dentro
npm run persona           # crea TU persona -> te devuelve un persona_id
                          # pégalo en .env como TAVUS_PERSONA_ID
npm start
```

Abre **http://localhost:4300**, dale a conectar y habla.

Las claves viven solo en tu `.env`: el navegador **nunca** las ve.

---

## Las tres piezas, y por qué cada una

### 1. Tavus — la cara
Tavus CVI da el avatar fotorrealista que escucha por el micro y responde en tiempo real.
La **réplica** es la cara. Por defecto usa `rfe12d8b9597` (*"Nathan - Bookshelf"*), una réplica
de stock que ya viene con la cuenta: un profesor en su estudio. Funciona sin configurar nada.

### 2. ElevenLabs — la voz
**Esta es la pieza que la gente se salta y por la que el resultado suena a robot.**
La voz por defecto de Tavus en español no da el pego. Por eso la persona se crea con el motor
de TTS apuntando a ElevenLabs:

```js
layers: {
  tts: {
    tts_engine: "elevenlabs",
    api_key: EL,
    external_voice_id: VOICE,        // "Javier Rojas - Calm & Friendly" (ES)
    tts_model_name: "eleven_turbo_v2_5",
  },
}
```

¿Quieres otra voz? Con el servidor arrancado:

```bash
curl localhost:4300/api/voices
```

Te lista las de tu cuenta. Coges un `id` y lo pones como `EL_VOICE_ID`.

### 3. El contexto — lo que hace que no diga vaguedades

Aquí está la diferencia entre un juguete y algo útil. En `server.js`, `GAME_CONTEXT` es lo que
el profe **sabe** antes de abrir la boca: el PGN, quién ganó, cuál fue el peor momento y qué
debió jugarse.

Sin contexto te suelta *"deberías pensar más tus jugadas"*.
Con contexto te dice *"en la jugada 20 pasaste de +0.97 a -0.17; lo bueno era c6"*.

**Es texto plano. Cámbialo y tienes otro profesor.**

---

## Adaptarlo a tu partida

| Dónde | Qué cambias |
|---|---|
| `server.js` → `GAME_CONTEXT` | Lo que el profe sabe: PGN, resultado, el momento clave |
| `public/index.html` → `PGN` | La partida que se dibuja en el tablero |
| `public/index.html` → `ORIENT` | `"b"` si jugabas negras, `"w"` si blancas |
| `public/index.html` → `ANNOT` | La jugada que quieres marcar |
| `crear-persona.mjs` → `system_prompt` | Cómo habla y qué hace |

**¿Y si no te interesa el ajedrez?** Cambia esos dos textos y tienes otra cosa: un profesor de
idiomas que corrige tu pronunciación, un entrenador de entrevistas, un tutor de oposiciones.
La arquitectura es la misma; lo único específico del ajedrez son el prompt y el tablero.

---

## Lo que NO funcionó (para que no pierdas el tiempo)

La primera versión iba con **Simli**: avatar + envío manual del audio de ElevenLabs.
Funcionaba, pero había que orquestar micro → STT → LLM → TTS → avatar a mano, y el resultado
no daba el pego en conversación.

**Tavus CVI hace ese bucle entero por dentro.** Por eso el repo va con Tavus y el código de
Simli no está: sobraba.

---

## Aviso

Material **didáctico**. Trastéalo y rómpelo, pero no lo pongas en producción tal cual: le faltan
límites de uso, reintentos y control de errores.

Y vigila los minutos. En serio.

---

🎥 **[Carlos Sáez AI](https://www.youtube.com/@carlossaezai)** · ¿Dudas o se ha roto algo? Ábreme un *issue*.
