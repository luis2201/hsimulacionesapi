const db = require('../config/db');

const User = {
    getAllUsers: (callback) => {
        db.query('SELECT U.ID, U.Nombres, U.Estado, U.Rol, A.Usuario FROM hs_usuario U INNER JOIN hs_auth A ON U.ID = A.ID ORDER BY Nombres', callback);
    },

    getUserById: (id, callback) => {
        db.query('SELECT U.ID, U.Nombres, U.Estado, U.Rol, A.Usuario FROM hs_usuario U INNER JOIN hs_auth A ON U.ID = A.ID WHERE U.ID = ?', [id], callback);
    },

    createUser: (userData, callback) => {
        const { Nombres, Rol } = userData;
        db.query('INSERT INTO hs_usuario (Nombres, Estado, Rol) VALUES (?, 1, ?)', [Nombres, Rol], callback);
    },

    updateUser: (id, userData, callback) => {
        const { Nombres, Usuario, Rol } = userData;
        db.query('UPDATE hs_usuario SET Nombres = ?, Rol = ? WHERE ID = ?', [Nombres, Rol, id], (err) => {
            if (err) return callback(err);
            
            db.query('UPDATE hs_auth SET Usuario = ? WHERE ID = ?', [Usuario, id], callback);
        });
    },

    updateUserNombres: (id, Nombres, callback) => {
        db.query('UPDATE hs_usuario SET Nombres = ? WHERE ID = ?', [Nombres, id], callback);
    },

    deleteUser: (id, callback) => {
        db.query('UPDATE hs_usuario SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateUser: (id, callback) => {
        db.query('UPDATE hs_usuario SET Estado = 1 WHERE ID = ?', [id], callback);
    }
};

module.exports = User;
