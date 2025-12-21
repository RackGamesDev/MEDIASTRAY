import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../pages/Inicio.jsx';
import ErrorNotFound from '../pages/ErrorNotFound.jsx';
import Info from '../pages/Info.jsx';
function Rutas() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/info" element={<Info />} />
        <Route path="/error" element={<ErrorNotFound />} />
        <Route path="/*" element={<ErrorNotFound />} />
      </Routes>
    </>
  )
}

export default Rutas;