const db = require('../config/db');

const Carrera = {

    getAllCarreras: (callback) => {
        db.query('SELECT * FROM hs_carrera ORDER BY Nombre', callback);
    },

    createCarrera: (carreraData, callback) => {
        const { Nombre } = carreraData;
        db.query('INSERT INTO hs_carrera (Nombre) VALUES (?)', [Nombre], callback);
    },

    updateCarrera: (id, carreraData, callback) => {
        const { Nombre } = carreraData;
        db.query('UPDATE hs_carrera SET Nombre = ? WHERE ID = ?', [Nombre, id], callback);
    },

    deleteCarrera: (id, callback) => {
        db.query('UPDATE hs_carrera SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateCarrera: (id, callback) => {
        db.query('UPDATE hs_carrera SET Estado = 1 WHERE ID = ?', [id], callback);
    }
};

module.exports = Carrera;
