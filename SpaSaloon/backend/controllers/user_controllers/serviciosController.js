// controllers/user_controllers/serviciosController.js
const db = require('../../db');

// Obtener todas las categorías de servicios
const getCategorias = async (req, res) => {
  const query = 'SELECT * FROM categoria_servicio';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías', detalles: err.message });
  }
};

// Obtener servicios por categoría
const getServiciosPorCategoria = async (req, res) => {
  const { id_categoria } = req.params;
  const query = 'SELECT * FROM servicio WHERE id_categoria = ? AND activo = 1';
  try {
    const [results] = await db.query(query, [id_categoria]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener servicios', detalles: err.message });
  }
};

// Obtener todos los servicios
const getAllServicios = async (req, res) => {
  const query = 'SELECT * FROM servicio WHERE activo = 1';
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener servicios', detalles: err.message });
  }
};

module.exports = {
  getCategorias,
  getServiciosPorCategoria,
  getAllServicios
};
