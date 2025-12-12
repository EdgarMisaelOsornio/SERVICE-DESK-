import { iniciarBuscador } from "/js/buscador.js";
import { generar } from "/js/generador.js";
import { descargarExcel, descargarWord } from "/js/exportaciones.js";
import { cargarSelectDirecciones, agregarOficinasPorDireccion } from "/js/filtros.js";
import { listaDirecciones } from "/data/direccionesLista.js";

window.onload = () => {
    iniciarBuscador();

    // Asignar funciones globales
    window.generar = generar;
    window.descargarExcel = descargarExcel;
    window.descargarWord = descargarWord;
    window.agregarOficinasPorDireccion = agregarOficinasPorDireccion;

    // Cargar lista de direcciones
    cargarSelectDirecciones(listaDirecciones);
};