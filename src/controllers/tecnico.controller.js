const Tecnico = require('../models/tecnico.model');
const { validationResult } = require('express-validator');

const TecnicoController = {
    getAllTecnicos: (req, res) => {
        Tecnico.getAllTecnicos((err, results) => {
            if(err) return res.status(500).json({ error: 'Error al obtener los técnicos'});
            res.json(results);
        });
    },

    getTecnicoById: (req, res) => {
        const { id } = req.params;

        Tecnico.getTecnicoById(id, (err, results) => {
            res.json(results[0]);
        })
    },

    createTecnico: (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { Nombres } = req.body;

        Tecnico.createTecnico({ Nombres }, (err) => {
            if(err) return res.status(500).json({ error: 'Error al crear el técnico.' });

            res.status(201).json({ message: 'Técnico registrado correctamente.' });
        });
    },

    updateTecnico: (req, res) => {
        const { id } = req.params;
        const { Nombres } = req.body;

        Tecnico.updateTecnico(id, { Nombres }, (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar el técnico' });
            res.json({ message: 'Técnico actualizado' });
        });
    },  

    deleteTecnico: (req, res) => {
        const { id } = req.params;
        Tecnico.deleteTecnico(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el técnico' });
            res.json({ message: 'Técnico eliminado' });
        });
    },

    activateTecnico: (req, res) => {
        const { id } = req.params;
    
        Tecnico.activateTecnico(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar el técnico' });
            res.json({ message: 'Técnico activado correctamente' });
        });
    }

}

module.exports = TecnicoController;