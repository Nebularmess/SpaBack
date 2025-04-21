const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosController');

router.get('/:id_cliente', turnosController.getTurnosPorCliente);
router.post('/', turnosController.crearTurno);
router.put('/cancelar/:id_turno', turnosController.cancelarTurno);
router.put('/reprogramar/:id_turno', turnosController.reprogramarTurno);

module.exports = router;
