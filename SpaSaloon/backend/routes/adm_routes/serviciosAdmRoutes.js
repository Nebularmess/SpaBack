const express = require('express');
const router = express.Router();
const serviciosAdmController = require('../../controllers/adm_controllers/serviciosAdmControllers');

// Coloca primero las rutas más específicas
router.get('/servicios/categoria/:id_categoria', serviciosAdmController.getServiciosPorCategoria);

// Ruta para crear un nuevo servicio
router.post('/', serviciosAdmController.crearServicio);

// Rutas generales
router.get('/', serviciosAdmController.getAdmServicios); // Obtener todos los servicios
router.put('/:id', serviciosAdmController.actualizarServicio); // Actualizar un servicio
router.delete('/:id', serviciosAdmController.eliminarServicio); // Eliminar un servicio
router.get('/', serviciosAdmController.getServiciosPorTipo); 
module.exports = router;
