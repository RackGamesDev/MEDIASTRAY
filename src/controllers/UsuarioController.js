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
        await redisSet(token, uuid, 14400);
        if (await !consulta("INSERT INTO USUARIOS (uuid, nickname, nombre, contrasegna, correo, cumpleagnos, fechacreacion) VALUES ($1, $2, $3, $4, $5, $6, $7);", 
            [uuid, datosUsuario.nickname, datosUsuario.nombre, contrasegnaEncriptada, datosUsuario.correo, datosUsuario.cumpleagnos, fechaCreacion])) throw new Error("Internal server error");
        return token;
    } catch (error) {
        throw error;
    }
}

const loginUsuario = async (datosLogin) => {
    /*import jwt from 'jsonwebtoken';
import redis from 'redis';

// Replace with your actual secret key (must match the one used for generation!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Redis configuration (adjust as needed)
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379' // Use environment variable for Redis URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();


// Function to validate a token and extract user ID
async function validateToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the token is present in Redis (blacklist/revocation check - optional but recommended)
    const redisKey = `blacklisted:${token}`;
    const isBlacklisted = await promisify((cb) => redisClient.get)(redisKey); // Use promisify for async/await

    if (isBlacklisted) {
      throw new Error('Token has been blacklisted');
    }


    return decoded;  // Return the decoded payload (e.g., user ID)
  } catch (error) {
    console.error("Token validation error:", error);
    return null; // Token is invalid
  }
}

export default validateToken;*/
} 

export { validarJsonCreacionUsuario, crearUsuario, loginUsuario }