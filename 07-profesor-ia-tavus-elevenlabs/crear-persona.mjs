// Crea TU persona de Tavus: el "cerebro + voz" del profesor.
//
// Una persona = el prompt de sistema (cómo habla y qué hace) + el motor de voz.
// Se crea UNA vez y se reutiliza. Esto NO consume minutos de conversación.
//
//   npm run persona
//
// Te devuelve un persona_id. Pégalo en tu .env como TAVUS_PERSONA_ID.
const TAVUS   = process.env.TAVUS_API_KEY;
const EL      = process.env.ELEVENLABS_API_KEY;
const REPLICA = process.env.TAVUS_REPLICA_ID || "rfe12d8b9597";
const VOICE   = process.env.EL_VOICE_ID || "RxPoOxDaJiOdJGnMMaql";

if (!TAVUS || !EL) {
  console.error("\n⚠️  Faltan claves. Necesitas TAVUS_API_KEY y ELEVENLABS_API_KEY en el .env\n");
  process.exit(1);
}

const body = {
  persona_name: "Profe Ajedrez ES",
  pipeline_mode: "full",
  // ---- Aquí defines la personalidad. Cámbialo para tu caso de uso. ----
  system_prompt:
    "Eres un profesor de ajedrez espanol, cercano y directo, sin humo. Hablas espanol de Espana. " +
    "Explicas errores, la jugada correcta y una regla practica. Respondes breve, 2-4 frases. " +
    "No uses caracteres raros ni emojis: tu salida se convierte en voz.",
  context: "Ayudas al usuario a repasar sus partidas de ajedrez y mejorar.",
  default_replica_id: REPLICA,
  layers: {
    // La voz de Tavus por defecto no convence en español. Por eso se enchufa ElevenLabs.
    tts: {
      tts_engine: "elevenlabs",
      api_key: EL,
      external_voice_id: VOICE,
      tts_model_name: "eleven_turbo_v2_5",
      voice_settings: { speed: 1.0, stability: 0.5, similarity_boost: 0.8 },
    },
  },
};

const r = await fetch("https://tavusapi.com/v2/personas", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": TAVUS },
  body: JSON.stringify(body),
});
const j = await r.json();

if (r.ok && j.persona_id) {
  console.log("\n✅ Persona creada.\n");
  console.log("   Pega esto en tu .env:\n");
  console.log("   TAVUS_PERSONA_ID=" + j.persona_id + "\n");
} else {
  console.log("\n❌ HTTP " + r.status);
  console.log(JSON.stringify(j, null, 1) + "\n");
}
