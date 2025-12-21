import fs from 'fs';
import path from 'path';

const escribirArchivo = async (contenido, ruta, nombre, esTexto) => {
    try {
        await fs.promises.mkdir(ruta, {recursive:true});
        if (esTexto) {
            await fs.promises.writeFile(path.join(ruta, nombre), contenido, 'utf8');
        } else {
            await fs.promises.writeFile(path.join(ruta, nombre), contenido);
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const leerArchivo = async (rutaMasNombre, esTexto) => {
    try {
        let contenido = "";
        if (esTexto) {
            contenido = await fs.promises.readFile(path.join(rutaMasNombre), 'utf8');
        } else {
            contenido = await fs.promises.readFile(path.join(rutaMasNombre));
        }
        return contenido;
    } catch (error) {
        console.log(error);
        return "";
    }
}

const borrarArchivo = async (rutaMasNombre) => {
    try {
        const esCarpeta = await fs.promises.stat(rutaMasNombre).then(stats => stats.isDirectory());
        if (esCarpeta) {
            await fs.promises.rm(path.join(rutaMasNombre), { recursive: true, force: true });
        } else {
            await fs.promises.unlink(path.join(rutaMasNombre));
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { escribirArchivo, leerArchivo, borrarArchivo }