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
            WHERE turno.estado IN ('Solicitado', 'Cancelado')
            AND turno.fecha_hora >= NOW()
            ORDER BY turno.fecha_hora ASC;
        `);
        console.log("Turnos obtenidos:", filas.length);
        return filas;
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        throw error;
    }
};
const getTurnosPorFecha = async (fecha) => {
    try {
        console.log(`Buscando turnos para la fecha: ${fecha}`);
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
            WHERE turno.estado IN ('Solicitado', 'Cancelado')
            AND DATE(turno.fecha_hora) = ?
            ORDER BY turno.fecha_hora ASC;
        `, [fecha]);
        console.log(`Turnos encontrados para ${fecha}:`, filas.length);
        return filas;
    } catch (error) {
        console.error(`Error al obtener los turnos para la fecha ${fecha}:`, error);
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
/**
 * Crea un nuevo turno en la base de datos
 * @param {Object} nuevoTurno - Datos del turno a crear
 * @returns {Promise} Resultado de la operación
 */
const crearNuevoTurno = async (nuevoTurno) => {
    try {
        console.log("Creando un nuevo turno en la BD:", nuevoTurno);
        
        const fechaHora = `${nuevoTurno.fecha} ${nuevoTurno.hora}:00`;
        
        const [resultado] = await db.execute(
            `INSERT INTO turno (id_cliente, id_servicio, id_profesional, fecha_hora, duracion_minutos, estado, comentarios)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nuevoTurno.id_cliente,
                nuevoTurno.id_servicio,
                nuevoTurno.id_profesional,
                fechaHora,
                nuevoTurno.duracion_minutos || 60, // Valor por defecto si no se pasa
                nuevoTurno.estado || 'Solicitado',
                nuevoTurno.comentarios || null
            ]
        );
        
        console.log('Nuevo turno creado con ID:', resultado.insertId);
        return resultado;
    } catch (error) {
        console.error('Error al crear un nuevo turno en la BD:', error);
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

// Nueva función que acepta directamente los IDs enviados por el frontend
const actualizarTurnoConIds = async (idTurno, datosTurno) => {
    try {
        console.log(`Actualizando turno ID: ${idTurno} en la BD con IDs directos`);
        
        // Validar que tenemos los IDs necesarios
        const idProfesional = datosTurno.id_profesional;
        const idCliente = datosTurno.id_cliente;
        const idServicio = datosTurno.id_servicio;
        
        // Crear la fecha-hora combinada
        const fechaHora = `${datosTurno.fecha} ${datosTurno.hora}:00`;
        
        // Actualizar el turno
        const [resultado] = await db.execute(
            `UPDATE turno 
             SET id_profesional = ?, 
                 id_cliente = ?, 
                 id_servicio = ?, 
                 fecha_hora = ?,
                 comentarios = ?
             WHERE id_turno = ?`,
            [idProfesional, idCliente, idServicio, fechaHora, datosTurno.comentarios || '', idTurno]
        );
        
        if (resultado.affectedRows === 0) {
            throw new Error(`No se encontró el turno con id ${idTurno}`);
        }
        
        return resultado;
    } catch (error) {
        console.error('Error al actualizar el turno con IDs en la BD:', error);
        throw error;
    }
};
// Exportar la nueva función
module.exports = {
    getTurnosPorFecha,
    actualizarTurnoConIds,
    crearNuevoTurno,
    getTurnos,
    actualizarEstadoTurno,
    actualizarTurno
};