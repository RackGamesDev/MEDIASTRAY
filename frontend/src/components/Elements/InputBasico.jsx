import React, { useState } from 'react';
import CajaError from '../Principal/CajaError.jsx';
import './InputBasico.css';

function InputBasico(props) {
  const [correcto, setCorrecto] = useState(true);
  const funcionValidadora = props.validador ?? (() => true);

  const [textareaValue, setTextareaValue] = useState(props.valor || ''); // Initialize with props.valor or an empty string

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    setTextareaValue(newValue); // Update the textarea's state
    setCorrecto(funcionValidadora(newValue) ?? true); // Validate and update correctness
  };


  return (
    <div className="input-basico">
      {props.valor}
      <label htmlFor={props.nombre}>{props.titulo}</label>
      {props.tipo === "textarea" ? (
        
        <div contentEditable="true" onBlur={handleTextareaChange} >{props.valor}</div>
      ) : (
        <input
          onChange={(e)=>{setCorrecto(funcionValidadora(e.target.value) ?? true)}}
          type={props.tipo ?? "text"}
          value={props.valor ?? ''}
          name={props.nombre ?? ''}
          id={props.nombre ?? ''}
          checked={props.tipo === "checkbox" && props.estaChecked }
          placeholder={props.placeholder ?? ''}
        />
      )}
      {!correcto && (<CajaError texto={props.mensajeError ?? ''} nivel="input" />)}
    </div>
  );
}

export default InputBasico;
