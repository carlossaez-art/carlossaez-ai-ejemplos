# Ejemplos de Carlos Sáez AI

Todo el código, los prompts y los pasos de los vídeos del canal
**[Carlos Sáez AI](https://www.youtube.com/@carlossaezai)** — IA aplicada a negocio, sin humo.

Cada carpeta es un vídeo. Dentro tienes lo que hace falta para reproducirlo tú mismo.

---

## Índice

| Vídeo | Qué hay aquí |
|---|---|
| **[La IA que DECIDE, no que HABLA — 10 casos de negocio con JEV](https://youtu.be/H72rbLYLnmE)** | 🟢 [App completa](./09-jev-10-casos-de-negocio) — los 10 casos, ejecutable en local |
| **[Reels UGC con IA + TEXTO detrás del personaje](https://youtu.be/8L8LSYJ1ck8)** | 🟢 [Prompts y pasos](./10-texto-detras-del-personaje) |
| [CANVA AI contra CLAUDE SLIDES](https://youtu.be/soKaYdt8sUM) | — |
| [Creé un PROFESOR con IA y me vacila!](https://youtu.be/na6kcuRhVeg) | — |
| [Claude Slides · ¿Es el fin de CANVA, POWERPOINT O DRIVE?](https://youtu.be/voOUXMW67Hs) | — |
| [Hice 30 anuncios con GPT IMAGE 2.5 en segundos](https://youtu.be/glPIcbWTSXA) | — |
| [Claude Fable 5.1 + Higgsfield · una WEB 3D con UN prompt](https://youtu.be/WSQqBuyekIo) | — |
| [GPT 6 ASTRA vs Claude FABLE 5.1 · ¿Quién es mejor en Marketing?](https://youtu.be/fjNEwcV1CZs) | — |
| [ASTRA y FABLE 5.1, ¡JUNTOS!](https://youtu.be/a7JqzIYargQ) | — |
| [4 Herramientas Gratis para publicar tu proyecto de IA](https://youtu.be/xifDR23wems) | — |

Voy subiendo el resto. **¿Te falta el de algún vídeo? [Ábreme un issue](https://github.com/carlossaez-art/carlossaez-ai-ejemplos/issues)** y lo priorizo.

---

## Cómo se usa

```bash
git clone https://github.com/carlossaez-art/carlossaez-ai-ejemplos.git
cd carlossaez-ai-ejemplos
```

Cada carpeta tiene su propio `README.md` con las instrucciones. Los proyectos son
independientes entre sí: no hay nada que instalar en la raíz.

---

## Sobre las claves de API

Ningún proyecto trae claves, y ninguno las pide por pantalla.

Donde haga falta una, encontrarás un **`.env.example`** con los nombres de las variables
y vacío el valor. Copias el fichero a `.env`, pones la tuya, y listo:

```bash
cp .env.example .env
```

**Los `.env` están en el `.gitignore` y nunca se suben.** En los proyectos con servidor,
la clave la lee el backend y **nunca llega al navegador**.

> Si clonas esto y vas a subir tus cambios a tu propio repositorio, comprueba antes que tu
> `.env` sigue ignorado. Una clave subida a GitHub no se arregla borrándola en el commit
> siguiente: se queda en el historial y hay bots que la encuentran en segundos. Habría que rotarla.

---

## Aviso

Esto es material **didáctico**. Está hecho para que lo trastees, lo rompas y lo adaptes a lo
tuyo, no para producción tal cual. Si lo llevas a un caso real, ponle tus propios límites,
reintentos y control de errores.

Algunas APIs que se usan aquí están en fase alpha o beta y pueden cambiar sin avisar.

---

## Dudas

Si algo no arranca o no se entiende, **[abre un issue](https://github.com/carlossaez-art/carlossaez-ai-ejemplos/issues)**.
Prefiero enterarme por aquí que dejar a alguien atascado.

🎥 **[youtube.com/@carlossaezai](https://www.youtube.com/@carlossaezai)**
