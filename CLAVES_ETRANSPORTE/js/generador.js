import { oficinas } from "./dataStore.js";

let resultados = [];

/**
 * Rellena la clave de usuario a 7 dígitos
 */
function pad7(n) {
  return n.toString().padStart(7, "0");
}

/**
 * Normaliza SOLO para búsqueda:
 * - mayúsculas
 * - sin espacios
 * - sin ceros a la izquierda
 */
function normalizarParaBusqueda(valor) {
  return String(valor)
    .trim()
    .toUpperCase()
    .replace(/^0+/, "");
}

export function generar() {
  const lista = document.getElementById("oficinas").value
    .trim()
    .split(/\r?\n/);

  const usuario = document.getElementById("usuario").value.trim();
  const puesto = document.getElementById("puesto").value;

  if (!usuario || isNaN(usuario)) {
    alert("La clave de usuario debe ser numérica y no estar vacía");
    return;
  }

  resultados = [];
  let out = "";
  const errores = [];

  // Eliminar duplicados
  const oficinasUnicas = [...new Set(lista.map(o => o.trim()))];

  oficinasUnicas.forEach(valorIngresado => {
    if (!valorIngresado) return;

    const claveBusqueda = normalizarParaBusqueda(valorIngresado);

    // 🔍 Buscar oficina en el Excel
    const oficina = oficinas.find(o =>
      normalizarParaBusqueda(o.clave) === claveBusqueda
    );

    if (!oficina) {
      errores.push(`Oficina ${valorIngresado} no encontrada.`);
      return;
    }

    const claveGenerada = `${oficina.nomenclatura}${pad7(usuario)}`;

    out +=
`PUESTO: ${puesto} ${oficina.nomenclatura} ${oficina.clave}
OFICINA: ${oficina.clave}    NOMBRE: ${oficina.nombre}
DIRECCIÓN: ${oficina.direccion}
CLAVE: ${claveGenerada}

`;

    resultados.push({
      Puesto: `${puesto} ${oficina.nomenclatura} ${oficina.clave}`,
      Oficina: oficina.clave,
      Nombre: oficina.nombre,
      Nomenclatura: oficina.nomenclatura,
      Dirección: oficina.direccion,
      Clave: claveGenerada
    });
  });

  document.getElementById("resultado").innerText = out.trim();
  document.getElementById("errores").innerText = errores.join("\n");
}

export function obtenerResultados() {
  return resultados;
}
