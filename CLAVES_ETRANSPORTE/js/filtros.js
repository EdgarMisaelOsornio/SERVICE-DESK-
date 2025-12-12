import { baseOficinas } from "../data/baseOficinas.js";

export function cargarSelectDirecciones(listaDirecciones) {
    const select = document.getElementById("filtroDireccion");
    if (!select) return;

    listaDirecciones.forEach(dir => {
        const opt = document.createElement("option");
        opt.value = dir;
        opt.textContent = dir;
        select.appendChild(opt);
    });
}

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

    // Buscar oficinas que tengan esa dirección EXACTA
    const oficinas = baseOficinas
        .filter(o => (o.DIRECCION ?? "").trim().toLowerCase() === direccion.toLowerCase())
        .map(o => o.CLAVE.padStart(4, "0"));

    let agregadas = 0;

    oficinas.forEach(cl => {
        if (!lines.includes(cl)) {
            lines.push(cl);
            agregadas++;
        }
    });

    textarea.value = lines.join("\n");

    error.textContent = `🟢 Se agregaron ${agregadas} oficinas pertenecientes a "${direccion}".`;
    setTimeout(() => (error.textContent = ""), 4000);
}
