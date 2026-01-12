import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function FeaturedForums() {

  const { idiomaActual } = useContext(AjustesContexto);
    useEffect(()=>{
      cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "featuredForums") + " - MEDIASTRAY");
    }, [idiomaActual]);

  return (
    <>
      <h2>FeaturedForums</h2>
    </>
  )
}

export default FeaturedForums;