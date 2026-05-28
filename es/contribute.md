---
layout: default
title: "Añade tu club de juegos de mesa a nuestro directorio"
description: "Registra tu club de juegos de mesa en Board Game Clubs. Nuestro directorio gratuito, mantenido por la comunidad, ayuda a las personas a encontrar clubes de juegos de mesa cerca de ellas por toda Europa."
permalink: /es/contribute/
---

<div class="content-page" markdown="1">

# Añadir un club de juegos de mesa

Board Game Clubs lo mantiene la comunidad y está alojado en GitHub. Cualquiera puede añadir un nuevo club o actualizar información existente.

## Enviar a través de nuestro formulario

La forma más sencilla de añadir tu club es el formulario en GitHub. No hace falta saber nada técnico — rellena los datos y nosotros nos encargamos del resto.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Añadir un club</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Editar un club</a>
</div>

## Añadir un club mediante pull request

Si te manejas con GitHub, puedes añadir un club directamente:

### 1. Crear un nuevo archivo

[Crea un nuevo archivo](https://github.com/BoardGameClubs/BoardGameClubs_Web/new/main/_clubs) en la carpeta `_clubs/<país>/` en GitHub, donde `<país>` es el código ISO 3166-1 alpha-2 en minúsculas (`gb`, `de`, `at`, `ch`, `nl`, `be`, `it`, `pl`, `fr`, `dk`, `es`). Nombra el archivo según el esquema `nombre-de-tu-club.md` (minúsculas, guiones en lugar de espacios). Para nombres con caracteres especiales, usa equivalentes ASCII: `á→a`, `é→e`, `í→i`, `ñ→n`, `ó→o`, `ú→u` etc. (por ejemplo, `club-juegos-madrid.md`).

### 2. Copiar la plantilla

Pega lo siguiente en tu nuevo archivo y rellena los detalles. Ajusta `country` y `permalink` para que coincidan con la carpeta.

```yaml
---
country: "ES"          # ISO 3166-1 alpha-2: GB, DE, AT, CH, NL, BE, IT, PL, FR, DK, ES
permalink: /es/clubs/nombre-de-tu-club/   # Para GB: /clubs/nombre-de-tu-club/
name: "Nombre de tu club"
type: ["Board Games"]
days: ["Thursday"]
time: "19:00 - 22:00"
frequency: "Weekly"
location:
  name: "Local"
  address: "Dirección completa, CP, ciudad"
  lat: 40.4168
  lng: -3.7038
cost: "Free"
age_restriction: ""
image: ""
website: ""
meetup: ""
facebook: ""
discord: ""
bgg: ""
description: >-
  Una breve descripción de tu club. ¿A qué juegan?
  ¿Aceptáis recién llegados? Otra información útil.
---
```

Los clubes británicos usan `permalink: /clubs/nombre-de-tu-club/`. Los clubes del resto de países usan `/<país>/clubs/nombre-de-tu-club/`, por ejemplo `/es/clubs/...`, `/de/clubs/...`, `/fr/clubs/...`.

### 3. Rellenar los campos

| Campo | Descripción |
|------|-------------|
| `country` | Código ISO 3166-1 alpha-2: `GB`, `DE`, `AT`, `CH`, `NL`, `BE`, `IT`, `PL`, `FR`, `DK`, `ES` |
| `permalink` | `/clubs/slug-de-tu-club/` para GB; `/<país>/clubs/slug-de-tu-club/` para el resto |
| `name` | Nombre completo del club |
| `type` | Array de tipos, p. ej. `["Board Games"]`. Opciones: "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Días de reunión (en inglés), p. ej. `["Thursday"]` o `["Monday", "Friday"]` |
| `time` | Horario de la reunión, p. ej. "19:00 - 22:00" |
| `frequency` | "Weekly", "Fortnightly", "Monthly" o "Ad-hoc" |
| `location` | Local, dirección completa con CP, coordenadas |
| `cost` | "Free" o un importe en moneda local, p. ej. "€3", "£2", "CHF 5", "kr 20", "zł 10", "€5 (primera sesión gratis)" |
| `age_restriction` | Edad mínima, p. ej. "18+". Dejar vacío si no hay |
| `image` | URL o nombre de archivo en `assets/images/clubs/` |
| `website` | Enlace al sitio del club |
| `meetup` | Enlace al grupo de Meetup |
| `facebook` | Enlace a la página o grupo de Facebook |
| `discord` | Enlace de invitación a Discord |
| `bgg` | Enlace al gremio o grupo de BoardGameGeek |
| `description` | Texto libre. Se admite Markdown sencillo — líneas en blanco separan párrafos, líneas que empiezan con `-` se convierten en listas. Ver ejemplos abajo. |

### Formatear la descripción

El campo `description` se renderiza como Markdown, así que puedes usar párrafos y listas. Mantén la sangría de dos espacios del block scalar YAML — si no, Jekyll se queja.

```yaml
description: |
  Somos un grupo abierto y nos reunimos en el centro de Madrid.
  Los recién llegados son siempre bienvenidos, explicamos las reglas.

  Una sesión típica:

  - Un eurogame intermedio para empezar
  - Más tarde juegos de cartas o party games más ligeros
  - Suficientes descansos y tiempo para charlar

```

La notación `>-` de la plantilla une los saltos de línea en un solo párrafo — bien para una descripción corta. Cambia a `|` (como arriba) si quieres conservar párrafos y listas.

### 4. Encontrar las coordenadas

Cómo encontrar la latitud y longitud de tu local:

1. Abre [OpenStreetMap](https://www.openstreetmap.org)
2. Busca la dirección
3. Clic derecho sobre el mapa → "Mostrar dirección"
4. Las coordenadas aparecen en la URL (lat y lng)

### 5. Añadir un logo

Puedes añadir un logo o imagen para tu club:

1. Sube tu imagen a `assets/images/clubs/` en el repositorio (PNG o JPG, idealmente cuadrada y menor de 200 KB)
2. En el archivo del club, ajusta el campo `image` con el nombre del archivo, p. ej. `image: "logo-de-tu-club.png"`

También puedes usar una URL directa a una imagen alojada externamente, p. ej. `image: "https://example.com/logo.png"`.

### 6. Enviar pull request

Haz commit de tu archivo y [abre una pull request](https://github.com/BoardGameClubs/BoardGameClubs_Web/pulls). La revisaremos y la integraremos.

## ¿Tu país no está en la lista?

Actualmente listamos clubes en Reino Unido, Alemania, Austria, Suiza, Países Bajos, Bélgica, Italia, Polonia, Francia, Dinamarca y España. Si tu club está en otro sitio, [abre un issue](https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new) — añadir un nuevo país es un cambio pequeño y lo hacemos con gusto.

## Actualizar un club existente

Encuentra el archivo del club en la [carpeta `_clubs/` en GitHub](https://github.com/BoardGameClubs/BoardGameClubs_Web/tree/main/_clubs), haz tus cambios y envía una pull request. O bien **[abre directamente una solicitud de cambio](https://github.com/BoardGameClubs/BoardGameClubs_Web/issues/new?template=edit-club.yml)** y lo actualizamos nosotros.

</div>
