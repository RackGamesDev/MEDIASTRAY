import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';
import { useParams } from 'react-router-dom';
import VerUsuarioCompleto from '../components/Usuario/VerUsuarioCompleto.jsx';

function ViewUser() {

  const {id} = useParams();

  const { idiomaActual } = useContext(AjustesContexto);
    useEffect(()=>{
      cambiarTitulo((id ?? TextoTraducido("titulosHtml", idiomaActual, "viewUser")) + " - MEDIASTRAY");
    }, [idiomaActual]);

  return (
    <>
      <VerUsuarioCompleto id={id} />
    </>
  )
}

export default ViewUser;