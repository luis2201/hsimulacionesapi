const express = require('express');
const { body, param } = require('express-validator');
const SolicitudController = require('../controllers/solicitud.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

const rolesGestionSolicitudes = ['ADMIN', 'USUARIO', 'DOCENTE'];

const validacionesSolicitud = [
    body('GuiaID').isInt().withMessage('GuiaID no es valido'),
    body('Fecha').isISO8601().withMessage('Fecha no es valida'),
    body('HoraInicio').matches(/^\d{2}:\d{2}$/).withMessage('HoraInicio no es valida'),
    body('HoraFin')
        .matches(/^\d{2}:\d{2}$/).withMessage('HoraFin no es valida')
        .custom((horaFin, { req }) => horaFin > req.body.HoraInicio)
        .withMessage('HoraFin debe ser mayor que HoraInicio'),
    body('Jornada').optional({ checkFalsy: true }).isIn(['AM', 'PM']).withMessage('Jornada no es valida'),
    body('NumEstudiantes').isInt({ min: 0 }).withMessage('NumEstudiantes no es valido'),
    body('SalaID').isInt().withMessage('SalaID no es valido'),
    body('TipoPracticaID').isInt().withMessage('TipoPracticaID no es valido'),
    body('RecursoID').optional({ checkFalsy: true }).isInt().withMessage('RecursoID no es valido'),
    body('TecnicoID').optional({ checkFalsy: true }).isInt().withMessage('TecnicoID no es valido'),
    body('SalaDebriefing').optional({ checkFalsy: true }).isIn(['SALA 1', 'SALA 2', 'SALA 3', 'SALA 4', 'NINGUNA']).withMessage('SalaDebriefing no es valida'),
    body('ErroresProcedimiento').optional({ checkFalsy: true }).isString().withMessage('ErroresProcedimiento no es valido'),
    body('DificultadesHallazgos').optional({ checkFalsy: true }).isString().withMessage('DificultadesHallazgos no es valido'),
    body('EstadoSolicitud').optional().isIn(['PENDIENTE', 'APROBADA', 'RECHAZADA', 'SUSPENDIDA', 'REPROGRAMADA', 'FINALIZADA']).withMessage('EstadoSolicitud no es valido')
];

const validacionId = [
    param('id').isInt().withMessage('id no es valido')
];

const validacionCodigoGuia = [
    param('codigo').isString().trim().notEmpty().withMessage('codigo es obligatorio')
];

const validacionSolicitudId = [
    param('solicitudId').isInt().withMessage('solicitudId no es valido')
];

const validacionesAsistencia = [
    body('asistencias').isArray({ min: 1 }).withMessage('asistencias debe ser un arreglo'),
    body('asistencias.*.ID').isInt().withMessage('ID de asistencia no es valido'),
    body('asistencias.*.Asistencia').isIn(['PENDIENTE', 'PRESENTE', 'FALTA']).withMessage('Asistencia no es valida'),
    body('asistencias.*.Observacion').optional({ checkFalsy: true }).isString().isLength({ max: 255 }).withMessage('Observacion no es valida')
];

const validacionesCrearEstudiantes = [
    body('estudiantes').isArray({ min: 1 }).withMessage('estudiantes debe ser un arreglo'),
    body('estudiantes.*.ApellidosNombres').isString().trim().notEmpty().isLength({ max: 180 }).withMessage('ApellidosNombres no es valido'),
    body('estudiantes.*.Observacion').optional({ checkFalsy: true }).isString().isLength({ max: 255 }).withMessage('Observacion no es valida')
];

const validacionesActualizarEstudiantes = [
    body('estudiantes').isArray({ min: 1 }).withMessage('estudiantes debe ser un arreglo'),
    body('estudiantes.*.ID').isInt().withMessage('ID de estudiante no es valido'),
    body('estudiantes.*.ApellidosNombres').isString().trim().notEmpty().isLength({ max: 180 }).withMessage('ApellidosNombres no es valido'),
    body('estudiantes.*.Observacion').optional({ checkFalsy: true }).isString().isLength({ max: 255 }).withMessage('Observacion no es valida')
];

router.get('/', verifyToken, verifyRole(rolesGestionSolicitudes), SolicitudController.getAllSolicitudes);

router.get(
    '/mis-solicitudes',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    SolicitudController.getMisSolicitudes
);

router.get(
    '/codigo-guia/:codigo',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionCodigoGuia,
    SolicitudController.getSolicitudesByCodigoGuia
);

router.get(
    '/:solicitudId/estudiantes',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionSolicitudId,
    SolicitudController.getEstudiantes
);

router.post(
    '/:solicitudId/estudiantes',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionSolicitudId,
    validacionesCrearEstudiantes,
    SolicitudController.createEstudiantes
);

router.put(
    '/:solicitudId/estudiantes',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionSolicitudId,
    validacionesActualizarEstudiantes,
    SolicitudController.updateEstudiantes
);

router.delete(
    '/:solicitudId/estudiantes/:id',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionSolicitudId,
    validacionId,
    SolicitudController.deleteEstudiante
);

router.get(
    '/:solicitudId/asistencia',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionSolicitudId,
    SolicitudController.getAsistencia
);

router.put(
    '/:solicitudId/asistencia',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionSolicitudId,
    validacionesAsistencia,
    SolicitudController.updateAsistencia
);

router.get(
    '/:id',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionId,
    SolicitudController.getSolicitudById
);

router.post(
    '/',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionesSolicitud,
    SolicitudController.createSolicitud
);

router.put(
    '/:id',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionId,
    validacionesSolicitud,
    SolicitudController.updateSolicitud
);

router.delete(
    '/:id',
    verifyToken,
    verifyRole(rolesGestionSolicitudes),
    validacionId,
    SolicitudController.deleteSolicitud
);

router.put(
    '/activate/:id',
    verifyToken,
    verifyRole(['ADMIN']),
    validacionId,
    SolicitudController.activateSolicitud
);

module.exports = router;
