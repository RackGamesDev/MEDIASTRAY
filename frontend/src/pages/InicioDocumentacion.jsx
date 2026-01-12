import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function InicioDocumentacion() {

  const { idiomaActual } = useContext(AjustesContexto);
    useEffect(()=>{
      cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "inicioDocumentacion") + " - MEDIASTRAY");
    }, [idiomaActual]);

  return (
    <>
      <h2>InicioDocumentacion</h2>
    </>
  )
}

export default InicioDocumentacion;