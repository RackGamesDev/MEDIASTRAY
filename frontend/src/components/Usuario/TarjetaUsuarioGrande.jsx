import React, { useState, useEffect } from 'react';
import { TextoTraducido } from '../../libraries/traducir.js';
import useAjustes from '../../hooks/useAjustes.js';
import BotonFuncion from '../Elements/BotonFuncion.jsx';
import useApi from '../../hooks/useApi.js';

function TarjetaUsuarioGrande(props) {

  const { idiomaActual, usuarioActual } = useAjustes();
  const esPremium = props.usuario.premium ? (props.usuario.premium > Date.now()) : false;
  const fechaCumpleagnos = new Date(Number(props.usuario.cumpleagnos)).toLocaleDateString();
  const fechaCreacion = new Date(Number(props.usuario.fechacreacion)).toLocaleDateString();
  const fechaPremium = new Date(Number(props.usuario.premium)).toLocaleDateString();
  const [siguiendo, setSiguiendo] = useState(false);
  const [teSigue, setTeSigue] = useState(false);
  const { verSeguir, seguir } = useApi();

  const alternarSeguir = async () => {
    
  }

  const verSiguiendo = async (deVuelta) => {

  }

  const cargaInicial = async () => {
    if (usuarioActual.uuid && !props.soyYo) {
      setSiguiendo(await verSiguiendo());
      setTeSigue(await verSiguiendo(true));
    }
  }
  useEffect(() => {
    cargaInicial();
  }, []);

  return (
    <div className="tarjeta-usuario-grande">
        {JSON.stringify(props.usuario)}
        {JSON.stringify(props.soyYo)}
        <h2>{props.usuario.nombre}</h2>
        <img src={props.usuario.url_foto ?? "#"} alt={TextoTraducido("errores", idiomaActual, "nopfp")} />
        <p>{"("}{props.usuario.nickname}{")"}</p>
        {props.soyYo && (<p>{props.usuario.correo}</p>)}
        <p>{props.usuario.descripcion.length ? props.usuario.descripcion : TextoTraducido("errores", idiomaActual, "noDescripcion")}</p>
        {props.soyYo && (<p>{TextoTraducido("formularios", idiomaActual, "cumpleagnos")} {fechaCumpleagnos}</p>)}
        <p>{TextoTraducido("formularios", idiomaActual, "fechaCreacion")} {fechaCreacion}</p>
        <p>{TextoTraducido("formularios", idiomaActual, "premium")} {esPremium ? TextoTraducido("palabras", idiomaActual, "si") : TextoTraducido("palabras", idiomaActual, "no")}</p>
        {esPremium && (<p>{TextoTraducido("formularios", idiomaActual, "premiumCaducidad")} {fechaPremium}</p>)}
        <p>{TextoTraducido("formularios", idiomaActual, "seguidores")} {props.usuario.cantidad_seguidores} {(!props.soyYo && usuarioActual.uuid) && (<span>
          <BotonFuncion funcion={alternarSeguir} titulo={TextoTraducido("botones", idiomaActual, siguiendo ? "noSeguir" : "seguir")} />
          <span>{props.usuario.nombre} {TextoTraducido("formularios", idiomaActual, teSigue ? "teSigue" : "noTeSigue")}</span>
        </span>)}</p>
        {props.soyYo ? (<div>

        </div>) : (<p></p>)}
    </div>
  )
}

export default TarjetaUsuarioGrande;
