const express = require('express');
const router = express.Router();
const serviciosController = require('../../controllers/user_controllers/serviciosController');

router.get('/categorias', serviciosController.getCategorias);
router.get('/por-categoria/:id_categoria', serviciosController.getServiciosPorCategoria);
router.get('/', serviciosController.getAllServicios);

module.exports = router;