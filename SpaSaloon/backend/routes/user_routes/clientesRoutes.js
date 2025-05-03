const express = require('express');
const router = express.Router();
const clienteController = require('../../controllers/user_controllers/clienteController');

router.get('/', clienteController.getAllClientes);
router.post('/register', clienteController.registerCliente);
router.post('/login', clienteController.loginCliente);
router.put('/cambiar-password', clienteController.cambiarPasswordCliente);

// Add these new routes
router.get('/:id', clienteController.getClienteById);
router.put('/actualizar/:id', clienteController.actualizarCliente);

module.exports = router;