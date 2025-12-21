import { createClient } from 'redis';

let clienteActual = null;

const getConexion = async () => {
    if (!clienteActual) {
        try {
            const client = createClient({ url: `redis://${process.env.REDIS_HOST}` });
            client.on('error', err => console.log('Redis Client Error', err));
            await client.connect();
            clienteActual = client;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    return clienteActual;
}

const redisSet = async (clave, valor) => {
    if (!clienteActual) getConexion();
    try {
        await clienteActual.set(clave, valor);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const redisGet = async (clave) => {
    if (!clienteActual) getConexion();
    try {
        return await clienteActual.get(clave);
    } catch (error) {
        console.log(error);
        return null;
    }
}

getConexion();

export { getConexion, redisGet, redisSet }