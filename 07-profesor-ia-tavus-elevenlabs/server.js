// Backend mínimo del profesor de ajedrez con avatar en tiempo real.
//
// Qué hace:
//   - Abre una conversación en Tavus CVI (el avatar que te ve, te escucha y te responde)
//   - Le pasa el contexto de TU partida para que hable con datos concretos
//   - La cierra al colgar, para no malgastar minutos
//
// Las claves se leen del .env y NUNCA llegan al navegador.
// Arranque:  npm start
import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const TAVUS      = process.env.TAVUS_API_KEY;
const EL         = process.env.ELEVENLABS_API_KEY;
const REPLICA_ID = process.env.TAVUS_REPLICA_ID || "rfe12d8b9597"; // "Nathan - Bookshelf" (réplica de stock)
const PERSONA_ID = process.env.TAVUS_PERSONA_ID;                   // la creas tú con: npm run persona
const VOICE_ID   = process.env.EL_VOICE_ID || "RxPoOxDaJiOdJGnMMaql";

// ---------------------------------------------------------------------------
// CONTEXTO DE LA PARTIDA  ←  esto es lo que hace que el profe no diga vaguedades.
//
// Cámbialo por el de tu partida. Cuanto más concreto, mejor habla:
// dale el PGN, dile quién ganó, cuál fue el peor momento y qué debió jugarse.
// Es lo que convierte "deberías pensar más tus jugadas" en
// "en la jugada 20 pasaste de +0.97 a -0.17; lo bueno era c6".
// ---------------------------------------------------------------------------
const GAME_CONTEXT = process.env.GAME_CONTEXT || [
  "Vas a analizar esta partida del usuario. Jugaba con NEGRAS y GANO, blitz 3+0. PGN: ",
  "1.d4 d6 2.c4 e6 3.e4 Ne7 4.Nf3 f5 5.exf5 Nxf5 6.Bg5 Be7 7.Bxe7 Qxe7 8.g3 O-O 9.Be2 Bd7 ",
  "10.O-O Be8 11.Nc3 Nd7 12.Rc1 Nh6 13.Bd3 Bh5 14.Be2 Rf7 15.Rc2 Raf8 16.Nh4 Bxe2 17.Qxe2 g5 ",
  "18.Ng2 Nf5 19.Qd2 Rg7 20.Nb5 Nb6 21.Nxa7 Qf6 22.Nb5 c6 23.Nc3 Nxd4 24.Qe3 Nxc2. ",
  "CLAVES: partida limpia, CERO errores graves del usuario. Salio bien de la apertura (-0.21 tras 10 jugadas). ",
  "Su PEOR momento fue la jugada 20 (20...Nb6): la evaluacion paso de +0.97 a -0.17; lo mejor era 20...c6. ",
  "La jugo con prisa, 86 segundos. GANO porque el rival fallo en la jugada 23 (23.Nc3), que permitio ",
  "23...Nxd4 y 24...Nxc2 ganando material. ",
  "IMPORTANTE: al explicar una jugada, DI SIEMPRE EN VOZ ALTA su numero (por ejemplo 'en la jugada 20') ",
  "para que el usuario la localice en el tablero. El usuario jugaba con NEGRAS.",
].join("");

// Log de depuración: el frontend manda aquí sus líneas y salen por consola.
app.post("/api/log", (req, res) => {
  console.log("[front]", String((req.body && req.body.m) || "").slice(0, 300));
  res.json({ ok: true });
});

// Lista las voces que existen en tu cuenta de ElevenLabs, para elegir un EL_VOICE_ID válido.
// La clave no sale de aquí.
app.get("/api/voices", async (req, res) => {
  try {
    if (!EL) return res.status(500).json({ error: "Falta ELEVENLABS_API_KEY en .env" });
    const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": EL } });
    const j = await r.json();
    const voices = (j.voices || []).map(v => ({
      id: v.voice_id, name: v.name, category: v.category,
      lang: (v.labels && (v.labels.language || v.labels.accent)) || "",
    }));
    res.status(r.status).json({ count: voices.length, voices });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Arranca la conversación. Devuelve {roomUrl, sessionId}; el front se une con Daily.co.
app.post("/api/converse", async (req, res) => {
  try {
    if (!TAVUS)      return res.status(500).json({ error: "Falta TAVUS_API_KEY en .env" });
    if (!PERSONA_ID) return res.status(500).json({ error: "Falta TAVUS_PERSONA_ID en .env — créala con: npm run persona" });

    const replicaId = (req.body && req.body.replicaId) || REPLICA_ID;
    const r = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": TAVUS },
      body: JSON.stringify({
        replica_id: replicaId,
        persona_id: PERSONA_ID,
        conversation_name: "Profe Ajedrez IA",
        conversational_context: GAME_CONTEXT,
        custom_greeting: "Hola, soy tu profesor de ajedrez. Cuentame que partida quieres repasar o preguntame lo que quieras.",
        properties: {
          max_call_duration: 300,         // corte automático a 5 min — protege tus minutos
          participant_absent_timeout: 30, // corta si nadie entra en 30 s
          participant_left_timeout: 10,   // corta 10 s después de salir
          enable_recording: false,
          enable_closed_captions: false,
          language: "spanish",
        },
      }),
    });
    const j = await r.json();
    res.status(r.status).json({
      roomUrl: j.conversation_url,
      sessionId: j.conversation_id,
      ...(r.ok ? {} : { detail: j.message || JSON.stringify(j) }),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Cierra la conversación al colgar. NO te saltes esto: si no, los minutos siguen corriendo.
app.post("/api/end", async (req, res) => {
  try {
    const id = req.body && req.body.sessionId;
    if (!id) return res.status(400).json({ error: "no sessionId" });
    const r = await fetch(`https://tavusapi.com/v2/conversations/${id}/end`, {
      method: "POST", headers: { "x-api-key": TAVUS },
    });
    res.status(r.status).json({ ended: r.ok });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/health", (req, res) =>
  res.json({ ok: true, hasTavus: !!TAVUS, hasElevenLabs: !!EL, hasPersona: !!PERSONA_ID, replica: REPLICA_ID }));

app.listen(4300, () => {
  console.log("\nProfesor de ajedrez IA → http://localhost:4300\n");
  const falta = [
    !TAVUS      && "TAVUS_API_KEY",
    !EL         && "ELEVENLABS_API_KEY",
    !PERSONA_ID && "TAVUS_PERSONA_ID  (créala con: npm run persona)",
  ].filter(Boolean);
  if (falta.length) {
    console.log("⚠️  Te falta esto en el .env:");
    falta.forEach(f => console.log("     - " + f));
    console.log("\n   cp .env.example .env   y rellénalo. Instrucciones en el README.\n");
  } else {
    console.log("Claves OK ✓   Ojo: cada conversación consume minutos de Tavus.\n");
  }
});
