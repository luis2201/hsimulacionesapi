const Recurso = require('../models/recurso.model');
const { validationResult } = require('express-validator');

const RecursoController = {

    getAllRecursos: (req, res) => {
        Recurso.getAllRecursos((err, results) => {
            if(err) return res.status(500).json({ error: 'Error al obtener los recursos' });
            res.json(results);
        });
    },

    getAllRecursosSalaID: (req, res) => {
        const { id } = req.params;

        Recurso.getAllRecursosSalaID(id, (err, results) => {
            if(err) return res.status(500).json({ error: 'Error al obtener los recursos de la sala' });
            res.json(results);
        });
    },

    getRecursoById: (req, res) => {
        const { id } = req.params;

        Recurso.getRecursoById(id, (err, results) => {
            res.json(results[0]);
        })
    },

    createRecurso: (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { SalaID, Nombre } = req.body;

        Recurso.createRecurso({ SalaID, Nombre }, (err) => {
            if(err) return res.status(500).json({ error: 'Error al crear el recurso.' });

            res.status(201).json({ message: 'Recurso registrado correctamente.' });
        });
    },

    updateRecurso: (req, res) => {
        const { id } = req.params;
        const { SalaID } = req.body;
        const { Nombre } = req.body;

        Recurso.updateRecurso(id, { SalaID, Nombre }, (err) => {
            if(err) return res.status(500).json({ error: 'Error al actualizar el recurso'});
            res.json({ message: 'Recurso actualizado' });
        })
    },

    deleteRecurso: (req, res) => {
        const { id } = req.params;
        Recurso.deleteRecurso(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el recurso' });
            res.json({ message: 'Recurso eliminado' });
        });
    },

    activateRecurso: (req, res) => {
        const { id } = req.params;

        Recurso.activateRecurso(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar el recurso' });
            res.json({ message: 'Recurso activado correctamente' });
        });
    }
}

module.exports = RecursoController;