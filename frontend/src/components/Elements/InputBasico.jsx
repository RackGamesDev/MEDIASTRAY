import React, { useState } from 'react';
import CajaError from '../Principal/CajaError.jsx';
import './InputBasico.css';

function InputBasico(props) {

  const [correcto, setCorrecto] = useState(true);
  const funcionValidadora = props.validador ?? (() => true);

  return (
    <div className="input-basico">
        {props.valor}
        <label htmlFor={props.nombre}>{props.titulo}</label>
        {props.tipo === "textarea" ? (<textarea rows='8' cols="50" onChange={(e)=>{setCorrecto(funcionValidadora(e.target.value) ?? true)}} id={props.nombre ?? ''}>{props.valor ?? ''}</textarea>) : 
        (<input onChange={(e)=>{setCorrecto(funcionValidadora(e.target.value) ?? true)}} type={props.tipo ?? "text"} value={props.valor ?? ''} name={props.nombre ?? ''} id={props.nombre ?? ''} checked={props.tipo === "checkbox" && props.estaChecked } placeholder={props.placeholder ?? ''}/>)}
        {!correcto && (<CajaError texto={props.mensajeError ?? ''} nivel="input" />)}
        

    </div>
  )
}

export default InputBasico;
