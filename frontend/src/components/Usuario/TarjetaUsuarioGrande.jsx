import React from 'react';

function TarjetaUsuarioGrande(props) {

  return (
    <>
        {JSON.stringify(props.usuario)}
        {JSON.stringify(props.soyYo)}
    </>
  )
}

export default TarjetaUsuarioGrande;
