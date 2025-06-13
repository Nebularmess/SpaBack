import express from 'express';
import turnosController from '../../controllers/user_controllers/turnosController.js';
const router = express.Router();

// La ruta específica debe ir antes que la ruta con parámetros
router.get('/disponibilidad', turnosController.verificarDisponibilidad);
router.get('/:id_cliente', turnosController.getTurnosPorCliente);
router.post('/', turnosController.crearTurno);
router.put('/cancelar/:id_turno', turnosController.cancelarTurno);
router.put('/reprogramar/:id_turno', turnosController.reprogramarTurno);


export default router;
