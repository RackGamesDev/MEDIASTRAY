import React from 'react';

function InputBasico(props) {
  
  return (
    <div className="input-basico">
        <label htmlFor={props.nombre}>{props.titulo}</label>
        <input onChange={()=>{}} type={props.tipo ?? "text"} valor={props.valor ?? ''} name={props.nombre ?? ''} id={props.nombre ?? ''} checked={props.tipo === "checkbox" && props.estaChecked } placeholder={props.placeholder ?? ''}/>
    </div>
  )
}

export default InputBasico;
