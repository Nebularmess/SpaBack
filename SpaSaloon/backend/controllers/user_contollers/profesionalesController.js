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
const getProfesionalesPorServicio = (req, res) => {
  const { id_servicio } = req.params;
  
  if (!id_servicio) {
    return res.status(400).json({ error: 'Se requiere el ID de servicio' });
  }
  
  // Aquí ajustamos la consulta para adaptarla a la estructura real de tu base de datos
  // Existen dos posibilidades dependiendo de cómo esté diseñada tu BD:
  
  // OPCIÓN 1: Si cada profesional tiene un campo id_servicio
  const query = `
    SELECT p.*, s.nombre as servicio_nombre 
    FROM profesional p
    JOIN servicio s ON p.id_servicio = s.id_servicio
    WHERE p.id_servicio = ? AND p.activo = 1
  `;
  
  // OPCIÓN 2: Si existe una tabla intermedia profesional_servicio
  // const query = `
  //   SELECT p.*, s.nombre as servicio_nombre 
  //   FROM profesional p
  //   JOIN profesional_servicio ps ON p.id_profesional = ps.id_profesional
  //   JOIN servicio s ON ps.id_servicio = s.id_servicio
  //   WHERE ps.id_servicio = ? AND p.activo = 1
  // `;
  
  db.query(query, [id_servicio], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener profesionales por servicio', detalles: err });
    
    // Si no hay resultados, enviamos un array vacío pero con status 200
    if (results.length === 0) {
      return res.json([]);
    }
    
    res.json(results);
  });
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