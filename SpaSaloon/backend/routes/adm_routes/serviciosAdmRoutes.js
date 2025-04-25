const express = require('express');
const router = express.Router();
const serviciosAdmController = require('../../controllers/adm_controllers/serviciosAdmControllers');

router.get('/', serviciosAdmController.getAdmServicios); // Obtener todos los servicios
router.put('/:id', serviciosAdmController.actualizarServicio); // Actualizar un servicio
router.delete('/:id', serviciosAdmController.eliminarServicio); // Eliminar un servicio

module.exports = router;