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

// ── 4. CONTROL DE FLUJO Y LISTA DE PRECIOS ──────────────────────────────
let stockGomitas = 12;

if (stockGomitas > 0) {
  console.log("Hay stock disponible de gomitas artesanales.");
} else {
  console.log("Gomitas temporalmente agotadas.");
}

const estado = stockGomitas > 0 ? "disponible" : "agotado";
console.log("Estado de la tienda:", estado);

// Precios de Maracuyá (5.00), Frutilla (6.00) y Mix Grande (15.00)
const preciosGomitas = [5.0, 6.0, 15.0];
for (const precio of preciosGomitas) {
  console.log("Precio registrado: Bs", precio.toFixed(2));
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
  "Prueba de cálculo de pedido (Maracuyá):",
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

// ── 7. FUNCIONES COMO VALORES ───────────────────────────────────────────
const operacion = calcularTotal;
console.log("Cálculo de Mix Grande (3 paquetes): Bs", operacion(15.0, 3));

function aplicarATodos(lista, fn) {
  const salida = [];
  for (const elemento of lista) {
    salida.push(fn(elemento));
  }
  return salida;
}

console.log("Precios al doble:", aplicarATodos(preciosGomitas, doblePack));
console.log(
  "Precios formateados:",
  aplicarATodos(preciosGomitas, (p) => `Bs ${p.toFixed(2)}`)
);

// ── 8. SCOPE Y CLOSURES (CONTADORES DE PEDIDOS) ─────────────────────────
function crearContadorPedidos() {
  let cuenta = 0;
  return () => {
    cuenta = cuenta + 1;
    return cuenta;
  };
}

const pedidosMaracuya = crearContadorPedidos();
console.log("Pedidos de Maracuyá realizados:", pedidosMaracuya(), pedidosMaracuya(), pedidosMaracuya());

const pedidosFrutilla = crearContadorPedidos();
console.log("Pedidos de Frutilla realizados:", pedidosFrutilla());

// ── 9. ACTUALIZACIÓN DEL DOM EN LA PÁGINA ───────────────────────────────
const subtitulo = document.querySelector("header p");
if (subtitulo) {
  subtitulo.textContent = `Gomitas artesanales desde ${anioFundacion} - ¡Quedan ${gomitasEnVitrina} paquetes en tienda!`;
}