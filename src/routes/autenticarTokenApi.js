const autenticarTokenApi = (req, res, next) => {
    const API_TOKEN = process.env.API_PRIVATE_TOKEN;
    try {
        const auth = req.header('X-auth-api');
        if (auth !== API_TOKEN || API_TOKEN === undefined || auth === undefined) {
            return res.status(401).json({message: "401: Valid token not provided at private endpoint", code: 404});
        } else {
            next();
        }
    } catch (e) {
        return res.status(401).json({message: "401: Token not provided at private endpoint", code: 404});
    }


}

export default autenticarTokenApi;