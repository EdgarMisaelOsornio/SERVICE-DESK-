import { oficinas } from "./dataStore.js";

// ============================
// CARGAR SELECT DE DIRECCIONES
// ============================
export function cargarSelectDirecciones() {
  const select = document.getElementById("filtroDireccion");
  if (!select) return;

  // Limpiar opciones anteriores
  select.innerHTML = `<option value="">-- Selecciona una Dirección --</option>`;

  const direccionesUnicas = [
    ...new Set(oficinas.map(o => o.direccion).filter(Boolean))
  ];

  direccionesUnicas.forEach(dir => {
    const opt = document.createElement("option");
    opt.value = dir;
    opt.textContent = dir;
    select.appendChild(opt);
  });
}

// =======================================
// AGREGAR OFICINAS SEGÚN LA DIRECCIÓN
// =======================================
export function agregarOficinasPorDireccion() {
  const direccion = document.getElementById("filtroDireccion").value;
  const textarea = document.getElementById("oficinas");
  const error = document.getElementById("errores");

  if (!direccion) {
    error.textContent = "⚠️ Selecciona una dirección primero.";
    setTimeout(() => (error.textContent = ""), 3000);
    return;
  }

  let lines = textarea.value
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  // Buscar oficinas del Excel con esa dirección
  const oficinasPorDireccion = oficinas
    .filter(o => o.direccion === direccion)
    .map(o => o.clave);

  let agregadas = 0;

  oficinasPorDireccion.forEach(clave => {
    if (!lines.includes(clave)) {
      lines.push(clave);
      agregadas++;
    }
  });

  textarea.value = lines.join("\n");

  error.textContent = `🟢 Se agregaron ${agregadas} oficinas de "${direccion}".`;
  setTimeout(() => (error.textContent = ""), 4000);
}
