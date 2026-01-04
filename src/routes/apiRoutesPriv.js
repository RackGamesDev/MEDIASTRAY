import express from 'express';
import autenticarTokenApi from './autenticarTokenApi.js';
import { crearUsuario } from '../controllers/UsuarioController.js';

const routerPriv = express.Router();

//Rutas de la API, pero privadas porque necesitan el token de la api (pequegna capa de seguridad extra)

routerPriv.get("/authApiToken", autenticarTokenApi, (req, res) => {
    res.json({ message: `Private API token valid`, code: 200 });
});

routerPriv.post("/userCreate", autenticarTokenApi, async (req, res) => {
    try {
        const token = await crearUsuario(req.body.usuario);
        return res.json({ message: `User created successfully`, code: 200, sessionToken: token });
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

export default routerPriv;