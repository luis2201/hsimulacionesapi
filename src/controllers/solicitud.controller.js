const { validationResult } = require('express-validator');
const Solicitud = require('../models/solicitud.model');

const cleanEmptyValues = (data) => Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
);

const normalizeSolicitudData = (req) => ({
    ...cleanEmptyValues(req.body),
    NumEstudiantes: req.body.NumEstudiantes ?? 0,
    SalaDebriefing: req.body.SalaDebriefing || 'NINGUNA',
    EstadoSolicitud: req.body.EstadoSolicitud || 'PENDIENTE'
});

const getSolicitudForUser = (req, id, callback) => {
    if (req.user.Rol === 'DOCENTE') {
        return Solicitud.getSolicitudByIdAndDocenteId(id, req.user.userId, callback);
    }

    return Solicitud.getSolicitudById(id, callback);
};

const validarGuiaDisponible = (req, guiaId, res, next) => {
    Solicitud.getGuiaOwnerById(guiaId, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al validar la guia' });
        if (results.length === 0) return res.status(404).json({ message: 'Guia no encontrada' });
        if (req.user.Rol === 'DOCENTE' && results[0].DocenteID !== req.user.userId) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos para esta guia.' });
        }

        next();
    });
};

const validarDisponibilidadSala = (solicitudData, res, next, excludeId = null) => {
    Solicitud.verificarDisponibilidadSala(
        solicitudData.Fecha,
        solicitudData.SalaID,
        solicitudData.HoraInicio,
        solicitudData.HoraFin,
        excludeId,
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error verificando disponibilidad de la sala' });
            if (results.length > 0) {
                return res.status(409).json({ error: 'La sala ya tiene una solicitud en ese horario' });
            }

            next();
        }
    );
};

const validarCupoEstudiantes = (solicitud, cantidadNueva, res, next) => {
    Solicitud.countEstudiantesBySolicitudId(solicitud.ID, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al validar el cupo de estudiantes' });

        const registrados = results[0]?.total || 0;
        const cupo = solicitud.NumEstudiantes;

        if (registrados + cantidadNueva > cupo) {
            return res.status(409).json({
                error: `La solicitud permite un maximo de ${cupo} estudiantes`,
                registrados,
                disponibles: Math.max(cupo - registrados, 0)
            });
        }

        next();
    });
};

const SolicitudController = {
    getAllSolicitudes: (req, res) => {
        if (req.user.Rol === 'DOCENTE') {
            return Solicitud.getSolicitudesByDocenteId(req.user.userId, (err, results) => {
                if (err) return res.status(500).json({ error: 'Error al obtener tus solicitudes' });
                res.json(results);
            });
        }

        Solicitud.getAllSolicitudes((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las solicitudes' });
            res.json(results);
        });
    },

    getMisSolicitudes: (req, res) => {
        Solicitud.getSolicitudesByDocenteId(req.user.userId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener tus solicitudes' });
            res.json(results);
        });
    },

    getSolicitudById: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        getSolicitudForUser(req, id, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            res.json(results[0]);
        });
    },

    getSolicitudesByCodigoGuia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { codigo } = req.params;
        const getSolicitudes = req.user.Rol === 'DOCENTE'
            ? (callback) => Solicitud.getSolicitudesByCodigoGuiaAndDocenteId(codigo, req.user.userId, callback)
            : (callback) => Solicitud.getSolicitudesByCodigoGuia(codigo, callback);

        getSolicitudes((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las solicitudes de la guia' });
            res.json(results);
        });
    },

    createSolicitud: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const solicitudData = normalizeSolicitudData(req);

        validarGuiaDisponible(req, solicitudData.GuiaID, res, () => {
            validarDisponibilidadSala(solicitudData, res, () => {
                Solicitud.createSolicitud(solicitudData, (err, result) => {
                    if (err) return res.status(500).json({ error: 'Error al crear la solicitud' });
                    res.status(201).json({ message: 'Solicitud registrada correctamente.', ID: result.insertId });
                });
            });
        });
    },

    updateSolicitud: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const solicitudData = normalizeSolicitudData(req);

        getSolicitudForUser(req, id, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            validarGuiaDisponible(req, solicitudData.GuiaID, res, () => {
                validarDisponibilidadSala(solicitudData, res, () => {
                    Solicitud.updateSolicitud(id, solicitudData, (updateErr) => {
                        if (updateErr) return res.status(500).json({ error: 'Error al actualizar la solicitud' });
                        res.json({ message: 'Solicitud actualizada' });
                    });
                }, id);
            });
        });
    },

    deleteSolicitud: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        getSolicitudForUser(req, id, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            Solicitud.deleteSolicitud(id, (deleteErr) => {
                if (deleteErr) return res.status(500).json({ error: 'Error al eliminar la solicitud' });
                res.json({ message: 'Solicitud eliminada' });
            });
        });
    },

    activateSolicitud: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        Solicitud.getSolicitudInactivaById(id, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud inactiva no encontrada' });

            validarDisponibilidadSala(results[0], res, () => {
                Solicitud.activateSolicitud(id, (activateErr) => {
                    if (activateErr) return res.status(500).json({ error: 'Error al activar la solicitud' });
                    res.json({ message: 'Solicitud activada correctamente' });
                });
            });
        });
    },

    getAsistencia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { solicitudId } = req.params;

        getSolicitudForUser(req, solicitudId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            Solicitud.getAsistenciaBySolicitudId(solicitudId, (asistenciaErr, asistencia) => {
                if (asistenciaErr) return res.status(500).json({ error: 'Error al obtener la asistencia' });
                res.json(asistencia);
            });
        });
    },

    getEstudiantes: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { solicitudId } = req.params;

        getSolicitudForUser(req, solicitudId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            Solicitud.getAsistenciaBySolicitudId(solicitudId, (estudiantesErr, estudiantes) => {
                if (estudiantesErr) return res.status(500).json({ error: 'Error al obtener los estudiantes' });
                res.json(estudiantes);
            });
        });
    },

    createEstudiantes: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { solicitudId } = req.params;
        const estudiantes = req.body.estudiantes.map(item => cleanEmptyValues(item));

        getSolicitudForUser(req, solicitudId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            validarCupoEstudiantes(results[0], estudiantes.length, res, () => {
                Solicitud.createEstudiantes(solicitudId, estudiantes, (createErr, result) => {
                    if (createErr) return res.status(500).json({ error: 'Error al registrar estudiantes' });
                    res.status(201).json({ message: 'Estudiantes registrados correctamente', insertados: result.affectedRows });
                });
            });
        });
    },

    updateEstudiantes: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { solicitudId } = req.params;
        const estudiantes = req.body.estudiantes.map(item => cleanEmptyValues(item));

        getSolicitudForUser(req, solicitudId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            if (estudiantes.length > results[0].NumEstudiantes) {
                return res.status(409).json({ error: `La solicitud permite un maximo de ${results[0].NumEstudiantes} estudiantes` });
            }

            Solicitud.updateEstudiantes(solicitudId, estudiantes, (updateErr, result) => {
                if (updateErr) return res.status(500).json({ error: 'Error al actualizar estudiantes' });
                res.json({ message: 'Estudiantes actualizados correctamente', actualizados: result.affectedRows });
            });
        });
    },

    deleteEstudiante: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { solicitudId, id } = req.params;

        getSolicitudForUser(req, solicitudId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            Solicitud.deleteEstudiante(solicitudId, id, (deleteErr, result) => {
                if (deleteErr) return res.status(500).json({ error: 'Error al eliminar estudiante' });
                if (result.affectedRows === 0) return res.status(404).json({ message: 'Estudiante no encontrado' });
                res.json({ message: 'Estudiante eliminado correctamente' });
            });
        });
    },

    updateAsistencia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { solicitudId } = req.params;
        const asistencias = req.body.asistencias.map(item => ({
            ...item,
            SolicitudID: Number(solicitudId)
        }));

        getSolicitudForUser(req, solicitudId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la solicitud' });
            if (results.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });

            Solicitud.updateAsistencia(asistencias, req.user.userId, (updateErr, result) => {
                if (updateErr) return res.status(500).json({ error: 'Error al actualizar la asistencia' });
                res.json({ message: 'Asistencia actualizada correctamente', actualizados: result.affectedRows });
            });
        });
    }
};

module.exports = SolicitudController;
