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
        console.log("Datos recibidos del frontend:", req.body);
        
        // Verificar que existan los campos necesarios
        const { id_cliente, id_servicio, id_profesional, fecha, hora, estado, comentarios } = req.body;
        
        if (!id_cliente || !id_servicio || !id_profesional || !fecha || !hora) {
            return res.status(400).json({
                success: false,
                error: 'Faltan datos requeridos para crear el turno'
            });
        }
        
        // Transformar los datos al formato esperado por el modelo
        const nuevoTurno = {
            id_cliente,
            id_servicio,
            id_profesional,
            fecha,
            hora,
            estado: estado || 'Solicitado',
            comentarios: comentarios || '',
            duracion_minutos: req.body.duracion_minutos || 60
        };
        
        console.log("Datos transformados para el modelo:", nuevoTurno);
        
        // Llamar al modelo para guardar en la BD
        const resultado = await turnosAdmModel.crearNuevoTurno(nuevoTurno);
        
        res.status(201).json({
            success: true,
            mensaje: 'Turno creado correctamente',
            data: resultado
        });
    } catch (error) {
        console.error('Error en el controlador al crear turno:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear el turno: ' + error.message
        });
    }
};


module.exports = {
    crearTurno,
    getAdmTurnos,
    actualizarEstadoTurno,
    actualizarTurno
};