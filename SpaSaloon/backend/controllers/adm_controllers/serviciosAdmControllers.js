const serviciosAdmModel = require('../../models/admin_model/serviciosAdmModels');

const getAdmServicios = async (req, res) => {
    try {
        const servicios = await serviciosAdmModel.getServicios();
        res.status(200).json(servicios);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
};
const getServiciosPorCategoria = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const servicios = await serviciosAdmModel.getServiciosPorCategoria(id_categoria);
        
        if (servicios && servicios.length > 0) {
            res.status(200).json(servicios);
        } else {
            res.status(404).json({ mensaje: 'No se encontraron servicios para esta categoría' });
        }
    } catch (error) {
        console.error('Error al obtener los servicios por categoría:', error);
        res.status(500).json({ error: 'Error al obtener los servicios por categoría' });
    }
};

const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const datosServicio = req.body;
        
        const resultado = await serviciosAdmModel.actualizarServicio(id, datosServicio);
        
        if (resultado) {
            res.status(200).json({ mensaje: 'Servicio actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Servicio no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
};

const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resultado = await serviciosAdmModel.eliminarServicio(id);
        
        if (resultado) {
            res.status(200).json({ mensaje: 'Servicio eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Servicio no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
};

module.exports = {
    getAdmServicios,
    actualizarServicio,
    eliminarServicio,
    getServiciosPorCategoria
};