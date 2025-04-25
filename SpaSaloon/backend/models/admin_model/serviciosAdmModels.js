const db = require('../../db');
const getServicios = async () => {
    try {
        const [filas] = await db.execute(`
            select 
            servicio.id_servicio AS id,
            servicio.nombre AS nombre,
            categoria_servicio.nombre AS categoria,
            servicio.tipo AS tipo,
            servicio.precio AS precio,
            profesional.nombre AS profesionales,    
            servicio.descripcion AS descripcion
            from servicio
            JOIN profesional ON servicio.id_servicio = profesional.id_servicio
            JOIN categoria_servicio ON servicio.id_categoria = categoria_servicio.id_categoria;
            `);
        console.log("Resultados obtenidos:", filas);
        if (!Array.isArray(filas)) {
            throw new Error("El resultado de la consulta no es un array.");
        }
        return filas.map(servicio => ({
            id: servicio.id,
            nombre: servicio.nombre,
            categoria: servicio.categoria,
            tipo: servicio.tipo,
            precio: servicio.precio,
            profesionales: servicio.profesionales,
            descripcion: servicio.descripcion,
        }));
    } catch (error) {
        console.error('Error al obtener los servicios getServicios:', error);
        throw error;
    }
};

module.exports = {getServicios};