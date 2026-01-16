import { v4 as uuidv4 } from 'uuid';
import { nombre as validarNombre, nickname as validarNickname, correo as validarCorreo, timestamp as validarCumpleagnos, contrasegna as validarContrasegna, descripcionForo as validarDescripcion, url as validarUrl, enteroPositivo as validarEnteroPositivo, contrasegna, correo } from '../libraries/validaciones.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redisDelete, redisSet } from '../connections/redis.js';
import { consulta } from '../connections/postgresql.js';
import { agnadirLog } from '../connections/logs.js';
import { mongoDelete, mongoGet, mongoSet } from '../connections/mongodb.js';

const validarJsonCreacionUsuario = (usuario) => {
    return validarNombre(usuario.nombre) && validarNickname(usuario.nickname) && validarCorreo(usuario.correo) && validarContrasegna(usuario.contrasegna) && validarCumpleagnos(usuario.cumpleagnos);
}

const validarJsonLoginUsuario = (credenciales) => {
    return (validarCorreo(credenciales.identification) || validarNickname(credenciales.identification)) && validarContrasegna(credenciales.contrasegna);
}

const validarJsonEdicionUsuario = (usuario) => {
    if (usuario.nombre && !validarNombre(usuario.nombre)) throw {message: "Invalid credentials (name)", code: 401};
    if (usuario.url_foto && !validarUrl(usuario.url_foto)) throw {message: "Invalid credentials (pfp url)", code: 401};
    if (usuario.descripcion && !validarDescripcion(usuario.descripcion)) throw {message: "Invalid credentials (description)", code: 401};
    if (usuario.cumpleagnos && !validarCumpleagnos(usuario.cumpleagnos)) throw {message: "Invalid credentials (birth date)", code: 401};
    if (usuario.nickname && !validarNickname(usuario.nickname)) throw {message: "Invalid credentials (nickname)", code: 401};
    if (usuario.correo && !validarCorreo(usuario.correo)) throw {message: "Invalid credentials (email)", code: 401};
    if (usuario.contrasegna && !validarContrasegna(usuario.contrasegna)) throw {message: "Invalid credentials (password)", code: 401};
}

//Registrarse, requiere en el body (usuario): nombre, nickname, correo, contrasegna, cumpleagnos. Devuelve un token de sesion
const crearUsuario = async (datosUsuario) => {
    try {
        if (!validarJsonCreacionUsuario(datosUsuario)) throw {message: "Invalid user data", code: 400};
        const nicknameExiste = await consulta("select uuid from USUARIOS where nickname = $1;", [datosUsuario.nickname]);
        const correoExiste = await consulta("select uuid from USUARIOS where correo = $1;", [datosUsuario.correo]);
        if (nicknameExiste[0]) throw {message: "Nickname already in use", code: 400, data: {doubleNickname: true}};
        if (correoExiste[0]) throw {message: "Email already in use", code: 400, data: {doubleEmail: true}};
        const uuid = uuidv4();
        const contrasegnaEncriptada = await bcrypt.hash(datosUsuario.contrasegna, 10);
        const fechaCreacion = Date.now() + "";
        const TOKEN_SECRET = process.env.JWT_SECRET;
        const token = await jwt.sign({ uuid, nickname: datosUsuario.nickname }, TOKEN_SECRET, {expiresIn: '4h', algorithm: 'HS256'});
        await redisDelete("SESSION-TOKEN-" + uuid);
        await redisDelete("SESSION-TOKEN-" + token);
        await redisSet("SESSION-TOKEN-" + uuid, token, 14400);
        await redisSet("SESSION-TOKEN-" + token, uuid, 14400);
        const creacion = await consulta("INSERT INTO USUARIOS (uuid, nickname, nombre, contrasegna, correo, cumpleagnos, fechacreacion) VALUES ($1, $2, $3, $4, $5, $6, $7);", 
            [uuid, datosUsuario.nickname, datosUsuario.nombre, contrasegnaEncriptada, datosUsuario.correo, datosUsuario.cumpleagnos, fechaCreacion]);
        if (creacion) {
            const usuario = await consulta("SELECT * FROM USUARIOS WHERE uuid = $1;", [uuid]);
            agnadirLog("backend.log", "New user created " + uuid);
            agnadirLog("db.log", "New user created USUARIOS " + uuid);
            return { token, usuario: usuario[0]};
        } else {
            throw {message: "Invalid user data", code: 400};
        }
    } catch (error) {
        throw error;
    }
}

//Hacer login con el usuario, requiere en el body (credentials): contrasegna, identificacion (su correo o nickname). Devuelve un token de sesion valido por 4 horas y los datos del usuario
const loginUsuario = async (datosLogin) => {
    try {
        if (!validarJsonLoginUsuario(datosLogin)) throw {message: "Invalid user data", code: 400};
        const elUsuario = await consulta("SELECT * FROM USUARIOS WHERE nickname = $1 OR correo = $1;", [datosLogin.identification]);
        const contrasegnaCoincide = await bcrypt.compare(datosLogin.contrasegna, elUsuario[0].contrasegna ?? '');
        if (!elUsuario[0] || !contrasegnaCoincide) throw {message: "Invalid credentials", code: 401};
        if (elUsuario[0].disponibilidad === 4) throw {message: "User has not allowed login", code: 401};
        const TOKEN_SECRET = process.env.JWT_SECRET;
        const token = await jwt.sign({ uuid: elUsuario[0].uuid, nickname: elUsuario[0].nickname }, TOKEN_SECRET, {expiresIn: '4h', algorithm: 'HS256'});
        await redisDelete("SESSION-TOKEN-" + elUsuario[0].uuid);
        await redisDelete("SESSION-TOKEN-" + token);
        await redisSet("SESSION-TOKEN-" + elUsuario[0].uuid, token, 14400);
        await redisSet("SESSION-TOKEN-" + token, elUsuario[0].uuid, 14400);
        elUsuario[0].contrasegna = "";
        agnadirLog("backend.log", "User logged in " + elUsuario[0].uuid);
        return { token, usuario: elUsuario[0]};
    } catch (error) {
        throw error;
    }
}

//Editar un usuario actualizando sus datos, requiere en el body (newData) todos los posibles nuevos datos. Devuelve true si va todo bien
//Concretamente se pueden editar: nickname, nombre, contrasegna, correo, descripcion, url_foto, cumpleagnos. Para nickname, correo o contrasegna se requiere tambien la contrasegna antigua (contrasegnaAntigua)
const editarUsuario = async (nuevos, uuid) => {
    try {
        if (!nuevos || !uuid) throw {message: "Invalid credentials", code: 401};
        const usuarioPrevio = await consulta("SELECT * FROM USUARIOS WHERE uuid = $1;", [uuid]);
        if (!usuarioPrevio[0]) throw {message: "Invalid credentials", code: 401};
        if (usuarioPrevio[0].disponibilidad >= 3) throw {message: "User has not allowed login nor edit credentials or profile", code: 401};
        validarJsonEdicionUsuario(nuevos);
        let proporcionadoContrasegnaAntigua = false;
        if (nuevos.contrasegnaAntigua) {
            if (await bcrypt.compare(nuevos.contrasegnaAntigua ?? "a", usuarioPrevio[0].contrasegna ?? "b")){
                proporcionadoContrasegnaAntigua = true;
            } else {
                throw {message: "Validate password is needed", code: 401}
            };
        }
        if (nuevos.nickname) {
            if (!proporcionadoContrasegnaAntigua) throw {message: "Validate password is needed", code: 401};
            const conEseNickname = await consulta("SELECT uuid FROM USUARIOS WHERE nickname = $1;", [nuevos.nickname]);
            if (conEseNickname[0]) throw {message: "Nickname already in use", code: 401};
        }
        if (nuevos.email) {
            if (!proporcionadoContrasegnaAntigua) throw {message: "Validate password is needed", code: 401};
            const conEseEmail = await consulta("SELECT uuid FROM USUARIOS WHERE email = $1;", [nuevos.email]);
            if (conEseEmail[0]) throw {message: "Email already in use", code: 401};
        }
        if (nuevos.contrasegna) {
            if (!proporcionadoContrasegnaAntigua) throw {message: "Validate password is needed", code: 401};
            nuevos.contrasegna = await bcrypt.hash(nuevos.contrasegna, 10);
        }
        if (await consulta("UPDATE USUARIOS SET nickname = $1, nombre = $2, contrasegna = $3, correo = $4, descripcion = $5, url_foto = $6, cumpleagnos = $7 WHERE uuid = $8;", 
                [nuevos.nickname ?? usuarioPrevio[0].nickname, nuevos.nombre ?? usuarioPrevio[0].nombre, nuevos.contrasegna ?? usuarioPrevio[0].contrasegna, nuevos.correo ?? usuarioPrevio[0].correo, nuevos.descripcion ?? usuarioPrevio[0].descripcion, nuevos.url_foto ?? usuarioPrevio[0].url_foto, nuevos.cumpleagnos ?? usuarioPrevio[0].cumpleagnos, uuid])) {
            const TOKEN_SECRET = process.env.JWT_SECRET;
            const token = await jwt.sign({ uuid, nickname: nuevos.nickname ?? usuarioPrevio[0].nickname }, TOKEN_SECRET, {expiresIn: '4h', algorithm: 'HS256'});
            await redisDelete("SESSION-TOKEN-" + uuid);
            await redisDelete("SESSION-TOKEN-" + token);
            await redisSet("SESSION-TOKEN-" + uuid, token, 14400);
            await redisSet("SESSION-TOKEN-" + token, uuid, 14400);
            const nuevoTodo = await consulta("SELECT * FROM USUARIOS WHERE uuid = $1;", [uuid]);
            nuevoTodo[0].contrasegna = "";
            agnadirLog("backend.log", "User editted " + uuid);
            agnadirLog("db.log", "User editted via update USUARIOS " + uuid);
            return {usuarioRenovado: nuevoTodo[0] ?? {}, tokenNuevo: token}
        } else {
            throw {message: "There was an error updating the user", code: 401};
        }
    } catch (error) {
        throw error;
    }
}

//Borra el usuario, requiere de su contrasegna en el body asi como el token de sesion
const borrarUsuario = async (contrasegna, uuid) => {
    try {
        const usuario = await consulta("SELECT * FROM USUARIOS WHERE uuid = $1;", [uuid]);
        if (!usuario[0]) throw {message: "Invalid credentials", code: 401};
        if (await bcrypt.compare(contrasegna ?? "a", usuario[0].contrasegna ?? "b")){
            const resultado = await consulta("DELETE FROM USUARIOS WHERE uuid = $1", [uuid]);
            agnadirLog("backend.log", "User deleted " + uuid);
            agnadirLog("db.log", "User deleted USUARIOS " + uuid);
            return resultado ? true : false;
        } else {
            throw {message: "Validate password is needed", code: 401}
        }
    } catch (error) {
        throw error;
    }
}

//Devuelve datos básicos y públicos de un usuario a partir de su uuid o su nickname
const verUsuario = async (id) => {
    try {
        const usuario = await consulta("SELECT * FROM USUARIOS WHERE uuid = $1 OR nickname = $2;", [id, id]);
        //usuario[0].contrasegna = undefined;
        return {...usuario[0], contrasegna: "", correo: undefined, cumpleagnos: "", disponibilidad: ""} ?? null;
    } catch (error) {
        throw error;
    }
}

//Altera la disponibilidad de un usuario (no para api), 0 disponible, 1 desabilitada de subir juegos, 2 desabilitada de interactuar, 3 desabilitada de login...
const alterarDisponibilidadUsuario = async (nuevoValor, uuid) => {
    try {
        const resultado = await consulta("UPDATE USUARIOS SET disponibilidad = $1 WHERE uuid = $2;", [nuevoValor, uuid]);
        agnadirLog("backend.log", `User ${uuid} altered its disponibility to ${nuevoValor}`);
        //EN UN FUTURO, HACER EL BORRADO EN CASCADA
        return resultado ? true : false;
    } catch (error) {
        throw error;
    }
}

//Renueva el premium de un usuario estableciendo la fecha de caducidad
const alterarPremiumUsuario = async (uuid, fechaCaducidad) => {
    try {
        const resultado = await consulta("UPDATE USUARIOS SET premium = $1 WHERE uuid = $2;", [fechaCaducidad, uuid]);
        agnadirLog("backend.log", "User got premium " + uuid);
        agnadirLog("db.log", "User got premium USUARIO to current date " + uuid);
        return resultado ? true : false;
    } catch (error) {
        throw error;
    }
}

//Altera la cantidad de seguidores de un usuario (en su registro sql), si la cantidad es 0 devuelve si el usuario a sigue al b
const alterarSeguidores = async (uuidA, uuidB, cantidad) => {
    try {
        const yaLeSigue = await mongoGet("intermediario", {sujeto: uuidA, verbo: "sigue", predicado: uuidB}) ?? {};
        if (cantidad === 0) return yaLeSigue.uuid;
        const seguidoresPrevios = await consulta("SELECT cantidad_seguidores FROM USUARIOS WHERE uuid = $1", [uuidB]);
        if (!seguidoresPrevios[0]) throw {message: "Invalid credentials", code: 401};
        let resultado = false;
        if (yaLeSigue.uuid && cantidad < 0) {
            await mongoDelete("intermediario", {sujeto: uuidA, verbo: "sigue", predicado: uuidB}, true);
            resultado = await consulta("UPDATE USUARIOS SET cantidad_seguidores = $1 WHERE uuid = $2;", [seguidoresPrevios[0].cantidad_seguidores + cantidad, uuidB]);
        } else if (!yaLeSigue.uuid && cantidad > 0) {
            await mongoSet("intermediario", {uuid: uuidv4(), sujeto: uuidA, verbo: "sigue", predicado: uuidB});
            resultado = await consulta("UPDATE USUARIOS SET cantidad_seguidores = $1 WHERE uuid = $2;", [seguidoresPrevios[0].cantidad_seguidores + cantidad, uuidB]);
        } else {
            return false;
        }
        //if (!validarEnteroPositivo(cantidad)) throw {message: "Invalid amount", code: 401};
        return resultado ? true : false;
    } catch (error) {
        //console.log(error);
        throw error;
    }
}

export { validarJsonCreacionUsuario, crearUsuario, loginUsuario, editarUsuario, borrarUsuario, alterarDisponibilidadUsuario, alterarPremiumUsuario, alterarSeguidores, verUsuario }