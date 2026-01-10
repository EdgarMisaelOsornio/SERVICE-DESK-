// js/main.js

import { cargarOficinas } from "./dataStore.js";
import { iniciarBuscador } from "./buscador.js";
import { cargarSelectDirecciones, agregarOficinasPorDireccion } from "./filtros.js";
import { generar } from "./generador.js";
import { descargarExcel, descargarWord } from "./exportaciones.js";

window.onload = async () => {
  try {
    // 1️⃣ Cargar Excel (única fuente de datos)
    await cargarOficinas();

    // 2️⃣ Inicializar módulos
    cargarSelectDirecciones();
    iniciarBuscador();

    // 3️⃣ Exponer funciones al HTML
    window.generar = generar;
    window.agregarOficinasPorDireccion = agregarOficinasPorDireccion;
    window.descargarExcel = descargarExcel;
    window.descargarWord = descargarWord;

    console.log("✅ Aplicación inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    alert("Error al cargar la información de oficinas. Verifica el archivo Excel.");
  }
};
