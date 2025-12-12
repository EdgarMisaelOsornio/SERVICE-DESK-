/* ---------- CONFIG ---------- */
const CSV_FILE = 'AGENCIAS.csv';

// Encabezados para copiar y CSV
const OUTPUT_HEADERS = [
  'Usuario',
  'Contraseña',
  'Confirmación',
  'Descripción',
  'Oficina',
  'Nomenclatura',
  'Usuario Citas'
];

const OUTPUT_IDS = [
  'outUser',
  'outPass',
  'outConfirm',
  'outDesc',
  'outOffice',
  'outNomen',
  'outCitasUser'
];

let officeData = [];

/* ---------- UTIL ---------- */
const $ = id => document.getElementById(id);

const statusDiv = $('loadStatus');
const spinner = $('spinner');
const officeSelect = $('officeSelect');
const generateBtn = $('generate');
const copyAllBtn = $('copyAll');
const downloadBtn = $('downloadCsv');
const clearBtn = $('clearBtn');
const outputArea = $('outputArea');
const curpInput = $('curpInput');
const nameInput = $('nameInput');
const fileInput = $('fileInput');
const dropZone = $('dropZone');

const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/i;

/* ------------------------------------------------------------
   PARSER PARA CSV CON COMAS INTERNAS
-------------------------------------------------------------*/
function smartSplitCSVLine(line, separator) {
  let result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === separator && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== "");
  if (lines.length <= 1) return [];

  let separator = lines[0].includes(';') ? ';' : ',';

  const headers = smartSplitCSVLine(lines[0], separator).map(h =>
    h.replace(/^"|"$/g, '').toUpperCase()
  );

  const idx = {
    number: headers.indexOf('NUMERO DE OFICINA'),
    nomen: headers.indexOf('NOMENCLATURA'),
    name: headers.indexOf('NOMBRE DE AGENCIA'),
    status: headers.indexOf('ESTATUS')
  };

  if (Object.values(idx).some(v => v === -1)) {
    throw new Error("Encabezados CSV incorrectos.");
  }

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const row = smartSplitCSVLine(lines[i], separator);

    if (row.length > 4) {
      const fixed = [
        row[idx.number],
        row[idx.nomen],
        row.slice(2, row.length - 1).join(" "),
        row[row.length - 1]
      ];
      row.length = 0;
      row.push(...fixed);
    }

    const estatus = (row[idx.status] || '').toUpperCase();

    if (estatus === "ACTIVA" || estatus === "INACTIVA") {
      data.push({
        officeNumber: row[idx.number] || '',
        nomen: row[idx.nomen] || '',
        officeName: row[idx.name] || '',
        status: estatus
      });
    }
  }

  data.sort((a, b) => Number(a.officeNumber) - Number(b.officeNumber));
  return data;
}

/* ---------- UI HELPERS ---------- */
function setStatus(message, type = "normal") {
  statusDiv.textContent = message;
  statusDiv.className = 'status-message' + (type === 'success' ? ' success' : '');
}

function showSpinner(show) {
  if (show) spinner.classList.add('show');
  else spinner.classList.remove('show');
}

/* ---------- LOAD CSV ---------- */
async function tryFetchCsv() {
  setStatus("Intentando cargar AGENCIAS.csv...");
  showSpinner(true);

  try {
    const resp = await fetch(CSV_FILE);
    if (!resp.ok) throw new Error(resp.statusText);

    const text = await resp.text();
    const parsed = parseCsv(text);

    officeData = parsed;
    populateOfficeSelect(parsed);

    officeSelect.disabled = false;
    generateBtn.disabled = false;

    setStatus(`¡Carga exitosa! ${parsed.length} agencias cargadas.`, "success");
  } catch {
    setStatus("No se pudo cargar AGENCIAS.csv. Súbelo manualmente.");
  } finally {
    showSpinner(false);
  }
}

function populateOfficeSelect(data) {
  officeSelect.innerHTML = '<option value="">-- Selecciona una agencia --</option>';

  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.officeNumber;
    opt.textContent = `${item.officeNumber} - ${item.officeName} (${item.status})`;
    opt.dataset.nomen = item.nomen;
    opt.dataset.status = item.status;
    officeSelect.appendChild(opt);
  });
}

/* ---------- GENERATION LOGIC (CORREGIDO CON TUS REGLAS) ---------- */

// USUARIO CORPORATIVO = NOMEN + OFICINA + 3 PRIMEROS DEL CURP
function generateCorporateUser(curp, nomen, office) {
  return nomen + office + curp.substring(0, 3);
}

// CONTRASEÑA = PRIMEROS 10 DEL CURP
function generatePassword(curp) {
  return curp.substring(0, 10);
}

// CITAS = NOMEN + 4 PRIMEROS DEL CURP + ISF
function generateCitasUser(curp, nomen) {
  return nomen + curp.substring(0, 4) + "ISF";
}

function validateInputs(curp, name, officeValue, selectedOption) {
  if (!curp || curp.length !== 18 || !CURP_REGEX.test(curp)) {
    setStatus("ERROR: CURP inválida.");
    return false;
  }
  if (!name || name.length < 5) {
    setStatus("ERROR: Ingresa el nombre completo.");
    return false;
  }
  if (!officeValue) {
    setStatus("ERROR: Debes seleccionar una oficina.");
    return false;
  }
  if (!selectedOption.dataset.nomen) {
    setStatus("ERROR: La oficina no tiene nomenclatura.");
    return false;
  }
  return true;
}

function generateKeys() {
  const curp = curpInput.value.trim().toUpperCase();
  const name = nameInput.value.trim().toUpperCase();
  const selectedOffice = officeSelect.value;
  const option = officeSelect.options[officeSelect.selectedIndex];

  if (!validateInputs(curp, name, selectedOffice, option)) {
    outputArea.hidden = true;
    return;
  }

  const nomen = option.dataset.nomen;
  const office = selectedOffice;

  const userCorp = generateCorporateUser(curp, nomen, office);
  const password = generatePassword(curp);
  const userCitas = generateCitasUser(curp, nomen);

  $('outUser').textContent = userCorp;
  $('outPass').textContent = password;
  $('outConfirm').textContent = password;
  $('outDesc').textContent = name;
  $('outOffice').textContent = office;
  $('outNomen').textContent = nomen;
  $('outCitasUser').textContent = userCitas;

  outputArea.hidden = false;
  setStatus("¡Claves generadas!", "success");
}

/* ---------- COPIAR COMPLETO ---------- */
function copyAll() {
  let texto = "";

  for (let i = 0; i < OUTPUT_HEADERS.length; i++) {
    const label = OUTPUT_HEADERS[i];
    const value = $(OUTPUT_IDS[i]).textContent;
    texto += `${label}: ${value}\n`;
  }

  navigator.clipboard.writeText(texto.trim())
    .then(() => setStatus("Datos copiados en formato claro.", "success"))
    .catch(() => prompt("Copia manual:", texto));
}

/* ---------- DESCARGAR CSV ---------- */
function downloadCsv() {
  const values = OUTPUT_IDS.map(id => $(id).textContent || '');
  const headerRow = OUTPUT_HEADERS.join(';');
  const dataRow = values.join(';');

  const csvContent = "\ufeff" + headerRow + "\n" + dataRow;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const curpPrefix = curpInput.value.trim().substring(0, 4).toUpperCase() || 'XXXX';
  const nomen = $('outNomen').textContent || 'NNN';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  link.download = `CLAVES_${curpPrefix}_${nomen}_${date}.csv`;
  link.href = URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setStatus(`Archivo ${link.download} descargado.`, 'success');
}

/* ---------- LIMPIAR (RESTAURADO) ---------- */
function limpiar() {
  curpInput.value = "";
  nameInput.value = "";
  officeSelect.value = "";

  OUTPUT_IDS.forEach(id => $(id).textContent = "");

  outputArea.hidden = true;

  setStatus("Formulario limpiado.", "success");
}

/* ---------- SUBIR CSV ---------- */
function handleFileContent(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = parseCsv(e.target.result);
      officeData = parsed;
      populateOfficeSelect(parsed);
      officeSelect.disabled = false;
      generateBtn.disabled = false;
      setStatus(`CSV cargado manualmente: ${parsed.length} agencias.`, 'success');
    } catch (err) {
      setStatus('Error procesando CSV: ' + err.message);
    }
  };
  reader.readAsText(file, 'UTF-8');
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  tryFetchCsv();

  curpInput.addEventListener('input', e => e.target.value = e.target.value.toUpperCase());
  nameInput.addEventListener('input', e => e.target.value = e.target.value.toUpperCase());

  generateBtn.addEventListener('click', generateKeys);
  copyAllBtn.addEventListener('click', copyAll);
  downloadBtn.addEventListener('click', downloadCsv);
  clearBtn.addEventListener('click', limpiar);

  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFileContent(e.target.files[0]);
    fileInput.value = "";
  });

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFileContent(e.dataTransfer.files[0]);
  });
});

