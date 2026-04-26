const { validationResult } = require('express-validator');
const Guia = require('../models/guia.model');

const cleanEmptyValues = (data) => Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
);

const cleanActorFieldsIfNeeded = (guiaData) => {
    if (guiaData.Complejidad !== 'ALTA') {
        guiaData.NumeroActor = null;
        guiaData.CaracteristicasActor = null;
        guiaData.DescripcionEscena = null;
        guiaData.Libreto = null;
    }
};

const normalizeGuiaData = (req) => {
    const guiaData = {
        ...cleanEmptyValues(req.body),
        DocenteID: req.body.DocenteID || req.user.userId,
        EstadoGuia: req.body.EstadoGuia || 'BORRADOR',
        CreadoPor: req.user.userId,
        ActualizadoPor: req.user.userId
    };

    if (req.user.Rol === 'DOCENTE') {
        guiaData.DocenteID = req.user.userId;
    }

    cleanActorFieldsIfNeeded(guiaData);

    return guiaData;
};

const GuiaController = {
    getAllGuias: (req, res) => {
        if (req.user.Rol === 'DOCENTE') {
            return Guia.getGuiasByDocenteId(req.user.userId, (err, results) => {
                if (err) return res.status(500).json({ error: 'Error al obtener tus guias' });
                res.json(results);
            });
        }

        Guia.getAllGuias((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener las guias' });
            res.json(results);
        });
    },

    getMisGuias: (req, res) => {
        Guia.getGuiasByDocenteId(req.user.userId, (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener tus guias' });
            res.json(results);
        });
    },

    getGuiaById: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const getGuia = req.user.Rol === 'DOCENTE'
            ? (callback) => Guia.getGuiaByIdAndDocenteId(id, req.user.userId, callback)
            : (callback) => Guia.getGuiaById(id, callback);

        getGuia((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la guia' });
            if (results.length === 0) return res.status(404).json({ message: 'Guia no encontrada' });

            res.json(results[0]);
        });
    },

    getGuiaByCodigo: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { codigo } = req.params;
        const getGuia = req.user.Rol === 'DOCENTE'
            ? (callback) => Guia.getGuiaByCodigoAndDocenteId(codigo, req.user.userId, callback)
            : (callback) => Guia.getGuiaByCodigo(codigo, callback);

        getGuia((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la guia por codigo' });
            if (results.length === 0) return res.status(404).json({ message: 'Guia no encontrada' });

            res.json(results[0]);
        });
    },

    createGuia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const guiaData = normalizeGuiaData(req);

        Guia.createGuia(guiaData, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'La guia ya existe o el codigo ya esta registrado' });
                }

                return res.status(500).json({ error: 'Error al crear la guia' });
            }

            res.status(201).json({ message: 'Guia registrada correctamente.', ID: result.insertId, Codigo: result.Codigo });
        });
    },

    updateGuia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const getGuia = req.user.Rol === 'DOCENTE'
            ? (callback) => Guia.getGuiaByIdAndDocenteId(id, req.user.userId, callback)
            : (callback) => Guia.getGuiaById(id, callback);

        getGuia((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la guia' });
            if (results.length === 0) return res.status(404).json({ message: 'Guia no encontrada' });

            const guiaData = normalizeGuiaData(req);
            guiaData.CreadoPor = results[0].CreadoPor;

            Guia.updateGuia(id, guiaData, (updateErr) => {
                if (updateErr) {
                    if (updateErr.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'La guia ya existe o el codigo ya esta registrado' });
                    }

                    return res.status(500).json({ error: 'Error al actualizar la guia' });
                }

                res.json({ message: 'Guia actualizada' });
            });
        });
    },

    deleteGuia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const getGuia = req.user.Rol === 'DOCENTE'
            ? (callback) => Guia.getGuiaByIdAndDocenteId(id, req.user.userId, callback)
            : (callback) => Guia.getGuiaById(id, callback);

        getGuia((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener la guia' });
            if (results.length === 0) return res.status(404).json({ message: 'Guia no encontrada' });

            Guia.deleteGuia(id, req.user.userId, (deleteErr) => {
                if (deleteErr) return res.status(500).json({ error: 'Error al eliminar la guia' });
                res.json({ message: 'Guia eliminada' });
            });
        });
    },

    activateGuia: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;

        Guia.activateGuia(id, req.user.userId, (err) => {
            if (err) return res.status(500).json({ error: 'Error al activar la guia' });
            res.json({ message: 'Guia activada correctamente' });
        });
    }
};

module.exports = GuiaController;
