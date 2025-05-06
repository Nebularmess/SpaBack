const ClienteModel = require('../../models/admin_model/clienteAdmModels');

const ClienteAdmController = {
  getAll: async (req, res) => {
    try {
      const clientes = await ClienteModel.getAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  },

  getById: async (req, res) => {
    try {
      const cliente = await ClienteModel.getById(req.params.id);
      if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente' });
    }
  },

  create: async (req, res) => {
    try {
      const id = await ClienteModel.create(req.body);
      res.status(201).json({ message: 'Cliente creado', id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el cliente' });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await ClienteModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Cliente no encontrado o inactivo' });
      res.json({ message: 'Cliente actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
  },

  deleteLogic: async (req, res) => {
    try {
      const deleted = await ClienteModel.deleteLogic(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json({ message: 'Cliente dado de baja' });
    } catch (error) {
      res.status(500).json({ error: 'Error al dar de baja el cliente' });
    }
  }
};

module.exports = ClienteAdmController;
