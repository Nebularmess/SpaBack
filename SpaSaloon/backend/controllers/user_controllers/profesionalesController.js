const db = require('../../db');

// Obtener todos los profesionales
const getAllProfesionales = (req, res) => {
  const query = `
    SELECT p.*, s.nombre as servicio_nombre 
    FROM profesional p
    JOIN servicio s ON p.id_servicio = s.id_servicio
    WHERE p.activo = 1
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener profesionales', detalles: err });
    res.json(results);
  });
};

// Obtener profesionales por servicio
const getProfesionalesPorServicio = async (req, res) => {
  const { id_servicio } = req.params;

  if (!id_servicio) {
    return res.status(400).json({ error: 'Se requiere el ID de servicio' });
  }

  const query = `
    SELECT p.*, s.nombre as servicio_nombre 
    FROM profesional p
    JOIN servicio s ON p.id_servicio = s.id_servicio
    WHERE p.id_servicio = ? AND p.activo = 1
  `;

  try {
    const [results] = await db.query(query, [id_servicio]);
    return res.json(results);
  } catch (err) {
    console.error('Error al obtener profesionales:', err);
    return res.status(500).json({ error: 'Error en la consulta', detalles: err });
  }
};

// Obtener horarios disponibles de un profesional para una fecha específica
const getHorariosProfesional = (req, res) => {
  const { id_profesional, fecha } = req.query;
  
  if (!id_profesional || !fecha) {
    return res.status(400).json({ error: 'Se requiere ID de profesional y fecha' });
  }
  
  // Primero verificamos los horarios ya ocupados
  const turnosQuery = `
    SELECT DATE_FORMAT(fecha_hora, '%H:%i') as hora
    FROM turno
    WHERE id_profesional = ?
    AND DATE(fecha_hora) = ?
    AND estado != 'Cancelado'
  `;
  
  db.query(turnosQuery, [id_profesional, fecha], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener horarios', detalles: err });
    
    // Los horarios ya ocupados
    const horariosOcupados = results.map(r => r.hora);
    
    // Aquí podrías obtener los horarios disponibles del profesional
    // si tienes una tabla con los horarios de trabajo de cada profesional
    // Por ahora usaremos horarios fijos como ejemplo
    const todosLosHorarios = [
      "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00"
    ];
    
    // Filtramos los horarios que no están ocupados
    const horariosDisponibles = todosLosHorarios.filter(
      hora => !horariosOcupados.includes(hora)
    );
    
    res.json({
      id_profesional,
      fecha,
      horariosDisponibles
    });
  });
};

module.exports = {
  getAllProfesionales,
  getProfesionalesPorServicio,
  getHorariosProfesional
};