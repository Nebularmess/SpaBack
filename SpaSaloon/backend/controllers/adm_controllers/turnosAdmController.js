const turnosAdmModel = require('../../models/admin_model/turnosAdmModels');

const getAdmTurnos = async (req, res) => {
    try {
        const turnos = await turnosAdmModel.getTurnos();
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
};

// Añadir este método para actualizar el estado
const actualizarEstadoTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        console.log(`Actualizando turno ${id} a estado ${estado}`);
        
        if (!estado || !['Solicitado', 'Confirmado', 'Cancelado', 'Realizado'].includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }
        
        const resultado = await turnosAdmModel.actualizarEstadoTurno(id, estado);
        console.log('Resultado de la actualización:', resultado);
        
        res.status(200).json({ 
            mensaje: 'Estado del turno actualizado correctamente',
            turnoId: id,
            nuevoEstado: estado 
        });
    } catch (error) {
        console.error('Error al actualizar el estado del turno:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del turno' });
    }
};
const actualizarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const datosTurno = req.body;
        
        console.log(`Actualizando turno ID: ${id} con datos:`, datosTurno);
        
        // Validar los datos necesarios
        if (!datosTurno.fecha || !datosTurno.hora || !datosTurno.profesional || 
            !datosTurno.cliente || !datosTurno.servicio) {
            return res.status(400).json({ error: 'Faltan datos requeridos para actualizar el turno' });
        }
        
        const resultado = await turnosAdmModel.actualizarTurno(id, datosTurno);
        
        res.status(200).json({ 
            mensaje: 'Turno actualizado correctamente',
            turnoId: id
        });
    } catch (error) {
        console.error('Error al actualizar el turno:', error);
        res.status(500).json({ error: 'Error al actualizar el turno' });
    }
};
const crearTurno = async (req, res) => {
    try {
        const datosTurno = req.body;
        
        console.log('Creando nuevo turno con datos:', datosTurno);
        
        // Validar los datos necesarios
        if (!datosTurno.fecha || !datosTurno.hora || !datosTurno.profesional || 
            !datosTurno.cliente || !datosTurno.servicio) {
            return res.status(400).json({ error: 'Faltan datos requeridos para crear el turno' });
        }
        
        // Llamar al modelo para crear el turno
        const resultado = await turnosAdmModel.crearTurno(datosTurno);
        
        res.status(201).json({
            mensaje: 'Turno creado correctamente',
            turnoId: resultado.insertId
        });
    } catch (error) {
        console.error('Error al crear el turno:', error);
        res.status(500).json({ error: `Error al crear el turno: ${error.message}` });
    }
};
module.exports = {
    getAdmTurnos,
    actualizarEstadoTurno,
    actualizarTurno,
    crearTurno
};