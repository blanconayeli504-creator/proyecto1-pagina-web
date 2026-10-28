// ── 1. SELECCIONAR ──────────────────────────────────────────────────────
// Corregido: En tu HTML la sección se llama #nuestras-gomitas
const contenedor = document.querySelector("#nuestras-gomitas");
const titulos = document.querySelectorAll("h2");

console.log("El contenedor existe:", contenedor !== null);
console.log("Hay", titulos.length, "encabezados h2 en la página");

const textosDeTitulos = [...titulos].map(t => t.textContent);
console.log(textosDeTitulos);

// ── 2. LEER Y MODIFICAR CONTENIDO ───────────────────────────────────────
const tituloGomitas = document.querySelector("#nuestras-gomitas h2");
if (tituloGomitas) {
  console.log("Título actual:", tituloGomitas.textContent);
}

// ── 3. ATRIBUTOS Y CLASES ───────────────────────────────────────────────
// Mantiene el contenedor listo para recibir la cuadrícula
if (contenedor) {
  contenedor.classList.add("galeria-gomitas");
}

// ── 4. CREAR ELEMENTOS ──────────────────────────────────────────────────
function crearTarjeta(producto) {
  const articulo = document.createElement("article");

  articulo.classList.add("tarjeta");
  if (!producto.disponible) {
    articulo.classList.add("agotado");
  }

  articulo.dataset.nombre = producto.nombre;

  // Etiqueta de estado según el stock (pocas unidades / agotado)
  const pocasUnidades = producto.disponible && producto.stock <= 5;
  const etiqueta = !producto.disponible
    ? `<span class="etiqueta etiqueta-agotado">Agotado</span>`
    : pocasUnidades
      ? `<span class="etiqueta etiqueta-poco">¡Últimas unidades!</span>`
      : `<span class="etiqueta">${producto.categoria}</span>`;

  const imagen = producto.imagen
    ? `<img src="${producto.imagen}" alt="${producto.nombre}" width="320" height="320" loading="lazy">`
    : "";

  articulo.innerHTML = `
    <div class="tarjeta-imagen">
      ${imagen}
      ${etiqueta}
    </div>
    <div class="tarjeta-cuerpo">
      <h3>${producto.nombre}</h3>
      <p class="precio">Bs ${producto.precio.toFixed(2)}</p>
      <p class="stock">${producto.disponible ? `${producto.stock} en stock` : "Agotado"}</p>
      ${producto.disponible
        ? `<a class="btn-pedir" href="#pedido" data-producto="${producto.nombre}">Pedir ahora</a>`
        : `<span class="btn-pedir btn-deshabilitado" aria-disabled="true">No disponible</span>`}
    </div>
  `;

  return articulo;
}

// ── 5. RENDER: EL PATRÓN DEL MÓDULO ─────────────────────────────────────
function render(lista) {
  if (!contenedor) return;

  // Mantenemos el título <h2> dentro de la sección
  contenedor.innerHTML = "<h2>Nuestras Gomitas Artesanales</h2>";

  // Si no hay productos pasados o la lista está vacía
  if (!lista || lista.length === 0) {
    contenedor.innerHTML += "<p class=\"sin-resultados\">No hay productos que mostrar por el momento.</p>";
    return;
  }

  lista.forEach(producto => {
    contenedor.append(crearTarjeta(producto));
  });
}

// ── 6. PINTAR ───────────────────────────────────────────────────────────
// Renderiza el catálogo de los 8 productos de gomitas que tenemos definidos
if (typeof productos !== "undefined") {
  render(productos);
} else {
  console.warn("La variable 'productos' no está definida todavía.");
}

// ── 7. RECORRER EL ÁRBOL ────────────────────────────────────────────────
const primeraTarjeta = document.querySelector(".tarjeta");
if (primeraTarjeta) {
  console.log("Padre de la primera tarjeta:", primeraTarjeta.parentElement.id);
  console.log("Su producto es:", primeraTarjeta.dataset.nombre);
}