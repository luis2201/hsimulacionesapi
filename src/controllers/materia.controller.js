const { validationResult } = require('express-validator');
const Materia = require('../models/materia.model');

const MateriaController = {
    getAllMaterias: (req, res) => {
        Materia.getAllMaterias((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las materias' });
            res.json(results);
        });
    },

    getMateriasByCarreraId: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { carreraId } = req.params;

        Materia.getMateriasByCarreraId(carreraId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las materias de la carrera' });
            res.json(results);
        });
    },

    getMateriasByCarreraAndNivel: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { carreraId, nivelId } = req.params;

        Materia.getMateriasByCarreraAndNivel(carreraId, nivelId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las materias por carrera y nivel' });
            res.json(results);
        });
    },

    createMateria: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { CarreraID, NivelID, Nombre } = req.body;

        Materia.createMateria({ CarreraID, NivelID, Nombre }, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'La materia ya existe' });
                }

                return res.status(500).json({ error: 'Error al crear la materia' });
            }

            res.status(201).json({ message: 'Materia registrada correctamente.', ID: result.insertId });
        });
    },

    updateMateria: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const { CarreraID, NivelID, Nombre } = req.body;

        Materia.updateMateria(id, { CarreraID, NivelID, Nombre }, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'La materia ya existe' });
                }

                return res.status(500).json({ error: 'Error al actualizar la materia' });
            }

            res.json({ message: 'Materia actualizada' });
        });
    },

    deleteMateria: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        Materia.deleteMateria(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar la materia' });
            res.json({ message: 'Materia eliminada' });
        });
    }
};

module.exports = MateriaController;
