const db = require('../config/db');

const Reserva = {
  // Crear una nueva reserva
  createReserva: (data, callback) => {
    const {
      Semana, Fecha, HoraInicio, HoraFin, Jornada, EscenarioID, TipoPracticaID,
      Carrera, Asignatura, Tema, Docente, NumEstudiantes, RecursoID, TecnicoID
    } = data;

    const sql = `INSERT INTO hs_reserva (
      Semana, Fecha, HoraInicio, HoraFin, Jornada, EscenarioID, TipoPracticaID,
      Carrera, Asignatura, Tema, Docente, NumEstudiantes, RecursoID, TecnicoID
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      Semana, Fecha, HoraInicio, HoraFin, Jornada, EscenarioID, TipoPracticaID,
      Carrera, Asignatura, Tema, Docente, NumEstudiantes, RecursoID, TecnicoID
    ], callback);
  },

  // Verificar si ya hay una reserva para la misma sala, fecha y franja horaria
  verificarDisponibilidad: (Fecha, EscenarioID, HoraInicio, HoraFin, callback) => {
    const sql = `SELECT * FROM hs_reserva
      WHERE Fecha = ? AND EscenarioID = ? AND Estado = 1
      AND ((HoraInicio < ? AND HoraFin > ?) OR (HoraInicio >= ? AND HoraInicio < ?))`;

    db.query(sql, [Fecha, EscenarioID, HoraFin, HoraInicio, HoraInicio, HoraFin], callback);
  },

  // Obtener todas las reservas
  getReservas: (callback) => {
    const sql = `
      SELECT R.*, 
            S.Nombre AS Escenario, 
            T.Nombre AS TipoPractica,
            C.Nombres AS Tecnico
      FROM hs_reserva R
      JOIN hs_sala S ON R.EscenarioID = S.ID
      JOIN hs_tipo_practica T ON R.TipoPracticaID = T.ID
      LEFT JOIN hs_tecnico C ON R.TecnicoID = C.ID`;
    db.query(sql, callback);
  },

  // Obtener reserva por ID
  getReservaById: (id, callback) => {
    const sql = `
      SELECT R.*, 
            S.Nombre AS Escenario, 
            T.Nombre AS TipoPractica,
            C.Nombres AS Tecnico
      FROM hs_reserva R
      JOIN hs_sala S ON R.EscenarioID = S.ID
      JOIN hs_tipo_practica T ON R.TipoPracticaID = T.ID
      LEFT JOIN hs_tecnico C ON R.TecnicoID = C.ID
      WHERE R.ID = ?`;
    db.query(sql, [id], callback);
  },

  // Actualizar una reserva
  updateReserva: (id, data, callback) => {
    const {
      Semana, Fecha, HoraInicio, HoraFin, Jornada, EscenarioID, TipoPracticaID,
      Carrera, Asignatura, Tema, Docente, NumEstudiantes, RecursoID, TecnicoID
    } = data;

    const sql = `UPDATE hs_reserva SET
      Semana = ?, Fecha = ?, HoraInicio = ?, HoraFin = ?, Jornada = ?, EscenarioID = ?, TipoPracticaID = ?,
      Carrera = ?, Asignatura = ?, Tema = ?, Docente = ?, NumEstudiantes = ?, RecursoID = ?, TecnicoID = ?
      WHERE ID = ?`;

    db.query(sql, [
      Semana, Fecha, HoraInicio, HoraFin, Jornada, EscenarioID, TipoPracticaID,
      Carrera, Asignatura, Tema, Docente, NumEstudiantes, RecursoID, TecnicoID, id
    ], callback);
  },

  // Eliminar lógicamente una reserva
  deleteReserva: (id, callback) => {
    const sql = `UPDATE hs_reserva SET Estado = 0 WHERE ID = ?`;
    db.query(sql, [id], callback);
  },

  updateEstadoManual: (id, estado, callback) => {
    const sql = `UPDATE hs_reserva SET EstadoManual = ? WHERE ID = ?`;
    db.query(sql, [estado, id], callback);
  }
};

module.exports = Reserva;
