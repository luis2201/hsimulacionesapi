const db = require('../config/db');

const Permissions = {
    getPermissionsByRole: (Rol, callback) => {
        db.query('SELECT * FROM hs_permisos WHERE Rol = ?', [Rol], callback);
    }
};

module.exports = Permissions;
