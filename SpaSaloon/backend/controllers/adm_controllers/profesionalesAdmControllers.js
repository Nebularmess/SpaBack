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
const crearProfesional = async (req, res) => {
    try {
        const { nombre, apellido, id_servicio, email, telefono } = req.body;

        // Validación simple
        if (!nombre || !apellido || !id_servicio || !email || !telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoProfesional = await profesionalesAdmModel.crearProfesional({
            nombre,
            apellido,
            id_servicio,
            email,
            telefono
        });

        res.status(201).json({
            mensaje: 'Profesional creado correctamente',
            profesional: nuevoProfesional
        });
    } catch (error) {
        console.error('Error al crear el profesional:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'El email ya está registrado' });
        } else {
            res.status(500).json({ error: 'Error al crear el profesional' });
        }
    }
};
const getProfesionalesPorServicio = async (req, res) => {
    try {
        const { id_servicio } = req.params;
        const profesionales = await profesionalesAdmModel.getProfesionalesPorServicio(id_servicio);
        res.status(200).json(profesionales);
    } catch (error) {
        console.error('Error al obtener profesionales por servicio:', error);
        res.status(500).json({ error: 'Error al obtener los profesionales por servicio' });
    }
};
const buscarProfesionales = (req, res) => {
    const { nombre = '', apellido = '' } = req.query;
  
    Profesional.buscarProfesionalesPorNombreApellido(nombre, apellido, (err, results) => {
      if (err) {
        console.error('Error al buscar profesionales:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json(results);
    });
  };


module.exports = {
    buscarProfesionales,
    getProfesionalesPorServicio,
    getAdmProfesionales,
    actualizarProfesional,
    eliminarProfesional,
    crearProfesional
};