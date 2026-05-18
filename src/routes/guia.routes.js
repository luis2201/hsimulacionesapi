const express = require('express');
const { body, param } = require('express-validator');
const GuiaController = require('../controllers/guia.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

const rolesGestionGuias = ['ADMIN', 'USUARIO', 'DOCENTE'];

const validacionesGuia = [
    body('TemaID').isInt().withMessage('TemaID no es valido'),
    body('DocenteID').optional().isInt().withMessage('DocenteID no es valido'),
    body('Complejidad').isIn(['BAJA', 'MEDIANA', 'ALTA']).withMessage('Complejidad no es valida'),
    body('TemaCaso').optional({ checkFalsy: true }).isString().withMessage('TemaCaso no es valido'),
    body('TecnicasProcedimientos').optional({ checkFalsy: true }).isString().withMessage('TecnicasProcedimientos no es valido'),
    body('ContextoClinicoEscenario').optional({ checkFalsy: true }).isString().withMessage('ContextoClinicoEscenario no es valido'),
    body('ConocimientosPrevios').optional({ checkFalsy: true }).isString().withMessage('ConocimientosPrevios no es valido'),
    body('ObjetivosAprendizaje').optional({ checkFalsy: true }).isString().withMessage('ObjetivosAprendizaje no es valido'),
    body('ResultadosAprendizaje').optional({ checkFalsy: true }).isString().withMessage('ResultadosAprendizaje no es valido'),
    body('DescripcionAmbienteAprendizaje').optional({ checkFalsy: true }).isString().withMessage('DescripcionAmbienteAprendizaje no es valido'),
    body('MaterialEquiposMedicos').optional({ checkFalsy: true }).isString().withMessage('MaterialEquiposMedicos no es valido'),
    body('NumeroActor').optional({ checkFalsy: true }).isString().isLength({ max: 50 }).withMessage('NumeroActor no es valido'),
    body('CaracteristicasActor').optional({ checkFalsy: true }).isString().withMessage('CaracteristicasActor no es valido'),
    body('DescripcionEscena').optional({ checkFalsy: true }).isString().withMessage('DescripcionEscena no es valido'),
    body('Libreto').optional({ checkFalsy: true }).isString().withMessage('Libreto no es valido'),
    body('Autor').optional({ checkFalsy: true }).isString().isLength({ max: 150 }).withMessage('Autor no es valido'),
    body('ReferenciasBibliograficas').optional({ checkFalsy: true }).isString().withMessage('ReferenciasBibliograficas no es valido'),
    body('FechaDiseno').optional({ checkFalsy: true }).isISO8601().withMessage('FechaDiseno no es valida'),
    body('FechaValidacion').optional({ checkFalsy: true }).isISO8601().withMessage('FechaValidacion no es valida')
];

const validacionId = [
    param('id').isInt().withMessage('id no es valido')
];

const validacionCodigo = [
    param('codigo').isString().trim().notEmpty().withMessage('codigo es obligatorio')
];

router.get('/', verifyToken, verifyRole(rolesGestionGuias), GuiaController.getAllGuias);

router.get(
    '/mis-guias',
    verifyToken,
    verifyRole(rolesGestionGuias),
    GuiaController.getMisGuias
);

router.get(
    '/codigo/:codigo',
    verifyToken,
    verifyRole(rolesGestionGuias),
    validacionCodigo,
    GuiaController.getGuiaByCodigo
);

router.get(
    '/:id',
    verifyToken,
    verifyRole(rolesGestionGuias),
    validacionId,
    GuiaController.getGuiaById
);

router.post(
    '/',
    verifyToken,
    verifyRole(rolesGestionGuias),
    validacionesGuia,
    GuiaController.createGuia
);

router.put(
    '/:id',
    verifyToken,
    verifyRole(rolesGestionGuias),
    validacionId,
    validacionesGuia,
    GuiaController.updateGuia
);

router.delete(
    '/:id',
    verifyToken,
    verifyRole(rolesGestionGuias),
    validacionId,
    GuiaController.deleteGuia
);

router.put(
    '/activate/:id',
    verifyToken,
    verifyRole(['ADMIN']),
    validacionId,
    GuiaController.activateGuia
);

module.exports = router;
