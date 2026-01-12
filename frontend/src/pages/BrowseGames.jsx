import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function BrowseGames() {

  const { idiomaActual } = useContext(AjustesContexto);
  useEffect(()=>{
    cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "browseGames") + " - MEDIASTRAY");
  }, [idiomaActual]);

  return (
    <>
      <h2>BrowseGames</h2>
    </>
  )
}

export default BrowseGames;