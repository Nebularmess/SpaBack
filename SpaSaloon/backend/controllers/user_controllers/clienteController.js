const pool = require('../../db');
const bcrypt = require('bcrypt');

exports.getAllClientes = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT id_cliente, nombre, apellido, email FROM CLIENTE WHERE estado = 1');
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.registerCliente = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, password } = req.body;

  try {
    // Verificar si el email ya existe
    const [emailResults] = await pool.query('SELECT id_cliente FROM CLIENTE WHERE email = ?', [email]);
    
    if (emailResults.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    
    // Si el email no existe, procedemos con el registro
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO CLIENTE (nombre, apellido, email, telefono, direccion, password)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    await pool.query(query, [nombre, apellido, email, telefono, direccion, hashedPassword]);
    res.status(201).json({ message: 'Cliente registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor durante el registro' });
  }
};

exports.loginCliente = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // Ya estás usando el método de promesas aquí, pero simplificamos
    const [results] = await pool.query('SELECT * FROM CLIENTE WHERE email = ?', [email]);
    
    // Usuario no encontrado
    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const cliente = results[0];
    
    // Comparar la contraseña
    const match = await bcrypt.compare(password, cliente.password);
    
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Enviar datos del cliente con estructura consistente
    res.json({ 
      message: 'Login exitoso', 
      cliente: { 
        id_cliente: cliente.id_cliente, 
        nombre: cliente.nombre 
      } 
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Nueva función: cambiar contraseña
exports.cambiarPasswordCliente = async (req, res) => {
  const { email, passwordActual, passwordNueva, confirmacionPasswordNueva } = req.body;

  if (!email || !passwordActual || !passwordNueva || !confirmacionPasswordNueva) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (passwordNueva !== confirmacionPasswordNueva) {
    return res.status(400).json({ error: 'La nueva contraseña y su confirmación no coinciden' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM CLIENTE WHERE email = ?', [email]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const cliente = results[0];
    
    const match = await bcrypt.compare(passwordActual, cliente.password);
    if (!match) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    }

    const hashedNueva = await bcrypt.hash(passwordNueva, 10);
    await pool.query('UPDATE CLIENTE SET password = ? WHERE email = ?', [hashedNueva, email]);
    
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor al cambiar contraseña' });
  }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
  const id_cliente = req.params.id;
  
  console.log(`Intentando obtener cliente con ID: ${id_cliente}`);
  
  if (!id_cliente) {
    console.log('ID de cliente no proporcionado');
    return res.status(400).json({ error: 'ID de cliente requerido' });
  }
  
  try {
    console.log('Ejecutando consulta a la base de datos...');
    
    const [results] = await pool.query(
      'SELECT id_cliente, nombre, apellido, email, telefono, direccion FROM CLIENTE WHERE id_cliente = ?', 
      [id_cliente]
    );
    
    console.log('Resultados obtenidos:', results.length);
    
    if (results.length === 0) {
      console.log('Cliente no encontrado');
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    console.log('Cliente encontrado, enviando respuesta');
    res.json(results[0]);
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar cliente
exports.actualizarCliente = async (req, res) => {
  const id_cliente = req.params.id;
  const { nombre, apellido, email, telefono, direccion } = req.body;

  if (!id_cliente) {
    return res.status(400).json({ error: 'ID de cliente requerido' });
  }

  try {
    // Primero verificamos que el cliente exista
    const [checkResults] = await pool.query('SELECT id_cliente FROM CLIENTE WHERE id_cliente = ?', [id_cliente]);
    
    if (checkResults.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Si existe, procedemos con la actualización
    await pool.query(
      'UPDATE CLIENTE SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ? WHERE id_cliente = ?',
      [nombre, apellido, email, telefono, direccion, id_cliente]
    );
    
    res.json({ message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar cliente' });
  }
};