const turnosAdmModel = require('../../models/admin_model/turnosAdmModels');

const getAdmTurnos = async (req, res) => {
    try {
        const turnos = await turnosAdmModel.getTurnos();
        res.status(200).json(turnos);
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
        res.status(500).json({ error: 'Error al obtener los turnos' });
    }
}
module.exports = {
    getAdmTurnos,
};