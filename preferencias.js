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
  boton.textContent = preferencias.tema === "oscuro" ? "🌞 Modo claro" : "🌙 Modo oscuro";

  document.querySelector("#orden").value = preferencias.orden;

  document.querySelector("#estado-prefs").textContent =
    `Tema ${preferencias.tema} activado · Catálogo ordenado por ${preferencias.orden}.`;
}

aplicarPreferencias();

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
});

document.querySelector("#olvidar").addEventListener("click", () => {
  localStorage.removeItem(CLAVE);
  preferencias = { ...PREFERENCIAS_POR_DEFECTO };
  aplicarPreferencias();
  document.querySelector("#estado-prefs").textContent = "Preferencias olvidadas. Se usarán los valores por defecto.";
});

// ── 5. LO QUE NUNCA VA EN localStorage ──────────────────────────────────
// Contraseñas, tokens de sesión, datos de tarjetas de crédito ni información
// personal sensible (nombre, teléfono, dirección). localStorage es accesible
// por cualquier script en la misma página y no tiene fecha de expiración.

// ── 6. GEOLOCATION ──────────────────────────────────────────────────────
// Coordenadas del local: Av. Camino Viacha, La Paz, Bolivia
const LOCAL = { lat: -16.5205, lng: -68.1946 };

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
      $ubic.textContent =
        `📍 Estás a ${km.toFixed(1)} km de Dulce Nube Leonel (precisión: ${Math.round(accuracy)} m).`;
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
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
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
