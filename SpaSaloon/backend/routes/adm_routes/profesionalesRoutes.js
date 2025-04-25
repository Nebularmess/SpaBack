const express = require('express');
const router = express.Router();
const profesionalesAdmController = require('../../controllers/adm_controllers/profesionalesAdmControllers');

// Ruta GET para obtener todos los profesionales del admin
router.get('/', profesionalesAdmController.getAdmProfesionales);
router.post('/', profesionalesAdmController.addProfesional);

module.exports = router;