import { Client } from 'pg';
import { leerArchivo } from './archivos.js';

let cliente = null; //Conexión reusable a Postgresql (para su correcto funcionamiento requiere haberse usado un par de veces antes, se hace en los tests)

//Recibir la conexión de Postgresql
const getConexion = async () => {
    if (!cliente) {
        try {
            cliente = new Client({ connectionString: process.env.DATABASE_URL, clientVersion: '8.16.3' });
            await cliente.connect();
            //Ejecutar las consultas iniciales para crear las tablas
            const consultasIniciales = await leerArchivo(process.env.SQL_INIT_PATH ?? "", true);
            if (consultasIniciales) {
                try {
                    await cliente.query("SELECT 1 FROM USUARIOS LIMIT 1;");
                } catch (e) {
                    await cliente.query(consultasIniciales);
                    //Si está en modo development, inserta datos de ejemplo
                    if (process.env.NODE_ENV === "DEVELOPMENT") {
                        const datosIniciales = await leerArchivo(process.env.SQL_INIT_PATH_FAKES ?? "", true);
                        await cliente.query(datosIniciales);
                    }
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

//Ejecuta una consulta sql sanitizándola y devuelve el posible resultado (parametros para el prepare y evitar inyección sql)
const consulta = async (consulta, parametros = []) => {
    if (!cliente || !sigueConectado()) await getConexion();
    try {
        const resultado = await cliente.query(consulta, parametros);
        //await cliente.end();
        return await resultado.rows;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Devuelve la conexión para hacer operaciones personalizadas
const getCliente = async () => {
    if (!cliente) await getConexion();
    try {
        return cliente;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Devuelve false si falla hacer el ping a la base de datos.
const sigueConectado = async () => {
    if (!cliente) await getConexion();
    try {
        await cliente.query("SELECT 1 FROM USUARIOS LIMIT 1;");
        return true;
    } catch (error) {
        console.log(error);
        cliente = null;
        getConexion();
        return false;
    }
}

export { getConexion, consulta, getCliente }