import { redisGet } from "../connections/redis.js";

//Para requerir el token de la api en el header
const autenticarTokenApi = (req, res, next) => {
    const API_TOKEN = process.env.API_PRIVATE_TOKEN;
    try {
        const auth = req.header('X-auth-api');
        if (auth !== API_TOKEN || API_TOKEN === undefined || auth === undefined) {
            return res.status(401).json({message: "401: Valid token not provided at private endpoint", code: 404});
        } else {
            next();
        }
    } catch (e) {
        return res.status(401).json({message: "401: Token not provided at private endpoint", code: 404});
    }
}

//Para requerir el token de sesion de un usuario en el header
const autenticarTokenSesion = async (req, res, next) => {
    try {
        const token = req.body.token ?? (req.header('X-auth-session') ?? "");
        const uuid = await redisGet("SESSION-TOKEN-" + token) ?? "";
        const token2 = await redisGet("SESSION-TOKEN-" + uuid) ?? "";
        if (token2 === token && token !== "" && token2 !== "" && uuid !== "") {
            next();
        } else {
            throw { message: `User session token NOT valid OR server error`, code: 200 }
        }
    } catch (error) {
        console.log(error);
        return res.json({ message: `User session token NOT valid OR server error`, code: 200 });
    }
}

//Para requerir el token de sesion de juego (de un usuario) en el header
const autenticarTokenJuego = (req, res, next) => {

}

//Para requerir el token de edicion de un juego en el header
const autenticarTokenAdministracionJuego = (req, res, next) => {

}

export { autenticarTokenApi, autenticarTokenJuego, autenticarTokenSesion, autenticarTokenAdministracionJuego };