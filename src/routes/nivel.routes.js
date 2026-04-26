const express = require('express');
const { param } = require('express-validator');
const NivelController = require('../controllers/nivel.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

const validacionId = [
    param('id').isInt().withMessage('id no es valido')
];

router.get('/', verifyToken, NivelController.getAllNiveles);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), validacionId, NivelController.activateNivel);

module.exports = router;
