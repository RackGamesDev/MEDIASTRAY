import { agnadirEnArchivo } from "./archivos.js"

let logsPendientes = [];
let iterador = null;

const agnadirLog = async (archivo, texto) => {
    logsPendientes = [...logsPendientes, {archivo, texto: Date.now() + ":   " + texto}];
}

const iniciarServicioLogs = () => {
    const ruta = process.env.RUTA_LOGS;
    iterador = setInterval(() => {
        logsPendientes.forEach(async (e) => {
            await agnadirEnArchivo(e.texto, ruta, e.archivo);
        });
        logsPendientes = [];
    }, process.env.TIEMPO_LOGS ?? 8000);
}

const pararLogs = () => {
    clearInterval(iterador);
    iterador = null;
}

export { agnadirLog, iniciarServicioLogs, pararLogs }