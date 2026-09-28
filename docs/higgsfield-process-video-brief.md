# Runestone — prompt Higgsfield (15 segundos)

El sitio usa **un solo MP4 de 15 segundos**. Al entrar se ve el inicio (hero). Al hacer scroll, el mismo archivo avanza y la web muestra el texto de cada paso encima. El video no lleva títulos.

El sitio parte el archivo en **9 partes iguales**, sin importar la duración total. Con 15 s, cada parte dura **1.67 s**:

- 0:00.00–0:01.67 hero
- 0:01.67–0:03.33 paso 01
- 0:03.33–0:05.00 paso 02
- 0:05.00–0:06.67 paso 03
- 0:06.67–0:08.33 paso 04
- 0:08.33–0:10.00 paso 05
- 0:10.00–0:11.67 paso 06
- 0:11.67–0:13.33 paso 07
- 0:13.33–0:15.00 paso 08

Una foto por parte, tomada de las que se cargaron. Así el movimiento de cámara se alcanza a ver dentro de los 15 s.

## Regla de Higgsfield

Cada foto es un clip aparte. Sube **esa foto como start frame y como end frame**. La imagen queda idéntica. Solo se mueve la cámara, muy poco.

| Salida | Valor |
|---|---|
| Por clip | El mínimo que permita Higgsfield. En el montaje se recorta a **1.67 s** |
| Movimiento | Intensidad 1. Empuje de unos 4 %. Horizonte fijo |
| Montaje final | **15.00 s** exactos. Nueve cortes secos de 1.67 s |
| Archivo | Sustituye `public/media/process-placeholder.mp4` |

## Prompt base

Pégalo en cada clip. Cambia solo la última línea.

```text
Animate this exact uploaded photograph. Keep every pixel of the scene identical from the first frame to the last frame: architecture, furniture, plants, water, sky, clouds, the house number 1108, reflections, colors, lighting, and framing. The uploaded photo is both the start frame and the end frame. Camera motion only, motion strength 1, horizon locked, 16:9, 24fps, silent. No redesign, no morph, no new objects, no people, no text, no logo, no day-to-night change, no furniture swap.
```

## Las 9 fotos, en orden

Archivos en `/Volumes/jcdeleon/Descargas/1108`.

1. **Hero** `1-Front Exterior 1 of 3.JPG` — Very slow push-in, about 4% closer to the facade. Palms stay as in the photo.
2. **01 Consultation** `5-Front Entrance 1 of 2.JPG` — Very slow push toward the wood door. Fountains stay exactly as photographed.
3. **02 Site Evaluation** `0-Aerial Front Exterior 1.JPG` — Very slow forward drift. No orbit, no spin, no descent.
4. **03 Design** `8-Living Room 1 of 2 -VS.JPG` — Very slow drift to the right, about 4%.
5. **04 Permitting** `23-Den - VS.JPG` — Very slow push-in through the glass opening, about 4%.
6. **05 Construction** `19-Kitchen 3 of 5.JPG` — Very slow lateral slide along the cabinets, about 4%.
7. **06 Quality Control** `28-Primary Bathroom 1 of 3.JPG` — Very slow push toward the vanity, about 4%.
8. **07 Final Walkthrough** `26-Primary Bedroom 2 of 3 -VS.JPG` — Very slow push toward the bed, about 4%.
9. **08 Project Delivery** `49-Lanai 1 of 4 -VS.JPG` — Very slow push toward the pool, about 4%.

## Montaje

1. Recorta cada clip a **1.67 s** (el centro del movimiento).
2. Únelos en el orden de arriba, corte seco, sin fundido.
3. Exporta H.264, `yuv420p`, sin audio, `+faststart`, **15.00 s**.
4. Reemplaza `public/media/process-placeholder.mp4`.
