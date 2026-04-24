const Nivel = require('../models/nivel.model');

const NivelController = {
    getAllNiveles: (req, res) => {
        Nivel.getAllNiveles((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener los niveles' });
            res.json(results);
        });
    }
};

module.exports = NivelController;
