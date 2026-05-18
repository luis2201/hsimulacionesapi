const Nivel = require('../models/nivel.model');
const { validationResult } = require('express-validator');

const NivelController = {
    getAllNiveles: (req, res) => {
        Nivel.getAllNiveles((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener los niveles' });
            res.json(results);
        });
    },

    activateNivel: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        Nivel.activateNivel(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar el nivel' });
            res.json({ message: 'Nivel activado correctamente' });
        });
    }
};

module.exports = NivelController;
