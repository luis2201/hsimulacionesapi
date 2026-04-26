const Carrera = require('../models/carrera.model');
const { validationResult } = require('express-validator');

const CarreraController = {

    getAllCarreras: (req, res) => {
        Carrera.getAllCarreras((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las carreras' });
            res.json(results);
        });
    },

    createCarrera: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { Nombre } = req.body;

        Carrera.createCarrera({ Nombre }, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'La carrera ya existe' });
                }

                return res.status(500).json({ error: 'Error al crear la carrera.' });
            }

            res.status(201).json({ message: 'Carrera registrada correctamente.', ID: result.insertId });
        });
    },

    updateCarrera: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const { Nombre } = req.body;

        Carrera.updateCarrera(id, { Nombre }, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'La carrera ya existe' });
                }

                return res.status(500).json({ error: 'Error al actualizar la carrera' });
            }

            res.json({ message: 'Carrera actualizada' });
        });
    },

    deleteCarrera: (req, res) => {
        const { id } = req.params;

        Carrera.deleteCarrera(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar la carrera' });
            res.json({ message: 'Carrera eliminada' });
        });
    },

    activateCarrera: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        Carrera.activateCarrera(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar la carrera' });
            res.json({ message: 'Carrera activada correctamente' });
        });
    }
};

module.exports = CarreraController;
