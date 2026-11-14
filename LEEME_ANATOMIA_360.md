# LEGADO CÓSMICO · Anatomía Espacial 360°

## Ejecutar
1. Extrae el ZIP completo y abre la carpeta Hackaton en Visual Studio Code.
2. Ejecuta index(1).html con Live Server. Selecciona idioma y abre «Ver en 360°» de Opportunity o Cassini.
3. Pulsa una marca roja numerada o un componente de la lista. Continúa girando y acercando manualmente el modelo; la selección solo pausa el giro automático. Puedes reanudarlo con el botón superior.
4. Usa Marcas: activadas/ocultas y el contador de componentes. Las marcas de la cara posterior se atenúan. El panel pasa debajo del visor en móvil.

## Ajuste de marcas
Las coordenadas iniciales se calcularon sobre triángulos de los GLB del ZIP Hackaton(2), identificando las piezas por mallas/materiales y vistas ortográficas de su geometría. No son puntos de una imagen plana. Como no se pudo cargar la biblioteca externa model-viewer en el entorno de pruebas, verifica visualmente la alineación con el visor real. Si deseas cambiar una marca, selecciona el componente, abre «Ajustar posición de una marca», activa el ajuste, gira el modelo si hace falta y pulsa directamente sobre la superficie. Se guardará en localStorage del navegador (no modifica el GLB). Usa «Restaurar marcas originales» para borrar los ajustes de esa nave. Si necesitas compartir una corrección con otros dispositivos, copia su posición y normal guardadas del objeto lc-anatomy-v1 de localStorage a COORDS en anatomia-espacial.js.

## Archivos
- anatomia-espacial.js: información bilingüe, coordenadas, panel, progreso y controles.
- anatomia-espacial.css: estilos exclusivos del visor de las dos naves.
- index(1).html: dos referencias añadidas para conectar los archivos. Todo el resto de los archivos originales se conserva byte por byte.

Para desinstalar, elimina las dos referencias anteriores del HTML y los dos nuevos archivos. Los GLB no fueron modificados.

## Pruebas y limitaciones
- Comprobación de sintaxis JavaScript y pruebas de interfaz en Chromium con un sustituto de pruebas de model-viewer; se verificaron selección, traducción, ocultar/mostrar marcas, progreso, pausa/reanudación del giro, ajuste/restauración simulado, diseño móvil y cierre.
- No fue posible cargar el CDN de model-viewer ni probar el renderizado WebGL real. Tu proyecto original sigue dependiendo del CDN para el visor. Los modelos nuevos son locales y se mantienen intactos.
- Las rutas a opportunity-demo.glb y cassini-demo.glb de respaldo ya existían en el código original, pero esos archivos no están en Hackaton(2).zip. No las cambiamos. Mientras los GLB principales carguen, no son necesarias.
- Fuentes de información: https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/ ; https://science.nasa.gov/mission/cassini/spacecraft/cassini-orbiter/ ; documentación https://modelviewer.dev/examples/annotations/ .
