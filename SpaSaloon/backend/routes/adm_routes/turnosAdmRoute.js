// En turnosAdmRoute.js
const express = require('express');
const router = express.Router();
const turnosAdmController = require('../../controllers/adm_controllers/turnosAdmController');

router.post('/', turnosAdmController.crearTurno);
// Rutas existentes
router.get('/', turnosAdmController.getAdmTurnos);
router.put('/estado/:id', turnosAdmController.actualizarEstadoTurno);
router.get('/por-fecha', turnosAdmController.getTurnosPorFecha);

// Nueva ruta para actualizar un turno
router.put('/:id', turnosAdmController.actualizarTurno);
router.use((req, res, next) => {
    console.log(`Ruta turnosAdmin: ${req.method} ${req.originalUrl}`);
    next();
  });

module.exports = router;