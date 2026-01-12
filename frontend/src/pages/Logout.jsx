import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AjustesContexto } from '../contexts/AjustesProvider.jsx';

function Logout() {

  const { cambiarTokenSesionActual, cambiarUsuarioActual } = useContext(AjustesContexto);
  const navegar = useNavigate();

  const cerrarSesion = async () => {
    cambiarTokenSesionActual("");
    cambiarUsuarioActual({ninguno: true});
    navegar("/");
  }

  useEffect(() => {
    cerrarSesion();
  }, []);

  return (
    <>
      <h2>Logout</h2>
    </>
  )
}

export default Logout;