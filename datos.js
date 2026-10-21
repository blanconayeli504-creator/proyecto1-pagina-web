// ── 1. OBJETO LITERAL ───────────────────────────────────────────────────
const paqueteGomitas = {
  nombre: "Gomitas de Maracuyá",
  precio: 5.0,
  categoria: "frutales",
  stock: 40,
  disponible: true,
};

console.log(paqueteGomitas.nombre);

const propiedad = "precio";
console.log(paqueteGomitas[propiedad]);

paqueteGomitas.stock = 35;
paqueteGomitas.azucarExtra = false;
delete paqueteGomitas.azucarExtra;

// ── 2. DESTRUCTURING ────────────────────────────────────────────────────
const { nombre, precio } = paqueteGomitas;
console.log(`${nombre} cuesta Bs ${precio}`);

const paqueteClasico = { ...paqueteGomitas, precio: 4.5, nombre: "Gomitas de Maracuyá Clásicas" };
console.log(paqueteClasico);

// ── 3. ARREGLO DE OBJETOS (Catálogo de 8 productos) ─────────────────────
const productos = [
  { nombre: "Gomitas de Maracuyá",        precio: 5.0,  categoria: "frutales",  stock: 40, disponible: true },
  { nombre: "Gomitas Ácidas de Frutilla", precio: 6.0,  categoria: "acidas",    stock: 25, disponible: true },
  { nombre: "Mix Artesanal Grande",       precio: 15.0, categoria: "mixes",     stock: 8,  disponible: true },
  { nombre: "Gomitas de Arándano",        precio: 6.5,  categoria: "frutales",  stock: 0,  disponible: false },
  { nombre: "Gomitas de Mango con Chili",  precio: 7.0,  categoria: "picantes",  stock: 30, disponible: true },
  { nombre: "Paleta de Gomita Gigante",   precio: 12.0, categoria: "especiales",stock: 3,  disponible: true },
  { nombre: "Gomitas de Limón Ácido",     precio: 5.5,  categoria: "acidas",    stock: 45, disponible: true },
  { nombre: "Bolsita Mini Surtida",       precio: 3.5,  categoria: "mixes",     stock: 0,  disponible: false },
];

// ── 4. LOS MÉTODOS QUE IMPORTAN ─────────────────────────────────────────
productos.forEach(p => console.log(p.nombre));

const nombres = productos.map(p => p.nombre);
console.log(nombres);

const disponibles = productos.filter(p => p.disponible);
console.log(disponibles.length, "de", productos.length, "disponibles");

// Ajustado a los precios reales de las gomitas (> 10 para encontrar la más cara/especial)
const caro = productos.find(p => p.precio > 10);
console.log("Producto destacado de mayor precio:", caro);

console.log(nombres.includes("Mix Artesanal Grande"));
console.log(productos.some(p => p.stock === 0)); // Verifica si hay productos agotados
console.log(productos.every(p => p.precio > 0));

const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);
console.log(porPrecio.map(p => p.nombre));

const valorInventario = productos.reduce((acumulador, p) => acumulador + p.precio * p.stock, 0);
console.log("Valor total del inventario: Bs", valorInventario.toFixed(2));

// ── 5. ENCADENAR ────────────────────────────────────────────────────────
const nombresDisponibles = productos
  .filter(p => p.disponible)
  .map(p => p.nombre);
console.log("Nombres disponibles:", nombresDisponibles);

// Cambiado de "dulces" a la categoría real "frutales"
const totalFrutalesEnStock = productos
  .filter(p => p.categoria === "frutales" && p.disponible)
  .reduce((total, p) => total + p.precio * p.stock, 0);
console.log("Valor de gomitas frutales en stock: Bs", totalFrutalesEnStock.toFixed(2));

const porCategoria = productos.reduce((grupos, p) => {
  if (!grupos[p.categoria]) grupos[p.categoria] = [];
  grupos[p.categoria].push(p.nombre);
  return grupos;
}, {});
console.log("Productos agrupados por categoría:", porCategoria);

// ── 6. CLASES ───────────────────────────────────────────────────────────
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
console.log(productoPrueba.nombre, "| Disponible:", productoPrueba.estaDisponible(), "| Valor stock: Bs", productoPrueba.valorEnStock());

class ProductoConDescuento extends ProductoGomita {
  constructor(nombre, precio, stock, descuento) {
    super(nombre, precio, stock);
    this.descuento = descuento;
  }

  precioFinal() {
    return this.precio * (1 - this.descuento / 100);
  }
}

const gomitaOferta = new ProductoConDescuento("Gomitas Ácidas de Frutilla", 6.0, 25, 10);
console.log("Precio con 10% de descuento: Bs", gomitaOferta.precioFinal().toFixed(2), "| Disponible:", gomitaOferta.estaDisponible());