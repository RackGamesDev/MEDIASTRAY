import React from 'react';
import useTituloDinamico from '../hooks/useTituloDinamico.js';
import FormularioLogin from '../components/Forms/FormularioLogin.jsx';

function Login() {

  useTituloDinamico("login");

  return (
    <>
      <FormularioLogin />
    </>
  )
}

export default Login;