import React from 'react';
import { useParams } from 'react-router-dom';
import VerUsuarioCompleto from '../components/Usuario/VerUsuarioCompleto.jsx';

function ViewUser() {

  const {uuid} = useParams();

  return (
    <>
      <VerUsuarioCompleto uuid={uuid} />
    </>
  )
}

export default ViewUser;