import React, { useContext, useState, useEffect } from 'react';
import { AjustesContexto } from '../../contexts/AjustesProvider.jsx';
import Texto from '../Texto.jsx';
import imgCargando from '../../assets/images/cargando.gif';
import { peticionBasica } from '../../libraries/peticiones.js';

function VerUsuarioCompleto(props) {

  const { API_URL, usuarioActual } = useContext(AjustesContexto);
  const [usuarioCargado, setUsuarioCargado] = useState({});
  const [fallo, setFallo] = useState(false);
  const uuidBuscar = props.id ?? usuarioActual.uuid;

  const cargaInicial = async () => {
    console.log(await usuarioActual);
    if (!props.id && !usuarioActual.uuid) {
      console.log("no");
      setFallo(true);
    } else {
      if (usuarioActual.uuid) {
        setUsuarioCargado(usuarioActual);
      } else {
        const resultado = await peticionBasica(API_URL + "/user/" + props.id, [], "GET");
        if (resultado.code === 200) {
          setUsuarioCargado(resultado.data);
        } else {
          setFallo(true);
        }
      }
    }
  }
  useEffect(() => {
    cargaInicial();
  }, []);

  return (
    <>
      {JSON.stringify(usuarioCargado)}
      {uuidBuscar ? (<div>
        {fallo ? (<p className="error error-expandido"><Texto tipo="errores" nombre="usuarioNoEncontrado" /></p>) : (<div>
          {usuarioCargado.uuid ? (<div className="ver-usuario">
            {JSON.stringify(usuarioCargado)}
          </div>) : (<img className="cargando" src={imgCargando} alt={<Texto tipo="titulos" nombre="cargando" />} />)}
        </div>)}
      </div>) : (<p className="error error-expandido"><Texto tipo="errores" nombre="usuarioNoEncontrado" /></p>)}
    </>
  )
}

export default VerUsuarioCompleto;
