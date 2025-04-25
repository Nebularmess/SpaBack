const express = require('express');
const router = express.Router();
const serviciosAdmController = require('../../controllers/adm_controllers/serviciosAdmControllers');

router.get('/', serviciosAdmController.getAdmServicios ); // Obtener todos los servicios

module.exports = router;