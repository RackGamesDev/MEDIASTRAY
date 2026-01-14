import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAjustes from '../hooks/useAjustes.js';

function Logout() {

  const { logout } = useAjustes();
  const navegar = useNavigate();

  const cerrarSesion = async () => {
    await logout();
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