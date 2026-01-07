
const peticionBasica = async (url, headers, verbo, body) => {
    const peticion = new Request(url, {method: verbo, body: JSON.stringify(body), headers});
    const resultado = await fetch(peticion);
    return await resultado.json();
}

export { peticionBasica }