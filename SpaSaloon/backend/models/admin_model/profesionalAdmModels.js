const db = require('../../db');
const getProfesionales = async () => {
    try {
        const [filas] = await db.execute(`
            select 
                profesional.id_profesional AS id,
                profesional.nombre AS nombre,
                profesional.apellido AS apellido,
                servicio.nombre AS servicio,
                profesional.activo AS activo,
                profesional.email AS email,
                profesional.telefono AS telefono
            from profesional
            JOIN servicio ON profesional.id_servicio = servicio.id_servicio;
            `);
        console.log("Resultados obtenidos:", filas);
        if (!Array.isArray(filas)) {
            throw new Error("El resultado de la consulta no es un array.");
        }
        return filas.map(profesionales => ({
            id: profesionales.id,
            nombre: profesionales.nombre,
            apellido: profesionales.apellido,
            servicio: profesionales.servicio,
            activo: profesionales.activo,
            email: profesionales.email,
            telefono: profesionales.telefono
        }));
    } catch (error) {
        console.error('Error al obtener los servicios getProfesionales:', error);
        throw error;
    }
};

const pushProfesionales = async (nuevoProfesional) => {
    try {
        const { nombre, apellido, servicio, activo, email, telefono } = nuevoProfesional;
        const [result] = await db.execute(`
            INSERT INTO profesional (nombre, apellido, id_servicio, activo, email, telefono)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nombre, apellido, servicio, activo, email, telefono]);
        console.log("Nuevo profesional agregado con ID:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error('Error al agregar un nuevo profesional:', error);
        throw error;
    }
}

module.exports = {getProfesionales, pushProfesionales};