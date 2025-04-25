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
const addProfesional = async (req, res) => {
    try {
        const nuevoProfesional = req.body; // Datos enviados desde el frontend
        const id = await profesionalesAdmModel.pushProfesionales(nuevoProfesional);
        res.status(201).json({ message: 'Profesional agregado exitosamente', id });
    } catch (error) {
        console.error('Error al agregar un profesional:', error);
        res.status(500).json({ error: 'Error al agregar un profesional' });
    }
};
module.exports = {
    getAdmProfesionales,
    addProfesional
};