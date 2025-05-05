const express = require('express');
const router = express.Router();
const profesionalesAdmController = require('../../controllers/adm_controllers/profesionalesAdmControllers');

// Ruta GET para obtener todos los profesionales del admin
router.get('/', profesionalesAdmController.getAdmProfesionales);
router.put('/:id', profesionalesAdmController.actualizarProfesional);
router.delete('/:id', profesionalesAdmController.eliminarProfesional);
router.post('/', profesionalesAdmController.crearProfesional);

module.exports = router;