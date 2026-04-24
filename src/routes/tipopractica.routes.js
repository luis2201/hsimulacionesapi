const express = require('express');
const { body } = require('express-validator');
const TipopracticaController = require('../controllers/tipopractica.controller');
// Para usuarios de HSIMULACIONES
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
// Para usuarios de APPIT
const verifyAppitToken = require('../middleware/authAppMiddleware');

const router = express.Router();

// Para usuarios de APPIT
router.get('/appit', verifyAppitToken, TipopracticaController.getAllTipopracticas);

// Para usuarios de HSIMULACIONES
router.get('/', verifyToken, TipopracticaController.getAllTipopracticas);
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'USUARIO']), TipopracticaController.getTipopracticaById);

router.post(
    '/',
    [
        body('Nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    ],
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    TipopracticaController.createTipopractica
);

router.put('/:id', verifyToken, verifyRole(['ADMIN']), TipopracticaController.updateTipopractica);
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), TipopracticaController.deleteTipopractica);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), TipopracticaController.activateTipopractica);

module.exports = router;