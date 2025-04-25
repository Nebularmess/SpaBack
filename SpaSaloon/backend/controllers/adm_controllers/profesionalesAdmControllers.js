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
module.exports = {
    getAdmProfesionales
};