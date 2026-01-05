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
  const recibirDatos = async () => {
    try {
        setFallo(false);
    } catch (error) {
        setFallo({error: true, objeto: error});
    }

  }
  useEffect(() => {
    recibirDatos();
  }, []);

  const cambiarUsuarioActual = async (usuario) => {
    if (validarDatosUsuario(usuario)) {
        setUsuarioActual(usuario);
    } else {
        setFallo({error: true, code: "user-non-validable"});
    }
  }

  const cambiarTokenSesionActual = async (token) => {
    if (token) setTokenSesionActual(token);
  }
  const cambiarTokenJuegoActual = async (token) => {
    if (token) setTokenJuegoActual(token);
  }

  const cambiarIdiomaActual = async (nuevo) => {
    if (idiomasAdmitidos.find((e)=>e===nuevo)) {
        setIdiomaActual(nuevo);
    } else {
        setFallo({error: true, code: "language-not-found"});
    }
  }

  const exportaciones = { fallo: fallo, tokenSesionActual, usuarioActual, tokenJuegoActual, idiomaActual, idiomasAdmitidos, API_URL, API_KEY, PUBLIC_URL, GAMES_URL, 
    textosInterfazEnlacesCabecera: textos.enlacesCabecera,
    textosInterfazBotones: textos.botones,
    cambiarUsuarioActual, cambiarTokenJuegoActual, cambiarIdiomaActual, cambiarTokenSesionActual };


  return (
    <AjustesContexto value={exportaciones}>
      {props.children}
    </AjustesContexto>
  )
}

export default AjustesProvider;
export { AjustesContexto }