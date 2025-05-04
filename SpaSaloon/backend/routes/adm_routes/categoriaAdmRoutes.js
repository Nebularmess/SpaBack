const express = require('express');
const router = express.Router();
const categoriaAdmController = require('../../controllers/adm_controllers/categoriaAdmController');

router.get('/', categoriaAdmController.obtenerTodas);
router.get('/:id', categoriaAdmController.obtenerPorId);

module.exports = router;