const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        console.error("Error: Token no proporcionado.");
        return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        console.error("Error: Formato de token incorrecto.");
        return res.status(400).json({ error: 'Formato de token incorrecto.' });
    }

    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error: Token no válido.");
            return res.status(401).json({ error: 'Token no válido' });
        }

        req.user = decoded; // Guardar los datos del usuario en `req.user`
        next();
    });
};

module.exports = verifyToken;
