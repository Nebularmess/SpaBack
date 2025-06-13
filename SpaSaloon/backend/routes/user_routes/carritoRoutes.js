const express = require('express');
const router = express.Router();
const carritoController = require('../../controllers/user_controllers/carritoController');

// RUTAS ESPECÍFICAS PRIMERO (antes de las rutas con parámetros dinámicos)
router.get('/buscar', carritoController.obtenerCarritoPorClienteYFecha);

// LUEGO LAS RUTAS CON PARÁMETROS
router.get('/:id_carrito/turnos', carritoController.getTurnosByCarritoId);
router.get('/cliente/:id_cliente', carritoController.getCarritosByClienteId);
router.get('/:id', carritoController.getCarritoById); // Esta va al final

// El resto de rutas
router.put('/estado/:id', carritoController.actualizarEstadoCarrito);
router.post('/crear', carritoController.crearCarritoPorIdCliente);
router.put('/actualizar/:id', carritoController.actualizarCarrito);
router.put('/metodo-pago/:id', carritoController.actualizarMetodoPago);

module.exports = router;