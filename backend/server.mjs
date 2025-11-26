import express from 'express';
import dotenv from 'dotenv';
import {abrirServidorMetricas} from './servidorMetricas.js';
import { testMongodb } from './tests/testMongodb.js';
dotenv.config();
const APP_PORT = process.env.BACKEND_PORT ?? 4000;
const app = express();


app.get('/api/greet', async (req, res) => {
    res.json({ message: `Hello, World! Processed` });
});

app.get('/api/test', async (req, res) => {
    try {
        testMongodb();
        res.json({ message: `Hello, World! Processed` });
    } catch (error) {
        console.log(error);
        res.json({ message: `error` });
    }
});

abrirServidorMetricas(app);
app.listen(APP_PORT, () => {
    console.log(`Ejecutandose en ${APP_PORT}`);
});

