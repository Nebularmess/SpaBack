const db = require('../db');

// Obtener todas las categorías de servicios
const getCategorias = (req, res) => {
  const query = 'SELECT * FROM categoria_servicio';
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener categorías', detalles: err });
    res.json(results);
  });
};

// Obtener servicios por categoría
const getServiciosPorCategoria = (req, res) => {
  const { id_categoria } = req.params;
  
  const query = 'SELECT * FROM servicio WHERE id_categoria = ? AND activo = 1';
  
  db.query(query, [id_categoria], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener servicios', detalles: err });
    res.json(results);
  });
};

// Obtener todos los servicios
const getAllServicios = (req, res) => {
  const query = 'SELECT s.*, c.nombre as categoria_nombre FROM servicio s JOIN categoria_servicio c ON s.id_categoria = c.id_categoria WHERE s.activo = 1';
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener servicios', detalles: err });
    res.json(results);
  });
};

module.exports = {
  getCategorias,
  getServiciosPorCategoria,
  getAllServicios
};