---
layout: default
title: "Licencia"
description: "Cómo está licenciado Board Game Clubs: MIT con restricción de Commons Clause para el código y CC BY 4.0 para los datos de clubes y eventos."
permalink: /es/licence/
---

<div class="content-page" markdown="1">

# Licencia

_Última actualización: {{ site.time | date: "%-d de %B de %Y" }}_

Board Game Clubs es código abierto. Esta página resume la licencia en lenguaje sencillo. El texto completo y legalmente vinculante está en el [archivo LICENSE]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) del repositorio. En caso de conflicto prevalece el archivo LICENSE.

## La versión corta

El código fuente del sitio se publica bajo la **MIT License** con una cláusula adicional **Commons Clause**. En claro:

- **Puedes** usarlo, copiarlo, modificarlo, ejecutar tu propia versión y compartir tus cambios.
- **No puedes** venderlo como producto o servicio. Alojarlo por una tarifa o cobrar por ejecutarlo para otros no está permitido.
- **Debes** conservar el aviso de copyright y de licencia en todas las copias o derivados.
- **Sin garantía.** El software se entrega "tal cual".
- **Los datos de clubes y eventos se licencian por separado.** Están bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es): cualquiera puede reutilizarlos siempre que cite a BoardGameClubs.org como fuente.

## Lo que permite la MIT License

La MIT License es una de las licencias de código abierto más permisivas. Bajo ella puedes:

- Usar el software para cualquier propósito.
- Copiarlo y distribuirlo.
- Modificarlo y distribuir versiones modificadas.
- Incluirlo en proyectos más grandes (incluso comerciales, sujeto a la Commons Clause de abajo).
- Sublicenciarlo.

Única condición: el aviso de copyright y el texto de la licencia deben acompañar a cualquier copia o porción sustancial del software.

## Lo que restringe la Commons Clause

La Commons Clause añade **una** restricción a la MIT License: no puedes **vender** el software.

En los términos de la licencia, "vender" significa usar los derechos concedidos por la MIT License para entregar el software a otros **a cambio de una tarifa u otra contraprestación**, incluido alojarlo para clientes que paguen, o vender consultoría/soporte cuyo valor proceda sustancialmente de este software.

En la práctica esto significa:

- Hacer funcionar tu propia copia gratuita del directorio para la comunidad local: bien.
- Hacer fork del código y aportar mejoras: bien.
- Integrar pequeñas partes en un proyecto más grande: bien.
- Montar una versión alojada de pago de este directorio y cobrar a usuarios o clubes por aparecer: no permitido sin autorización.

La Commons Clause es un [texto estandarizado y publicado](https://commonsclause.com/), mantenido por Fossa. Es deliberadamente de alcance limitado: solo restringe la venta, no el uso ni la modificación.

## Datos de clubes y eventos

Las fichas de clubes y eventos (los archivos en `_clubs/` y `_events/`, y los feeds JSON en `/api/clubs.json` y `/api/events.json`) las aporta la comunidad y se licencian por separado del código, bajo [Creative Commons Atribución 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es).

Esto significa que puedes copiar, compartir y adaptar las fichas para cualquier fin, incluso comercial, siempre que:

- **Cites la fuente.** Menciona a BoardGameClubs.org como fuente y enlaza al sitio.
- **Enlaces la licencia.** Remite a CC BY 4.0.
- **Indiques los cambios.** Señala si has modificado los datos.

Atribución sugerida: "Datos de clubes y eventos de [BoardGameClubs.org](https://boardgameclubs.org), bajo licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es)."

La Commons Clause anterior se aplica solo al software. No restringe el uso de los datos.

Al enviar o editar una ficha, ya sea mediante un formulario de GitHub, una pull request o cualquier otra vía, aceptas que tu contribución se publique bajo CC BY 4.0.

Los logotipos de clubes y eventos en `assets/images/` pertenecen a sus respectivos clubes y organizadores y no están cubiertos por ninguna de las dos licencias.

Si organizas un club y quieres actualizar o retirar tu ficha, consulta la [página de contribución]({{ "/es/contribute/" | relative_url }}) o abre un issue en GitHub.

## Software y recursos de terceros

El sitio usa varias librerías de código abierto de terceros (Leaflet, Leaflet.MarkerCluster, iconos Lucide, Jekyll y otras). Cada una se usa bajo su propia licencia. Encontrarás la lista completa en los [archivos de paquetes del repositorio]({% if site.repository %}https://github.com/{{ site.repository }}{% endif %}).

Las teselas del mapa las proporciona [CARTO](https://carto.com/), los datos son &copy; [colaboradores de OpenStreetMap](https://www.openstreetmap.org/copyright).

## Sin garantía

El software se entrega **"tal cual"**, sin garantías de ningún tipo, expresas o implícitas. Las autorías y titulares del copyright no son responsables de reclamaciones ni daños derivados del uso del software. La cláusula de exoneración completa está en el [archivo LICENSE]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}).

## Contacto

Para preguntas sobre la licencia, o si quieres usar el software de una forma que la Commons Clause pueda restringir, [abre un issue en GitHub]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}).

</div>
