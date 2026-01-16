import React, { useState } from "react";
import useAjustes from "./useAjustes";
import { peticionBasica } from "../libraries/peticiones";

const useApi = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const { tokenSesionActual, usuarioActual, tokenJuegoActual, API_URL, API_KEY, cambiarTokenSesionActual, cambiarUsuarioActual } = useAjustes();

    const peticionGenerica = async (url, verbo = "GET", body, headersExtra = {}) => {
        await setCargando(true);
        await setError(false);
        try {
            const resultado = await peticionBasica(url, {...headersExtra, "X-auth-api": API_KEY, "X-auth-session": tokenSesionActual ?? '', "X-auth-playtime": tokenJuegoActual ?? '', "X-my-uuid": usuarioActual.uuid ?? '', "X-auth-game": "X"}, verbo, body ?? undefined);
            if (!resultado.ok && resultado.code >= 400) throw {fallo: true, code: resultado.code ?? '', message: "Error api", result: resultado}
            return resultado;
        } catch (error) {
            setError({fallo: true, error});
            throw error;
        } finally {
            setCargando(false);
        }
    }

    const login = async (objetoLogin) => {
        try {
            const resultado = await peticionGenerica(API_URL + "/userLogin", "POST", {credentials: { contrasegna: objetoLogin.contrasegna, identification: objetoLogin.identificacion}});
            cambiarTokenSesionActual(resultado.sessionToken);
            cambiarUsuarioActual(resultado.user);
            return resultado;
        } catch (error) {
            return {fallo: true, error}
        }
    }

    const register = async (objetoRegister) => {
        await setError(false);
        try {
            const resultado = await peticionGenerica(API_URL + "/userCreate", "POST", { usuario: { nickname: objetoRegister.nickname, contrasegna: objetoRegister.contrasegna, correo: objetoRegister.correo, nombre: objetoRegister.nombre, cumpleagnos: Date.parse(objetoRegister.cumpleagnos) + "" } });
            cambiarTokenSesionActual(resultado.sessionToken);
            cambiarUsuarioActual(resultado.user);
            return resultado;
        } catch (error) {
            return {fallo: true, error}
        }
    }

    const verUsuario = async (id) => {
        try {
            const resultado = await peticionGenerica(API_URL + "/user/" + (id ?? ''), "GET");
            return resultado.data;
        } catch (error) {
            return {fallo: true, error}
        }
    }

    const resetEstados = () => {
        setCargando(false);
        setError(false)
    }

    return { cargando, error, peticionGenerica, login, register, verUsuario, resetEstados };
};

export default useApi;