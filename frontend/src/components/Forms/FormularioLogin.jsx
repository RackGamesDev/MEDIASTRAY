import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Texto from '../Texto.jsx';
import InputBasico from '../Elements/InputBasico.jsx';
import BotonFuncion from '../Elements/BotonFuncion.jsx';
import { identificacion as validarIdentificacion, contrasegna as validarContrasegna } from '../../libraries/validacionesBackend.js';
import { TextoTraducido } from '../../libraries/traducir.js';
import { AjustesContexto } from '../../contexts/AjustesProvider.jsx';
import { peticionBasica } from '../../libraries/peticiones.js';

function FormularioLogin(props) {

  const objetoLoginBasico = { identificacion: "", contrasegna: "", verContrasegna: false }
  const [objetoLogin, setObjetoLogin] = useState({ ...objetoLoginBasico });
  const [errorFormulario, setErrorFormulario] = useState("");
  const { idiomaActual, API_URL, API_KEY, cambiarTokenSesionActual, cambiarUsuarioActual } = useContext(AjustesContexto);
  const navegar = useNavigate();

  const cambio = (e) => {
    if (e.target.nodeName === "INPUT") {
      if (e.target.type === "checkbox") {
        setObjetoLogin({ ...objetoLogin, [e.target.name]: e.target.checked });
      } else {
        e.preventDefault();
        setObjetoLogin({ ...objetoLogin, [e.target.name]: e.target.value });
      }
    }
  }

  const reset = () => {
    setObjetoLogin({ ...objetoLoginBasico });
  }

  const validar = () => {
    return validarIdentificacion(objetoLogin.identificacion) && validarContrasegna(objetoLogin.contrasegna);
  }

  const enviar = async (e) => {
    e.preventDefault();
    if (validar()) {
      setErrorFormulario("");
      if (typeof props.enviarPersonalizado === "function") {
        props.enviarPersonalizado(objetoLogin);
      } else {
        const resultado = await peticionBasica(API_URL + "/userLogin", { "X-auth-api": API_KEY }, "POST", { credentials: { contrasegna: objetoLogin.contrasegna, identification: objetoLogin.identificacion } });
        if (resultado.code === 200 && !resultado.fallo) {
          cambiarTokenSesionActual(resultado.sessionToken);
          cambiarUsuarioActual(resultado.user);
          navegar("/user/" + resultado.user.nickname);
          reset();
        } else {
          setErrorFormulario(TextoTraducido("errores", idiomaActual, "noLogin"));
        }
      }
    } else {
      setErrorFormulario(TextoTraducido("errores", idiomaActual, "noLogin"));
    }
  }

  return (
    <div>
      <h2><Texto tipo="titulos" nombre="login" /></h2>
      <form onChange={cambio}>
        <InputBasico nombre="identificacion" titulo={<Texto tipo="formularios" nombre="identificacion" />} valor={objetoLogin.identificacion} tipo="text" mensajeError={<Texto tipo="errores" nombre="validacionIdentificacion" />} validador={validarIdentificacion} />
        <InputBasico nombre="contrasegna" titulo={<Texto tipo="formularios" nombre="contrasegna" />} valor={objetoLogin.contrasegna} tipo={objetoLogin.verContrasegna ? "text" : "password"} placeholder="········" />
        <InputBasico nombre="verContrasegna" titulo={<Texto tipo="formularios" nombre="contrasegnaMostrar" />} estaChecked={objetoLogin.verContrasegna} tipo="checkbox" />
        <BotonFuncion titulo={<Texto tipo="botones" nombre="iniciarSesion" />} funcion={enviar} />
        <div className="caja-errores">{errorFormulario}</div>
      </form>
    </div>
  )
}

export default FormularioLogin;
