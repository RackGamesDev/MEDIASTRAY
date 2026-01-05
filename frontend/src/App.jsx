import React from 'react';
import './App.css';
import Contenido from './routes/Contenido.jsx';
import Cabecera from './components/Principal/Cabecera.jsx';
import Pie from './components/Principal/Pie.jsx';
import AjustesProvider from './contexts/AjustesProvider.jsx';

function App() {
  

  return (
    <>
      <AjustesProvider>
        <Cabecera />
        <Contenido />
        <Pie />
      </AjustesProvider>
    </>
  )
}

export default App
