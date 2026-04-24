const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Auth = {
    getUserByUsername: (Usuario, callback) => {
        db.query('SELECT A.*, U.Nombres, U.Rol FROM hs_auth A INNER JOIN hs_usuario U ON A.ID = U.ID WHERE A.Usuario = ? AND U.Estado = 1', [Usuario], callback);
    },

    createAuth: async (authData, callback) => {
        const { ID, Usuario, Password } = authData;
        
        try {
            // Generar hash de la contraseña
            const hashedPassword = await bcrypt.hash(Password, 10);
            db.query('INSERT INTO hs_auth (ID, Usuario, Password) VALUES (?, ?, ?)', [ID, Usuario, hashedPassword], callback);
        } catch (error) {
            callback(error, null);
        }
    },    

    verifyPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    updatePassword: (id, hashedPassword, callback) => {
        db.query('UPDATE hs_auth SET Password = ? WHERE ID = ?', [hashedPassword, id], callback);
    }
};

module.exports = Auth;
