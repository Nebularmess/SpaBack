const pool = require('../../db');
exports.getTurnosByCarritoId = async (req, res) => {
  const id_carrito = parseInt(req.params.id_carrito, 10);

  console.log(`Buscando turnos asociados al carrito con ID: ${id_carrito}`);

  if (isNaN(id_carrito)) {
    return res.status(400).json({ error: 'ID de carrito no válido' });
  }

  try {
    // Verificamos si el carrito existe
    const [carrito] = await pool.query('SELECT id FROM carritos WHERE id = ?', [id_carrito]);
    if (carrito.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Traemos los turnos relacionados
    const [turnos] = await pool.query(`
SELECT 
    t.id_turno,
    t.id_cliente,
    t.id_servicio,
    t.id_profesional,
    t.id_carrito,
    t.fecha_hora,
    t.duracion_minutos,
    t.estado,
    t.fecha_solicitud,
    t.comentarios,
    s.nombre AS servicio_nombre,
    s.precio AS servicio_precio,
    p.nombre AS profesional_nombre
  FROM turno t
  JOIN servicio s ON t.id_servicio = s.id_servicio
  JOIN profesional p ON t.id_profesional = p.id_profesional
  WHERE t.id_carrito = ?
  ORDER BY t.fecha_hora ASC
    `, [id_carrito]);

    if (turnos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron turnos para este carrito' });
    }

    console.log(`Se encontraron ${turnos.length} turno(s) asociados`);
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los carritos por ID de cliente
exports.getCarritosByClienteId = async (req, res) => {
  const id_cliente = req.params.id_cliente;
  
  console.log(`Intentando obtener carritos del cliente con ID: ${id_cliente}`);
  
  if (!id_cliente) {
    console.log('ID de cliente no proporcionado');
    return res.status(400).json({ error: 'ID de cliente requerido' });
  }
  
  try {
    console.log('Ejecutando consulta a la base de datos...');
    
    const [results] = await pool.query(
      'SELECT id, id_cliente, subtotal, total, metodo_pago, fecha, estado FROM carritos WHERE id_cliente = ? ORDER BY fecha DESC', 
      [id_cliente]
    );
    
    console.log('Resultados obtenidos:', results.length);
    
    if (results.length === 0) {
      console.log('No se encontraron carritos para este cliente');
      return res.status(404).json({ error: 'No se encontraron carritos para este cliente' });
    }
    
    console.log('Carritos encontrados, enviando respuesta');
    res.json(results);
  } catch (error) {
    console.error('Error al obtener carritos por cliente ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un carrito específico por su ID
exports.getCarritoById = async (req, res) => {
  const id = req.params.id;
  
  console.log(`Intentando obtener carrito con ID: ${id}`);
  
  if (!id) {
    console.log('ID de carrito no proporcionado');
    return res.status(400).json({ error: 'ID de carrito requerido' });
  }
  
  try {
    console.log('Ejecutando consulta a la base de datos...');
    
    const [results] = await pool.query(
      'SELECT id, id_cliente, subtotal, total, metodo_pago, fecha, estado FROM carritos WHERE id = ?', 
      [id]
    );
    
    console.log('Resultados obtenidos:', results.length);
    
    if (results.length === 0) {
      console.log('Carrito no encontrado');
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    console.log('Carrito encontrado, enviando respuesta');
    res.json(results[0]);
  } catch (error) {
    console.error('Error al obtener carrito por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar el estado de un carrito por su ID
exports.actualizarEstadoCarrito = async (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  console.log(`Intentando actualizar estado del carrito con ID: ${id} a estado: ${estado}`);

  if (!id) {
    return res.status(400).json({ error: 'ID de carrito requerido' });
  }

  if (!estado) {
    return res.status(400).json({ error: 'Estado requerido' });
  }

  // Validar que el estado sea válido
  const estadosValidos = ['Pendiente', 'Pagado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido. Debe ser: Pendiente o Pagado' });
  }

  try {
    // Primero verificamos que el carrito exista
    const [checkResults] = await pool.query('SELECT id FROM carritos WHERE id = ?', [id]);
    
    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    console.log('Carrito encontrado, procediendo con la actualización...');
    
    // Si existe, procedemos con la actualización del estado
    await pool.query(
      'UPDATE carritos SET estado = ? WHERE id = ?',
      [estado, id]
    );
    
    console.log('Estado actualizado exitosamente');
    res.json({ message: 'Estado del carrito actualizado correctamente', estado: estado });
  } catch (error) {
    console.error('Error al actualizar estado del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar estado del carrito' });
  }
};

// Actualizar método de pago de un carrito por su ID
exports.actualizarMetodoPago = async (req, res) => {
  const id = req.params.id;
  const { metodo_pago } = req.body;

  console.log(`Intentando actualizar método de pago del carrito con ID: ${id} a método: ${metodo_pago}`);

  if (!id) {
    return res.status(400).json({ error: 'ID de carrito requerido' });
  }

  if (metodo_pago === undefined) {
    return res.status(400).json({ error: 'Método de pago requerido' });
  }

  // Validar método de pago
  if (metodo_pago !== 0 && metodo_pago !== 1) {
    return res.status(400).json({ error: 'Método de pago no válido. Debe ser 0 (tarjeta) o 1 (efectivo)' });
  }

  try {
    // Primero verificamos que el carrito exista
    const [checkResults] = await pool.query('SELECT id FROM carritos WHERE id = ?', [id]);
    
    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    console.log('Carrito encontrado, procediendo con la actualización del método de pago...');
    
    // Actualizar el método de pago (el trigger se encarga de recalcular el total)
    await pool.query(
      'UPDATE carritos SET metodo_pago = ? WHERE id = ?',
      [metodo_pago, id]
    );
    
    const metodoPagoTexto = metodo_pago === 0 ? 'tarjeta' : 'efectivo';
    console.log('Método de pago actualizado exitosamente');
    res.json({ 
      message: 'Método de pago actualizado correctamente', 
      metodo_pago: metodoPagoTexto 
    });
  } catch (error) {
    console.error('Error al actualizar método de pago del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar método de pago' });
  }
};

// Actualizar carrito completo (subtotal, método de pago, etc.)
exports.actualizarCarrito = async (req, res) => {
  const id = req.params.id;
  const { subtotal, metodo_pago } = req.body;

  console.log(`Intentando actualizar carrito con ID: ${id}`);

  if (!id) {
    return res.status(400).json({ error: 'ID de carrito requerido' });
  }

  // Validar método de pago si se proporciona
  if (metodo_pago !== undefined && metodo_pago !== 0 && metodo_pago !== 1) {
    return res.status(400).json({ error: 'Método de pago no válido. Debe ser 0 (tarjeta) o 1 (efectivo)' });
  }

  try {
    // Primero verificamos que el carrito exista
    const [checkResults] = await pool.query('SELECT id FROM carritos WHERE id = ?', [id]);
    
    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    console.log('Carrito encontrado, procediendo con la actualización...');
    
    // Construir la consulta dinámicamente según los campos proporcionados
    let updateFields = [];
    let updateValues = [];
    
    if (subtotal !== undefined) {
      updateFields.push('subtotal = ?');
      updateValues.push(subtotal);
    }
    
    if (metodo_pago !== undefined) {
      updateFields.push('metodo_pago = ?');
      updateValues.push(metodo_pago);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }
    
    // Agregar el ID al final para la cláusula WHERE
    updateValues.push(id);
    
    const updateQuery = `UPDATE carritos SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await pool.query(updateQuery, updateValues);
    
    console.log('Carrito actualizado exitosamente');
    res.json({ message: 'Carrito actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar carrito' });
  }
};
exports.obtenerCarritoPorClienteYFecha = async (req, res) => {
  const { id_cliente, fecha } = req.query;

  console.log('=== DEBUG obtenerCarritoPorClienteYFecha ===');
  console.log('Parámetros recibidos:', { id_cliente, fecha });

  if (!id_cliente || !fecha) {
    return res.status(400).json({ mensaje: 'id_cliente y fecha son requeridos' });
  }

  try {
    const [resultados] = await pool.query(
      'SELECT * FROM carritos WHERE id_cliente = ? AND DATE(fecha) = ?',
      [id_cliente, fecha]
    );

    console.log('✅ Resultados:', resultados);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró ningún carrito' });
    }

    return res.json(resultados);
  } catch (err) {
    console.error('❌ Error en la consulta:', err);
    return res.status(500).json({ error: err.message });
  }
};
exports.crearCarritoPorIdCliente = async (req, res) => {
  const { id_cliente } = req.body;

  console.log('== CREAR CARRITO ==');
  console.log('ID Cliente recibido:', id_cliente);

  if (!id_cliente) {
    return res.status(400).json({ mensaje: 'id_cliente es requerido' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO carritos (id_cliente) VALUES (?)',
      [id_cliente]
    );

    console.log('✅ Carrito creado con ID:', resultado.insertId);

    return res.status(201).json({
      mensaje: 'Carrito creado exitosamente',
      id_carrito: resultado.insertId,
    });
  } catch (err) {
    console.error('❌ Error al crear carrito:', err);
    return res.status(500).json({
      mensaje: 'Error del servidor',
      error: err.message,
    });
  }
};