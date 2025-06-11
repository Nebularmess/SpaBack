const express = require('express');
const router = express.Router();
const emailHelper = require('./emailHelper');

router.post('/email-send',emailHelper.emailSender);
router.post('/email-reciver', emailHelper.emailReciverSimulation);

module.exports =  router;