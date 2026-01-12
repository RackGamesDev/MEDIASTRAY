import React, { useEffect, useContext } from 'react';
import { cambiarTitulo } from '../libraries/accionesIndex';
import { TextoTraducido } from '../libraries/traducir.js';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';
import FormularioLogin from '../components/Forms/FormularioLogin.jsx';

function Login() {

  const { idiomaActual } = useContext(AjustesContexto);
    useEffect(()=>{
      cambiarTitulo(TextoTraducido("titulosHtml", idiomaActual, "login") + " - MEDIASTRAY");
    }, [idiomaActual]);

  return (
    <>
      <FormularioLogin />
    </>
  )
}

export default Login;