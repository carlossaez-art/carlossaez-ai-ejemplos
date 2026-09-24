# Texto detrás del personaje — sin perder el vídeo de fondo

Prompts y pasos del vídeo **[Reels UGC con IA + TEXTO detrás del personaje con VÍDEO de fondo](https://youtu.be/8L8LSYJ1ck8)**.

Se ven muchos tutoriales para poner texto detrás de una persona, **pero casi todos dejan una
foto fija de fondo**. Aquí el fondo sigue siendo el vídeo, moviéndose. Ese es el truco.

Herramientas: **Claude** (con el MCP de Higgsfield) → **Higgsfield** → **Canva**.

---

## Parte 1 — Generar el reel UGC

El prompt que se lanza desde Claude:

```
Usando el MCP de Higgsfield, quiero que me crees tres reels de diez segundos
cada uno, tipo UGC, con Gemini Omni Flash.
```

### Por qué diez segundos

Porque **[Gemini Omni Flash](https://higgsfield.ai/gemini-omni-flash)** (el modelo de vídeo de
Google) genera clips de **hasta 10 segundos**, y genera el **audio sincronizado en la misma
pasada**. Eso significa:

- La voz sale directamente buena
- **No** necesitas ElevenLabs
- **No** necesitas hacer lip-sync

Si pides un vídeo más largo, el sistema de Higgsfield se irá a otro modelo (Kling, Seedance…)
y entonces sí tendrás que montar la voz y la sincronización de labios por separado.

> **¿Quieres un vídeo de un minuto?** Haz **seis clips de diez segundos y concaténalos**.
> Pasando siempre el avatar como referencia, y si puedes, también el clip anterior.

### Por qué desde Claude y no directamente en Higgsfield

En Higgsfield es más rápido (20-30 s por clip frente a 4-5 minutos). Pero si el clip sale con
un error — una palabra repetida, un nombre mal pronunciado — **Claude lo detecta solo y pide
la corrección** al propio Higgsfield.

Hecho a mano tendrías que: detectar el fallo, localizar el segundo exacto, describirlo bien y
pedir la regeneración. En el vídeo pasó justo eso con la palabra *Merzouga* y se arregló solo.

---

## Parte 2 — El texto detrás, en Canva

El resultado que buscamos: el texto pasa **por detrás de la persona** y **el fondo sigue siendo vídeo**.

1. **Duplica** el clip. Te quedan dos capas idénticas.
2. En la capa **de arriba**, **quita el audio** y bórralo.
   *(Si no, suenan los dos a la vez y se duplican los decibelios.)*
3. En la capa **de arriba**, aplica **Quitafondos**.
4. **La capa de abajo se queda entera.** Esta es la clave: el quitafondos de vídeo no es perfecto
   y deja huecos — la capa completa de abajo los tapa, y además es la que mantiene el fondo en movimiento.
5. Añade el **texto**. Fuente alta y grande, color, efecto (neón funciona bien) y animación si quieres.
6. **Arrastra la capa de texto ENTRE las dos capas de vídeo.** Aquí aparece el efecto.
7. Ajusta la **duración del texto** hasta que el personaje sale de plano. Si lo dejas más allá,
   salen cosas raras.
8. **Exporta.**

### Si ves al personaje "duplicado" en la previsualización

Es la previsualización, no el vídeo. **Al exportar desaparece**: los fotogramas por segundo
quedan clavados. No lo intentes arreglar.

---

## Por qué Canva y no CapCut

Se puede hacer en CapCut y en otros editores. Canva es lo que mejor ha funcionado para este
efecto concreto manteniendo el vídeo de fondo.

---

🎥 **[Carlos Sáez AI](https://www.youtube.com/@carlossaezai)** · ¿Dudas o se ha roto algo? Ábreme un *issue*.
