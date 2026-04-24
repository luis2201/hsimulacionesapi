const express = require('express');
const { body } = require('express-validator');
const CarreraController = require('../controllers/carrera.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

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

module.exports = router;
