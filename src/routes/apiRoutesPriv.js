import express from 'express';
import autenticarTokenApi from './autenticarTokenApi.js';
import { v4 as uuidv4 } from 'uuid';

const routerPriv = express.Router();

//Rutas de la API

routerPriv.get("/authApiToken", autenticarTokenApi, (req, res) => {
    res.json({ message: `Private API token valid`, code: 200 });
});

routerPriv.post("/userCreate", autenticarTokenApi, (req, res) => {
    try {
        console.log(req.body.hola);
        console.log(uuidv4());
    } catch (error) {

    }
});

export default routerPriv;