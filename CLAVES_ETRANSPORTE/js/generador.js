import { oficinasMap } from '../data/oficinasMap.js';
import { direccionesMap } from '../data/direccionesMap.js';

let resultados = [];

function pad7(n) {
  return n.toString().padStart(7, "0");
}

export function generar() {
  const oficinas = document.getElementById("oficinas").value.trim().split("\n");
  const usuario = document.getElementById("usuario").value.trim();
  const puesto = document.getElementById("puesto").value;

  if (!usuario || isNaN(usuario)) {
    alert("La clave de usuario debe ser numérica y no estar vacía");
    return;
  }

  resultados = [];
  let out = "";
  const errores = [];

  const oficinasUnicas = [...new Set(oficinas.map(o => o.trim()))];

  oficinasUnicas.forEach(numero => {
    if (!numero) return;

    const abrev = oficinasMap[numero];

    if (!abrev) {
      errores.push(`Oficina ${numero} no encontrada.`);
      return;
    }

    const direccion = direccionesMap[abrev] || "SIN DIRECCIÓN";
    const clave = `${abrev}${pad7(usuario)}`;

    out += `PUESTO: ${puesto} ${abrev} ${numero}\nOFICINA: ${numero}    ABREVIATURA: ${abrev}   DIRECCIÓN: ${direccion}\nCLAVE: ${clave}\n\n`;

    resultados.push({
      Puesto: `${puesto} ${abrev} ${numero}`,
      Oficina: numero,
      Abreviatura: abrev,
      Dirección: direccion,
      Clave: clave
    });
  });

  document.getElementById("resultado").innerText = out.trim();
  document.getElementById("errores").innerText = errores.join("\n");
}

export function obtenerResultados() {
    return resultados;
}
