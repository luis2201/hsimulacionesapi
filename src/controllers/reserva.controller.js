const Reserva = require('../models/reserva.model');
const { validationResult } = require('express-validator');

const ReservaController = {

  // Crear nueva reserva con verificación de disponibilidad
  createReserva: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const datos = req.body;

    // Verificar si la sala ya está reservada en ese horario
    Reserva.verificarDisponibilidad(
      datos.Fecha,
      datos.EscenarioID,
      datos.HoraInicio,
      datos.HoraFin,
      (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error verificando disponibilidad' });

        if (resultados.length > 0) {
          return res.status(409).json({ error: 'La sala ya está reservada en ese horario' });
        }

        // Crear la reserva si no hay traslapes
        Reserva.createReserva(datos, (err, result) => {
          if (err) return res.status(500).json({ error: 'Error al registrar la reserva' });
          res.status(201).json({ message: 'Reserva registrada exitosamente', ID: result.insertId });
        });
      }
    );
  },

  // Obtener todas las reservas
  getReservas: (req, res) => {
    Reserva.getReservas((err, resultados) => {
      if (err) return res.status(500).json({ error: 'Error al obtener reservas' });
      res.json(resultados);
    });
  },

  // Obtener reserva por ID
  getReservaById: (req, res) => {
    const { id } = req.params;
    Reserva.getReservaById(id, (err, resultado) => {
      if (err) return res.status(500).json({ error: 'Error al obtener la reserva' });
      if (resultado.length === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
      res.json(resultado[0]);
    });
  },

  // Actualizar reserva (sin control de traslapes por simplicidad)
  updateReserva: (req, res) => {
    const { id } = req.params;
    const datos = req.body;

    Reserva.updateReserva(id, datos, (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la reserva' });
      res.json({ message: 'Reserva actualizada exitosamente' });
    });
  },

  // Eliminar (inhabilitar) una reserva
  deleteReserva: (req, res) => {
    const { id } = req.params;

    Reserva.deleteReserva(id, (err) => {
      if (err) return res.status(500).json({ error: 'Error al eliminar la reserva' });
      res.json({ message: 'Reserva eliminada correctamente' });
    });
  }
};

module.exports = ReservaController;
