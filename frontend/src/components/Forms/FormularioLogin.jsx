import React, { useState } from 'react';
import Texto from '../Texto.jsx';
import InputBasico from '../Elements/InputBasico.jsx';
import BotonFuncion from '../Elements/BotonFuncion.jsx';

function FormularioLogin() {
  
  const objetoLoginBasico = {identificacion: "", contrasegna: "", verContrasegna: false}
  const [objetoLogin, setObjetoLogin] = useState({...objetoLoginBasico});

  const cambio = (e) => {
    if (e.target.nodeName === "INPUT") {
      if (e.target.type === "checkbox") {
        setObjetoLogin({...objetoLogin, [e.target.name]: e.target.checked});
      } else {
        e.preventDefault();
        setObjetoLogin({...objetoLogin, [e.target.name]: e.target.value});
      }
    }
  }

  const reset = () => {
    setObjetoLogin({...objetoLoginBasico});
  }

  const validar = () => {

  }

  const enviar = (e) => {
    e.preventDefault();
    console.log(objetoLogin);
  }

  return (
    <div>
      <h2><Texto tipo="titulos" nombre="login" /></h2>
        <form onChange={cambio}>
            <InputBasico nombre="identificacion" titulo={<Texto tipo="formularios" nombre="identificacion" />} valor={objetoLogin.identificacion} tipo="text"/>
            <InputBasico nombre="contrasegna" titulo={<Texto tipo="formularios" nombre="contrasegna" />} valor={objetoLogin.contrasegna} tipo={objetoLogin.verContrasegna ? "text" : "password"} placeholder="········"/>
            <InputBasico nombre="verContrasegna" titulo={<Texto tipo="formularios" nombre="contrasegnaMostrar" />} estaChecked={objetoLogin.verContrasegna} tipo="checkbox" />
            <BotonFuncion titulo={<Texto tipo="botones" nombre="iniciarSesion" />} funcion={enviar}/>
            <div className="caja-errores">

            </div>
        </form>
    </div>
  )
}

export default FormularioLogin;
