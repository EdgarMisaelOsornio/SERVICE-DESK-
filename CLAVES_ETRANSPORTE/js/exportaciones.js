import { obtenerResultados } from "./generador.js";

// ============================
// DESCARGAR EXCEL
// ============================
export function descargarExcel() {
  const resultados = obtenerResultados();
  if (!resultados.length) {
    alert("Genera primero los datos");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(resultados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Oficinas");
  XLSX.writeFile(wb, "Oficinas.xlsx");
}

// ============================
// DESCARGAR WORD
// ============================
export function descargarWord() {
  const resultados = obtenerResultados();
  if (!resultados.length) {
    alert("Genera primero los datos");
    return;
  }

  let html = `
    <html>
    <body>
      <h2>Resultado de Oficinas</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Puesto</th>
          <th>Oficina</th>
          <th>Nombre</th>
          <th>Nomenclatura</th>
          <th>Dirección</th>
          <th>Clave</th>
        </tr>
  `;

  resultados.forEach(r => {
    html += `
      <tr>
        <td>${r.Puesto}</td>
        <td>${r.Oficina}</td>
        <td>${r.Nombre}</td>
        <td>${r.Nomenclatura}</td>
        <td>${r.Dirección}</td>
        <td>${r.Clave}</td>
      </tr>
    `;
  });

  html += `
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/msword;charset=utf-8;" });
  saveAs(blob, "Oficinas.doc");
}
