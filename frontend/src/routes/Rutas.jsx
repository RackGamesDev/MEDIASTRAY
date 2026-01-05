import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../pages/Inicio.jsx';
import ErrorNotFound from '../pages/ErrorNotFound.jsx';
import Info from '../pages/Info.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ViewUser from '../pages/ViewUser.jsx';
import Settings from '../pages/Settings.jsx';
function Rutas() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/info" element={<Info />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<ViewUser />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/error" element={<ErrorNotFound />} />
        <Route path="/*" element={<ErrorNotFound />} />
      </Routes>
    </>
  )
}

export default Rutas;