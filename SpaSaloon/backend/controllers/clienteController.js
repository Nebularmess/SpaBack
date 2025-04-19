const db = require('../db');
const bcrypt = require('bcrypt');

exports.getAllClientes = (req, res) => {
  db.query('SELECT id_cliente, nombre, apellido, email FROM CLIENTE WHERE estado = 1', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.registerCliente = async (req, res) => {
  const { nombre, apellido, email, telefono, direccion, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO CLIENTE (nombre, apellido, email, telefono, direccion, password)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [nombre, apellido, email, telefono, direccion, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Cliente registrado' });
  });
};

exports.loginCliente = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM CLIENTE WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const cliente = results[0];
    const match = await bcrypt.compare(password, cliente.password);

    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({ message: 'Login exitoso', cliente: { id: cliente.id_cliente, nombre: cliente.nombre } });
  });
};

// Nueva función: cambiar contraseña
exports.cambiarPasswordCliente = (req, res) => {
  const { email, passwordActual, passwordNueva, confirmacionPasswordNueva } = req.body;

  if (passwordNueva !== confirmacionPasswordNueva) {
    return res.status(400).json({ error: 'La nueva contraseña y su confirmación no coinciden' });
  }

  db.query('SELECT * FROM CLIENTE WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar el cliente' });
    if (results.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

    const cliente = results[0];
    const match = await bcrypt.compare(passwordActual, cliente.password);

    if (!match) return res.status(401).json({ error: 'La contraseña actual es incorrecta' });

    const hashedNueva = await bcrypt.hash(passwordNueva, 10);
    db.query('UPDATE CLIENTE SET password = ? WHERE email = ?', [hashedNueva, email], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la contraseña' });

      res.json({ message: 'Contraseña actualizada exitosamente' });
    });
  });
};

