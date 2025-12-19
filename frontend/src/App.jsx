import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL ?? process.env.REACT_APP_API_URL;// "http://localhost:8080/api"; //locatoin.host + "api"

  useEffect(() => {
    console.log(API_URL);
    (async()=>{
      let datos = await fetch(API_URL + "/greet");
      datos = await datos.json();
      console.log(await datos);
    })();
  }, []);

  return (
    <>
    <h2>ques</h2>
    <img src="/public/2Q2.png" alt="la imagen no va" />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
