const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.Rol)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos.' });
        }
        next();
    };
};

module.exports = verifyRole;
