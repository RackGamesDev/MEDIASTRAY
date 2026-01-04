import express from 'express';
import { autenticarTokenApi, autenticarTokenSesion } from './autenticaciones.js';
import { crearUsuario, loginUsuario, editarUsuario } from '../controllers/UsuarioController.js';
import { redisGet } from '../connections/redis.js';

const routerPriv = express.Router();

//Rutas de la API, pero privadas porque necesitan el token de la api (pequegna capa de seguridad extra)

//Valida si el API token es valido (el del header)
routerPriv.get("/authApiToken", autenticarTokenApi, (req, res) => {
    res.json({ message: `Private API token valid`, code: 200 });
});

//Valida si un token de sesion de usuario es valido (en el body)
routerPriv.get("/authSessionToken", autenticarTokenApi, autenticarTokenSesion, async (req, res) => {
    return res.json({ message: `User session token valid`, code: 200 });
});

//Ruta para crear el usuario, requiere en el body (usuario): nombre, nickname, correo, contrasegna, cumpleagnos. Devuelve un token de sesion
routerPriv.post("/userCreate", autenticarTokenApi, async (req, res) => {
    try {
        const token = await crearUsuario(req.body.usuario);
        res.setHeader('X-auth-session', token);
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

//Ruta para hacer login con un usuario existente, requiere en el body (credentials): contrasegna, identificacion (su correo o nickname). Devuelve un token de sesion valido por 4 horas y los datos del usuario
routerPriv.post("/userLogin", autenticarTokenApi, async (req, res) => {
    try {
        const { token, usuario } = await loginUsuario(req.body.credentials);
        usuario.contrasegna = "";
        res.setHeader('X-auth-session', token);
        return res.json({ message: `User logged in successfully`, code: 200, sessionToken: token, user: usuario });
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

//Ruta para editar un usuario existente, requiere en el body (newData) todos los posibles nuevos datos. Devuelve true si va todo bien
routerPriv.patch("/userEdit", autenticarTokenApi, autenticarTokenSesion, async (req, res) => {
    try {
        const token = req.body.token ?? (req.header('X-auth-session') ?? "");
        const uuid = await redisGet("SESSION-TOKEN-" + token) ?? "";
        if (uuid === "") throw {message: "Invalid credentials", code: 401}
        const { usuarioRenovado, tokenNuevo } = await editarUsuario(req.body.newData, uuid);
        res.setHeader('X-auth-session', tokenNuevo);
        return res.json({ message: `Data editted successfully`, code: 200, user: usuarioRenovado, sessionToken: tokenNuevo });
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