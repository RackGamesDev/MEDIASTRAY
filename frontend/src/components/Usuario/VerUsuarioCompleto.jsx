import React, { useContext, useState, useEffect } from 'react';
import { AjustesContexto } from '../../contexts/AjustesProvider.jsx';
import Texto from '../Texto.jsx';
import imgCargando from '../../assets/images/cargando.gif';
import { peticionBasica } from '../../libraries/peticiones.js';

function VerUsuarioCompleto(props) {
  
  const { API_URL, usuarioActual } = useContext(AjustesContexto);
  const [usuarioCargado, setUsuarioCargado] = useState({});
  const [fallo, setFallo] = useState(false);

  const cargaInicial = async () => {
    if (!props.uuid) {
        setFallo(true);
    } else if (usuarioActual.uuid) {
        setUsuarioCargado(usuarioActual);
    } else {
        const resultado = await peticionBasica(API_URL + "/user/" + props.uuid, [], "GET");
        console.log(resultado);
        if (resultado.code === 200) {
            setUsuarioCargado(resultado.data);
        } else {
            setFallo(true);
        }
    }
  }
  useEffect(() => {
    cargaInicial();
  }, []);

  return (
    <>
        {props.uuid ? (<div>
            {usuarioCargado.uuid ? (<div>
                {fallo ? (<p className="error error-expandido"><Texto tipo="errores" nombre="usuarioNoEncontrado" /></p>) : (<div>
                    
                </div>)}
            </div>) : (<img className="cargan" src={imgCargando} alt={<Texto tipo="titulos" nombre="cargando" />} />)}
        </div>) : (<p className="error error-expandido"><Texto tipo="errores" nombre="usuarioNoEncontrado" /></p>)}
    </>
  )
}

export default VerUsuarioCompleto;
