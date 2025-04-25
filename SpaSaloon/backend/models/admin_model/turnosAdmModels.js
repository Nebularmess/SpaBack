const db = require('../../db');
const getTurnos = async () => {
    try {
        console.log("Ejecutando consulta SQL...");
        const [filas] = await db.execute(`
            SELECT 
                turno.id_turno AS id,
                DATE(turno.fecha_hora) AS fecha,
                TIME(turno.fecha_hora) AS hora,
                profesional.nombre AS profesional,
                cliente.nombre AS cliente,
                servicio.nombre AS servicio,
                servicio.precio AS precio
            FROM turno
            JOIN profesional ON turno.id_profesional = profesional.id_profesional
            JOIN cliente ON turno.id_cliente = cliente.id_cliente
            JOIN servicio ON turno.id_servicio = servicio.id_servicio;
        `);
        console.log("Resultados obtenidos:", filas);
        if (!Array.isArray(filas)) {
            throw new Error("El resultado de la consulta no es un array.");
        }
        return filas.map(turno => ({
            id: turno.id,
            fecha: turno.fecha,
            hora: turno.hora,
            profesional: turno.profesional,
            cliente: turno.cliente,
            servicio: turno.servicio,
            precio: turno.precio,
        }));
    } catch (error) {
        console.error('Error al obtener los turnos getTurnos:', error);
        throw error;
    }
};
module.exports = {getTurnos};