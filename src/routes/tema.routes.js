const express = require('express');
const { body, param } = require('express-validator');
const TemaController = require('../controllers/tema.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

const validacionesTema = [
    body('MateriaID').isInt().withMessage('MateriaID no es valido'),
    body('Codigo').isString().trim().notEmpty().withMessage('El codigo es obligatorio'),
    body('Nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio')
];

const validacionMateriaId = [
    param('materiaId').isInt().withMessage('materiaId no es valido')
];

const validacionCodigo = [
    param('codigo').isString().trim().notEmpty().withMessage('codigo es obligatorio')
];

const validacionId = [
    param('id').isInt().withMessage('id no es valido')
];

router.get('/', verifyToken, TemaController.getAllTemas);

router.get(
    '/materia/:materiaId',
    verifyToken,
    validacionMateriaId,
    TemaController.getTemasByMateriaId
);

router.get(
    '/codigo/:codigo',
    verifyToken,
    validacionCodigo,
    TemaController.getTemaByCodigo
);

router.post(
    '/',
    validacionesTema,
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    TemaController.createTema
);

router.put(
    '/:id',
    validacionId,
    validacionesTema,
    verifyToken,
    verifyRole(['ADMIN']),
    TemaController.updateTema
);

router.delete('/:id', verifyToken, verifyRole(['ADMIN']), validacionId, TemaController.deleteTema);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), validacionId, TemaController.activateTema);

module.exports = router;
