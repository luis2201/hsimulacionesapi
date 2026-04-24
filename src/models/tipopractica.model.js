const db = require('../config/db');

const Tipopractica = {

    getAllTipopracticas: (callback) => {
        db.query("SELECT * FROM hs_tipo_practica ORDER BY Nombre", callback);
    },

    getTipopracticaById: (id, callback) => {
        db.query('SELECT * FROM hs_tipo_practica WHERE ID = ?', [id], callback);
    },

    createTipopractica: (tipopracticaData, callback) => {
        const { Nombre } = tipopracticaData;
        db.query("INSERT INTO hs_tipo_practica(Nombre) VALUES(?);", [Nombre], callback);
    },

    updateTipopractica: (id, tipopracticaData, callback) => {
        const  { Nombre } = tipopracticaData;
        db.query('UPDATE hs_tipo_practica SET Nombre = ? WHERE ID = ?', [Nombre, id], callback);
    },

    deleteTipopractica: (id, callback) => {
        db.query('UPDATE hs_tipo_practica SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateTipopractica: (id, callback) => {
        db.query('UPDATE hs_tipo_practica SET Estado = 1 WHERE ID = ?', [id], callback);
    }

}

module.exports = Tipopractica;