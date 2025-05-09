const express = require('express');
const router = express.Router();
const profesionalesAdmController = require('../../controllers/adm_controllers/profesionalesAdmControllers');

// Ruta GET para obtener todos los profesionales del admin
router.get('/servicio/:id_servicio', profesionalesAdmController.getProfesionalesPorServicio);
router.get('/', profesionalesAdmController.getAdmProfesionales);
router.put('/:id', profesionalesAdmController.actualizarProfesional);
router.delete('/:id', profesionalesAdmController.eliminarProfesional);
router.post('/', profesionalesAdmController.crearProfesional);
router.get('/profesionales', profesionalesAdmController.buscarProfesionales);

module.exports = router;