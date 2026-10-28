// ── 1. LOS ELEMENTOS QUE SE VAN A ESCUCHAR ──────────────────────────────
const buscador = document.querySelector("#buscador");
const filtros = document.querySelector("#filtros");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("form");
const mensajePedido = document.querySelector("#mensaje-pedido");

let categoriaActiva = "todos";
let textoBuscado = "";

// ── 2. UNA SOLA FUNCIÓN QUE DECIDE QUÉ MOSTRAR ──────────────────────────
function actualizar() {
  // Validamos que el arreglo 'productos' (de datos.js) exista
  if (typeof productos === "undefined") return;

  const visibles = productos
    .filter(p => categoriaActiva === "todos" || p.categoria === categoriaActiva)
    .filter(p => p.nombre.toLowerCase().includes(textoBuscado.toLowerCase()));

  // Llamamos a la función render de tu otro archivo
  if (typeof render === "function") {
    render(visibles);
  }
  
  if (resultado) {
    resultado.textContent = `${visibles.length} de ${productos.length} productos en Dulce Nube Leonel`;
  }
}

// Ejecutamos al iniciar la página
actualizar();

// ── 3. EL EVENTO input (Buscador en tiempo real) ────────────────────────
if (buscador) {
  buscador.addEventListener("input", (event) => {
    textoBuscado = event.target.value;
    actualizar();
  });
}

// ── 4. DELEGACIÓN DE EVENTOS (Filtros por categoría) ────────────────────
if (filtros) {
  filtros.addEventListener("click", (event) => {
    const boton = event.target.closest("button");
    if (!boton) return;

    categoriaActiva = boton.dataset.categoria;

    filtros.querySelectorAll("button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");

    actualizar();
  });
}

// ── 4.1 BOTÓN "PEDIR AHORA" DE LAS TARJETAS (delegación) ────────────────
// Elige automáticamente el producto en el formulario de pedido
document.addEventListener("click", (event) => {
  const enlace = event.target.closest(".btn-pedir[data-producto]");
  if (!enlace) return;

  const select = document.querySelector("#producto");
  if (!select) return;

  const opcion = [...select.options].find(o => o.textContent.startsWith(enlace.dataset.producto));
  if (opcion && !opcion.disabled) {
    select.value = opcion.value;
  }
});

// Evita que el texto escrito por el cliente se interprete como HTML
function escapar(texto) {
  const nodo = document.createElement("span");
  nodo.textContent = texto;
  return nodo.innerHTML;
}

// ── 5. EL EVENTO submit Y preventDefault (Validación del pedido) ────────
if (formulario) {
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formulario.reportValidity()) {
      return;
    } 

    // Validación de fecha de entrega (no anterior a hoy)
    const fecha = formulario.querySelector("#fecha");
    if (fecha) {
      // Fecha local (evita el desfase de la zona horaria que produce toISOString)
      const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      if (fecha.value < hoy) {
        fecha.setCustomValidity("La fecha de entrega no puede ser anterior a hoy.");
        fecha.reportValidity();

        fecha.addEventListener("input", () => fecha.setCustomValidity(""), { once: true });
        return;
      }
    }

    const datos = Object.fromEntries(new FormData(formulario));
    console.log("Pedido recibido en Dulce Nube Leonel:", datos);

    // Resumen del pedido con el total (usa calcularTotal de funciones.js)
    const textoProducto = formulario.querySelector("#producto").selectedOptions[0].textContent;
    const gomita = productos.find(p => textoProducto.startsWith(p.nombre));
    const total = gomita ? calcularTotal(gomita.precio, Number(datos.cantidad)) : 0;
    const resumen = `Hola, soy ${datos.nombre}. Quiero pedir ${datos.cantidad} x ${gomita ? gomita.nombre : textoProducto} (Total: Bs ${total.toFixed(2)}) para el ${datos.fecha}.${datos.notas ? " Indicaciones: " + datos.notas : ""}`;

    if (mensajePedido) {
      mensajePedido.className = "estado-remoto ok";
      mensajePedido.innerHTML = `¡Gracias ${escapar(datos.nombre)}! Tu pedido quedó registrado: ${datos.cantidad} x ${gomita ? gomita.nombre : textoProducto}, total <strong>Bs ${total.toFixed(2)}</strong>. `
        + `<a class="btn-whatsapp" href="https://wa.me/59177541854?text=${encodeURIComponent(resumen)}" target="_blank" rel="noopener noreferrer">Confirmar por WhatsApp</a>`;
    }
    formulario.reset();
  });
}

// La fecha de entrega no puede ser anterior a hoy (también en el calendario)
const campoFecha = document.querySelector("#fecha");
if (campoFecha) {
  campoFecha.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// ── 6. EXPRESIONES REGULARES ────────────────────────────────────────────
const PATRONES = {
  telefono: /^[0-9]{7,8}$/, // Formato para 7 u 8 dígitos en Bolivia
  correo: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i,
  ci: /^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/,
};

console.log("Validación de teléfono (77541854):", PATRONES.telefono.test("77541854"));
console.log("Validación de correo (ventas@dulcenube.bo):", PATRONES.correo.test("ventas@dulcenube.bo"));