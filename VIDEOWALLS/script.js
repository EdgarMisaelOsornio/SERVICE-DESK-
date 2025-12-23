
const base = [
  ["TCUS0","ACAPULCO CUAUHTEMOC SALA 1","MAGIC"],
  ["ALUS0","ACAPULCO PAPAGAYO SALA UNICA","MAGIC"],
  ["APVS0","AG. TLAQUEPAQUE SALA UNICA","MAX"],
  ["AGSS0","AGUASCALIENTES SALA 1","MAX"],
  ["OBRS1","CD OBREGON SALA 1","TECNOMANIA"],
  ["CELS0","CELAYA SALA UNICA","MAX"],
  ["CHIS0","CHIHUAHUA SALA UNICA","TECNOMANIA"],
  ["CHGS0","CHILPANCINGO SALA 1","MAGIC"],
  ["JUAS0","CIUDAD JUAREZ SALA  UNICA","TECNOMANIA"],
  ["JUAS2","CIUDAD JUAREZ SALA 2","TECNOMANIA"],
  ["JUAS3","CIUDAD JUAREZ SALA 3","TECNOMANIA"],
  ["CUES0","CUERNAVACA SALA UNICA","MAX"],
  ["CULS0","CULIACAN SALA UNICA","MAX"],
  ["DGOS0","DURANGO SALA UNICA","MAX"],
  ["ENSS0","ENSENADA SALA 1","MAGIC"],
  ["GOMS0","GOMEZ PALACIO SALA UNICA","MAX"],
  ["GDAS0","GUADALAJARA SALA UNICA MOD 7","MAX"],
  ["HERS0","HERMOSILLO SALA UNICA","MAX"],
  ["IRAS0","IRAPUATO SALA UNICA","MAX"],
  ["CRCS0","LAS CRUCES SALA UNICA","TECNOMANIA"],
  ["LEOS0","LEON SALA UNICA","MAX"],
  ["MATS0","MATAMOROS SALA 1","MAX"],
  ["MAZS0","MAZATLAN SALA UNICA","MAX"],
  ["MXIS1","MEXICALI SALA 1","TECNOMANIA"],
  ["MXIS2","MEXICALI SALA 2","TECNOMANIA"],
  ["MXN1A","MEXICO NORTE SALA 1 1ER PANTALLA","MAX"],
  ["MXN1B","MEXICO NORTE SALA 1 2DA PANTALLA","MAX"],
  ["MXN2A","MEXICO NORTE SALA 2","MAX"],
  ["MXN2B","MEXICO NORTE SALA 2.5","TECNOMANIA"],
  ["MXN3A","MEXICO NORTE SALA 3","TECNOMANIA"],
  ["MXN4A","MEXICO NORTE SALA 4 1ER PANTALLA","TECNOMANIA"],
  ["MXN4B","MEXICO NORTE SALA 4 2DA PANTALLA","MAX"],
  ["MXN5A","MEXICO NORTE SALA 5 1ER PANTALLA","MAX"],
  ["MXN5B","MEXICO NORTE SALA 5 2DA PANTALLA","MAX"],
  ["MXN6A","MEXICO NORTE SALA 6","MAX"],
  ["MXN8A","MEXICO NORTE SALA 8","TECNOMANIA"],
  ["MXSS1","MEXICO SUR SALA 1","TECNOMANIA"],
  ["MOCS0","MOCHIS SALA UNICA","STRATECH"],
  ["MONS0","MONCLOVA SALA UNICA","MAX"],
  ["MTYS0","MONTERREY SALA UNICA","MAX"],
  ["MORS0","MORELIA SALA UNICA","MAX"],
  ["MRNS0","MOROLEON SALA UNICA","MAX"],
  ["LARS0","NUEVO LAREDO SALA UNICA","TECNOMANIA"],
  ["PCHS0","PACHUCA SALA UNICA","MAX"],
  ["UGBS0","PISTOLAS MENESES UNICA","MAX"],
  ["POZS0","POZA RICA SALA UNICA","STRATECH"],
  ["PUES0","PUEBLA SALA UNICA","MAX"],
  ["VTAS0","PUERTO VALLARTA SALA UNICA","MAX"],
  ["QROS1","QUERETARO SALA 1","TECNOMANIA"],
  ["REYS0","REYNOSA SALA UNICA","MAX"],
  ["SCAS0","SALAMANCA SALA UNICA","MAX"],
  ["SJR01","SAN JUAN DEL RIO SALA 1","MAX"],
  ["SLPS0","SAN LUIS POTOSI SALA UNICA","MAX"],
  ["SMAS1","SAN MIGUEL DE ALLENDE SALA 1","MAX"],
  ["SILS0","SILAO SALA UNICA","MAX"],
  ["TPOS0","TAMPICO SALA 1","MAX"],
  ["TAXS0","TAXCO SALA 01","MAX"],
  ["TEPS1","TEPIC SALA 1","MAX"],
  ["ZLTS1","TEPOTZOTLAN SALA 1","MAX"],
  ["TIJS0","TIJUANA SALA UNICA","TECNOMANIA"],
  ["TOLS0","TOLUCA SALA UNICA","MAX"],
  ["TORS1","TORREON SALA 1","MAX"],
  ["TGOS0","TULANCINGO SALA UNICA","TECNOMANIA"],
  ["ZACS0","ZACATECAS SALA UNICA","MAX"],
  ["APNS1","ZAPOPAN P NORTE SALA 1","MAX"],
  ["ZIHS0","ZIHUATANEJO SALA 1","MAGIC"],
  ["SJLS0","SAN JUAN DE LOS LAGOS SALA UNICA","MAX"],
  ["QUERETARO CONEXION","QUERETARO SALA CONEXION","TECNOMANIA"]
];

// --- UTILIDADES ---
function normalizar(texto){
  if(!texto || typeof texto !== "string") return "";
  return texto
    .replace(/^\s*/,"")
    .replace(/^\[[^\]]+\]/,"")       // Quita códigos [0001]
    .replace(/^\d+\s*/,"")           // Quita números iniciales (0319)
    .replace(/,/g," ")               // Comas -> espacio
    .replace(/\./g,"")               // Quita puntos
    .replace(/\s+/g," ")             // Espacios múltiples
    .replace(/\bCD\b/gi,"CIUDAD")   // CD -> CIUDAD
    .trim()
    .toUpperCase();
}

let BUSQUEDA_ACTIVA = false; // flag global para cancelar

function cancelarBusqueda(){
  if(!BUSQUEDA_ACTIVA) return;
  BUSQUEDA_ACTIVA = false;
  document.getElementById("btnBuscar").disabled = false;
  document.getElementById("btnCancelar").disabled = true;
  document.getElementById("progresoBusqueda").innerText = "Búsqueda cancelada por el usuario.";
  document.getElementById("barraProgreso").style.display = "none";
  console.log("Procesamiento abortado por cancelación.");
}

// --- BUSCAR POR NOMBRE ---
function buscarPorNombre(){
  if(BUSQUEDA_ACTIVA){
    console.log("Ya hay una búsqueda en curso.");
    return;
  }

  const raw = document.getElementById("solicitudes").value;
  const resultado = document.getElementById("resultadoNombres");
  const progresoEl = document.getElementById("progresoBusqueda");
  const barra = document.getElementById("barraProgreso");
  const barraFill = document.getElementById("barraProgresoFill");
  resultado.innerHTML = "";
  progresoEl.innerHTML = "";
  barra.style.display = "none";
  barraFill.style.width = "0%";

  if(!raw || raw.trim() === ""){
    resultado.innerHTML = "<p class='no-match'>Ingrese al menos una oficina.</p>";
    return;
  }

  const LIMITE_MODO_REDUCIDO = 100; // hasta 100 -> modo normal; 101+ -> modo reducido
  const BATCH_SIZE = 250; // procesar 250 líneas por tick (ajusta si quieres)
  const RENDER_BATCH = 300; // filas a renderizar por tick para evitar freeze al mostrar resultados

  const LINE_SPLIT = raw.replace(/\r/g,"").split("\n");

  // Normalizar entradas y filtrar vacíos
  const entradas = LINE_SPLIT.map(l => ({ original: l.trim(), normalizada: normalizar(l) }))
                            .filter(e => e.normalizada && e.normalizada.trim() !== "");

  const totalEntradas = entradas.length;
  if(totalEntradas === 0){
    resultado.innerHTML = "<p class='no-match'>No se encontraron líneas válidas.</p>";
    return;
  }

  const modoReducido = totalEntradas > LIMITE_MODO_REDUCIDO;

  // Preparar estado
  BUSQUEDA_ACTIVA = true;
  document.getElementById("btnBuscar").disabled = true;
  document.getElementById("btnCancelar").disabled = false;

  progresoEl.innerText = `Iniciando procesamiento de ${totalEntradas} oficinas...`;
  barra.style.display = "block";

  let index = 0;
  let encontradas = []; // array de objetos {buscada,nombre,proveedor}
  let noEncontradas = []; // sólo si modo normal

  // procesar por batches
  function procesarBatch(){
    if(!BUSQUEDA_ACTIVA){
      console.log("Procesamiento abortado por cancelación.");
      return;
    }

    const end = Math.min(index + BATCH_SIZE, totalEntradas);

    for(let i = index; i < end; i++){
      const e = entradas[i];
      const palabras = e.normalizada.split(" ").filter(Boolean);
      const coincidencias = base.filter(b => {
        const nombreBase = normalizar(b[1]);
        return palabras.every(p => {
          const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp(`\\b${esc}\\b`, "i");
          return re.test(nombreBase);
        });
      });

      if(coincidencias.length === 0){
        if(!modoReducido) noEncontradas.push({ buscada: e.original });
      } else {
coincidencias.forEach(c => {
  // clave única por combinación de búsqueda + sala encontrada
  const key = e.normalizada + "||" + c[1];

  // Evitar duplicados exactos
  if (!encontradas.some(x => x.key === key)) {
    encontradas.push({
      key,
      buscada: e.original,
      nombre: c[1],
      proveedor: c[2]
    });
  }
});
      }
    }

    index = end;
    const pct = Math.round((index / totalEntradas) * 100);
    progresoEl.innerText = `Procesando ${totalEntradas} oficinas... ${pct}% (${index}/${totalEntradas})`;
    barraFill.style.width = pct + "%";

    if(index < totalEntradas){
      // continuar en próximo tick
      setTimeout(procesarBatch, 0);
    } else {
      // terminado: renderizar resultados
      setTimeout(() => renderizarResultados(), 0);
    }
  }

  // render por fragmentos para no bloquear la UI al pintar
  function renderizarResultados(){
    if(!BUSQUEDA_ACTIVA) return;

    const resumen = document.createElement("div");
    resumen.innerHTML = `<p>Encontradas: <strong>${encontradas.length}</strong>${!modoReducido ? ` — No encontradas: <strong>${noEncontradas.length}</strong>` : ""}</p>`;
    resultado.appendChild(resumen);

    if(modoReducido){
      const titulo = document.createElement("h4");
      titulo.innerText = `⚠ Modo reducido (se ingresaron ${totalEntradas} oficinas). Solo se muestran coincidencias encontradas.`;
      resultado.appendChild(titulo);

      if(encontradas.length === 0){
        const p = document.createElement("p");
        p.className = "no-match";
        p.innerText = "❌ Ninguna coincidencia encontrada";
        resultado.appendChild(p);
        finalizar();
        return;
      }

      // crear tabla y renderizar filas por lotes
      const tabla = document.createElement("table");
      tabla.innerHTML = `<thead><tr><th>Buscada</th><th>Coincidencia</th><th>Proveedor</th></tr></thead><tbody></tbody>`;
      resultado.appendChild(tabla);
      const tbody = tabla.querySelector("tbody");

      let ri = 0;
      function renderRowsReducidas(){
        if(!BUSQUEDA_ACTIVA) return;
        const end = Math.min(ri + RENDER_BATCH, encontradas.length);
        // añadir filas al DOM
        const frag = document.createDocumentFragment();
        for(let j = ri; j < end; j++){
          const r = encontradas[j];
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${escapeHtml(r.buscada)}</td><td class="match">${escapeHtml(r.nombre)}</td><td>${escapeHtml(r.proveedor)}</td>`;
          frag.appendChild(tr);
        }
        tbody.appendChild(frag);
        ri = end;
        const pctRender = Math.round((ri / encontradas.length) * 100);
        progresoEl.innerText = `Renderizando coincidencias: ${pctRender}% (${ri}/${encontradas.length})`;
        barraFill.style.width = pctRender + "%";
        if(ri < encontradas.length){
          setTimeout(renderRowsReducidas, 0);
        } else {
          finalizar();
        }
      }
      renderRowsReducidas();

    } else {
      // MODO NORMAL: debemos mostrar por cada entrada su/s coincidencias o "No encontrada"
      const tabla = document.createElement("table");
      tabla.innerHTML = `<thead><tr><th>Oficina buscada</th><th>Coincidencias en Base de Datos</th></tr></thead><tbody></tbody>`;
      resultado.appendChild(tabla);
      const tbody = tabla.querySelector("tbody");

      // construir mapa de coincidencias por texto buscado
      const map = new Map();
      encontradas.forEach(r => {
        const k = r.buscada;
        if(!map.has(k)) map.set(k, []);
        map.get(k).push(`${escapeHtml(r.nombre)} — <strong>${escapeHtml(r.proveedor)}</strong>`);
      });

      let ri = 0;
      function renderRowsNormal(){
        if(!BUSQUEDA_ACTIVA) return;
        const end = Math.min(ri + RENDER_BATCH, entradas.length);
        const frag = document.createDocumentFragment();
        for(let j = ri; j < end; j++){
          const e = entradas[j];
          const lista = map.get(e.original);
          const tr = document.createElement("tr");
          if(!lista || lista.length === 0){
            tr.innerHTML = `<td>${escapeHtml(e.original)}</td><td class="no-match">❌ No encontrada</td>`;
          } else {
            tr.innerHTML = `<td>${escapeHtml(e.original)}</td><td class="match">✅<br>${lista.join("<br>")}</td>`;
          }
          frag.appendChild(tr);
        }
        tbody.appendChild(frag);
        ri = end;
        const pctRender = Math.round((ri / entradas.length) * 100);
        progresoEl.innerText = `Renderizando resultados: ${pctRender}% (${ri}/${entradas.length})`;
        barraFill.style.width = pctRender + "%";
        if(ri < entradas.length){
          setTimeout(renderRowsNormal, 0);
        } else {
          finalizar();
        }
      }
      renderRowsNormal();
    }
  }

  function finalizar(){
    BUSQUEDA_ACTIVA = false;
    document.getElementById("btnBuscar").disabled = false;
    document.getElementById("btnCancelar").disabled = true;
    document.getElementById("barraProgreso").style.display = "none";
    document.getElementById("progresoBusqueda").innerText += " — Listo.";
    console.log("Búsqueda finalizada.");
  }

  // helper: escape HTML para evitar inyección o rotura de tablas
  function escapeHtml(str){
    if(!str) return "";
    return String(str)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  // iniciar procesamiento
  setTimeout(procesarBatch, 0);
}

// --- BUSCAR POR ARCHIVOS --- (mantenemos tu lógica original)
let archivosSubidos = [];
function buscarPorArchivos(){
  const archivos = document.getElementById("archivos").files;
  const resultado = document.getElementById("resultadoArchivos");
  resultado.innerHTML = "";
  if(!archivos.length) return;

  archivosSubidos = Array.from(archivos);

  let tabla = `<table><thead><tr><th>Archivo</th><th>Código</th><th>Nombre Completo</th><th>Proveedor</th><th>Estado</th></tr></thead><tbody>`;

  archivosSubidos.forEach(archivo=>{
    const codigo = archivo.name.replace(/\s*\(.*\)/,"").split('.')[0].toUpperCase();
    const match = base.find(b => b[0] === codigo);
    if(match){
      tabla += `<tr><td>${archivo.name}</td><td>${codigo}</td><td>${match[1]}</td><td>${match[2]}</td><td class="match">✅</td></tr>`;
    } else {
      tabla += `<tr><td>${archivo.name}</td><td>${codigo}</td><td>—</td><td>—</td><td class="no-match">❌</td></tr>`;
    }
  });

  tabla += "</tbody></table>";
  resultado.innerHTML = tabla;
}

// --- DESCARGAR ZIP ---
function descargarZip(){
  if(!archivosSubidos.length) return alert("No hay archivos procesados.");
  const zip = new JSZip();
  archivosSubidos.forEach(archivo=>{
    const codigo = archivo.name.replace(/\s*\(.*\)/,"").split('.')[0].toUpperCase();
    const match = base.find(b => b[0] === codigo);
    const proveedor = match ? match[2] : "SIN_PROVEEDOR";
    zip.folder(proveedor).file(archivo.name, archivo);
  });
  zip.generateAsync({type:"blob"}).then(c=>saveAs(c,"Archivos_Videowalls.zip"));
  zip.generateAsync({type:"blob"}).then(c=>saveAs(c,"Archivos_Videowalls.zip"));
}