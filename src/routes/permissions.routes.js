const express = require('express');
const PermissionsController = require('../controllers/permissions.controller');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/menus', verifyToken, PermissionsController.getMenusByRole);

module.exports = router;
