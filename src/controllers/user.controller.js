const User = require('../models/user.model');
const Auth = require('../models/auth.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const UserController = {
    getAllUsers: (req, res) => {
        User.getAllUsers((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener los usuarios' });
            res.json(results);
        });
    },

    getUserById: (req, res) => {
        const { id } = req.params;
        User.getUserById(id, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener el usuario' });
            if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
            res.json(results[0]);
        });
    },

    getCurrentUser: (req, res) => {
        if (!req.user) {
            console.error("Error: req.user está vacío en getCurrentUser.");
            return res.status(500).json({ error: "Error interno: No se encontró información del usuario en el token." });
        }

        const userId = req.user.userId;

        User.getUserById(userId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener el usuario' });

            if (results.length === 0) return res.status(404).json({ message: 'El usuario con este ID no existe en la base de datos' });

            res.json(results[0]);
        });
    },

    createUser: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { Nombres, Usuario, Password, Rol } = req.body;

        if (!['ADMIN', 'USUARIO'].includes(Rol)) {
            return res.status(400).json({ error: 'Rol no válido. Debe ser ADMIN o USUARIO.' });
        }

        if (Rol === 'ADMIN' && req.user.Rol !== 'ADMIN') {
            return res.status(403).json({ error: 'No tienes permisos para crear un administrador.' });
        }

        User.createUser({ Nombres, Rol }, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear usuario' });

            const ID = result.insertId;

            Auth.createAuth({ ID: ID, Usuario, Password }, (err) => {
                if (err) return res.status(500).json({ error: 'Error al registrar credenciales' });
                res.status(201).json({ message: 'Usuario registrado correctamente', ID, Rol });
            });
        });
    },

    updateUser: (req, res) => {
        const { id } = req.params;
        const { Nombres, Usuario, Rol } = req.body;

        if (Rol && !['ADMIN', 'USUARIO'].includes(Rol)) {
            return res.status(400).json({ error: 'Rol inválido. Debe ser ADMIN o USUARIO.' });
        }

        User.updateUser(id, { Nombres, Usuario, Rol }, (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar el usuario' });
            res.json({ message: 'Usuario actualizado' });
        });
    },

    updateCurrentUser: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const userIdFromToken = req.user.userId;
        const { ID, Nombres, Password } = req.body;

        if (ID && ID !== userIdFromToken) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar información de otro usuario.' });
        }

        if (!Nombres && !Password) {
            return res.status(400).json({ error: 'Debes proporcionar al menos un campo para actualizar (Nombres o Password).' });
        }

        try {
            let updated = false;

            if (Nombres) {
                const result = await new Promise((resolve, reject) => {
                    User.updateUserNombres(userIdFromToken, Nombres, (err, res) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
                });
                if (result.affectedRows > 0) updated = true;
            }

            if (Password) {
                const hashedPassword = await bcrypt.hash(Password, 10);
                const result = await new Promise((resolve, reject) => {
                    Auth.updatePassword(userIdFromToken, hashedPassword, (err, res) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
                });
                if (result.affectedRows > 0) updated = true;
            }

            if (!updated) {
                return res.status(404).json({ error: 'No se encontró el usuario para actualizar' });
            }

            res.json({ message: 'Tu información ha sido actualizada correctamente' });
        } catch (err) {
            console.error('Error al actualizar el usuario:', err);
            res.status(500).json({ error: 'Error al actualizar tu información' });
        }
    },

    resetPassword: (req, res) => {
        const { id } = req.params;
        const defaultPassword = '12345678';

        bcrypt.hash(defaultPassword, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: 'Error al generar el hash de la contraseña' });

            Auth.updatePassword(id, hashedPassword, (err) => {
                if (err) return res.status(500).json({ error: 'Error al resetear la contraseña' });

                res.json({ message: 'Contraseña reseteada correctamente' });
            });
        });
    },

    deleteUser: (req, res) => {
        const { id } = req.params;
        User.deleteUser(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el usuario' });
            res.json({ message: 'Usuario eliminado' });
        });
    },

    activateUser: (req, res) => {
        const { id } = req.params;

        User.activateUser(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar el usuario' });
            res.json({ message: 'Usuario activado correctamente' });
        });
    }
};

module.exports = UserController;
