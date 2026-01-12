import React, { useContext, useState, useEffect } from 'react';
import { AjustesContexto } from '../../contexts/AjustesProvider.jsx';
import Texto from '../Texto.jsx';
import imgCargando from '../../assets/images/cargando.gif';
import { peticionBasica } from '../../libraries/peticiones.js';
import TarjetaUsuarioGrande from './TarjetaUsuarioGrande.jsx';

function VerUsuarioCompleto(props) {

  const { API_URL, usuarioActual } = useContext(AjustesContexto);
  const [usuarioCargado, setUsuarioCargado] = useState({});
  const [fallo, setFallo] = useState(false);
  const uuidBuscar = props.id ?? usuarioActual.uuid;
  const [soyYo, setSoyYo] = useState(false);

  const cargaInicial = async () => {
    if (!props.id && !usuarioActual.uuid) {
      setFallo(true);
    } else {
      if (usuarioActual.uuid === props.id || usuarioActual.nickname === props.id || (!props.id && usuarioActual.uuid)) {
        setSoyYo(true);
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
      {uuidBuscar ? (<div>
        {fallo ? (<p className="error error-expandido"><Texto tipo="errores" nombre="usuarioNoEncontrado" /></p>) : (<div>
          {usuarioCargado.uuid ? (<div className="ver-usuario">
            <TarjetaUsuarioGrande usuario={usuarioCargado} soyYo={soyYo} />
          </div>) : (<img className="cargando" src={imgCargando} alt={<Texto tipo="titulos" nombre="cargando" />} />)}
        </div>)}
      </div>) : (<p className="error error-expandido"><Texto tipo="errores" nombre="usuarioNoEncontrado" /></p>)}
    </>
  )
}

export default VerUsuarioCompleto;
