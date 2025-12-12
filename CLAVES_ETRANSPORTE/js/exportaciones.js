import { obtenerResultados } from './generador.js';

export function descargarExcel() {
  const resultados = obtenerResultados();
  if (!resultados.length) return alert("Genera primero los datos");

  const ws = XLSX.utils.json_to_sheet(resultados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Oficinas");
  XLSX.writeFile(wb, "Oficinas.xlsx");
}

export function descargarWord() {
  const resultados = obtenerResultados();
  if (!resultados.length) return alert("Genera primero los datos");

  let html = "<html><body><h2>Resultado de Oficinas</h2>";
  html += "<table border='1' cellpadding='5'><tr><th>Puesto</th><th>Oficina</th><th>Abreviatura</th><th>Dirección</th><th>Clave</th></tr>";

  resultados.forEach(r => {
    html += `<tr><td>${r.Puesto}</td><td>${r.Oficina}</td><td>${r.Abreviatura}</td><td>${r.Dirección}</td><td>${r.Clave}</td></tr>`;
  });

  html += "</table></body></html>";

  const blob = new Blob([html], { type: "application/msword" });
  saveAs(blob, "Oficinas.doc");
}
