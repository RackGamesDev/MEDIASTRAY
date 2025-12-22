import express from 'express';

const router = express.Router();

//Rutas de la API

router.get("/prueba", (req, res) => {
    res.json({ message: `Hello, World! Processed` });
});

export default router;