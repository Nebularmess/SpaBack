const db = require('../../db');

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
    const [result] = await db.execute(
      'INSERT INTO cliente (nombre, apellido, email, telefono, direccion, password) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono, direccion, password]
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
  }
};

module.exports = ClienteAdmModel;
