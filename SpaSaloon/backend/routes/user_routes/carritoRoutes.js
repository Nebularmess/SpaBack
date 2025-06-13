const express = require('express');
const router = express.Router();
const carritoController = require('../../controllers/user_controllers/carritoController');
router.get('/:id_carrito/turnos', carritoController.getTurnosByCarritoId);

// Obtener todos los carritos por ID de cliente
router.get('/cliente/:id_cliente', carritoController.getCarritosByClienteId);

// Obtener un carrito específico por su ID
router.get('/:id', carritoController.getCarritoById);

// Actualizar el estado de un carrito por su ID
router.put('/estado/:id', carritoController.actualizarEstadoCarrito);

// Actualizar carrito completo (subtotal, método de pago, etc.)
router.put('/actualizar/:id', carritoController.actualizarCarrito);
router.put('/metodo-pago/:id', carritoController.actualizarMetodoPago);

module.exports = router;