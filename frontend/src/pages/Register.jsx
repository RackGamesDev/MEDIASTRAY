import React from 'react';
import useTituloDinamico from '../hooks/useTituloDinamico.js';
import FormularioRegister from '../components/Forms/FormularioRegister.jsx';

function Register() {

  useTituloDinamico("register");

  return (
    <>
      <FormularioRegister />
    </>
  )
}

export default Register;