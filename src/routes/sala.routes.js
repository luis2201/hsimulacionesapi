const express = require('express');
const { body } = require('express-validator');
const SalaController = require('../controllers/sala.controller');
// Para usuarios de HSIMULACIONES
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
// Para usuarios de APPIT
const verifyAppitToken = require('../middleware/authAppMiddleware');

const router = express.Router();

//Rutas para usuarios de APPIT
router.get('/appit', verifyAppitToken, SalaController.getAllSalas);

// Para usuarios de HSIMULACIONES
router.get('/', verifyToken, SalaController.getAllSalas);
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'USUARIO']), SalaController.getSalaById);

router.post(
    '/',
    [
        body('Nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    ],
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    SalaController.createSala
);

router.put('/:id', verifyToken, verifyRole(['ADMIN']), SalaController.updateSala);
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), SalaController.deleteSala);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), SalaController.activateSala);

module.exports = router;