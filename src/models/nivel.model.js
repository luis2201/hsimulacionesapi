const db = require('../config/db');

const Nivel = {
    getAllNiveles: (callback) => {
        db.query('SELECT * FROM hs_nivel ORDER BY Nombre', callback);
    },

    activateNivel: (id, callback) => {
        db.query('UPDATE hs_nivel SET Estado = 1 WHERE ID = ?', [id], callback);
    }
};

module.exports = Nivel;
