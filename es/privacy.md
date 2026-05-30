---
layout: default
title: "Privacidad"
description: "Cómo gestiona Board Game Clubs tus datos. En pocas palabras: no recopilamos información personal, no usamos cookies y no vendemos nada."
permalink: /es/privacy/
---

<div class="content-page" markdown="1">

# Política de privacidad

_Última actualización: {{ site.time | date: "%-d de %B de %Y" }}_

Board Game Clubs es un directorio gratuito, mantenido por la comunidad. Hemos diseñado el sitio para recopilar la menor cantidad posible de información sobre ti.

## La versión corta

- No te pedimos que crees una cuenta.
- No usamos cookies para rastreo ni publicidad.
- No vendemos, compartimos ni alquilamos datos.
- Usamos una herramienta de analítica respetuosa con la privacidad que no identifica a los visitantes.
- Algunas funciones (búsqueda por código postal, "Mi ubicación") envían datos a servicios de terceros, pero solo si las usas activamente.

## Lo que recopilamos

### Estadísticas de uso anónimas

Usamos [GoatCounter](https://www.goatcounter.com/) para contar las visitas al sitio. GoatCounter es un servicio de analítica de código abierto y respetuoso con la privacidad que:

- **no** usa cookies.
- **no** almacena direcciones IP (solo un hash temporal y con sal que rota cada día para deduplicar visitas).
- **no** te rastrea entre otros sitios.
- **no** vende ni comparte datos.

Lo que vemos: recuentos anónimos de páginas vistas, referrers y categorías generales de dispositivo/navegador.

Todos los detalles en la [política de privacidad de GoatCounter](https://www.goatcounter.com/help/privacy).

### Logs del servidor

El sitio está alojado en [GitHub Pages](https://docs.github.com/en/pages). GitHub puede registrar logs básicos de servidor (p. ej. direcciones IP y marcas de tiempo de las peticiones) para prevención de abuso y seguridad. Consulta la [política de privacidad de GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) para más detalles.

## Funciones opcionales con servicios de terceros

Las siguientes funciones solo se ejecutan si las usas activamente.

### Búsqueda por código postal

Si introduces un código postal en la búsqueda, lo enviamos a [Nominatim](https://nominatim.openstreetmap.org/) (el servicio de geocodificación de OpenStreetMap) para obtener las coordenadas y ordenar los clubes por distancia. No almacenamos el código postal en nuestros servidores.

### "Mi ubicación"

Si pulsas "Mi ubicación", tu navegador te pide permiso y (si lo concedes) facilita a la página tus coordenadas aproximadas, para que ordenemos los clubes por distancia. Tu ubicación se usa solo en tu navegador: **no** se envía a nuestros servidores ni a terceros. Se descarta al cerrar o recargar la página.

### Teselas del mapa

El mapa usa teselas de [CARTO](https://carto.com/) y datos de [OpenStreetMap](https://www.openstreetmap.org/). Al cargar el mapa, tu navegador descarga las imágenes de las teselas directamente desde CARTO, lo que puede registrar la información estándar de las peticiones web. Consulta el [aviso de privacidad de CARTO](https://carto.com/privacy/) y la [política de privacidad de OpenStreetMap](https://wiki.osmfoundation.org/wiki/Privacy_Policy).

### Fuentes y scripts incrustados

El sitio carga un pequeño número de recursos de terceros directamente desde CDNs (Google Fonts para tipografía, unpkg para librerías de mapa e iconos). Tu navegador hace peticiones HTTP estándar a esos servicios al cargar la página.

## Menores

El sitio es un directorio público y no está dirigido a menores de 13 años. No recopilamos a sabiendas información de menores.

## Cambios en esta política

Si cambia la forma en que el sitio trata los datos, actualizaremos esta página y la fecha de arriba.

## Contacto

El sitio lo gestionan voluntarios. Para consultas sobre privacidad, [abre un issue en GitHub](https://github.com/BoardGameClubs/BoardGameClubs/issues) o contáctanos a través de la página de contribución.

</div>
