const Permissions = require('../models/permissions.model');

const verifyPermissions = (req, res, next) => {
    const { Rol } = req.user;    

    Permissions.getPermissionsByRole(Rol, (err, results) => {
        if (err) {            
            return res.status(500).json({ error: 'Error al verificar permisos' });
        }

        if (results.length === 0) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos para esta acción.' });
        }

        req.menus = results.map(row => row.Menu);
        next();
    });
};

module.exports = verifyPermissions;
