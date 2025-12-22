import { Client } from 'pg';
import { leerArchivo } from './archivos.js';

let cliente = null;

const getConexion = async () => {
    if (!cliente) {
        console.log("CONECTANDO SQL");
        try {
            cliente = new Client({connectionString: process.env.DATABASE_URL,clientVersion: '8.16.3'});
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

const consulta = async (consulta, parametros = []) => {
    if (!cliente) getConexion();
    try {
        //const resultado = await cliente.query({rowMode: 'array',text: consulta,parametros});
        const resultado = await cliente.query(consulta, parametros);
        //await cliente.end();
        return await resultado.rows;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { getConexion, consulta }