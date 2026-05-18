const db = require('../config/db');

const SELECT_SOLICITUDES = `
    SELECT
        S.*,
        G.Codigo AS CodigoGuia,
        G.DocenteID,
        T.ID AS TemaID,
        T.Nombre AS Tema,
        M.ID AS MateriaID,
        M.Nombre AS Materia,
        U.Nombres AS Docente,
        SA.Nombre AS Sala,
        TP.Nombre AS TipoPractica,
        R.Nombre AS Recurso,
        TE.Nombres AS Tecnico
    FROM hs_solicitud S
    INNER JOIN hs_guia_practica G ON G.ID = S.GuiaID
    INNER JOIN hs_tema T ON T.ID = G.TemaID
    INNER JOIN hs_materia M ON M.ID = T.MateriaID
    INNER JOIN hs_usuario U ON U.ID = G.DocenteID
    INNER JOIN hs_sala SA ON SA.ID = S.SalaID
    INNER JOIN hs_tipo_practica TP ON TP.ID = S.TipoPracticaID
    LEFT JOIN hs_recurso R ON R.ID = S.RecursoID
    LEFT JOIN hs_tecnico TE ON TE.ID = S.TecnicoID
`;

const SOLICITUD_FIELDS = [
    'GuiaID',
    'Fecha',
    'HoraInicio',
    'HoraFin',
    'Jornada',
    'NumEstudiantes',
    'SalaID',
    'TipoPracticaID',
    'RecursoID',
    'TecnicoID',
    'SalaDebriefing',
    'ErroresProcedimiento',
    'DificultadesHallazgos',
    'EstadoSolicitud'
];

const getValues = (solicitudData) => SOLICITUD_FIELDS.map(field => solicitudData[field] ?? null);

const Solicitud = {
    getAllSolicitudes: (callback) => {
        const sql = `
            ${SELECT_SOLICITUDES}
            WHERE S.Estado = 1
            ORDER BY S.CreatedAt DESC
        `;

        db.query(sql, callback);
    },

    getSolicitudesByDocenteId: (docenteId, callback) => {
        const sql = `
            ${SELECT_SOLICITUDES}
            WHERE S.Estado = 1 AND G.DocenteID = ?
            ORDER BY S.CreatedAt DESC
        `;

        db.query(sql, [docenteId], callback);
    },

    getSolicitudById: (id, callback) => {
        const sql = `
            ${SELECT_SOLICITUDES}
            WHERE S.Estado = 1 AND S.ID = ?
            LIMIT 1
        `;

        db.query(sql, [id], callback);
    },

    getSolicitudByIdAndDocenteId: (id, docenteId, callback) => {
        const sql = `
            ${SELECT_SOLICITUDES}
            WHERE S.Estado = 1 AND S.ID = ? AND G.DocenteID = ?
            LIMIT 1
        `;

        db.query(sql, [id, docenteId], callback);
    },

    getSolicitudesByCodigoGuia: (codigo, callback) => {
        const sql = `
            ${SELECT_SOLICITUDES}
            WHERE S.Estado = 1 AND G.Codigo = ?
            ORDER BY S.CreatedAt DESC
        `;

        db.query(sql, [codigo], callback);
    },

    getSolicitudesByCodigoGuiaAndDocenteId: (codigo, docenteId, callback) => {
        const sql = `
            ${SELECT_SOLICITUDES}
            WHERE S.Estado = 1 AND G.Codigo = ? AND G.DocenteID = ?
            ORDER BY S.CreatedAt DESC
        `;

        db.query(sql, [codigo, docenteId], callback);
    },

    getGuiaOwnerById: (guiaId, callback) => {
        db.query('SELECT ID, DocenteID FROM hs_guia_practica WHERE ID = ? AND Estado = 1 LIMIT 1', [guiaId], callback);
    },

    verificarDisponibilidadSala: (Fecha, SalaID, HoraInicio, HoraFin, excludeId, callback) => {
        const params = [Fecha, SalaID, HoraFin, HoraInicio, HoraInicio, HoraFin];
        let sql = `
            SELECT ID, Fecha, HoraInicio, HoraFin, SalaID
            FROM hs_solicitud
            WHERE Fecha = ? AND SalaID = ? AND Estado = 1
            AND ((HoraInicio < ? AND HoraFin > ?) OR (HoraInicio >= ? AND HoraInicio < ?))
        `;

        if (excludeId) {
            sql += ' AND ID <> ?';
            params.push(excludeId);
        }

        db.query(sql, params, callback);
    },

    createSolicitud: (solicitudData, callback) => {
        const sql = `
            INSERT INTO hs_solicitud
            (${SOLICITUD_FIELDS.join(', ')})
            VALUES (${SOLICITUD_FIELDS.map(() => '?').join(', ')})
        `;

        db.query(sql, getValues(solicitudData), callback);
    },

    updateSolicitud: (id, solicitudData, callback) => {
        const sql = `
            UPDATE hs_solicitud
            SET ${SOLICITUD_FIELDS.map(field => `${field} = ?`).join(', ')}
            WHERE ID = ?
        `;

        db.query(sql, [...getValues(solicitudData), id], callback);
    },

    deleteSolicitud: (id, callback) => {
        db.query('UPDATE hs_solicitud SET Estado = 0 WHERE ID = ?', [id], callback);
    },

    getSolicitudInactivaById: (id, callback) => {
        db.query('SELECT * FROM hs_solicitud WHERE ID = ? AND Estado = 0 LIMIT 1', [id], callback);
    },

    activateSolicitud: (id, callback) => {
        db.query('UPDATE hs_solicitud SET Estado = 1 WHERE ID = ?', [id], callback);
    },

    getAsistenciaBySolicitudId: (solicitudId, callback) => {
        const sql = `
            SELECT
                ID,
                SolicitudID,
                ApellidosNombres,
                Asistencia,
                Observacion,
                FechaMarcacion,
                MarcadoPor,
                Estado,
                CreatedAt
            FROM hs_solicitud_estudiante
            WHERE SolicitudID = ? AND Estado = 1
            ORDER BY ApellidosNombres
        `;

        db.query(sql, [solicitudId], callback);
    },

    countEstudiantesBySolicitudId: (solicitudId, callback) => {
        db.query(
            'SELECT COUNT(*) AS total FROM hs_solicitud_estudiante WHERE SolicitudID = ? AND Estado = 1',
            [solicitudId],
            callback
        );
    },

    createEstudiantes: (solicitudId, estudiantes, callback) => {
        if (estudiantes.length === 0) return callback(null, { affectedRows: 0 });

        const sql = `
            INSERT INTO hs_solicitud_estudiante
            (SolicitudID, ApellidosNombres, Observacion)
            VALUES ?
        `;
        const values = estudiantes.map(item => [
            solicitudId,
            item.ApellidosNombres,
            item.Observacion ?? null
        ]);

        db.query(sql, [values], callback);
    },

    updateEstudiantes: (solicitudId, estudiantes, callback) => {
        if (estudiantes.length === 0) return callback(null, { affectedRows: 0 });

        const sql = `
            UPDATE hs_solicitud_estudiante
            SET ApellidosNombres = ?, Observacion = ?
            WHERE ID = ? AND SolicitudID = ? AND Estado = 1
        `;

        const queries = estudiantes.map(item => new Promise((resolve, reject) => {
            db.query(
                sql,
                [item.ApellidosNombres, item.Observacion ?? null, item.ID, solicitudId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        }));

        Promise.all(queries)
            .then(results => {
                const affectedRows = results.reduce((total, result) => total + result.affectedRows, 0);
                callback(null, { affectedRows });
            })
            .catch(callback);
    },

    deleteEstudiante: (solicitudId, id, callback) => {
        db.query(
            'UPDATE hs_solicitud_estudiante SET Estado = 0 WHERE ID = ? AND SolicitudID = ?',
            [id, solicitudId],
            callback
        );
    },

    updateAsistencia: (asistencias, marcadoPor, callback) => {
        if (asistencias.length === 0) return callback(null, { affectedRows: 0 });

        const sql = `
            UPDATE hs_solicitud_estudiante
            SET Asistencia = ?, Observacion = ?, FechaMarcacion = CURRENT_TIMESTAMP, MarcadoPor = ?
            WHERE ID = ? AND SolicitudID = ? AND Estado = 1
        `;

        const queries = asistencias.map(item => new Promise((resolve, reject) => {
            db.query(
                sql,
                [item.Asistencia, item.Observacion ?? null, marcadoPor, item.ID, item.SolicitudID],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        }));

        Promise.all(queries)
            .then(results => {
                const affectedRows = results.reduce((total, result) => total + result.affectedRows, 0);
                callback(null, { affectedRows });
            })
            .catch(callback);
    }
};

module.exports = Solicitud;
