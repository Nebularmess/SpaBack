const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getAllClientes);
router.post('/register', clienteController.registerCliente);
router.post('/login', clienteController.loginCliente);
router.put('/cambiar-password', clienteController.cambiarPasswordCliente); // Nueva ruta

module.exports = router;