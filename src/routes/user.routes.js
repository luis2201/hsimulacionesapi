const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/user.controller');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/me', verifyToken, UserController.getCurrentUser);

router.put('/me',
    verifyToken,
    [
        body('Nombres')
            .optional()
            .isString()
            .notEmpty().withMessage('El nombre no puede estar vacío'),

        body('Password')
            .optional({ checkFalsy: true }) // 👈 Esto permite valores vacíos sin error
            .isString()
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres si se proporciona')
    ],
    UserController.updateCurrentUser
);


router.get('/', verifyToken, verifyRole(['ADMIN']), UserController.getAllUsers);
router.get('/:id', verifyToken, verifyRole(['ADMIN', 'USUARIO']), UserController.getUserById);

router.post(
    '/',
    [
        body('Nombres').isString().notEmpty().withMessage('El nombre es obligatorio'),
        body('Usuario').isString().trim().notEmpty().withMessage('Usuario es obligatorio'),
        body('Password').isString().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('Rol').isIn(['ADMIN', 'USUARIO']).withMessage('Rol inválido, debe ser ADMIN o USUARIO')
    ],
    verifyToken,
    verifyRole(['ADMIN']),
    UserController.createUser
);

router.put('/:id', verifyToken, verifyRole(['ADMIN']), UserController.updateUser);
router.put('/reset-password/:id', verifyToken, verifyRole(['ADMIN']), UserController.resetPassword);
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), UserController.deleteUser);
router.put('/activate/:id', verifyToken, verifyRole(['ADMIN']), UserController.activateUser);

module.exports = router;
