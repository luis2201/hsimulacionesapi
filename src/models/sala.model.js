const db = require('../config/db');

const Sala = {

    getAllSalas: (callback) => {
        db.query("SELECT * FROM hs_sala ORDER BY Nombre", callback);
    },

    getSalaById: (id, callback) => {
        db.query('SELECT * FROM hs_sala WHERE ID = ?', [id], callback);
    },

    createSala: (salaData, callback) => {
        const { Nombre } = salaData;
        db.query("INSERT INTO hs_sala(Nombre) VALUES(?);", [Nombre], callback);
    },

    updateSala: (id, salaData, callback) => {
        const  { Nombre } = salaData;
        db.query('UPDATE hs_sala SET Nombre = ? WHERE ID = ?', [Nombre, id], callback);
    },

    deleteSala: (id, callback) => {
        db.query('UPDATE hs_sala SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateSala: (id, callback) => {
        db.query('UPDATE hs_sala SET Estado = 1 WHERE ID = ?', [id], callback);
    }

}

module.exports = Sala;