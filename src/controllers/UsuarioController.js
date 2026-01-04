import { v4 as uuidv4 } from 'uuid';
import { nombre as validarNombre, nickname as validarNickname, correo as validarCorreo, timestamp as validarCumpleagnos, contrasegna as validarContrasegna } from './validaciones.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redisDelete, redisSet } from '../connections/redis.js';
import { consulta } from '../connections/postgresql.js';

const validarJsonCreacionUsuario = (usuario) => {
    return validarNombre(usuario.nombre) && validarNickname(usuario.nickname) && validarCorreo(usuario.correo) && validarContrasegna(usuario.contrasegna) && validarCumpleagnos(usuario.cumpleagnos);
}

const crearUsuario = async (datosUsuario) => {
    try {
        if (!validarJsonCreacionUsuario(datosUsuario)) throw {message: "Invalid user data", code: 400};
        const nicknameExiste = await consulta("select uuid from USUARIOS where nickname = $1;", [datosUsuario.nickname]);
        const correoExiste = await consulta("select uuid from USUARIOS where correo = $1;", [datosUsuario.correo]);
        if (nicknameExiste[0]) throw {message: "Nickname already in use", code: 400};
        if (correoExiste[0]) throw {message: "Email already in use", code: 400};
        const uuid = uuidv4();
        const contrasegnaEncriptada = await bcrypt.hash(datosUsuario.contrasegna, 10);
        const fechaCreacion = Date.now();
        const TOKEN_SECRET = process.env.JWT_SECRET;
        const token = await jwt.sign({ uuid, nickname: datosUsuario.nickname }, TOKEN_SECRET, {expiresIn: '4h', algorithm: 'HS256'});
        await redisDelete(uuid);
        await redisSet(uuid, token, 14400);
        if (await !consulta("INSERT INTO USUARIOS (uuid, nickname, nombre, contrasegna, correo, cumpleagnos, fechacreacion) VALUES ($1, $2, $3, $4, $5, $6, $7);", 
            [uuid, datosUsuario.nickname, datosUsuario.nombre, contrasegnaEncriptada, datosUsuario.correo, datosUsuario.cumpleagnos, fechaCreacion])) throw new Error("Internal server error");
        return token;
    } catch (error) {
        throw error;
    }
}

const loginUsuario = async (datosLogin) => {

} 

export { validarJsonCreacionUsuario, crearUsuario, loginUsuario }