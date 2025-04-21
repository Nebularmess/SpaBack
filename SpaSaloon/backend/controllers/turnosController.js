const db = require('../db'); // ajustá la ruta según tu estructura

// Obtener todos los turnos de un cliente
const getTurnosPorCliente = (req, res) => {
  const { id_cliente } = req.params;

  const query = `
    SELECT t.*, s.nombre AS nombre_servicio, p.nombre AS nombre_profesional, p.apellido AS profesional_apellido
    FROM TURNO t
    JOIN SERVICIO s ON t.id_servicio = s.id_servicio
    JOIN PROFESIONAL p ON t.id_profesional = p.id_profesional
    WHERE t.id_cliente = ? ORDER BY t.fecha_hora DESC
  `;

  db.query(query, [id_cliente], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los turnos', detalles: err });
    res.json(results);
  });
};

// Crear un nuevo turno
const crearTurno = (req, res) => {
  const {
    id_cliente,
    id_servicio,
    id_profesional,
    fecha_hora,
    duracion_minutos,
    comentarios
  } = req.body;

  const query = `
    INSERT INTO TURNO (id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, estado, comentarios)
    VALUES (?, ?, ?, ?, ?, 'Solicitado', ?)
  `;

  db.query(query, [id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, comentarios], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear el turno', detalles: err });
    res.status(201).json({ mensaje: 'Turno creado con éxito', id_turno: result.insertId });
  });
};

// Cancelar un turno
const cancelarTurno = (req, res) => {
  const { id_turno } = req.params;

  const query = `
    UPDATE TURNO SET estado = 'Cancelado' WHERE id_turno = ?
  `;

  db.query(query, [id_turno], (err) => {
    if (err) return res.status(500).json({ error: 'Error al cancelar el turno', detalles: err });
    res.json({ mensaje: 'Turno cancelado exitosamente' });
  });
};

// Reprogramar un turno
const reprogramarTurno = (req, res) => {
  const { id_turno } = req.params;
  const { fecha_hora } = req.body;

  if (!fecha_hora) {
    return res.status(400).json({ error: 'Se requiere la nueva fecha y hora para reprogramar' });
  }

  const query = `
    UPDATE TURNO SET fecha_hora = ? WHERE id_turno = ? AND estado != 'Cancelado'
  `;

  db.query(query, [fecha_hora, id_turno], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al reprogramar el turno', detalles: err });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el turno o ya está cancelado' });
    }
    
    res.json({ mensaje: 'Turno reprogramado exitosamente' });
  });
};

module.exports = {
  getTurnosPorCliente,
  crearTurno,
  cancelarTurno,
  reprogramarTurno
};
