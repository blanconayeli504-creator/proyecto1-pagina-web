const $estado = document.querySelector("#estado");
const listaRemota = document.querySelector("#lista-remota");

// ── 1. JSON ─────────────────────────────────────────────────────────────
// Ejemplo con un producto artesanal real de Dulce Nube Leonel
const textoJson = '{"nombre":"Gomitas de Maracuyá","precio":5.0,"categoria":"frutales","stock":40,"disponible":true,"unidad":"paquete"}';

// JSON.parse: Convierte una cadena de texto en formato JSON a objeto JavaScript
const objeto = JSON.parse(textoJson);
console.log("Producto deserializado:", objeto.nombre);
console.log("Precio:", objeto.precio, "| Tipo de dato:", typeof objeto.precio);

// JSON.stringify: Convierte un objeto JavaScript a texto en formato JSON
console.log("Serializado a JSON:", JSON.stringify(objeto));

// ── 2. LOS TRES ESTADOS ─────────────────────────────────────────────────
function mostrarEstado(texto, tipo = "info") {
  const elemEstado = $estado || document.querySelector("#estado");
  if (!elemEstado) return;
  elemEstado.textContent = texto;
  elemEstado.className = `estado-remoto ${tipo}`;
}

// Si la página se abre con doble clic (file://) el navegador bloquea fetch() y
// $.getJSON() por seguridad. Con un servidor local (http://localhost) funciona normal.
const ABIERTO_COMO_ARCHIVO = location.protocol === "file:";

// Datos de respaldo: el mismo catálogo que está en datos.js (misma estructura que datos.json)
function datosDeRespaldo() {
  return {
    negocio: { nombre: (typeof negocio !== "undefined") ? negocio : "Dulce Nube Leonel" },
    productos: (typeof productos !== "undefined") ? productos : []
  };
}

function mostrarRespaldo(via = "fetch") {
  const datos = datosDeRespaldo();
  pintarRemoto(datos.productos);
  mostrarEstado(
    `⚠ Modo local (file://): el navegador bloquea ${via} sobre archivos. Se muestran ${datos.productos.length} productos de respaldo. Abre el sitio con un servidor (ver README) para la carga remota real.`,
    "aviso"
  );
}

function pintarRemoto(productos) {
  const contenedorRemoto = listaRemota || document.querySelector("#lista-remota");
  if (!contenedorRemoto) return;

  contenedorRemoto.innerHTML = "";

  if (!productos || productos.length === 0) {
    contenedorRemoto.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
    return;
  }

  productos.forEach(p => {
    const art = document.createElement("article");
    art.classList.add("tarjeta");
    if (!p.disponible) art.classList.add("agotado");
    art.dataset.nombre = p.nombre;

    const textoUnidad = p.unidad ? ` / ${p.unidad}` : " / paquete";
    const imagen = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}" width="320" height="320" loading="lazy">`
      : "";
    const etiqueta = p.disponible
      ? `<span class="etiqueta">${p.categoria}</span>`
      : `<span class="etiqueta etiqueta-agotado">Agotado</span>`;

    art.innerHTML = `
      <div class="tarjeta-imagen">
        ${imagen}
        ${etiqueta}
      </div>
      <div class="tarjeta-cuerpo">
        <h3>${p.nombre}</h3>
        <p class="precio">Bs ${p.precio.toFixed(2)}${textoUnidad}</p>
        <p class="stock">${p.disponible ? `${p.stock} en stock` : "Agotado"}</p>
      </div>
    `;
    contenedorRemoto.append(art);
  });
}

// ── 3. fetch Y async/await ──────────────────────────────────────────────
async function cargarConFetch(url = "datos.json") {
  mostrarEstado("Cargando gomitas artesanales...", "cargando");

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió ${respuesta.status} (${respuesta.statusText || "Error"})`);
    }

    const datos = await respuesta.json();
    pintarRemoto(datos.productos);

    const nombreNegocio = datos.negocio?.nombre || "Dulce Nube Leonel";
    mostrarEstado(`✓ ${datos.productos.length} productos de ${nombreNegocio} cargados con éxito`, "ok");

  } catch (error) {
    // Abierto con doble clic: mostramos el respaldo en lugar de un error confuso
    if (ABIERTO_COMO_ARCHIVO && url === "datos.json") {
      mostrarRespaldo("fetch");
      return;
    }

    mostrarEstado(`✗ No se pudieron cargar los datos de gomitas. ${error.message}`, "error");
    const contenedorRemoto = listaRemota || document.querySelector("#lista-remota");
    if (contenedorRemoto) {
      contenedorRemoto.innerHTML = "";
    }
  }
}

const btnFetch = document.querySelector("#cargar-fetch");
if (btnFetch) {
  btnFetch.addEventListener("click", () => cargarConFetch());
}

const btnRoto = document.querySelector("#cargar-roto");
if (btnRoto) {
  btnRoto.addEventListener("click", () => cargarConFetch("no-existe.json"));
}

// ── 4. LO MISMO CON jQUERY ──────────────────────────────────────────────
if (typeof $ !== "undefined") {
  $("#cargar-jquery").on("click", function () {
    mostrarEstado("Cargando gomitas con jQuery...", "cargando");

    $.getJSON("datos.json")
      .done(function (datos) {
        pintarRemoto(datos.productos);
        const nombreNegocio = datos.negocio?.nombre || "Dulce Nube Leonel";
        mostrarEstado(`✓ ${datos.productos.length} productos de ${nombreNegocio} (vía jQuery)`, "ok");
      })
      .fail(function (jqXHR) {
        if (ABIERTO_COMO_ARCHIVO) {
          mostrarRespaldo("$.getJSON");
          return;
        }
        mostrarEstado(`✗ Falló la carga remota con jQuery: ${jqXHR.status} ${jqXHR.statusText || ""}`.trim(), "error");
      })
      .always(function () {
        console.log("La petición remota de Dulce Nube Leonel terminó, con éxito o sin él.");
      });
  });
}

// ── 5. QUÉ ES UNA PROMESA ───────────────────────────────────────────────
// Una Promesa representa un resultado que estará disponible en el futuro (asíncrono).
// Tiene tres posibles estados: pendiente (pending), cumplida (fulfilled) o rechazada (rejected).

function verificarDisponibilidadRemota(nombreGomita) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulación de búsqueda asíncrona de disponibilidad
      const catalogo = (typeof productos !== "undefined") ? productos : [
        { nombre: "Gomitas de Maracuyá", stock: 40, disponible: true },
        { nombre: "Gomitas Ácidas de Frutilla", stock: 25, disponible: true },
        { nombre: "Mix Artesanal Grande", stock: 8, disponible: true }
      ];

      const encontrado = catalogo.find(p => p.nombre.toLowerCase().includes(nombreGomita.toLowerCase()));

      if (encontrado) {
        resolve({
          producto: encontrado.nombre,
          disponible: encontrado.disponible,
          stock: encontrado.stock,
          mensaje: encontrado.disponible ? "Stock verificado en bodega." : "Temporalmente agotado."
        });
      } else {
        reject(new Error(`El producto "${nombreGomita}" no se encontró en el inventario remoto.`));
      }
    }, 500);
  });
}

// Ejemplo de consumo con .then(), .catch() y .finally()
verificarDisponibilidadRemota("Maracuyá")
  .then(resultado => {
    console.log("Promesa cumplida con éxito:", resultado);
  })
  .catch(error => {
    console.error("Promesa rechazada con error:", error.message);
  })
  .finally(() => {
    console.log("Consulta de promesa finalizada.");
  });

// ── 6. LA PESTAÑA NETWORK ───────────────────────────────────────────────
// En las herramientas del desarrollador (F12 > pestaña 'Network' / 'Red'):
// 1. Monitorear las peticiones HTTP que generan fetch() y $.getJSON() hacia "datos.json".
// 2. Verificar los códigos de estado HTTP (200 para éxito, 404 para URLs inexistentes).
// 3. Inspeccionar las cabeceras (Headers) y la pestaña Response / Preview para ver el JSON recibido.
// 4. Medir los tiempos de respuesta y transferencia del servidor.

console.info(
  "%cDulce Nube Leonel - Módulo de datos remotos listo 🍬",
  "color: #a65b32; font-weight: bold; font-size: 1.1em;"
);
console.info("💡 Tip: Abre la pestaña 'Network' (Red) en DevTools (F12) al hacer clic en los botones para inspeccionar las peticiones a 'datos.json'.");
