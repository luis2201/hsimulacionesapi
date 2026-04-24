const db = require('../config/db');

const Nivel = {
    getAllNiveles: (callback) => {
        db.query('SELECT * FROM hs_nivel ORDER BY Nombre', callback);
    }
};

module.exports = Nivel;
