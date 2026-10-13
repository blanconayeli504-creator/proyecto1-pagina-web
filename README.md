# Dulce Nube Leonel - Sitio Web Oficial

**Estudiante:** [Nayeli Blanco Miranda]
**Cliente:** Dulce Nube Leonel (Gomitas artesanales)

## Qué resuelve
El sitio web ayuda a la microempresa a mostrar sus gomitas artesanales de pulpa natural, informar sobre sus horarios de atención, publicar una tabla clara de precios y permitir que los clientes hagan sus pedidos en línea con un formulario sencillo.

## Cómo está construido
- **Semántica:** Usé etiquetas estructuradas de HTML5 como `<header>` para el título y la navegación con lista desordenada (`<ul>`, `<li>`, `<a>`), `<main>` para albergar el contenido principal, y un elemento contenedor `<div>` con la clase `contenido-bloque` para agrupar dinámicamente las secciones de la página. Dentro de él se encuentran `<section>` con identificadores específicos (`#nuestras-gomitas`, `#horarios`, `#precios`, `#pedido`), etiquetas `<article>` para la presentación individual de cada producto, una tabla (`<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`) para los precios junto con una imagen descriptiva (`<figure>`, `<img>`, `<figcaption>`), y un formulario estructurado con `<form>`, `<fieldset>`, `<legend>`, `<label>`, distintos tipos de `<input>`, `<select>`, `<textarea>` y casillas de verificación. Se completa con un `<aside>` para el bloque informativo ("¿Sabías?") y un `<footer>` con datos de contacto (`<address>`) y derechos reservados.
- **Layout:** Usé **Flexbox** en el `<header>` y en la lista del menú (`nav ul`) para alinear y centrar los botones con `justify-content: center` y `flex-wrap: wrap`, y en los `<article>` para acomodar su contenido en columna de manera equilibrada. Usé **CSS Grid** en la sección `#productos` con `repeat(auto-fit, minmax(16rem, 1fr))` para las tarjetas de productos y en el diseño general del `body` mediante `grid-template-areas` y media queries para la distribución de los elementos.
- **Diseño:** Elegí una paleta de tonos tierra definida mediante variables CSS en `:root` (`--color-principal: #a65b32` terracota, `--color-acento: #c87941`, `--color-fondo: #fbf8f5`, entre otros) para transmitir una identidad artesanal y natural. Para las fuentes utilicé tipografías del sistema (`system-ui`) garantizando legibilidad y un rendimiento óptimo.

## Capturas
![Escritorio](ruta/a/captura-escritorio.png)
![Móvil 375px](ruta/a/captura-movil.png)

## Lo más difícil
Lo que más me costó fue hacer que el sitio se adapte bien a diferentes pantallas sin que se desordene. Al principio, cuando ponía el menú en celulares, los botones se salían o quedaban apretados, lo cual arreglé agregando `flex-wrap: wrap` y `justify-content: center` en `nav ul` para que bajen solos y queden centrados. 

También tuve un problema con la sección del `<aside>` ("¿Sabías?"), porque en pantallas grandes el CSS Grid me lo mandaba hacia un lado en una segunda columna y se veía raro, pero yo quería que se mantenga abajo después del contenido principal. Lo resolví acomodando las `grid-template-areas` dentro del `@media (min-width: 60rem)` en una sola columna vertical (`cabecera`, `principal`, `lateral`, `pie`) para que todo fluya hacia abajo en orden.