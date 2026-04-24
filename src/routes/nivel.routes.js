const express = require('express');
const NivelController = require('../controllers/nivel.controller');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, NivelController.getAllNiveles);

module.exports = router;
