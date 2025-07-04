const express = require('express');
const { body } = require('express-validator');
const ReservaController = require('../controllers/reserva.controller');
// Para usuarios de HSIMULACIONES
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
// Para usuarios de APPIT
const verifyAppitToken = require('../middleware/authAppMiddleware');

const router = express.Router();

// Validación básica para crear o actualizar una reserva
const validacionesReserva = [
  body('Fecha').isISO8601().withMessage('Fecha no es válida'),
  body('HoraInicio').matches(/^\d{2}:\d{2}$/).withMessage('HoraInicio no es válida'),
  body('HoraFin').matches(/^\d{2}:\d{2}$/).withMessage('HoraFin no es válida'),
  body('Jornada').isIn(['AM', 'PM']).withMessage('Jornada no es válida'),
  body('EscenarioID').isInt().withMessage('EscenarioID no es válido'),
  body('TipoPracticaID').isInt().withMessage('TipoPracticaID no es válido'),
  body('Carrera').notEmpty().withMessage('Carrera obligatoria'),
  body('Asignatura').notEmpty().withMessage('Asignatura obligatoria'),
  body('Docente').notEmpty().withMessage('Docente obligatorio'),
  body('NumEstudiantes').isInt({ min: 1 }).withMessage('Número de estudiantes no es válido'),
  body('TecnicoID').isInt().withMessage('Técnico no es válido')
];

//Rutas para usuarios de APPIT
router.get('/appit', verifyAppitToken, ReservaController.getReservas);

router.post(
  '/appit',
  verifyAppitToken,
  validacionesReserva,
  ReservaController.createReserva
);

// Rutas para usuarios de HSIMULACIONES
router.get('/', verifyToken, ReservaController.getReservas);
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'USUARIO']), ReservaController.getReservaById);

router.post(
    '/', 
    verifyToken, 
    verifyRole(['ADMIN', 'USUARIO']), 
    validacionesReserva, 
    ReservaController.createReserva
);

router.put('/:id', verifyToken, verifyRole(['ADMIN']), validacionesReserva, ReservaController.updateReserva);
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), ReservaController.deleteReserva);

module.exports = router;
