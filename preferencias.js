// ── 1. localStorage Y sessionStorage ────────────────────────────────────
const CLAVE = "dulcenube:preferencias";

const PREFERENCIAS_POR_DEFECTO = { tema: "claro", orden: "nombre" };

// ── 2. LEER CON try/catch ───────────────────────────────────────────────
function leerPreferencias() {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (!texto) return { ...PREFERENCIAS_POR_DEFECTO };

    const guardado = JSON.parse(texto);

    return { ...PREFERENCIAS_POR_DEFECTO, ...guardado };

  } catch (error) {
    console.warn("Preferencias corruptas, se usan las por defecto:", error.message);
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}

function guardarPreferencias(prefs) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.warn("No se pudo guardar:", error.message);
    return false;
  }
}

// ── 3. APLICAR LO GUARDADO AL CARGAR ────────────────────────────────────
let preferencias = leerPreferencias();

function aplicarPreferencias() {

  document.body.classList.toggle("tema-oscuro", preferencias.tema === "oscuro");

  const boton = document.querySelector("#tema-toggle");
  boton.setAttribute("aria-pressed", preferencias.tema === "oscuro");
  boton.querySelector(".tema-icono").textContent = preferencias.tema === "oscuro" ? "🌞" : "🌙";
  boton.querySelector(".tema-etiqueta").textContent = preferencias.tema === "oscuro" ? "Modo claro" : "Modo oscuro";

  document.querySelector("#orden").value = preferencias.orden;

  document.querySelector("#estado-prefs").textContent =
    `Tema ${preferencias.tema} activado · Catálogo ordenado por ${preferencias.orden}.`;
}

aplicarPreferencias();
if (typeof actualizar === "function") actualizar(); // aplica el orden guardado

// ── 4. GUARDAR AL CAMBIAR ───────────────────────────────────────────────
document.querySelector("#tema-toggle").addEventListener("click", () => {
  preferencias.tema = preferencias.tema === "oscuro" ? "claro" : "oscuro";
  guardarPreferencias(preferencias);
  aplicarPreferencias();
});

document.querySelector("#orden").addEventListener("change", (event) => {
  preferencias.orden = event.target.value;
  guardarPreferencias(preferencias);
  aplicarPreferencias();
  if (typeof actualizar === "function") actualizar();
});

document.querySelector("#olvidar").addEventListener("click", () => {
  localStorage.removeItem(CLAVE);
  preferencias = { ...PREFERENCIAS_POR_DEFECTO };
  aplicarPreferencias();
  if (typeof actualizar === "function") actualizar();
  document.querySelector("#estado-prefs").textContent = "Preferencias olvidadas. Se usarán los valores por defecto.";
});

// ── 5. LO QUE NUNCA VA EN localStorage ──────────────────────────────────
// Contraseñas, tokens de sesión, datos de tarjetas de crédito ni información
// personal sensible (nombre, teléfono, dirección). localStorage es accesible
// por cualquier script en la misma página y no tiene fecha de expiración.

// ── 6. GEOLOCATION ──────────────────────────────────────────────────────
// Coordenadas exactas del negocio proporcionadas por el propietario
const LOCAL = { lat: -16.5976720, lng: -68.2484980 };

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const aRad = (g) => (g * Math.PI) / 180;
  const dLat = aRad(lat2 - lat1);
  const dLng = aRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const $ubic = document.querySelector("#estado-ubicacion");

document.querySelector("#ubicarme").addEventListener("click", () => {

  if (!navigator.geolocation) {
    $ubic.textContent = "Tu navegador no permite compartir la ubicación.";
    $ubic.className = "error";
    return;
  }

  $ubic.textContent = "Obteniendo tu ubicación...";
  $ubic.className = "cargando";

  navigator.geolocation.getCurrentPosition(

    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const km = distanciaKm(latitude, longitude, LOCAL.lat, LOCAL.lng);
      const enlaceRuta = document.createElement("a");
      enlaceRuta.href = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${LOCAL.lat},${LOCAL.lng}`;
      enlaceRuta.target = "_blank";
      enlaceRuta.rel = "noopener noreferrer";
      enlaceRuta.textContent = "Abrir indicaciones en Google Maps";

      $ubic.replaceChildren(
        document.createTextNode(
          `Estás aproximadamente a ${km.toFixed(1)} km en línea recta de Dulce Nube Leonel (precisión de ubicación: ${Math.round(accuracy)} m). `
        ),
        document.createElement("br"),
        enlaceRuta
      );
      $ubic.className = "ok";
    },

    (error) => {
      const mensajes = {
        [error.PERMISSION_DENIED]:
          "No diste permiso de ubicación. Puedes seguir usando la página igual.",
        [error.POSITION_UNAVAILABLE]:
          "No se pudo determinar tu ubicación. ¿Estás bajo techo?",
        [error.TIMEOUT]:
          "Tardó demasiado en responder. Intenta de nuevo.",
      };
      $ubic.textContent = mensajes[error.code] || "No se pudo obtener la ubicación.";
      $ubic.className = "error";
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    }
  );
});

// ── 7. SESSIONSSTORAGE: contador de visitas en la sesión actual ──────────
const visitas = Number(sessionStorage.getItem("dulcenube:visitas") || 0) + 1;
sessionStorage.setItem("dulcenube:visitas", visitas);
const $visitas = document.querySelector("#visitas-sesion");
if ($visitas) {
  $visitas.textContent = `Páginas visitadas en esta sesión: ${visitas}`;
}


// ── 8. VENTANA DE PREFERENCIAS (abre con el botón superior) ─────────────
const $btnPrefs = document.querySelector("#btn-preferencias");
const $panelPrefs = document.querySelector("#preferencias");

$btnPrefs.addEventListener("click", () => {
  $panelPrefs.showModal();
  $btnPrefs.setAttribute("aria-expanded", "true");
});

$panelPrefs.addEventListener("close", () => $btnPrefs.setAttribute("aria-expanded", "false"));
document.querySelector("#cerrar-prefs").addEventListener("click", () => $panelPrefs.close());

// Clic fuera de la ventana (en el fondo oscuro) también la cierra
$panelPrefs.addEventListener("click", (event) => {
  if (event.target === $panelPrefs) $panelPrefs.close();
});
