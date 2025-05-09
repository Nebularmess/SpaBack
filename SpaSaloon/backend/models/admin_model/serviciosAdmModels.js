const db = require('../../db');

const getServicios = async () => {
    try {
        const [filas] = await db.execute(`
            SELECT 
            servicio.id_servicio AS id,
            servicio.nombre AS nombre,
            categoria_servicio.nombre AS categoria,
            servicio.tipo AS tipo,
            servicio.precio AS precio,
            IFNULL(GROUP_CONCAT(profesional.nombre SEPARATOR ', '), 'No tiene profesionales actualmente') AS profesionales,    
            servicio.descripcion AS descripcion
            FROM servicio
            LEFT JOIN profesional ON servicio.id_servicio = profesional.id_servicio
            JOIN categoria_servicio ON servicio.id_categoria = categoria_servicio.id_categoria
            WHERE servicio.activo = 1
            GROUP BY servicio.id_servicio;

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

const getServiciosPorCategoria = async (id_categoria) => {
    const query = `
        SELECT id_servicio, nombre
        FROM servicio
        WHERE id_categoria = ?
    `;
    const [rows] = await db.execute(query, [id_categoria]);
    return rows;
};

const actualizarServicio = async (id, datosServicio) => {
    try {
        const { nombre, categoria, tipo, precio, descripcion } = datosServicio;
        
        const [categoriaResult] = await db.execute(
            'SELECT id_categoria FROM categoria_servicio WHERE nombre = ?',
            [categoria]
        );
        
        if (!categoriaResult.length) {
            throw new Error('Categoría no encontrada');
        }
        
        const id_categoria = categoriaResult[0].id_categoria;

        const [resultado] = await db.execute(
            'UPDATE servicio SET nombre = ?, id_categoria = ?, tipo = ?, precio = ?, descripcion = ? WHERE id_servicio = ?',
            [nombre, id_categoria, tipo, precio, descripcion, id]
        );
        
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        throw error;
    }
};

const eliminarServicio = async (id) => {
    try {
        const [resultado] = await db.execute(
            'UPDATE servicio SET activo = 0 WHERE id_servicio = ?',
            [id]
        );
        
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        throw error;
    }
};

const crearServicio = async (nuevoServicio) => {
    try {
        const { nombre, categoria, tipo, precio, descripcion } = nuevoServicio;

        // Obtener el id de la categoría
        const [categoriaResult] = await db.execute(
            'SELECT id_categoria FROM categoria_servicio WHERE nombre = ?',
            [categoria]
        );

        if (!categoriaResult.length) {
            throw new Error('Categoría no encontrada');
        }

        const id_categoria = categoriaResult[0].id_categoria;

        // Insertar el nuevo servicio
        const [resultado] = await db.execute(
            'INSERT INTO servicio (nombre, id_categoria, tipo, precio, descripcion, activo) VALUES (?, ?, ?, ?, ?, 1)',
            [nombre, id_categoria, tipo, precio, descripcion]
        );

        return {
            id_servicio: resultado.insertId,
            nombre,
            categoria,
            tipo,
            precio,
            descripcion
        };
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        throw error;
    }
};
/**
 * Obtener servicios filtrados por tipo ('Individual' o 'Grupal')
 * @param {string} tipo - Tipo de servicio a filtrar (opcional)
 * @returns {Promise<Array>} Lista de servicios filtrados
 */
const getServiciosPorTipo = async (tipo) => {
    try {
      let query = `
        SELECT 
          servicio.id_servicio AS id,
          servicio.nombre,
          categoria_servicio.nombre AS categoria,
          servicio.tipo,
          servicio.precio,
          servicio.descripcion
        FROM servicio
        JOIN categoria_servicio ON servicio.id_categoria = categoria_servicio.id_categoria
        WHERE servicio.activo = 1
      `;
  
      const params = [];
  
      if (tipo && (tipo === 'Individual' || tipo === 'Grupal')) {
        query += ` AND servicio.tipo = ?`;
        params.push(tipo);
      }
  
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Error al obtener servicios por tipo:', error);
      throw error;
    }
  };

module.exports = {
    getServiciosPorTipo,
    getServicios,
    actualizarServicio,
    eliminarServicio,
    getServiciosPorCategoria,
    crearServicio
};
