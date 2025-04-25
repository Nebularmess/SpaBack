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

module.exports = {getProfesionales};