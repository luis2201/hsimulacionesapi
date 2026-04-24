const db = require('../config/db');
const { getAllRecursosSalaID } = require('../controllers/recurso.controller');

const Recurso = {

    getAllRecursos: (callback) => {
        db.query("SELECT * FROM hs_recurso ORDER BY Nombre", callback);
    },

    getAllRecursosSalaID: (id, callback) => {
        db.query("SELECT * FROM hs_recurso WHERE SalaID = ? ORDER BY Nombre", [id], callback);
    },

    getRecursoById: (id, callback) => {
        db.query('SELECT * FROM hs_recurso WHERE ID = ?', [id], callback);
    },

    createRecurso: (recursoData, callback) => {
        const { SalaID, Nombre } = recursoData;
        db.query("INSERT INTO hs_recurso(SalaID, Nombre) VALUES(?, ?);", [SalaID, Nombre], callback);
    },

    updateRecurso: (id, recursoData, callback) => {
        const  { SalaID, Nombre } = recursoData;
        db.query('UPDATE hs_recurso SET SalaID = ?, Nombre = ? WHERE ID = ?', [SalaID, Nombre, id], callback);
    },

    deleteRecurso: (id, callback) => {
        db.query('UPDATE hs_recurso SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateRecurso: (id, callback) => {
        db.query('UPDATE hs_recurso SET Estado = 1 WHERE ID = ?', [id], callback);
    }

}

module.exports = Recurso;