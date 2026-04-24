const Auth = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const AuthController = {
    login: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { Usuario, Password } = req.body;

        Auth.getUserByUsername(Usuario, async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en el login' });
            if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

            const user = results[0];

            const isMatch = await Auth.verifyPassword(Password, user.Password);
            if (!isMatch) return res.status(401).json({ error: 'Credenciales incorrectas' });

            // Extraer el rol y nombres del usuario
            const { ID, Rol, Nombres } = user;

            // Generar el token JWT con rol y nombres incluidos
            const token = jwt.sign(
                { userId: user.ID, Usuario: user.Usuario, Rol, Nombres },
                process.env.JWT_SECRET || 'secreto123',
                { expiresIn: '2h' }
            );

            res.json({ message: 'Login exitoso', token, ID, Rol, Nombres });
        });
    }
};

module.exports = AuthController;
