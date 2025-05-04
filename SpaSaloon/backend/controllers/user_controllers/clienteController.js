const pool = require('../../db');
const bcrypt = require('bcrypt');

exports.getAllClientes = (req, res) => {
  db.query('SELECT id_cliente, nombre, apellido, email FROM CLIENTE WHERE estado = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.registerCliente = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, password } = req.body;

  try {
    // Verificar si el email ya existe
    db.query('SELECT id_cliente FROM CLIENTE WHERE email = ?', [email], async (emailErr, emailResults) => {
      if (emailErr) return res.status(500).json({ error: emailErr.message });
      
      if (emailResults.length > 0) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }
      
      // Si el email no existe, procedemos con el registro
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO CLIENTE (nombre, apellido, email, telefono, direccion, password)
                     VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(query, [nombre, apellido, email, telefono, direccion, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Cliente registrado exitosamente' });
      });
    });
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
    // Añadir await ya que pool.promise() devuelve promesas
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
exports.cambiarPasswordCliente = (req, res) => {
  const { email, passwordActual, passwordNueva, confirmacionPasswordNueva } = req.body;

  if (!email || !passwordActual || !passwordNueva || !confirmacionPasswordNueva) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (passwordNueva !== confirmacionPasswordNueva) {
    return res.status(400).json({ error: 'La nueva contraseña y su confirmación no coinciden' });
  }

  try {
    db.query('SELECT * FROM CLIENTE WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al buscar el cliente' });
      if (results.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

      const cliente = results[0];
      
      try {
        const match = await bcrypt.compare(passwordActual, cliente.password);

        if (!match) return res.status(401).json({ error: 'La contraseña actual es incorrecta' });

        const hashedNueva = await bcrypt.hash(passwordNueva, 10);
        db.query('UPDATE CLIENTE SET password = ? WHERE email = ?', [hashedNueva, email], (updateErr, result) => {
          if (updateErr) return res.status(500).json({ error: 'Error al actualizar la contraseña' });

          res.json({ message: 'Contraseña actualizada exitosamente' });
        });
      } catch (bcryptError) {
        console.error('Error en la comparación de contraseñas:', bcryptError);
        return res.status(500).json({ error: 'Error en la verificación de contraseña' });
      }
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor al cambiar contraseña' });
  }
};

// Obtener cliente por ID
exports.getClienteById = (req, res) => {
  const id_cliente = req.params.id;
  
  if (!id_cliente) {
    return res.status(400).json({ error: 'ID de cliente requerido' });
  }
  
  try {
    db.query('SELECT id_cliente, nombre, apellido, email, telefono, direccion FROM CLIENTE WHERE id_cliente = ?', 
      [id_cliente], 
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        
        res.json(results[0]);
      }
    );
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar cliente
exports.actualizarCliente = (req, res) => {
  const id_cliente = req.params.id;
  const { nombre, apellido, email, telefono, direccion } = req.body;

  if (!id_cliente) {
    return res.status(400).json({ error: 'ID de cliente requerido' });
  }

  try {
    // Primero verificamos que el cliente exista
    db.query('SELECT id_cliente FROM CLIENTE WHERE id_cliente = ?', [id_cliente], (checkErr, checkResults) => {
      if (checkErr) return res.status(500).json({ error: 'Error al verificar el cliente' });
      if (checkResults.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
      
      // Si existe, procedemos con la actualización
      db.query(
        'UPDATE CLIENTE SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ? WHERE id_cliente = ?',
        [nombre, apellido, email, telefono, direccion, id_cliente],
        (updateErr, result) => {
          if (updateErr) return res.status(500).json({ error: 'Error al actualizar datos' });
          res.json({ message: 'Datos actualizados correctamente' });
        }
      );
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar cliente' });
  }
};