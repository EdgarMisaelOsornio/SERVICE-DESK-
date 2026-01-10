export let oficinas = [];

export async function cargarOficinas() {
  console.log("🔄 Intentando cargar Excel...");

  const excelURL = new URL(
    "../OFICINAS NOMENCLATURAS.xlsx",
    import.meta.url
  );

  const response = await fetch(excelURL);
  if (!response.ok) {
    throw new Error("No se pudo cargar el archivo Excel (fetch falló)");
  }

  const data = await response.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const raw = XLSX.utils.sheet_to_json(sheet);

  oficinas = raw.map(row => {
    const claveOriginal = String(row.CLAVE).trim().toUpperCase();

    return {
      // ✅ SOLO números se normalizan
      clave: /^\d+$/.test(claveOriginal)
        ? claveOriginal.padStart(4, "0")
        : claveOriginal,

      nombre: row.NOMBRE?.toString().trim() ?? "",
      nomenclatura: row.NOMENCLATURA?.toString().trim() ?? "",
      direccion: row.DIRECCION?.toString().trim() ?? ""
    };
  });

  console.log(`📊 Oficinas cargadas: ${oficinas.length}`);
}
