const { validationResult } = require('express-validator');
const Tema = require('../models/tema.model');

const TemaController = {
    getAllTemas: (req, res) => {
        Tema.getAllTemas((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener los temas' });
            res.json(results);
        });
    },

    getTemasByMateriaId: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { materiaId } = req.params;

        Tema.getTemasByMateriaId(materiaId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener los temas de la materia' });
            res.json(results);
        });
    },

    createTema: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { MateriaID, Codigo, Nombre } = req.body;

        Tema.createTema({ MateriaID, Codigo, Nombre }, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'El tema ya existe o el codigo ya esta registrado' });
                }

                return res.status(500).json({ error: 'Error al crear el tema' });
            }

            res.status(201).json({ message: 'Tema registrado correctamente.', ID: result.insertId });
        });
    },

    updateTema: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const { MateriaID, Codigo, Nombre } = req.body;

        Tema.updateTema(id, { MateriaID, Codigo, Nombre }, (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'El tema ya existe o el codigo ya esta registrado' });
                }

                return res.status(500).json({ error: 'Error al actualizar el tema' });
            }

            res.json({ message: 'Tema actualizado' });
        });
    },

    deleteTema: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        Tema.deleteTema(id, (err) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el tema' });
            res.json({ message: 'Tema eliminado' });
        });
    }
};

module.exports = TemaController;
