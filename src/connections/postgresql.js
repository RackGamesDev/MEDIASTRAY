import { Client } from 'pg';
import { leerArchivo } from './archivos.js';

let cliente = null;

const getConexion = async () => {
    if(!cliente) {
        try {
            cliente = new Client(process.env.DATABASE_URL);
            await cliente.connect();
            const consultasIniciales = await leerArchivo(process.env.SQL_INIT_PATH ?? "", true);
            if (consultasIniciales) {
                await cliente.query(consultasIniciales);
                if (process.env.NODE_ENV === "DEVELOPMENT") {
                    const datosIniciales = await leerArchivo(process.env.SQL_INIT_PATH_FAKES ?? "", true);
                    await cliente.query(datosIniciales);
                }
            }
            return cliente;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    return cliente;
}

const consulta = async (consulta) => {
    if (!cliente) getConexion();
    try {
        const resultado = await cliente.query(consulta);
        //await client.end();
        return resultado.rows ?? [];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { getConexion, consulta }