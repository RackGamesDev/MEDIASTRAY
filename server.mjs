import express from 'express';
import dotenv from 'dotenv';
import { abrirServidorMetricas } from './src/servidorMetricas.js';
import apiRoutes from "./src/routes/apiRoutes.js";
import path from 'path';

import cors from 'cors';
import { hacerTestsConexiones } from './src/tests/tests.js';

//dotenv.config();
dotenv.config({path: new URL("./.env", import.meta.url).pathname});
const APP_PORT = process.env.BACKEND_PORT ?? 8510;
const app = express();

if (process.env.INIT_TESTS) {
    //Iniciar los tests para establecer las conexiones permanentes. Se hacen varias veces para asegurarse de que las bases de datos estan realmente preparadas
    hacerTestsConexiones();
    hacerTestsConexiones();
    hacerTestsConexiones();
}
if (process.env.NODE_ENV === "DEVELOPMENT") { //Código solo para development
    console.log("ACTUALMENTE EN DEV");
    app.use(cors({
        origin: process.env.FREE_CORS ?? "n" === "s" ? true : 'http://localhost:8520', //Permitir peticiones de vite
        credentials: true,
    }));
    app.get('/api/test', async (req, res) => { //Re-ejecutar los tests
        await hacerTestsConexiones();
        res.json({ message: `Hello, World! Test Processed` });
    });
}

//Rutas con contenido estático
app.use("/public", express.static(process.env.PUBLIC_FILES_PATH));
app.use("/games", express.static(process.env.GAMES_FILES_PATH));
//Peticiones a la API (se gestionan manualmente por el servidor)
app.use("/api", apiRoutes);
//Las peticiones en / se dirigen al dist del frontend
app.use(express.static(path.join(process.cwd(), process.env.FRONTEND_DIST_PATH)));

//Errores 404
app.use((req, res) => {
    if (req.path.startsWith("/public")) {
        res.status(404).redirect('/public/err404.html');
    } else if (req.path.startsWith("/games")) {
        res.status(404).redirect('/games/err404.html');
    } else if (req.path.startsWith("/api")) {
        res.status(404).json({message: "404 Not found", code: 404});
    } else {
        res.sendFile(path.join(process.cwd(), process.env.FRONTEND_DIST_PATH, "index.html")); //El error 404 en / lo maneja el frontend
    }
});

try {abrirServidorMetricas(app);} catch (e) {console.log("No se han habierto los servicios de métricas");} //Abrir el servidor de métricas

app.listen(APP_PORT, () => {
    console.log(`Ejecutandose en ${APP_PORT}`);
});

