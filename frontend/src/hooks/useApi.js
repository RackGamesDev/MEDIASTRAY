import React, { useState } from "react";

const useApi = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);

    return { cargando, error };
};

export default useApi;