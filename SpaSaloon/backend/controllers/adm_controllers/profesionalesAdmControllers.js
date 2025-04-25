const profesionalesAdmModel = require('../../models/admin_model/profesionalAdmModels');

const getAdmProfesionales = async (req, res) => {
    try {
        const profesionales = await profesionalesAdmModel.getProfesionales();
        res.status(200).json(profesionales);
    } catch (error) {
        console.error('Error al obtener los profesionales:', error);
        res.status(500).json({ error: 'Error al obtener los profesionales' });
    }
}
const actualizarProfesional = async (req, res) => {
    try {
        const { id } = req.params;
        const profesionalActualizado = await profesionalesAdmModel.actualizarProfesional(id, req.body);
        res.status(200).json(profesionalActualizado);
    } catch (error) {
        console.error('Error al actualizar el profesional:', error);
        res.status(500).json({ error: 'Error al actualizar el profesional' });
    }
};
const eliminarProfesional = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await profesionalesAdmModel.eliminarProfesional(id);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al eliminar el profesional:', error);
        res.status(500).json({ error: 'Error al eliminar el profesional' });
    }
};

module.exports = {
    getAdmProfesionales,
    actualizarProfesional,
    eliminarProfesional
};