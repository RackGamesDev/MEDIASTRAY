import React from 'react';
import { useParams } from 'react-router-dom';
import VerUsuarioCompleto from '../components/Usuario/VerUsuarioCompleto.jsx';

function ViewUser() {

  const {id} = useParams();

  return (
    <>
      <VerUsuarioCompleto id={id} />
    </>
  )
}

export default ViewUser;