const db = require('../../db');

// Obtener todos los turnos de un cliente
const getTurnosPorCliente = async (req, res) => {
  const { id_cliente } = req.params;
  
  const query = `
    SELECT t.*, s.nombre AS nombre_servicio, p.nombre AS nombre_profesional, p.apellido AS profesional_apellido
    FROM TURNO t
    JOIN SERVICIO s ON t.id_servicio = s.id_servicio
    JOIN PROFESIONAL p ON t.id_profesional = p.id_profesional
    WHERE t.id_cliente = ? ORDER BY t.fecha_hora DESC
  `;
  
  try {
    const [results] = await db.query(query, [id_cliente]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener los turnos', detalles: err.message });
  }
};

// Crear un nuevo turno
const crearTurno = async (req, res) => {
  const {
    id_cliente,
    id_servicio,
    id_profesional,
    fecha_hora,
    duracion_minutos,
    comentarios
  } = req.body;

  try {
    // Verificar que no exista un turno en el mismo horario y con el mismo profesional
    const verificarDisponibilidadQuery = `
      SELECT COUNT(*) as total FROM TURNO 
      WHERE id_profesional = ? 
      AND fecha_hora = ? 
      AND estado != 'Cancelado'
    `;

    const [result] = await db.query(verificarDisponibilidadQuery, [id_profesional, fecha_hora]);
    
    if (result[0].total > 0) {
      return res.status(400).json({ error: 'El horario seleccionado ya no está disponible para este profesional' });
    }

    // Si está disponible, crear el turno
    const query = `
      INSERT INTO TURNO (id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, estado, comentarios)
      VALUES (?, ?, ?, ?, ?, 'Solicitado', ?)
    `;

    const [insertResult] = await db.query(query, [id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, comentarios]);
    res.status(201).json({ mensaje: 'Turno creado con éxito', id_turno: insertResult.insertId });
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear el turno', detalles: err.message });
  }
};

// Consultar disponibilidad de horarios para una fecha específica
const verificarDisponibilidad = async (req, res) => {
  const { fecha, id_servicio, id_profesional } = req.query;
  
  if (!fecha) {
    return res.status(400).json({ error: 'Se requiere una fecha para verificar disponibilidad' });
  }
  
  let query = `
    SELECT t.id_turno, t.fecha_hora, t.id_profesional 
    FROM TURNO t
    WHERE DATE(t.fecha_hora) = ? 
    AND t.id_servicio = ?
    AND t.estado != 'Cancelado'
  `;
  
  const params = [fecha, id_servicio];
  
  // Si se proporciona un profesional específico, filtramos por él
  if (id_profesional) {
    query += ` AND t.id_profesional = ?`;
    params.push(id_profesional);
  }
  
  try {
    const [result] = await db.query(query, params);
    res.json({ turnosOcupados: result });
  } catch (err) {
    return res.status(500).json({ error: 'Error al verificar disponibilidad', detalles: err.message });
  }
};

// Cancelar un turno
const cancelarTurno = async (req, res) => {
  const { id_turno } = req.params;
  
  const query = `
    UPDATE TURNO SET estado = 'Cancelado' WHERE id_turno = ?
  `;
  
  try {
    await db.query(query, [id_turno]);
    res.json({ mensaje: 'Turno cancelado exitosamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al cancelar el turno', detalles: err.message });
  }
};

// Reprogramar un turno
const reprogramarTurno = async (req, res) => {
  const { id_turno } = req.params;
  const { fecha_hora } = req.body;
  
  if (!fecha_hora) {
    return res.status(400).json({ error: 'Se requiere la nueva fecha y hora para reprogramar' });
  }

  try {
    // Primero obtenemos el id_profesional del turno
    const obtenerProfeQuery = `SELECT id_profesional FROM TURNO WHERE id_turno = ?`;
    
    const [results] = await db.query(obtenerProfeQuery, [id_turno]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontró el turno' });
    }
    
    const id_profesional = results[0].id_profesional;
    
    // Verificar disponibilidad para la nueva fecha/hora
    const verificarDisponibilidadQuery = `
      SELECT COUNT(*) as total FROM TURNO 
      WHERE id_profesional = ? 
      AND fecha_hora = ? 
      AND estado != 'Cancelado'
      AND id_turno != ?
    `;

    const [disponibilidadResult] = await db.query(verificarDisponibilidadQuery, [id_profesional, fecha_hora, id_turno]);
    
    if (disponibilidadResult[0].total > 0) {
      return res.status(400).json({ error: 'El horario seleccionado ya no está disponible para este profesional' });
    }
    
    // Si está disponible, reprogramar el turno
    const query = `
      UPDATE TURNO SET fecha_hora = ? WHERE id_turno = ? AND estado != 'Cancelado'
    `;

    const [updateResult] = await db.query(query, [fecha_hora, id_turno]);
    
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el turno o ya está cancelado' });
    }
    
    res.json({ mensaje: 'Turno reprogramado exitosamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al reprogramar el turno', detalles: err.message });
  }
};

module.exports = {
  getTurnosPorCliente,
  crearTurno,
  cancelarTurno,
  reprogramarTurno,
  verificarDisponibilidad
};
