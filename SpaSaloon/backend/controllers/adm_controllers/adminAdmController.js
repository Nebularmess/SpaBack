const adminModel = require('../../models/admin_model/adminAdmModels');
// const bcrypt = require('bcrypt'); // usar si hay hash en producción

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const admin = await adminModel.findByEmail(email);
    if (!admin)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    // Si estuviera encriptada usar:
    // const match = await bcrypt.compare(password, admin.password);
    const match = password === admin.password;

    if (!match)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({
      message: 'Login exitoso',
      administrador: {
        id_admin: admin.id_admin,
        nombre: admin.nombre,
        apellido: admin.apellido
      }
    });
  } catch (err) {
    console.error('Error en loginAdmin:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const admins = await adminModel.findAllActive();
    res.json(admins);
  } catch (err) {
    console.error('Error en getAllAdmin:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
