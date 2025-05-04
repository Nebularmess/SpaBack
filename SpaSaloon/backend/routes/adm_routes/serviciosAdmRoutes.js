const express = require('express');
const router = express.Router();
const serviciosAdmController = require('../../controllers/adm_controllers/serviciosAdmControllers');

// Coloca primero las rutas más específicas
router.get('/servicios/categoria/:id_categoria', serviciosAdmController.getServiciosPorCategoria);

// Después las rutas más generales
router.get('/', serviciosAdmController.getAdmServicios); // Obtener todos los servicios
router.put('/:id', serviciosAdmController.actualizarServicio); // Actualizar un servicio
router.delete('/:id', serviciosAdmController.eliminarServicio); // Eliminar un servicio

module.exports = router;