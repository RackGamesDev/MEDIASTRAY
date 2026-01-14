import React, { useState } from 'react';
import CajaError from '../Principal/CajaError.jsx';

function InputBasico(props) {

  const [correcto, setCorrecto] = useState(true);
  const funcionValidadora = props.validador ?? (() => true);

  return (
    <div className="input-basico">
        <label htmlFor={props.nombre}>{props.titulo}</label>
        <input onChange={(e)=>{setCorrecto(funcionValidadora(e.target.value) ?? true)}} type={props.tipo ?? "text"} valor={props.valor ?? ''} name={props.nombre ?? ''} id={props.nombre ?? ''} checked={props.tipo === "checkbox" && props.estaChecked } placeholder={props.placeholder ?? ''}/>
        {!correcto && (<CajaError texto={props.mensajeError ?? ''} nivel="input" />)}
        

    </div>
  )
}

export default InputBasico;
