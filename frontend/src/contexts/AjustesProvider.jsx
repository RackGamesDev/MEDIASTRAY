/* eslint-disable react-hooks/set-state-in-effect */
import { React, createContext, useState, useEffect } from 'react';
import { validarDatosUsuario } from '../libraries/validaciones.js';
import { textos } from '../assets/textosInterfaz.json';

const AjustesContexto = createContext();

const AjustesProvider = (props) => {

  const API_URL = import.meta.env.VITE_API_URL ?? (process.env.REACT_APP_API_URL ?? "/api");
  const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL ?? (process.env.REACT_APP_PUBLIC_URL ?? "/public");
  const GAMES_URL = import.meta.env.VITE_GAMES_URL ?? (process.env.REACT_APP_GAMES_URL ?? "/games");
  const API_KEY = import.meta.env.VITE_API_KEY ?? (process.env.REACT_APP_API_KEY ?? "");
  const [usuarioActual, setUsuarioActual] = useState({});
  const [tokenSesionActual, setTokenSesionActual] = useState("");
  const [tokenJuegoActual, setTokenJuegoActual] = useState("");
  const [idiomaActual, setIdiomaActual] = useState("");
  const idiomasAdmitidos = ["EN-us", "ES-es"];
  const [fallo, setFallo] = useState(false);

  //Carga al inicio
  const inicio = async () => {
    try {
      await localStorage.setItem("API_URL", API_URL);
      await localStorage.setItem("PUBLIC_URL", PUBLIC_URL);
      await localStorage.setItem("GAMES_URL", GAMES_URL);
      await localStorage.setItem("API_KEY", API_KEY);

      const idiomaPreferente = navigator.language;
      const idiomaPrecargado = await localStorage.getItem("idiomaActual") ?? `${(idiomaPreferente[0] + idiomaPreferente[1]).toUpperCase()}-${(idiomaPreferente[3] + idiomaPreferente[4]).toLowerCase()}`;
      setIdiomaActual(idiomaPrecargado);
      await localStorage.setItem("idiomaActual", idiomaPrecargado);

      const usuarioPrecargado = JSON.parse(await localStorage.getItem("usuarioActual") ?? '{"ninguno": true}');
      if (validarDatosUsuario(usuarioPrecargado) && usuarioPrecargado?.uuid) {
        setUsuarioActual(usuarioPrecargado);
      } else {
        setUsuarioActual({ninguno: true});
        await localStorage.setItem("usuarioActual", "");
      }
      //await localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
      setFallo(false);
    } catch (error) {
      console.log(error);
      setUsuarioActual({ninguno: true});
      setFallo({ error: true, objeto: error });
    }

  }

  const cambiarUsuarioActual = async (usuario) => {
    if (validarDatosUsuario(usuario)) {
      setUsuarioActual(usuario);
      await localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    } else {
      setFallo({ error: true, code: "user-non-validable" });
      //await localStorage.setItem("usuarioActual", "");
    }
  }

  const cambiarTokenSesionActual = async (token) => {
    if (token) {
      setTokenSesionActual(token);
      await localStorage.setItem("tokenSesionActual", token);
    }
  }
  const cambiarTokenJuegoActual = async (token) => {
    if (token) {
      setTokenJuegoActual(token);
      await localStorage.setItem("tokenJuegoActual", token);
    }
  }

  const cambiarIdiomaActual = async (nuevo) => {
    if (idiomasAdmitidos.find((e) => e === nuevo)) {
      setIdiomaActual(nuevo);
      await localStorage.setItem("idiomaActual", nuevo);
    } else {
      setFallo({ error: true, code: "language-not-found" });
    }
  }

  const exportaciones = /*useMemo(()=>(*/{
    fallo: fallo, tokenSesionActual, usuarioActual, tokenJuegoActual, idiomaActual, idiomasAdmitidos, API_URL, API_KEY, PUBLIC_URL, GAMES_URL, textosInterfaz: textos, textosInterfazEnlacesCabecera: textos.enlacesCabecera,
    cambiarUsuarioActual, cambiarTokenJuegoActual, cambiarIdiomaActual, cambiarTokenSesionActual
  }//), [fallo, tokenSesionActual, usuarioActual, tokenJuegoActual, idiomaActual, idiomasAdmitidos, API_URL, API_KEY, PUBLIC_URL, GAMES_URL, textos, cambiarUsuarioActual, cambiarTokenJuegoActual, cambiarIdiomaActual, cambiarTokenSesionActual]);

  useEffect(() => {
  //useLayoutEffect(() => {
    inicio();
  }, []);

  return (
    <AjustesContexto value={exportaciones}>
      {(usuarioActual.ninguno || usuarioActual.uuid) && props.children}
    </AjustesContexto>
  )
}

export default AjustesProvider;
export { AjustesContexto }