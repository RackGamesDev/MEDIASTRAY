import express from 'express';
import { hacerTestsConexiones } from '../tests/tests.js';

const router = express.Router();

//Rutas de la API

router.get("/prueba", (req, res) => {
    res.json({ message: `Hello, World! Processed` });
});

if (process.env.NODE_ENV === "DEVELOPMENT") router.get('/test', async (req, res) => { //Re-ejecutar los tests
    await hacerTestsConexiones();
    res.json({ message: `Hello, World! Test Processed` });
});



export default router;