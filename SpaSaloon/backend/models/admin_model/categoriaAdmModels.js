const db = require('../../db');

const getCategorias = async () => {
    const [rows] = await db.query('SELECT * FROM categoria_servicio');
    return rows;
};

const getCategoriaPorId = async (id_categoria) => {
    const [rows] = await db.query('SELECT * FROM categoria_servicio WHERE id_categoria = ?', [id_categoria]);
    return rows[0]; // devuelve un solo objeto
};

module.exports = {
    getCategorias,
    getCategoriaPorId
};