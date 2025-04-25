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
            JOIN servicio ON profesional.id_servicio = servicio.id_servicio
            WHERE profesional.activo = 1;
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
const actualizarProfesional = async (id, datos) => {
    try {
        const { nombre, apellido, servicio, activo, email, telefono } = datos;
        
        // Primero obtener el id_servicio basado en el nombre del servicio
        const [servicioRows] = await db.execute(
            'SELECT id_servicio FROM servicio WHERE nombre = ?',
            [servicio]
        );
        
        if (!servicioRows || servicioRows.length === 0) {
            throw new Error('Servicio no encontrado');
        }
        
        const id_servicio = servicioRows[0].id_servicio;
        
        // Ahora actualizar el profesional
        const [result] = await db.execute(
            `UPDATE profesional 
             SET nombre = ?, apellido = ?, id_servicio = ?, activo = ?, email = ?, telefono = ?
             WHERE id_profesional = ?`,
            [nombre, apellido, id_servicio, activo, email, telefono, id]
        );
        
        if (result.affectedRows === 0) {
            throw new Error('Profesional no encontrado');
        }
        
        // Devolver el profesional actualizado
        return {
            id: parseInt(id),
            nombre,
            apellido,
            servicio,
            activo,
            email,
            telefono
        };
    } catch (error) {
        console.error('Error al actualizar el profesional:', error);
        throw error;
    }
};

const eliminarProfesional = async (id) => {
    try {
        // Baja lógica: actualizar el campo activo a 0
        const [result] = await db.execute(
            'UPDATE profesional SET activo = 0 WHERE id_profesional = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            throw new Error('Profesional no encontrado');
        }
        
        return { id, eliminado: true };
    } catch (error) {
        console.error('Error al eliminar el profesional:', error);
        throw error;
    }
};

module.exports = {
    getProfesionales,
    actualizarProfesional,
    eliminarProfesional
};