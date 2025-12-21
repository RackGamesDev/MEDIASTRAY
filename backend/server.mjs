import express from 'express';
import dotenv from 'dotenv';
import { abrirServidorMetricas } from './servidorMetricas.js';

import { testMongodb } from './tests/testMongodb.js';
import { testRedis } from './tests/testRedis.js';
import { testSql } from './tests/testPostgresql.js';
import { testFs } from './tests/testFs.js';
import { testMail } from './tests/testMail.js';
import cors from 'cors';

dotenv.config();
const APP_PORT = process.env.BACKEND_PORT ?? 4000;
const app = express();

if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("ACTUALMENTE EN DEV");
    app.use(cors({
        origin: process.env.FREE_CORS ?? "n" === "s" ? true : 'http://localhost:5174',
        credentials: true,
    }));
    app.get('/api/test', async (req, res) => {
    try {
        testRedis();
        testSql();
        testMongodb();
        testFs();
        //testMail();
        res.json({ message: `Hello, World! Processed` });
    } catch (error) {
        console.log(error);
        res.json({ message: `error` });
    }
    });
}


app.get('/api/greet', async (req, res) => {
    testRedis();
    res.json({ message: `Hello, World! Processed` });
});



try {abrirServidorMetricas(app);} catch (e) {console.log("No se han habierto los servicios de métricas");}
app.listen(APP_PORT, () => {
    console.log(`Ejecutandose en ${APP_PORT}`);
});

