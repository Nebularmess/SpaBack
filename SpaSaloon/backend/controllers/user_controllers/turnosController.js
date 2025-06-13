const db = require('../../db');

// Obtener todos los turnos de un cliente
const getTurnosPorCliente = async (req, res) => {
  const { id_cliente } = req.params;
  
  const query = `
    SELECT t.*, s.nombre AS nombre_servicio, p.nombre AS nombre_profesional, p.apellido AS profesional_apellido
    FROM turno t
    JOIN servicio s ON t.id_servicio = s.id_servicio
    JOIN profesional p ON t.id_profesional = p.id_profesional
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
 console.log('=== DEBUG: INICIO crearTurno ===');
 console.log('req.body completo:', JSON.stringify(req.body, null, 2));
 console.log('req.headers:', req.headers);
 
 const {
   id_cliente,
   id_servicio,
   id_profesional,
   fecha_hora,
   duracion_minutos,
   comentarios
 } = req.body;

 console.log('=== DEBUG: Datos extraídos ===');
 console.log('id_cliente:', id_cliente, 'tipo:', typeof id_cliente);
 console.log('id_servicio:', id_servicio, 'tipo:', typeof id_servicio);
 console.log('id_profesional:', id_profesional, 'tipo:', typeof id_profesional);
 console.log('fecha_hora:', fecha_hora, 'tipo:', typeof fecha_hora);
 console.log('duracion_minutos:', duracion_minutos, 'tipo:', typeof duracion_minutos);
 console.log('comentarios:', comentarios, 'tipo:', typeof comentarios);

 // Validar campos requeridos
 if (!id_cliente || !id_servicio || !id_profesional || !fecha_hora) {
   console.log('❌ ERROR: Faltan campos requeridos');
   return res.status(400).json({ 
     error: 'Faltan campos requeridos',
     recibido: { id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, comentarios }
   });
 }

 // Validar formato de fecha_hora
 if (typeof fecha_hora !== 'string' || !fecha_hora.includes(' ')) {
   console.log('❌ ERROR: Formato de fecha_hora incorrecto');
   return res.status(400).json({ 
     error: 'Formato de fecha_hora incorrecto',
     recibido: fecha_hora,
     tipo: typeof fecha_hora,
     esperado: 'YYYY-MM-DD HH:MM:SS' 
   });
 }

 try {
   console.log('=== DEBUG: Verificando disponibilidad ===');
   // Verificar que no exista un turno en el mismo horario y con el mismo profesional
   const verificarDisponibilidadQuery = `
     SELECT COUNT(*) as total FROM turno 
     WHERE id_profesional = ? 
     AND fecha_hora = ? 
     AND estado != 'Cancelado'
   `;

   console.log('Query disponibilidad:', verificarDisponibilidadQuery);
   console.log('Parámetros:', [id_profesional, fecha_hora]);

   const [result] = await db.query(verificarDisponibilidadQuery, [id_profesional, fecha_hora]);
   console.log('Resultado verificación disponibilidad:', result);
   
   if (result[0].total > 0) {
     console.log('❌ Horario no disponible');
     return res.status(400).json({ error: 'El horario seleccionado ya no está disponible para este profesional' });
   }

   console.log('✅ Horario disponible');

   // Extraer la fecha del turno (sin la hora)
   const fechaTurno = fecha_hora.split(' ')[0]; // Formato: 'YYYY-MM-DD'
   console.log('=== DEBUG: Fecha extraída ===');
   console.log('fechaTurno:', fechaTurno);

   // Verificar si existe un carrito para el cliente en la fecha del turno
   console.log('=== DEBUG: Verificando carrito existente ===');
const verificarCarritoQuery = `
  SELECT id FROM carritos 
  WHERE id_cliente = ? 
  AND DATE(fecha) = ?
`;

   console.log('Query carrito:', verificarCarritoQuery);
   console.log('Parámetros carrito:', [id_cliente, fechaTurno]);

   const [carritoResult] = await db.query(verificarCarritoQuery, [id_cliente, fechaTurno]);
   console.log('Resultado búsqueda carrito:', carritoResult);
   
   let id_carrito;

   if (carritoResult.length > 0) {
     // Si existe carrito, usar su ID
     id_carrito = carritoResult[0].id;
     console.log('✅ Carrito existente encontrado:', id_carrito);
   } else {
     // Si no existe carrito, crear uno nuevo
     console.log('❌ No se encontró carrito, creando uno nuevo...');
     
const crearCarritoQuery = `
  INSERT INTO carritos (id_cliente, fecha) VALUES (?, ?)
`;
     
     console.log('Query crear carrito:', crearCarritoQuery);
     console.log('Parámetro crear carrito:', [id_cliente]);

const [carritoInsertResult] = await db.query(crearCarritoQuery, [id_cliente, fechaTurno]);
     id_carrito = carritoInsertResult.insertId;
     
     console.log('✅ Carrito creado con ID:', id_carrito);
     console.log('Resultado inserción carrito:', carritoInsertResult);
   }

   console.log('=== DEBUG: Creando turno ===');
   // Crear el turno con el id_carrito
   const query = `
     INSERT INTO turno (id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, estado, comentarios, id_carrito)
     VALUES (?, ?, ?, ?, ?, 'Solicitado', ?, ?)
   `;

   const parametrosTurno = [
     id_cliente, 
     id_servicio, 
     id_profesional, 
     fecha_hora, 
     duracion_minutos, 
     comentarios, 
     id_carrito
   ];

   console.log('Query crear turno:', query);
   console.log('Parámetros crear turno:', parametrosTurno);

   const [insertResult] = await db.query(query, parametrosTurno);

   console.log('✅ Turno creado con éxito:', insertResult.insertId);
   console.log('Resultado inserción turno:', insertResult);
   
   const respuesta = { 
     mensaje: 'Turno creado con éxito', 
     id_turno: insertResult.insertId,
     id_carrito: id_carrito
   };

   console.log('=== DEBUG: Respuesta final ===');
   console.log('Respuesta a enviar:', respuesta);
   
   res.status(201).json(respuesta);

 } catch (err) {
   console.error('❌ Error al crear el turno:', err);
   console.error('Stack trace:', err.stack);
   console.error('Código de error:', err.code);
   console.error('Número de error SQL:', err.errno);
   console.error('Estado SQL:', err.sqlState);
   console.error('Mensaje SQL:', err.sqlMessage);
   
   return res.status(500).json({ 
     error: 'Error al crear el turno', 
     detalles: err.message,
     codigo: err.code,
     errno: err.errno
   });
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
    FROM turno t
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
    UPDATE turno SET estado = 'Cancelado' WHERE id_turno = ?
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
    const obtenerProfeQuery = `SELECT id_profesional FROM turno WHERE id_turno = ?`;
    
    const [results] = await db.query(obtenerProfeQuery, [id_turno]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontró el turno' });
    }
    
    const id_profesional = results[0].id_profesional;
    
    // Verificar disponibilidad para la nueva fecha/hora
    const verificarDisponibilidadQuery = `
      SELECT COUNT(*) as total FROM turno 
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
      UPDATE turno SET fecha_hora = ? WHERE id_turno = ? AND estado != 'Cancelado'
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

const getTurnosProfesionalesConDetalle = async (req, res) => {
  const { id_cliente } = req.params;

  const query = `
    SELECT 
      t.id_turno,
      t.id_cliente,
      t.id_servicio,
      t.id_profesional,
      t.id_carrito,
      DATE(t.fecha_hora) AS fecha,
      TIME_FORMAT(t.fecha_hora, '%H:%i') AS hora,
      t.duracion_minutos,
      t.estado,
      t.comentarios,
      s.nombre AS servicio,
      s.precio AS precio,
      CONCAT(p.nombre, ' ', p.apellido) AS profesional
    FROM turno t
    JOIN servicio s ON t.id_servicio = s.id_servicio
    JOIN profesional p ON t.id_profesional = p.id_profesional
    WHERE t.id_cliente = ?
    ORDER BY t.fecha_hora DESC
  `;

  try {
    const [results] = await db.query(query, [id_cliente]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ 
      error: 'Error al obtener los turnos detallados', 
      detalles: err.message 
    });
  }
};

module.exports= {
  getTurnosPorCliente,
  crearTurno,
  cancelarTurno,
  reprogramarTurno,
  verificarDisponibilidad,
  getTurnosProfesionalesConDetalle
};