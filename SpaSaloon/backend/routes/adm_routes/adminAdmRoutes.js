const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adm_controllers/adminAdmController');

router.post('/login', adminController.loginAdmin);
router.get('/', adminController.getAllAdmin);

module.exports = router;
