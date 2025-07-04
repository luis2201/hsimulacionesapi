const express = require('express');
const { body } = require('express-validator');
const TecnicoController = require('../controllers/tecnico.controller');
// Para usuarios de HSIMULACIONES
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
// Para usuarios de APPIT
const verifyAppitToken = require('../middleware/authAppMiddleware');

const router = express.Router();

//Rutas para usuarios de APPIT
router.get('/appit', verifyAppitToken, TecnicoController.getAllTecnicos);

// Rutas para usuarios de HSIMULACIONES
router.get('/', verifyToken, TecnicoController.getAllTecnicos);
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'USUARIO']), TecnicoController.getTecnicoById);

router.post(
    '/',
    [
        body('Nombres').isString().notEmpty().withMessage('El nombre es obligatorio'),        
    ],
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    TecnicoController.createTecnico
);

router.put('/:id', verifyToken, verifyRole(['ADMIN']), TecnicoController.updateTecnico);
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), TecnicoController.deleteTecnico);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), TecnicoController.activateTecnico);

module.exports = router;