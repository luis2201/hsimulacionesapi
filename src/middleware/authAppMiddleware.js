const jwt = require('jsonwebtoken');

const verifyAppITToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET_APP, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido o expirado' });

        if (decoded.Rol !== 'APP' || decoded.App !== 'APPIT') {
            return res.status(403).json({ error: 'Permisos insuficientes para APPIT' });
        }

        req.appit = decoded; // guardamos los datos del token
        next();
    });
};

module.exports = verifyAppITToken;
