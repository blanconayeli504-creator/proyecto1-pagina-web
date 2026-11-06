// ── CONFIGURACIÓN ───────────────────────────────────────────────────────
// Si tienes un servicio para recibir pedidos (Formspree, tu propio servidor, etc.),
// pon aquí su dirección. Si queda vacío, el pedido se confirma en pantalla y por WhatsApp.
const URL_PEDIDOS = "";

// ── 1. BARRA DE HERRAMIENTAS ────────────────────────────────────────────
const barra = document.querySelector("#barra-herramientas");
const btnFiltros = document.querySelector("#btn-filtros");
const panelFiltros = document.querySelector("#panel-filtros");
const btnLimpiar = document.querySelector("#limpiar-filtros");
const contador = document.querySelector("#contador-filtros");

// Sombra cuando la barra se pega arriba y altura disponible para las anclas
function ajustarBarra() {
  document.documentElement.style.setProperty("--alto-barra", `${barra.offsetHeight}px`);
  barra.classList.toggle("con-sombra", barra.getBoundingClientRect().top <= 0);
}
window.addEventListener("scroll", ajustarBarra, { passive: true });
window.addEventListener("resize", ajustarBarra);
ajustarBarra();

// ── 2. PANEL DESPLEGABLE DE FILTROS ─────────────────────────────────────
function alternarPanelFiltros(abrir) {
  panelFiltros.hidden = !abrir;
  btnFiltros.setAttribute("aria-expanded", abrir);
  ajustarBarra();
}

btnFiltros.addEventListener("click", () => alternarPanelFiltros(panelFiltros.hidden));

document.addEventListener("click", (event) => {
  if (!panelFiltros.hidden && !barra.contains(event.target)) alternarPanelFiltros(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panelFiltros.hidden) {
    alternarPanelFiltros(false);
    btnFiltros.focus();
  }
});

// ── 3. CONTADOR Y BOTÓN "LIMPIAR FILTROS" ───────────────────────────────
// categoriaActiva y textoBuscado viven en eventos.js
function refrescarFiltros() {
  const activos = (categoriaActiva !== "todos" ? 1 : 0) + (textoBuscado.trim() !== "" ? 1 : 0);
  contador.textContent = String(activos);
  contador.hidden = activos === 0;
  btnLimpiar.hidden = activos === 0;
  ajustarBarra();
}

buscador.addEventListener("input", refrescarFiltros);
filtros.addEventListener("click", refrescarFiltros);

btnLimpiar.addEventListener("click", () => {
  categoriaActiva = "todos";
  textoBuscado = "";
  buscador.value = "";
  filtros.querySelectorAll("button").forEach((b) => b.classList.toggle("activo", b.dataset.categoria === "todos"));
  actualizar();
  refrescarFiltros();
});

// ── 4. TRANSICIÓN SUAVE ENTRE MODO CLARO Y OSCURO ───────────────────────
document.querySelector("#tema-toggle").addEventListener("click", () => {
  const raiz = document.documentElement;
  raiz.classList.add("cambiando-tema");
  setTimeout(() => raiz.classList.remove("cambiando-tema"), 600);
});

// ── 5. SECCIONES QUE APARECEN SUAVEMENTE AL HACER SCROLL ────────────────
const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !sinAnimaciones) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("revelado");
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll("main section, aside, footer").forEach((elemento) => {
    elemento.classList.add("revelar");
    observador.observe(elemento);
  });
}

// ── 6. CANASTA: PEDIDO CON FORMULARIO ───────────────────────────────────
const dialogoPedido = document.querySelector("#dialogo-pedido");
const formCanasta = document.querySelector("#form-canasta");
const resumenDialogo = document.querySelector("#resumen-dialogo");
const mensajeDialogo = document.querySelector("#mensaje-dialogo");

function hoyLocal() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// Líneas del pedido y total, leídas de la canasta (tablero.js)
function leerCanasta() {
  const lineas = [...canasta.entries()].map(([nombre, cantidad]) => {
    const producto = productos.find((p) => p.nombre === nombre);
    return { nombre, cantidad, subtotal: producto.precio * cantidad };
  });
  const total = lineas.reduce((suma, linea) => suma + linea.subtotal, 0);
  return { lineas, total };
}

function pintarResumen() {
  const { lineas, total } = leerCanasta();

  const lista = document.createElement("ul");
  lineas.forEach(({ nombre, cantidad, subtotal }) => {
    const item = document.createElement("li");
    const texto = document.createElement("span");
    texto.textContent = `${cantidad} × ${nombre}`;
    const precio = document.createElement("strong");
    precio.textContent = `Bs ${subtotal.toFixed(2)}`;
    item.append(texto, precio);
    lista.append(item);
  });

  const totalFila = document.createElement("p");
  totalFila.className = "total-dialogo";
  totalFila.append("Total ");
  const totalValor = document.createElement("strong");
  totalValor.textContent = `Bs ${total.toFixed(2)}`;
  totalFila.append(totalValor);

  resumenDialogo.replaceChildren(lista, totalFila);
}

document.querySelector("#pedido-formulario").addEventListener("click", () => {
  if (canasta.size === 0) return;
  pintarResumen();
  mensajeDialogo.replaceChildren();
  mensajeDialogo.className = "";
  formCanasta.hidden = false;
  resumenDialogo.hidden = false;
  formCanasta.querySelector("#fc-fecha").min = hoyLocal();
  dialogoPedido.showModal();
});

document.querySelector("#cerrar-dialogo-pedido").addEventListener("click", () => dialogoPedido.close());
dialogoPedido.addEventListener("click", (event) => {
  if (event.target === dialogoPedido) dialogoPedido.close();
});

formCanasta.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fecha = formCanasta.querySelector("#fc-fecha");
  fecha.setCustomValidity(fecha.value && fecha.value < hoyLocal() ? "La fecha de entrega no puede ser anterior a hoy." : "");
  if (!formCanasta.reportValidity()) return;

  const datos = Object.fromEntries(new FormData(formCanasta));
  const { lineas, total } = leerCanasta();
  const detalle = lineas.map((l) => `- ${l.cantidad} x ${l.nombre}: Bs ${l.subtotal.toFixed(2)}`).join("\n");
  const pedido = { ...datos, productos: lineas, total };

  const botonEnviar = formCanasta.querySelector("button[type='submit']");
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";

  try {
    if (URL_PEDIDOS) {
      const respuesta = await fetch(URL_PEDIDOS, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(pedido),
      });
      if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
    } else {
      console.log("Pedido por formulario en Dulce Nube Leonel:", pedido);
    }

    const resumenWsp = `Hola, soy ${datos.nombre}. Acabo de enviar este pedido por el formulario:\n${detalle}\nTotal: Bs ${total.toFixed(2)}.\nEntrega: ${datos.fecha}, ${datos.direccion}.${datos.notas ? "\nIndicaciones: " + datos.notas : ""}`;

    const enlace = document.createElement("a");
    enlace.className = "btn-whatsapp";
    enlace.href = `https://wa.me/59177541854?text=${encodeURIComponent(resumenWsp)}`;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = "Confirmar por WhatsApp";

    const gracias = document.createElement("span");
    gracias.textContent = `¡Gracias ${datos.nombre}! Tu pedido de Bs ${total.toFixed(2)} quedó registrado. Te contactaremos al ${datos.telefono} para confirmarlo. `;
    mensajeDialogo.replaceChildren(gracias, enlace);
    mensajeDialogo.className = "estado-remoto ok";

    formCanasta.hidden = true;
    resumenDialogo.hidden = true;
    formCanasta.reset();
    canasta.clear();
    actualizarCanasta();
    document.querySelector("#estado-canasta").textContent = "Pedido enviado con el formulario.";
  } catch (error) {
    mensajeDialogo.textContent = `No se pudo enviar el pedido (${error.message}). Inténtalo de nuevo o usa WhatsApp.`;
    mensajeDialogo.className = "estado-remoto error";
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar pedido";
  }
});

// ── 7. TARJETA DE UBICACIÓN: ESTADO "ABIERTO AHORA" ─────────────────────
const estadoLocal = document.querySelector("#estado-local");

function pintarEstadoLocal() {
  const abierto = tiendaAbierta(); // funciones.js
  estadoLocal.hidden = false;
  estadoLocal.className = `estado-tienda ${abierto ? "abierto" : "cerrado"}`;
  estadoLocal.textContent = abierto ? "● Abierto ahora" : "● Cerrado en este momento";
}

pintarEstadoLocal();
setInterval(pintarEstadoLocal, 60000);
