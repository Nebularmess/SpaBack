const express = require('express');
const router = express.Router();
const emailHelper = require('./emailHelper');

// Endpoint para enviar email
router.post('/email-send', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        
        // Validar que se proporcionen los campos requeridos
        if (!to || !subject || !text) {
            return res.status(400).json({
                error: 'Faltan campos requeridos: to, subject, text'
            });
        }
        
        const result = await emailHelper.emailSender(to, subject, text);
        
        res.status(200).json({
            success: true,
            message: 'Email enviado correctamente',
            data: result
        });
        
    } catch (error) {
        console.error('Error en /email-send:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Endpoint para simular recepción de email
router.post('/email-reciver', async (req, res) => {
    try {
        const { from, subject, text } = req.body;
        
        // Validar que se proporcionen los campos requeridos
        if (!from || !subject || !text) {
            return res.status(400).json({
                error: 'Faltan campos requeridos: from, subject, text'
            });
        }
        
        const result = await emailHelper.emailReciverSimulation(from, subject, text);
        
        res.status(200).json({
            success: true,
            message: 'Email de simulación enviado correctamente',
            data: result
        });
        
    } catch (error) {
        console.error('Error en /email-reciver:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

module.exports = router;