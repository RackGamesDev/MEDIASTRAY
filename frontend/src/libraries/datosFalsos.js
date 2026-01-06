import datosFalsos from '../assets/textosDummy.json';

const correoFalso = () => {
    return datosFalsos.correos[Math.floor(Math.random() * datosFalsos.correos.length)];
}

const nicknameFalso = () => {
    return datosFalsos.nicknames[Math.floor(Math.random() * datosFalsos.nicknames.length)];
}

const identificacionFalsa = () => {
    return Math.random() < 0.5 ? correoFalso() : nicknameFalso();
}

export { correoFalso, nicknameFalso, identificacionFalsa }