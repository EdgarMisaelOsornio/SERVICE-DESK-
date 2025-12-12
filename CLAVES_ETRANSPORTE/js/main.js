import { iniciarBuscador } from "./CLAVES_ETRANSPORTE/js/buscador.js";
import { generar } from "./CLAVES_ETRANSPORTE/js/generador.js";
import { descargarExcel, descargarWord } from "./CLAVES_ETRANSPORTE/js/exportaciones.js";
import { cargarSelectDirecciones, agregarOficinasPorDireccion } from "./CLAVES_ETRANSPORTE/js/filtros.js";
import { listaDirecciones } from "./CLAVES_ETRANSPORTE/data/direccionesLista.js";

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