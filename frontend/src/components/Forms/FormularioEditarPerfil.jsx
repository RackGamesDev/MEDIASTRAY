import React, { useState, useMemo } from 'react';
import Texto from '../Texto.jsx';
import useApi from '../../hooks/useApi.js';
import { useNavigate } from 'react-router-dom';
import InputBasico from '../Elements/InputBasico.jsx';
import BotonFuncion from '../Elements/BotonFuncion.jsx';
import { correo as validarCorreo, contrasegna as validarContrasegna, nickname as validarNickname, nombre as validarNombre, cumpleagnos as validarCumpleagnos } from '../../libraries/validacionesBackend.js';
import { TextoTraducido } from '../../libraries/traducir.js';
import { nicknameFalso, nombreFalso, correoFalso } from '../../libraries/datosFalsos.js';
import useAjustes from '../../hooks/useAjustes.js';
import ImgCargando from '../Principal/ImgCargando.jsx';

function FormularioEditarPerfil(props) {

    const previo = props.usuario;
    const { editarUsuario, borrarUsuario, cargando, error, resetEstados } = useApi();
    const objetoPatchBasico = { correo: previo.correo ?? "", nickname: previo.nickname ?? "", contrasegna: "", verContrasegna: false, contrasegna2: "", nombre: previo.nombre ?? "", cumpleagnos: "", descripcion: previo.descripcion ?? "", url_foto: previo.url_foto ?? "", cambiarContrasegna: false }
    const [objetoPatch, setObjetoPatch] = useState({ ...objetoPatchBasico });
    const [errorFormulario, setErrorFormulario] = useState("");
    const { idiomaActual } = useAjustes();
    const navegar = useNavigate();
    const nombreFalsoPlaceholder = useMemo(() => nombreFalso(), []);
    const nicknameFalsoPlaceholder = useMemo(() => nicknameFalso(), []);
    const correoFalsoPlaceholder = useMemo(() => correoFalso(), []);

    const cambio = (e) => {
        console.log("asdfkjasdlf")
        if (e.target.nodeName === "INPUT") {
            if (e.target.type === "checkbox") {
                setObjetoPatch({ ...objetoPatch, [e.target.name]: e.target.checked });
            } else {
                e.preventDefault();
                setObjetoPatch({ ...objetoPatch, [e.target.name]: e.target.value });
            }
        }
    }

    const reset = () => {
        setObjetoPatch({ ...objetoPatchBasico });
        resetEstados();
    }

    const validar = () => {
        return validarContrasegna(objetoPatch.contrasegna)
            && objetoPatch.contrasegna2 === objetoPatch.contrasegna
            && validarNombre(objetoPatch.nombre)
            && validarCorreo(objetoPatch.correo)
            && validarNickname(objetoPatch.nickname)
            && validarCumpleagnos(objetoPatch.cumpleagnos);
    }

    const enviar = async (e) => {
        e.preventDefault();
        if (validar()) {
            setErrorFormulario("");
            const resultado = await editarUsuario(objetoPatch);
            if (!error && !resultado.error) {
                navegar("/user/" + resultado.user.nickname);
                reset();
            } else {
                if (resultado?.error?.result?.data.doubleNickname) {
                    setErrorFormulario(TextoTraducido("errores", idiomaActual, "nicknameRepetido"));
                } else if (resultado?.error?.result?.data.doubleEmail) {
                    setErrorFormulario(TextoTraducido("errores", idiomaActual, "correoRepetido"));
                } else {
                    setErrorFormulario(TextoTraducido("errores", idiomaActual, "noRegister"));
                }
            }
            resetEstados();

        } else {
            setErrorFormulario(TextoTraducido("errores", idiomaActual, "noRegister"));
        }
        if (objetoPatch.contrasegna2 !== objetoPatch.contrasegna) setErrorFormulario(TextoTraducido("errores", idiomaActual, "dobleContrasegna"));
    }

    return (
        <>
            {JSON.stringify(previo)}<br></br>
            {JSON.stringify(objetoPatchBasico)}
            <h3><Texto tipo="titulos" nombre="editarUsuario" /></h3>
            <form onChange={cambio}>
                <InputBasico nombre="nickname" placeholder={nicknameFalsoPlaceholder} titulo={<Texto tipo="formularios" nombre="nickname" />} valor={objetoPatch.nickname} tipo="text" mensajeError={<Texto tipo="errores" nombre="validacionNickname" />} validador={validarNickname} />
                <InputBasico nombre="correo" placeholder={correoFalsoPlaceholder} titulo={<Texto tipo="formularios" nombre="correo" />} valor={objetoPatch.correo} tipo="text" mensajeError={<Texto tipo="errores" nombre="validacionEmail" />} validador={validarCorreo} />
                <InputBasico nombre="nombre" placeholder={nombreFalsoPlaceholder} titulo={<Texto tipo="formularios" nombre="nombre" />} valor={objetoPatch.nombre} tipo="text" mensajeError={<Texto tipo="errores" nombre="validacionNombre" />} validador={validarNombre} />
                <InputBasico nombre="cumpleagnos" titulo={<Texto tipo="formularios" nombre="cumpleagnos" />} valor={objetoPatch.cumpleagnos} tipo="date" mensajeError={<Texto tipo="errores" nombre="validacionCumpleagnos" />} validador={validarCumpleagnos} />
                {objetoPatch.cambiarContrasegna && (<div>
                    <InputBasico nombre="contrasegna" titulo={<Texto tipo="formularios" nombre="contrasegna" />} valor={objetoPatch.contrasegna} tipo={objetoPatch.verContrasegna ? "text" : "password"} placeholder="········" />
                    <InputBasico nombre="contrasegna2" titulo={<Texto tipo="formularios" nombre="contrasegna2" />} valor={objetoPatch.contrasegna2} tipo={objetoPatch.verContrasegna ? "text" : "password"} placeholder="········" />
                    <InputBasico nombre="verContrasegna" titulo={<Texto tipo="formularios" nombre="contrasegnaMostrar" />} estaChecked={objetoPatch.verContrasegna} tipo="checkbox" />
                </div>)}
                <BotonFuncion titulo={<Texto tipo="botones" nombre="editarPerfil" />} funcion={enviar} />
                <BotonFuncion titulo={<Texto tipo="botones" nombre="reset" />} funcion={reset} />
                <div className="caja-errores">{errorFormulario}</div>
                {cargando && (<ImgCargando />)}
            </form>
        </>
    )
}

export default FormularioEditarPerfil;
