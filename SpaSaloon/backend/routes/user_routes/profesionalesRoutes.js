// profesionalesRoutes.js
const express = require('express');
const router = express.Router();
const profesionalesController = require('../../controllers/user_controllers/profesionalesController');

router.get('/', profesionalesController.getAllProfesionales);
router.get('/servicio/:id_servicio', profesionalesController.getProfesionalesPorServicio);
router.post('/login', profesionalesController.loginProfesionales);
router.put('/cambiar-psswd', profesionalesController.putProfesionalesPassword);

module.exports = router;