const Tipopractica = require('../models/tipopractica.model');
const { validationResult } = require('express-validator');

const TipopracticaController = {

    getAllTipopracticas: (req, res) => {
        Tipopractica.getAllTipopracticas((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener el tipo de práctica' });
            res.json(results);
        });
    },

    getTipopracticaById: (req, res) => {
        const { id } = req.params;

        Tipopractica.getTipopracticaById(id, (err, results) => {
            res.json(results[0]);
        })
    },

    createTipopractica: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { Nombre } = req.body;

        Tipopractica.createTipopractica({ Nombre }, (err) => {
            if (err) return res.status(500).json({ error: 'Error al crear el tipo de práctica.' });

            res.status(201).json({ message: 'Tipo de práctica registrada correctamente.' });
        });
    },

    updateTipopractica: (req, res) => {
        const { id } = req.params;
        const { Nombre } = req.body;

        Tipopractica.updateTipopractica(id, { Nombre }, (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar el tipo de practica' });
            res.json({ message: 'Tipo de práctica actualizada' });
        })
    },

    deleteTipopractica: (req, res) => {
        const { id } = req.params;
        Tipopractica.deleteTipopractica(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el tipo de práctica' });
            res.json({ message: 'Tipo de práctica eliminada' });
        });
    },

    activateTipopractica: (req, res) => {
        const { id } = req.params;

        Tipopractica.activateTipopractica(id, (err) => {
            console.log(id)
            if (err) return res.status(500).json({ error: 'Error al activar el tipo de práctica' });
            res.json({ message: 'Tipo de práctica activada correctamente' });
        });
    }
}

module.exports = TipopracticaController;