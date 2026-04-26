const db = require('../config/db');

const Materia = {
    getAllMaterias: (callback) => {
        const sql = `
            SELECT
                M.*,
                C.Nombre AS Carrera,
                N.Nombre AS Nivel
            FROM hs_materia M
            INNER JOIN hs_carrera C ON C.ID = M.CarreraID
            INNER JOIN hs_nivel N ON N.ID = M.NivelID
            ORDER BY C.Nombre, N.Orden, M.Nombre
        `;

        db.query(sql, callback);
    },

    getMateriasByCarreraId: (carreraId, callback) => {
        const sql = `
            SELECT
                M.*,
                C.Nombre AS Carrera,
                N.Nombre AS Nivel
            FROM hs_materia M
            INNER JOIN hs_carrera C ON C.ID = M.CarreraID
            INNER JOIN hs_nivel N ON N.ID = M.NivelID
            WHERE M.CarreraID = ?
            ORDER BY N.Orden, M.Nombre
        `;

        db.query(sql, [carreraId], callback);
    },

    getMateriasByCarreraAndNivel: (carreraId, nivelId, callback) => {
        const sql = `
            SELECT
                M.*,
                C.Nombre AS Carrera,
                N.Nombre AS Nivel
            FROM hs_materia M
            INNER JOIN hs_carrera C ON C.ID = M.CarreraID
            INNER JOIN hs_nivel N ON N.ID = M.NivelID
            WHERE M.CarreraID = ? AND M.NivelID = ?
            ORDER BY M.Nombre
        `;

        db.query(sql, [carreraId, nivelId], callback);
    },

    createMateria: (materiaData, callback) => {
        const { CarreraID, NivelID, Nombre } = materiaData;
        const sql = `
            INSERT INTO hs_materia (CarreraID, NivelID, Nombre)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [CarreraID, NivelID, Nombre], callback);
    },

    updateMateria: (id, materiaData, callback) => {
        const { CarreraID, NivelID, Nombre } = materiaData;
        const sql = `
            UPDATE hs_materia
            SET CarreraID = ?, NivelID = ?, Nombre = ?
            WHERE ID = ?
        `;

        db.query(sql, [CarreraID, NivelID, Nombre, id], callback);
    },

    deleteMateria: (id, callback) => {
        db.query('UPDATE hs_materia SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateMateria: (id, callback) => {
        db.query('UPDATE hs_materia SET Estado = 1 WHERE ID = ?', [id], callback);
    }
};

module.exports = Materia;
