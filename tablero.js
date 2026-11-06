const catalogoCanasta = document.querySelector("#catalogo-canasta");
const listaCanasta = document.querySelector("#lista-canasta");
const bandejaCanasta = document.querySelector("#bandeja-canasta");
const CAPACIDAD_CANASTA = 12;
const canasta = new Map();

function crearTarjetaCanasta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "producto-canasta";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.width = 320;
  imagen.height = 240;
  imagen.loading = "lazy";

  const cuerpo = document.createElement("div");
  cuerpo.className = "cuerpo-producto-canasta";

  const nombre = document.createElement("h3");
  nombre.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "precio-canasta";
  precio.textContent = `Bs ${producto.precio.toFixed(2)}`;

  const stock = document.createElement("p");
  stock.className = producto.stock > 0 ? "stock-canasta" : "stock-canasta agotado-canasta";
  stock.textContent = producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado";

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton-agregar-canasta";
  boton.dataset.agregarCanasta = producto.nombre;
  boton.textContent = producto.stock > 0 ? "Agregar a mi canasta" : "No disponible";
  boton.disabled = producto.stock <= 0;

  cuerpo.append(nombre, precio, stock, boton);
  tarjeta.append(imagen, cuerpo);
  return tarjeta;
}

function actualizarCanasta() {
  if (!listaCanasta) return;

  listaCanasta.replaceChildren();
  let totalUnidades = 0;
  let totalPrecio = 0;

  canasta.forEach((cantidad, nombre) => {
    const producto = productos.find((elemento) => elemento.nombre === nombre);
    if (!producto) return;

    totalUnidades += cantidad;
    totalPrecio += producto.precio * cantidad;

    const fila = document.createElement("li");
    fila.className = "fila-canasta";

    const detalle = document.createElement("div");
    detalle.className = "detalle-fila-canasta";

    const titulo = document.createElement("strong");
    titulo.textContent = producto.nombre;

    const subtotal = document.createElement("span");
    subtotal.textContent = `Bs ${(producto.precio * cantidad).toFixed(2)}`;
    detalle.append(titulo, subtotal);

    const controles = document.createElement("div");
    controles.className = "controles-canasta";

    const menos = document.createElement("button");
    menos.type = "button";
    menos.className = "boton-cantidad";
    menos.dataset.cambiarCanasta = "-1";
    menos.dataset.nombre = nombre;
    menos.setAttribute("aria-label", `Quitar una unidad de ${nombre}`);
    menos.textContent = "−";

    const cantidadVisible = document.createElement("span");
    cantidadVisible.textContent = String(cantidad);
    cantidadVisible.setAttribute("aria-label", `Cantidad: ${cantidad}`);

    const mas = document.createElement("button");
    mas.type = "button";
    mas.className = "boton-cantidad";
    mas.dataset.cambiarCanasta = "1";
    mas.dataset.nombre = nombre;
    mas.setAttribute("aria-label", `Agregar una unidad de ${nombre}`);
    mas.textContent = "+";
    mas.disabled = cantidad >= producto.stock;

    controles.append(menos, cantidadVisible, mas);
    fila.append(detalle, controles);
    listaCanasta.append(fila);
  });

  const estaVacia = canasta.size === 0;
  document.querySelector("#canasta-vacia").hidden = !estaVacia;
  document.querySelector("#canasta-productos").textContent = String(canasta.size);
  document.querySelector("#canasta-unidades").textContent = String(totalUnidades);
  document.querySelector("#canasta-total").textContent = `Bs ${totalPrecio.toFixed(2)}`;
  document.querySelector("#unidades-bandeja").textContent = String(totalUnidades);
  document.querySelector("#vaciar-canasta").disabled = estaVacia;
  document.querySelector("#enviar-canasta").disabled = estaVacia;
  const botonFormulario = document.querySelector("#pedido-formulario");
  if (botonFormulario) botonFormulario.disabled = estaVacia;

  const unidadesSeleccionadas = [...canasta.entries()].flatMap(([nombre, cantidad]) => {
    const producto = productos.find((elemento) => elemento.nombre === nombre);
    return Array.from({ length: cantidad }, () => producto);
  });
  const espacios = Array.from({ length: CAPACIDAD_CANASTA }, (_, indice) => {
    const espacio = document.createElement("div");
    espacio.className = "espacio-bandeja";
    espacio.setAttribute("role", "listitem");

    const producto = unidadesSeleccionadas[indice];
    if (!producto) {
      espacio.classList.add("espacio-bandeja-vacio");
      espacio.setAttribute("aria-label", `Espacio ${indice + 1} disponible`);
      return espacio;
    }

    espacio.classList.add("espacio-bandeja-ocupado");
    espacio.setAttribute("aria-label", producto.nombre);

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = "";
    imagen.width = 64;
    imagen.height = 64;

    const nombre = document.createElement("span");
    nombre.textContent = producto.nombre.replace("Gomitas de ", "").replace("Gomitas ", "");

    espacio.append(imagen, nombre);
    return espacio;
  });
  bandejaCanasta?.replaceChildren(...espacios);

  document.querySelectorAll("[data-agregar-canasta]").forEach((boton) => {
    const producto = productos.find((elemento) => elemento.nombre === boton.dataset.agregarCanasta);
    const estaAgotado = !producto || producto.stock <= 0;
    const canastaLlena = totalUnidades >= CAPACIDAD_CANASTA;
    boton.disabled = estaAgotado || canastaLlena;
    boton.textContent = estaAgotado
      ? "No disponible"
      : canastaLlena
        ? "Canasta completa"
        : "Agregar a mi canasta";
  });

  listaCanasta.querySelectorAll("[data-cambiar-canasta='1']").forEach((boton) => {
    boton.disabled = totalUnidades >= CAPACIDAD_CANASTA || boton.disabled;
  });
}

catalogoCanasta?.addEventListener("click", (event) => {
  const boton = event.target.closest("[data-agregar-canasta]");
  if (!boton) return;

  const nombre = boton.dataset.agregarCanasta;
  const producto = productos.find((elemento) => elemento.nombre === nombre);
  const cantidadActual = canasta.get(nombre) || 0;

  const totalUnidades = [...canasta.values()].reduce((total, cantidad) => total + cantidad, 0);
  if (producto && cantidadActual < producto.stock && totalUnidades < CAPACIDAD_CANASTA) {
    canasta.set(nombre, cantidadActual + 1);
    document.querySelector("#estado-canasta").textContent = `${nombre} agregado a tu canasta (${totalUnidades + 1} de ${CAPACIDAD_CANASTA}).`;
    actualizarCanasta();
  }
});

listaCanasta?.addEventListener("click", (event) => {
  const boton = event.target.closest("[data-cambiar-canasta]");
  if (!boton) return;

  const nombre = boton.dataset.nombre;
  const cambio = Number(boton.dataset.cambiarCanasta);
  const cantidad = (canasta.get(nombre) || 0) + cambio;
  const producto = productos.find((elemento) => elemento.nombre === nombre);
  const totalUnidades = [...canasta.values()].reduce((total, valor) => total + valor, 0);

  if (cantidad <= 0) canasta.delete(nombre);
  else if (producto && cantidad <= producto.stock && (cambio < 0 || totalUnidades < CAPACIDAD_CANASTA)) {
    canasta.set(nombre, cantidad);
  }

  actualizarCanasta();
});

document.querySelector("#vaciar-canasta")?.addEventListener("click", () => {
  canasta.clear();
  document.querySelector("#estado-canasta").textContent = "Vaciaste tu canasta.";
  actualizarCanasta();
});

document.querySelector("#enviar-canasta")?.addEventListener("click", () => {
  if (canasta.size === 0) return;

  const detallePedido = [...canasta.entries()].map(([nombre, cantidad]) => {
    const producto = productos.find((elemento) => elemento.nombre === nombre);
    return `- ${cantidad} x ${nombre}: Bs ${(producto.precio * cantidad).toFixed(2)}`;
  });
  const total = [...canasta.entries()].reduce((suma, [nombre, cantidad]) => {
    const producto = productos.find((elemento) => elemento.nombre === nombre);
    return suma + producto.precio * cantidad;
  }, 0);
  const mensaje = `Hola, quiero hacer este pedido de Dulce Nube Leonel:\n${detallePedido.join("\n")}\nTotal: Bs ${total.toFixed(2)}.`;
  const url = `https://wa.me/59177541854?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

if (catalogoCanasta && typeof productos !== "undefined") {
  catalogoCanasta.replaceChildren(...productos.map(crearTarjetaCanasta));
  actualizarCanasta();
}
