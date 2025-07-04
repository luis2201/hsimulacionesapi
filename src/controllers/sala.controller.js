const Sala = require('../models/sala.model');
const { validationResult } = require('express-validator');

const SalaController = {

    getAllSalas: (req, res) => {
        Sala.getAllSalas((err, results) => {
            if(err) return res.status(500).json({ error: 'Error al obtener las salas' });
            res.json(results);
        });
    },

    getSalaById: (req, res) => {
        const { id } = req.params;

        Sala.getSalaById(id, (err, results) => {
            res.json(results[0]);
        })
    },

    createSala: (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { Nombre } = req.body;

        Sala.createSala({ Nombre }, (err) => {
            if(err) return res.status(500).json({ error: 'Error al crear la sala.' });

            res.status(201).json({ message: 'Sala registrada correctamente.' });
        });
    },

    updateSala: (req, res) => {
        const { id } = req.params;
        const { Nombre } = req.body;

        Sala.updateSala(id, { Nombre }, (err) => {
            if(err) return res.status(500).json({ error: 'Error al actualizar la sala'});
            res.json({ message: 'Sala actualizada' });
        })
    },
    
    deleteSala: (req, res) => {
        const { id } = req.params;
        Sala.deleteSala(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar la sala' });
            res.json({ message: 'Sala eliminada' });
        });
    },

    activateSala: (req, res) => {
        const { id } = req.params;
    
        Sala.activateSala(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar la sala' });
            res.json({ message: 'Sala activada correctamente' });
        });
    }
}

module.exports = SalaController;