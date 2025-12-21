import { escribirArchivo, leerArchivo, borrarArchivo } from '../connections/archivos.js';
import { mongoGet, mongoSet } from '../connections/mongodb.js';
import { consulta } from '../connections/postgresql.js';
import { redisGet, redisSet } from '../connections/redis.js';

import { testMongodb } from './testMongodb.js';
import { testRedis } from './testRedis.js';
import { testSql } from './testPostgresql.js';
import { testFs } from './testFs.js';
import { testMail } from './testMail.js';

const hacerTestsConexiones = async () => {
    try {
        await testRedis();
        await testSql();
        await testMongodb();
        await testFs();
        //await testMail();

        (async () => {
            console.log("----------- REDIS");
            await redisSet("test-init", "12345");
            console.log(await redisGet("test-init"));
            console.log("----------- MONGODB");
            await mongoSet("test-init", {hola: "hello", numero: 12345});
            console.log(await mongoGet("test-init", {numero: 12345}));
            console.log("----------- ARCHIVOS");
            await escribirArchivo("hola 1234", "./src/files/prueba", "prueba.txt", true);
            console.log(await leerArchivo("./src/files/prueba/prueba.txt", true));
            await borrarArchivo("./src/files/prueba");
            console.log("----------- POSTGRESQL");
            console.log(await consulta("SELECT * FROM USUARIOS;"));
            console.log("------------");
        })();

    } catch (error) {
        console.log(error);
        res.json({ message: `error` });
    }
}

export { hacerTestsConexiones }