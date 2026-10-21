// ── 1. CONSTANTES Y VARIABLES DEL NEGOCIO ───────────────────────────────
const negocio = "Dulce Nube Leonel";
const anioFundacion = 2010;

let gomitasEnVitrina = 50;
gomitasEnVitrina = 40;

// ── 2. COERCIÓN DE TIPOS ────────────────────────────────────────────────
console.log("5" + 3); // "53" (concatenación de texto)
console.log("5" - 3); // 2 (conversión a número)
console.log(Number("5") + 3);

// ── 3. VALORES FALSY Y TRUTHY ───────────────────────────────────────────
console.log(Boolean(0), Boolean(""), Boolean("0"), Boolean([]));

// ── 4. CONTROL DE FLUJO Y CATÁLOGO DE 8 PRODUCTOS ───────────────────────
let stockGomitas = 12;

if (stockGomitas > 0) {
  console.log("Hay stock disponible de gomitas artesanales.");
} else {
  console.log("Gomitas temporalmente agotadas.");
}

const estado = stockGomitas > 0 ? "disponible" : "agotado";
console.log("Estado de la tienda:", estado);

// Catálogo oficial de los 8 productos de Dulce Nube Leonel
const productos = [
  { nombre: "Gomitas de Maracuyá",        precio: 5.0,  categoria: "frutales",  stock: 40, disponible: true },
  { nombre: "Gomitas Ácidas de Frutilla", precio: 6.0,  categoria: "acidas",    stock: 25, disponible: true },
  { nombre: "Mix Artesanal Grande",       precio: 15.0, categoria: "mixes",     stock: 8,  disponible: true },
  { nombre: "Gomitas de Arándano",        precio: 6.5,  categoria: "frutales",  stock: 0,  disponible: false },
  { nombre: "Gomitas de Mango con Chili",  precio: 7.0,  categoria: "picantes",  stock: 30, disponible: true },
  { nombre: "Paleta de Gomita Gigante",   precio: 12.0, categoria: "especiales", stock: 3,  disponible: true },
  { nombre: "Gomitas de Limón Ácido",     precio: 5.5,  categoria: "acidas",    stock: 45, disponible: true },
  { nombre: "Bolsita Mini Surtida",       precio: 3.5,  categoria: "mixes",     stock: 0,  disponible: false },
];

console.log("--- LISTA DE PRODUCTOS DISPONIBLES ---");
for (const prod of productos) {
  if (prod.disponible) {
    console.log(`Producto: ${prod.nombre} | Precio: Bs ${prod.precio.toFixed(2)} | Stock: ${prod.stock}`);
  }
}

// ── 5. FUNCIONES PARA CÁLCULO DE PEDIDOS ────────────────────────────────
function totalDeclarada(precio, cantidad) {
  return precio * cantidad;
}

const totalExpresion = function (precio, cantidad) {
  return precio * cantidad;
};

const calcularTotal = (precio, cantidad) => precio * cantidad;

console.log(
  "Prueba de cálculo de pedido:",
  totalDeclarada(5.0, 2),
  totalExpresion(5.0, 2),
  calcularTotal(5.0, 2)
);

// ── 6. ARROW FUNCTIONS Y DESCUENTOS ─────────────────────────────────────
const doblePack = (n) => n * 2;

const aplicarDescuento = (total, porcentaje) => {
  const descuento = total * (porcentaje / 100);
  return total - descuento;
};

const conImpuesto = (monto, tasa = 13) => monto * (1 + tasa / 100);

console.log("Total con 20% de descuento:", aplicarDescuento(100, 20));
console.log("Total con impuesto aplicado:", conImpuesto(100).toFixed(2));

// ── 7. FUNCIONES COMO VALORES Y MÉTODOS DE ARREGLOS ────────────────────
const operacion = calcularTotal;
console.log("Cálculo de Mix Grande (3 paquetes): Bs", operacion(15.0, 3));

function aplicarATodos(lista, fn) {
  const salida = [];
  for (const elemento of lista) {
    salida.push(fn(elemento));
  }
  return salida;
}

const preciosGomitas = [5.0, 6.0, 15.0];
console.log("Precios al doble:", aplicarATodos(preciosGomitas, doblePack));
console.log(
  "Precios formateados:",
  aplicarATodos(preciosGomitas, (p) => `Bs ${p.toFixed(2)}`)
);

// Métodos avanzados requeridos por el laboratorio
const nombresProductos = productos.map(p => p.nombre);
console.log("Nombres de productos:", nombresProductos);

const valorInventario = productos.reduce((acumulador, p) => acumulador + p.precio * p.stock, 0);
console.log("Valor total del inventario: Bs", valorInventario.toFixed(2));

// ── 8. SCOPE Y CLOSURES (CONTADORES DE PEDIDOS) ─────────────────────────
function crearContadorPedidos() {
  let cuenta = 0;
  return () => {
    cuenta = cuenta + 1;
    return cuenta;
  };
}

const pedidosMaracuya = crearContadorPedidos();
console.log("Pedidos de Maracuyá realizados:", pedidosMaracuya(), pedidosMaracuya());

const pedidosFrutilla = crearContadorPedidos();
console.log("Pedidos de Frutilla realizados:", pedidosFrutilla());

// ── 9. CLASES ───────────────────────────────────────────────────────────
class ProductoGomita {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
  estaDisponible() {
    return this.stock > 0;
  }
  valorEnStock() {
    return this.precio * this.stock;
  }
}

const productoPrueba = new ProductoGomita("Mix Artesanal Grande", 15.0, 8);
console.log("Clase probada:", productoPrueba.nombre, "| Valor stock: Bs", productoPrueba.valorEnStock());

// ── 10. RENDERIZAR EN LA PÁGINA (DOM) ───────────────────────────────────
// Actualizar el subtítulo del encabezado
const subtitulo = document.querySelector("header p");
if (subtitulo) {
  subtitulo.textContent = `Gomitas artesanales desde ${anioFundacion} - ¡Quedan ${gomitasEnVitrina} paquetes en tienda!`;
}

// Pintar las tarjetas de productos en la sección #nuestras-gomitas
const contenedor = document.querySelector("#nuestras-gomitas");

function crearTarjeta(producto) {
  const articulo = document.createElement("article");
  articulo.classList.add("tarjeta");
  if (!producto.disponible) {
    articulo.classList.add("agotado");
  }
  articulo.dataset.nombre = producto.nombre;

  articulo.innerHTML = `
    <h3>${producto.nombre}</h3>
    <p class="precio">Bs ${producto.precio.toFixed(2)}</p>
    <p class="stock">${producto.disponible ? `${producto.stock} en stock` : "Agotado"}</p>
  `;
  return articulo;
}

function renderTarjetas(lista) {
  if (!contenedor) return;
  contenedor.innerHTML = "<h2>Nuestras Gomitas</h2>";
  
  lista.forEach(producto => {
    contenedor.append(crearTarjeta(producto));
  });
}

// Cargar automáticamente los 8 productos en el formulario de pedidos (<select>)
const selectProducto = document.querySelector("#producto");

function cargarSelectProductos(lista) {
  if (!selectProducto) return;
  selectProducto.innerHTML = '<option value="">Elige uno</option>';

  lista.forEach(producto => {
    const option = document.createElement("option");
    option.value = producto.nombre.toLowerCase().replace(/ /g, "-");
    option.textContent = `${producto.nombre} (Bs ${producto.precio.toFixed(2)})`;
    
    if (!producto.disponible) {
      option.textContent += " - Agotado";
    }
    selectProducto.append(option);
  });
}

// Ejecutar el render y la carga del selector
renderTarjetas(productos);
cargarSelectProductos(productos);