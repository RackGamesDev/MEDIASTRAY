import React, { useContext } from 'react';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function Cabecera(props) {
  
  const { idiomaActual, textosInterfaz } = useContext(AjustesContexto);

  return (
    <>
        {textosInterfaz[props.tipo][idiomaActual][props.nombre] ?? ""}
    </>
  )
}

export default Cabecera;
