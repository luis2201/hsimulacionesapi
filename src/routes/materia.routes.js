const express = require('express');
const { body, param } = require('express-validator');
const MateriaController = require('../controllers/materia.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

const validacionesMateria = [
    body('CarreraID').isInt().withMessage('CarreraID no es valido'),
    body('NivelID').isInt().withMessage('NivelID no es valido'),
    body('Nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio')
];

const validacionesFiltros = [
    param('carreraId').isInt().withMessage('carreraId no es valido')
];

const validacionesFiltrosConNivel = [
    param('carreraId').isInt().withMessage('carreraId no es valido'),
    param('nivelId').isInt().withMessage('nivelId no es valido')
];

const validacionId = [
    param('id').isInt().withMessage('id no es valido')
];

router.get('/', verifyToken, MateriaController.getAllMaterias);

router.get(
    '/carrera/:carreraId',
    verifyToken,
    validacionesFiltros,
    MateriaController.getMateriasByCarreraId
);

router.get(
    '/carrera/:carreraId/nivel/:nivelId',
    verifyToken,
    validacionesFiltrosConNivel,
    MateriaController.getMateriasByCarreraAndNivel
);

router.post(
    '/',
    validacionesMateria,
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    MateriaController.createMateria
);

router.put(
    '/:id',
    validacionId,
    validacionesMateria,
    verifyToken,
    verifyRole(['ADMIN']),
    MateriaController.updateMateria
);

router.delete('/:id', verifyToken, verifyRole(['ADMIN']), validacionId, MateriaController.deleteMateria);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), validacionId, MateriaController.activateMateria);

module.exports = router;
