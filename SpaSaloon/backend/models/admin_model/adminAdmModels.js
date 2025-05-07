// Este archivo define el acceso a la tabla directamente usando pool.query
const pool = require('../../db');

module.exports = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM administrador WHERE email = ?', [email]);
    return rows[0];
  },

  async findAllActive() {
    const [rows] = await pool.query('SELECT * FROM administrador WHERE estado = 1');
    return rows;
  }
};
