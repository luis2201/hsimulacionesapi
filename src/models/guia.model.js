const db = require('../config/db');

const SELECT_GUIAS = `
    SELECT
        G.*,
        T.Codigo AS TemaCodigo,
        T.Nombre AS Tema,
        M.ID AS MateriaID,
        M.Nombre AS Materia,
        M.CarreraID,
        M.NivelID,
        U.Nombres AS Docente
    FROM hs_guia_practica G
    INNER JOIN hs_tema T ON T.ID = G.TemaID
    INNER JOIN hs_materia M ON M.ID = T.MateriaID
    INNER JOIN hs_usuario U ON U.ID = G.DocenteID
`;

const GUIA_DATA_FIELDS = [
    'TemaID',
    'DocenteID',
    'Complejidad',
    'TemaCaso',
    'TecnicasProcedimientos',
    'ContextoClinicoEscenario',
    'ConocimientosPrevios',
    'ObjetivosAprendizaje',
    'ResultadosAprendizaje',
    'DescripcionAmbienteAprendizaje',
    'MaterialEquiposMedicos',
    'NumeroActor',
    'CaracteristicasActor',
    'DescripcionEscena',
    'Libreto',
    'FechaDiseno',
    'Autor',
    'FechaValidacion',
    'ReferenciasBibliograficas'
];

const GUIA_CREATE_FIELDS = ['Codigo', ...GUIA_DATA_FIELDS];

const getValues = (fields, guiaData) => fields.map(field => guiaData[field] ?? null);

const generarCodigoGuia = (connection, callback) => {
    const year = new Date().getFullYear();
    const prefix = `GP-${year}-`;
    const sql = `
        SELECT MAX(CAST(SUBSTRING(Codigo, ?) AS UNSIGNED)) AS ultimo
        FROM hs_guia_practica
        WHERE Codigo LIKE ?
        FOR UPDATE
    `;

    connection.query(sql, [prefix.length + 1, `${prefix}%`], (err, results) => {
        if (err) return callback(err);

        const siguiente = (results[0]?.ultimo || 0) + 1;
        const codigo = `${prefix}${String(siguiente).padStart(6, '0')}`;

        callback(null, codigo);
    });
};

const Guia = {
    getAllGuias: (callback) => {
        const sql = `
            ${SELECT_GUIAS}
            WHERE G.Estado = 1
            ORDER BY G.CreatedAt DESC
        `;

        db.query(sql, callback);
    },

    getGuiasByDocenteId: (docenteId, callback) => {
        const sql = `
            ${SELECT_GUIAS}
            WHERE G.Estado = 1 AND G.DocenteID = ?
            ORDER BY G.CreatedAt DESC
        `;

        db.query(sql, [docenteId], callback);
    },

    getGuiaById: (id, callback) => {
        const sql = `
            ${SELECT_GUIAS}
            WHERE G.Estado = 1 AND G.ID = ?
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    },

    getGuiaByIdAndDocenteId: (id, docenteId, callback) => {
        const sql = `
            ${SELECT_GUIAS}
            WHERE G.Estado = 1 AND G.ID = ? AND G.DocenteID = ?
            LIMIT 1
        `;

        db.query(sql, [id, docenteId], callback);
    },

    getGuiaByCodigo: (codigo, callback) => {
        const sql = `
            ${SELECT_GUIAS}
            WHERE G.Estado = 1 AND G.Codigo = ?
            LIMIT 1
        `;

        db.query(sql, [codigo], callback);
    },

    getGuiaByCodigoAndDocenteId: (codigo, docenteId, callback) => {
        const sql = `
            ${SELECT_GUIAS}
            WHERE G.Estado = 1 AND G.Codigo = ? AND G.DocenteID = ?
            LIMIT 1
        `;

        db.query(sql, [codigo, docenteId], callback);
    },

    createGuia: (guiaData, callback) => {
        db.getConnection((connectionErr, connection) => {
            if (connectionErr) return callback(connectionErr);

            connection.beginTransaction((transactionErr) => {
                if (transactionErr) {
                    connection.release();
                    return callback(transactionErr);
                }

                generarCodigoGuia(connection, (codigoErr, codigo) => {
                    if (codigoErr) {
                        return connection.rollback(() => {
                            connection.release();
                            callback(codigoErr);
                        });
                    }

                    const sql = `
                        INSERT INTO hs_guia_practica
                        (${GUIA_CREATE_FIELDS.join(', ')}, CreadoPor, ActualizadoPor)
                        VALUES (${GUIA_CREATE_FIELDS.map(() => '?').join(', ')}, ?, ?)
                    `;
                    const values = [
                        ...getValues(GUIA_CREATE_FIELDS, { ...guiaData, Codigo: codigo }),
                        guiaData.CreadoPor,
                        guiaData.ActualizadoPor
                    ];

                    connection.query(sql, values, (insertErr, result) => {
                        if (insertErr) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(insertErr);
                            });
                        }

                        connection.commit((commitErr) => {
                            connection.release();
                            if (commitErr) return callback(commitErr);

                            result.Codigo = codigo;
                            callback(null, result);
                        });
                    });
                });
            });
        });
    },

    updateGuia: (id, guiaData, callback) => {
        const sql = `
            UPDATE hs_guia_practica
            SET ${GUIA_DATA_FIELDS.map(field => `${field} = ?`).join(', ')},
                ActualizadoPor = ?
            WHERE ID = ?
        `;

        db.query(sql, [...getValues(GUIA_DATA_FIELDS, guiaData), guiaData.ActualizadoPor, id], callback);
    },

    deleteGuia: (id, actualizadoPor, callback) => {
        const sql = `
            UPDATE hs_guia_practica
            SET Estado = 0, ActualizadoPor = ?
            WHERE ID = ?
        `;

        db.query(sql, [actualizadoPor, id], callback);
    },

    activateGuia: (id, actualizadoPor, callback) => {
        const sql = `
            UPDATE hs_guia_practica
            SET Estado = 1, ActualizadoPor = ?
            WHERE ID = ?
        `;

        db.query(sql, [actualizadoPor, id], callback);
    }
};

module.exports = Guia;
