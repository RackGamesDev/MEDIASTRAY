import express from 'express';
import { hacerTestsConexiones } from '../tests/tests.js';
import { alterarSeguidores, verUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

//Rutas de la API

router.get("/prueba", (req, res) => {
    res.json({ message: `Hello, World! Processed` });
});

//Devuelve si el usuario A sigue al usuario B (uuid_a, uuid_b)
router.get("/userFollow", async (req, res) => {
    try {
        if (await alterarSeguidores(req.body.uuid_a, req.body.uuid_b, 0)) {
            return res.json({ message: `Follows`, code: 200, data: true });
        } else {
            return res.json({ message: `Does not follow`, code: 200, data: false });
        }
    } catch (error) {
        try {
            console.log(error);
            return res.status(error.code).json({message: error.message, code: error.code});
        } catch (error2) {
            //console.log(error2);
            return res.status(500).json({message: "Server error", code: 500});
        }
    }
});

//Devuelve los datos públicos base de un usuario
router.get("/user/:id", async (req, res) => {
    console.log("ver");
    try {
        if (!req.params.id) return res.status(404).json({message: "User not found or not present", code: 404});
        const usuario = await verUsuario(req.params.id) ?? false;
        if (!usuario) return res.status(404).json({message: "User not found", code: 404});
        return res.json({ code: 200, data: usuario });
    } catch (error) {
        try {
            console.log(error);
            return res.status(error.code).json({message: error.message, code: error.code});
        } catch (error2) {
            //console.log(error2);
            return res.status(500).json({message: "Server error", code: 500});
        }
    }
});

if (process.env.NODE_ENV === "DEVELOPMENT") router.get('/test', async (req, res) => { //Re-ejecutar los tests
    await hacerTestsConexiones();
    res.json({ message: `Hello, World! Test Processed` });
});



export default router;