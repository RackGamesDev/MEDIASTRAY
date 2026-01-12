import React, { useContext } from 'react';
import { AjustesContexto } from '../../contexts/AjustesProvider.jsx';
import BotonNavegacion from '../Elements/BotonNavegacion.jsx';
import imgLogo from '../../assets/images/logoA.png';
import { useNavigate } from 'react-router-dom';
import './Cabecera.css';
import EnlaceFuncion from '../Elements/EnlaceFuncion.jsx';

function Cabecera() {
  
  const { idiomaActual, idiomasAdmitidos, cambiarIdiomaActual, usuarioActual, textosInterfazEnlacesCabecera, PUBLIC_URL } = useContext(AjustesContexto);
  const navegar = useNavigate();
  //usuarioActual.uuid = "si"; usuarioActual.nickname = "sisisi";
  return (
    <>
        <header id="cabecera">
            <img id="logo-cabecera" src={imgLogo ?? PUBLIC_URL + "/logoA.png"} alt="MEDIASTRAY" onClick={()=>{navegar("/")}} />
            {textosInterfazEnlacesCabecera[(usuarioActual.uuid ? "si" : "no") + "Usuario"][idiomaActual].map((e, i) => {
              return (<BotonNavegacion key={i} cabecera={true} direccion={e.direccion} titulo={e.titulo} />)
            })}
            {textosInterfazEnlacesCabecera[idiomaActual].map((e, i) => {
              return (<BotonNavegacion key={i} cabecera={true} direccion={e.direccion} titulo={e.titulo} />)
            })}
            {usuarioActual.uuid ? (
              <span className="usuario-cabecera">
                <BotonNavegacion cabecera={true} direccion={"/user"} titulo={usuarioActual.nickname ?? "User"} />
              </span>
            ) : ""}
            <span id="cambiar-idioma">
              {idiomasAdmitidos.map((e, i) => {
                if (e !== idiomaActual) return (<EnlaceFuncion key={i} cabecera={true} titulo={e} funcion={() => {
                  cambiarIdiomaActual(e);
                }}/>)
              })}
            </span>
            
        </header>
    </>
  )
}

export default Cabecera;
