import React, { useContext } from "react";
import { AjustesContexto } from "../contexts/AjustesProvider.jsx";

const useAjustes = () => {

  const contexto = useContext(AjustesContexto);

  if (!contexto) {
    throw new Error(
      "El hook useDiscentes debe ser utilizado dentro de <ProveedorDiscentes>."
    );
  }

  return contexto;
};

export default useAjustes;