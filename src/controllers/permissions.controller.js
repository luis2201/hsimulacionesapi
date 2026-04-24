const Permissions = require('../models/permissions.model');

const PermissionsController = {
    getMenusByRole: (req, res) => {
        const { Rol } = req.user; // Extraemos el rol desde el token JWT        

        Permissions.getPermissionsByRole(Rol, (err, menuTree) => {
            if (err) {
                console.error("Error obteniendo permisos:", err);
                return res.status(500).json({ error: 'Error al obtener permisos' });
            }

            res.json({ Rol, menus: menuTree });
        });
    }
};

module.exports = PermissionsController;
