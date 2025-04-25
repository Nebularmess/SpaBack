// En turnosAdmRoute.js
const express = require('express');
const router = express.Router();
const turnosAdmController = require('../../controllers/adm_controllers/turnosAdmController');

// Rutas existentes
router.get('/', turnosAdmController.getAdmTurnos);
router.put('/estado/:id', turnosAdmController.actualizarEstadoTurno);
router.put('/:id', turnosAdmController.actualizarTurno);

// Nueva ruta para crear un turno
router.post('/', turnosAdmController.crearTurno);

router.use((req, res, next) => {
    console.log(`Ruta turnosAdmin: ${req.method} ${req.originalUrl}`);
    next();
});

module.exports = router;