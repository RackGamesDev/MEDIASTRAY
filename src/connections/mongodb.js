import { MongoClient } from 'mongodb';
import { inicializarMongo } from './base/init.js';

let cliente = null;

const getConexion = async () => {
    if (!cliente) {
        try {
            cliente = new MongoClient(process.env.MONGODB_URI);
            await cliente.connect();
            inicializarMongo(cliente);
            //console.log(cliente);
            return cliente;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    return cliente;
}

const mongoSet = async (collectionNombre, data) => {
    if (!cliente) getConexion();
    try {
        const db = cliente.db(process.env.MONGODB_DATABASE ?? 'base');
        const collection = db.collection(collectionNombre);
        const result = await collection.insertOne(data);
        return result ?? true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const mongoGet = async (collectionNombre, consulta) => {
    if (!cliente) getConexion();
    try {
        const db = cliente.db(process.env.MONGODB_DATABASE ?? 'base');
        const collection = db.collection(collectionNombre);
        const result = await collection.findOne(consulta);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { getConexion, mongoGet, mongoSet }
