import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function BrowseForums() {

  const { idiomaActual } = useContext(AjustesContexto);
  useEffect(()=>{
    cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "browseForums") + " - MEDIASTRAY");
  }, [idiomaActual]);

  return (
    <>
      <h2>BrowseForums</h2>
    </>
  )
}

export default BrowseForums;