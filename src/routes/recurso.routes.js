const express = require('express');
const { body } = require('express-validator');
const RecursoController = require('../controllers/recurso.controller');
// Para usuarios de HSIMULACIONES
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
// Para usuarios de APPIT
const verifyAppitToken = require('../middleware/authAppMiddleware');

const router = express.Router();

//Rutas para usuarios de APPIT
router.get('/appit/:id', verifyAppitToken, RecursoController.getAllRecursosSalaID);

// Para usuarios de HSIMULACIONES
router.get('/', verifyToken, RecursoController.getAllRecursos);
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'USUARIO']), RecursoController.getRecursoById);

router.post(
    '/',
    [
        body('SalaID').isInt().notEmpty().withMessage('La sala es obligatoria'),
        body('Nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    ],
    verifyToken,
    verifyRole(['ADMIN', 'USUARIO']),
    RecursoController.createRecurso
);

router.put('/:id', verifyToken, verifyRole(['ADMIN']), RecursoController.updateRecurso);
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), RecursoController.deleteRecurso);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), RecursoController.activateRecurso);

module.exports = router;