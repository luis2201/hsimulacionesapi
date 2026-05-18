const db = require('../config/db');

const Tema = {
    getAllTemas: (callback) => {
        const sql = `
            SELECT
                T.*,
                M.Nombre AS Materia,
                M.CarreraID,
                M.NivelID
            FROM hs_tema T
            INNER JOIN hs_materia M ON M.ID = T.MateriaID
            ORDER BY M.Nombre, T.Nombre
        `;

        db.query(sql, callback);
    },

    getTemasByMateriaId: (materiaId, callback) => {
        const sql = `
            SELECT
                T.*,
                M.Nombre AS Materia,
                M.CarreraID,
                M.NivelID
            FROM hs_tema T
            INNER JOIN hs_materia M ON M.ID = T.MateriaID
            WHERE T.MateriaID = ?
            ORDER BY T.Nombre
        `;

        db.query(sql, [materiaId], callback);
    },

    getTemaByCodigo: (codigo, callback) => {
        const sql = `
            SELECT
                T.*,
                M.Nombre AS Materia,
                M.CarreraID,
                M.NivelID
            FROM hs_tema T
            INNER JOIN hs_materia M ON M.ID = T.MateriaID
            WHERE T.Codigo = ?
            LIMIT 1
        `;

        db.query(sql, [codigo], callback);
    },

    createTema: (temaData, callback) => {
        const { MateriaID, Codigo, Nombre } = temaData;
        const sql = `
            INSERT INTO hs_tema (MateriaID, Codigo, Nombre)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [MateriaID, Codigo, Nombre], callback);
    },

    updateTema: (id, temaData, callback) => {
        const { MateriaID, Codigo, Nombre } = temaData;
        const sql = `
            UPDATE hs_tema
            SET MateriaID = ?, Codigo = ?, Nombre = ?
            WHERE ID = ?
        `;

        db.query(sql, [MateriaID, Codigo, Nombre, id], callback);
    },

    deleteTema: (id, callback) => {
        db.query('UPDATE hs_tema SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    activateTema: (id, callback) => {
        db.query('UPDATE hs_tema SET Estado = 1 WHERE ID = ?', [id], callback);
    }
};

module.exports = Tema;
