import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';
import FormularioRegister from '../components/Forms/FormularioRegister.jsx';

function Register() {

  const { idiomaActual } = useContext(AjustesContexto);
    useEffect(()=>{
      cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "register") + " - MEDIASTRAY");
    }, [idiomaActual]);

  return (
    <>
      <FormularioRegister />
    </>
  )
}

export default Register;