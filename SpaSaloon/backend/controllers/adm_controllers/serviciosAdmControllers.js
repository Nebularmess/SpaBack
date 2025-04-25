const serviciosAdmModel = require('../../models/admin_model/serviciosAdmModels');

const getAdmServicios = async (req, res) => {
    try {
        const servicios = await serviciosAdmModel.getServicios(); ;
        res.status(200).json(servicios);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
}
module.exports = {
    getAdmServicios,
};