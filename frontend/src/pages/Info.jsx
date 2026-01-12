import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function Info() {

  const { idiomaActual } = useContext(AjustesContexto);
    useEffect(()=>{
      cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "info") + " - MEDIASTRAY");
    }, [idiomaActual]);

  return (
    <>
      <h2>info</h2>
    </>
  )
}

export default Info;