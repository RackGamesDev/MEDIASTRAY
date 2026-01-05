import React, { useContext } from 'react';
import { AjustesContexto } from '../../contexts/AjustesProvider.jsx';

function Cabecera() {
  
  const { idiomaActual, idiomasAdmitidos, cambiarIdiomaActual, usuarioActual, textosInterfazEnlacesCabecera } = useContext(AjustesContexto);

  return (
    <>
        <header id="cabecera">
            a
        </header>
    </>
  )
}

export default Cabecera;
