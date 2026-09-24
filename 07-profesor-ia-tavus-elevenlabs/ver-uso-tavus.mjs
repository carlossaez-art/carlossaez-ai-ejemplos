// Cuánto has gastado de Tavus.
//
// El plan gratuito trae ~25 minutos de conversación AL MES y se van volando:
// cada prueba, cada toma que repites, cada vez que te dejas la pestaña abierta.
// Ejecuta esto ANTES de ponerte a grabar.
//
//   npm run uso
const TAVUS = process.env.TAVUS_API_KEY;
if (!TAVUS) { console.error("\n⚠️  Falta TAVUS_API_KEY en el .env\n"); process.exit(1); }

const r = await fetch("https://tavusapi.com/v2/conversations?limit=100", {
  headers: { "x-api-key": TAVUS },
});
if (!r.ok) { console.error("HTTP " + r.status, await r.text()); process.exit(1); }

const list = (await r.json()).data || [];
const activas = list.filter(c => c.status === "active");

console.log("\nConversaciones registradas: " + list.length);

if (activas.length) {
  console.log("\n🔴 TIENES " + activas.length + " CONVERSACION(ES) ABIERTA(S) — están gastando minutos AHORA:");
  activas.forEach(c => console.log("     " + c.conversation_id));
  console.log("\n   Ciérralas:");
  activas.forEach(c =>
    console.log(`     curl -X POST https://tavusapi.com/v2/conversations/${c.conversation_id}/end -H "x-api-key: $TAVUS_API_KEY"`));
} else {
  console.log("✅ Ninguna conversación abierta.");
}

console.log("\nÚltimas 12:\n");
for (const c of list.slice(0, 12)) {
  const fecha = (c.created_at || "").slice(0, 16).replace("T", " ");
  console.log(`  ${fecha}  ${String(c.status).padEnd(10)}  ${c.conversation_id}`);
}
console.log("\nEl total de minutos consumidos solo lo da el panel: https://platform.tavus.io\n");
