import { iniciarBuscador } from "./buscador.js";
import { generar } from "./generador.js";
import { descargarExcel, descargarWord } from "./exportaciones.js";
import { cargarSelectDirecciones, agregarOficinasPorDireccion } from "./filtros.js";
import { listaDirecciones } from "../data/direccionesLista.js";

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