const express = require('express');
const router = express.Router();
const ClienteAdmController = require('../../controllers/adm_controllers/clienteAdmController');
router.get('/buscar', ClienteAdmController.filtrarPorNombreApellido);
router.get('/', ClienteAdmController.getAll);
router.get('/:id', ClienteAdmController.getById);
router.post('/', ClienteAdmController.create);
router.put('/:id', ClienteAdmController.update);
router.delete('/:id', ClienteAdmController.deleteLogic);


module.exports = router;
