const express = require('express');
const { body, param } = require('express-validator');
const CarreraController = require('../controllers/carrera.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

const validacionId = [
    param('id').isInt().withMessage('id no es valido')
];

router.get('/', verifyToken, CarreraController.getAllCarreras);

router.post(
    '/',
    [
        body('Nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio'),
    ],
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    CarreraController.createCarrera
);

router.put(
    '/:id',
    [
        body('Nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio'),
    ],
    verifyToken,
    verifyRole(['ADMIN']),
    CarreraController.updateCarrera
);

router.delete('/:id', verifyToken, verifyRole(['ADMIN']), CarreraController.deleteCarrera);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), validacionId, CarreraController.activateCarrera);

module.exports = router;
