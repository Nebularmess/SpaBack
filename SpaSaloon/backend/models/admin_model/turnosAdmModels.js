// En turnosAdmModels.js
const db = require('../../db');

const getTurnos = async () => {
    try {
        console.log("Ejecutando consulta SQL para obtener turnos...");
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE_FORMAT(turno.fecha_hora, '%Y-%m-%d') AS fecha,
                TIME_FORMAT(turno.fecha_hora, '%H:%i') AS hora,
                profesional.nombre AS profesional,
                cliente.nombre AS cliente,
                servicio.nombre AS servicio,
                servicio.precio AS precio,
                turno.estado AS estado
            FROM turno
            JOIN profesional ON turno.id_profesional = profesional.id_profesional
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio
            WHERE turno.estado != 'Cancelado'; -- Filtrar los turnos no cancelados
        `);
        console.log("Turnos obtenidos:", filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        throw error;
    }
};

// Añadir esta función para actualizar el estado
const actualizarEstadoTurno = async (idTurno, estado) => {
    try {
        console.log(`Actualizando turno ${idTurno} a estado ${estado} en la BD`);
        
        const [resultado] = await db.execute(
            'UPDATE turno SET estado = ? WHERE id_turno = ?',
            [estado, idTurno]
        );
        
        console.log('Resultado de la actualización en BD:', resultado);
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el estado del turno en BD:', error);
        throw error;
    }
};
const actualizarTurno = async (idTurno, datosTurno) => {
    try {
        console.log(`Actualizando turno ID: ${idTurno} en la BD`);
        
        // Obtener los IDs necesarios basados en los nombres
        const [profesionalResult] = await db.execute(
            'SELECT id_profesional FROM profesional WHERE nombre = ?',
            [datosTurno.profesional]
        );
        
        const [clienteResult] = await db.execute(
            'SELECT id_cliente FROM cliente WHERE nombre = ?',
            [datosTurno.cliente]
        );
        
        const [servicioResult] = await db.execute(
            'SELECT id_servicio FROM servicio WHERE nombre = ?',
            [datosTurno.servicio]
        );
        
        if (profesionalResult.length === 0 || clienteResult.length === 0 || servicioResult.length === 0) {
            throw new Error('No se encontró el profesional, cliente o servicio especificado');
        }
        
        const idProfesional = profesionalResult[0].id_profesional;
        const idCliente = clienteResult[0].id_cliente;
        const idServicio = servicioResult[0].id_servicio;
        
        // Crear la fecha-hora combinada
        const fechaHora = `${datosTurno.fecha} ${datosTurno.hora}:00`;
        
        // Actualizar el turno
        const [resultado] = await db.execute(
            `UPDATE turno 
             SET id_profesional = ?, 
                 id_cliente = ?, 
                 id_servicio = ?, 
                 fecha_hora = ?
             WHERE id_turno = ?`,
            [idProfesional, idCliente, idServicio, fechaHora, idTurno]
        );
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el turno en la BD:', error);
        throw error;
    }
};
const crearTurno = async (datosTurno) => {
    try {
        console.log(`Creando turno en la BD con datos:`, datosTurno);
        
        // Obtener los IDs necesarios basados en los nombres
        const [profesionalResult] = await db.execute(
            'SELECT id_profesional FROM profesional WHERE nombre = ?',
            [datosTurno.profesional]
        );
        
        const [clienteResult] = await db.execute(
            'SELECT id_cliente FROM cliente WHERE nombre = ?',
            [datosTurno.cliente]
        );
        
        const [servicioResult] = await db.execute(
            'SELECT id_servicio FROM servicio WHERE nombre = ?',
            [datosTurno.servicio]
        );
        
        if (profesionalResult.length === 0) {
            throw new Error(`No se encontró el profesional: ${datosTurno.profesional}`);
        }
        
        if (clienteResult.length === 0) {
            throw new Error(`No se encontró el cliente: ${datosTurno.cliente}`);
        }
        
        if (servicioResult.length === 0) {
            throw new Error(`No se encontró el servicio: ${datosTurno.servicio}`);
        }
        
        const idProfesional = profesionalResult[0].id_profesional;
        const idCliente = clienteResult[0].id_cliente;
        const idServicio = servicioResult[0].id_servicio;
        
        // Crear la fecha-hora combinada
        const fechaHora = `${datosTurno.fecha} ${datosTurno.hora}:00`;
        
        // Verificar disponibilidad del profesional
        const [turnosExistentes] = await db.execute(
            `SELECT id_turno FROM turno 
             WHERE id_profesional = ? 
             AND fecha_hora = ? 
             AND estado != 'Cancelado'`,
            [idProfesional, fechaHora]
        );
        
        if (turnosExistentes.length > 0) {
            throw new Error(`El profesional ya tiene un turno asignado en esa fecha y hora`);
        }
        
        // Insertar el nuevo turno
        const [resultado] = await db.execute(
            `INSERT INTO turno (id_profesional, id_cliente, id_servicio, fecha_hora, estado) 
             VALUES (?, ?, ?, ?, 'Solicitado')`,
            [idProfesional, idCliente, idServicio, fechaHora]
        );
        
        return resultado;
    } catch (error) {
        console.error('Error al crear el turno en la BD:', error);
        throw error;
    }
};
module.exports = {
    getTurnos,
    actualizarEstadoTurno,
    actualizarTurno,
    crearTurno
};