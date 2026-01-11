import { agnadirEnArchivo } from "./archivos.js"

let logsPendientes = [];
let iterador = null;

//Agnade un log para que se guarde en un archivo
const agnadirLog = async (archivo, texto, suprimirConsola) => {
    if (iterador !== null) logsPendientes = [...logsPendientes, {archivo, texto: Date.now() + ":   " + texto}];
    if (!suprimirConsola) console.log(archivo, Date.now() + ":   " + texto);
}

//Inicia el proceso para guardar los logs en los archivos cada x tiempo
const iniciarServicioLogs = () => {
    const ruta = process.env.RUTA_LOGS;
    iterador = setInterval(() => {
        logsPendientes.forEach(async (e) => {
            await agnadirEnArchivo(e.texto, ruta, e.archivo);
        });
        logsPendientes = [];
    }, process.env.TIEMPO_LOGS ?? 8000);
}

//Parar el proceso de los logs temporalmente
const pararLogs = () => {
    clearInterval(iterador);
    iterador = null;
}

export { agnadirLog, iniciarServicioLogs, pararLogs }