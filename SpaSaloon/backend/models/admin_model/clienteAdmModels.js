const db = require('../../db');
const bcrypt = require('bcrypt');

const ClienteAdmModel = {
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM cliente WHERE estado = 1');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM cliente WHERE id_cliente = ? AND estado = 1', [id]);
    return rows[0];
  },

  create: async (cliente) => {
    const { nombre, apellido, email, telefono, direccion, password } = cliente;
    console.log("Password recibido:", password);
    // Hashear la contraseña antes de guardar
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Password recibido:", hashedPassword);

    const [result] = await db.execute(
      'INSERT INTO cliente (nombre, apellido, email, telefono, direccion, password) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono, direccion, hashedPassword]
    );

    return result.insertId;
  },

  update: async (id, cliente) => {
    const { nombre, apellido, email, telefono, direccion, password } = cliente;
    const [result] = await db.execute(
      'UPDATE cliente SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, password = ? WHERE id_cliente = ? AND estado = 1',
      [nombre, apellido, email, telefono, direccion, password, id]
    );
    return result.affectedRows;
  },

  deleteLogic: async (id) => {
    const [result] = await db.execute(
      'UPDATE cliente SET estado = 0 WHERE id_cliente = ?',
      [id]
    );
    return result.affectedRows;
  },
  GetByNombreApellido: async (nombre, apellido) => {
  const query = `
    SELECT id_cliente AS id, nombre, apellido, direccion, email, telefono
    FROM cliente
    WHERE estado = 1
    AND nombre LIKE ?
    AND apellido LIKE ?
  `;
  const [rows] = await db.execute(query, [`%${nombre}%`, `%${apellido}%`]);
  return rows;
},
};

module.exports = ClienteAdmModel;
