const express = require('express');
const router = express.Router();
const turnosAdmController = require('../../controllers/adm_controllers/turnosAdmController');

router.get('/', turnosAdmController.getAdmTurnos); // Obtener todos los turnos

module.exports = router;