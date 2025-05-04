const categoriaAdmModel = require('../../models/admin_model/categoriaAdmModels');

const obtenerTodas = async (req, res) => {
    try {
        const categorias = await categoriaAdmModel.getCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
};

const obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await categoriaAdmModel.getCategoriaPorId(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        console.error('Error al obtener categoría por ID:', error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId
};