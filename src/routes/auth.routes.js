const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
    '/login',
    [
        body('Usuario').isString().trim().notEmpty().withMessage('Usuario es obligatorio'),
        body('Password').isString().trim().notEmpty().withMessage('Contraseña es obligatoria')
    ],
    AuthController.login
);

module.exports = router;
