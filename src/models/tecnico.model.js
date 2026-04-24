const db = require('../config/db');

const Tecnico = {
    getAllTecnicos: (callback) => {
        db.query("SELECT * FROM hs_tecnico ORDER BY Nombres", callback);
    },
    
    createTecnico: (tecnicoData, callback) => {
        const { Nombres } = tecnicoData;
        db.query("INSERT INTO hs_tecnico(Nombres) VALUES (?);", [Nombres], callback);
    },

    getTecnicoById: (id, callback) => {
        db.query('SELECT * FROM hs_tecnico WHERE ID = ?', [id], callback);
    },

    updateTecnico: (id, tecnicoData, callback) => {
        const { Nombres } = tecnicoData;
        db.query('UPDATE hs_tecnico SET Nombres = ? WHERE ID = ?', [Nombres, id], callback);
    },

    deleteTecnico: (id, callback) => {
        db.query('UPDATE hs_tecnico SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateTecnico: (id, callback) => {
        db.query('UPDATE hs_tecnico SET Estado = 1 WHERE ID = ?', [id], callback);
    }
}

module.exports = Tecnico;