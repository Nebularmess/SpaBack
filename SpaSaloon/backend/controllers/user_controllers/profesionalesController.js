const db = require('../../db');

// Obtener todos los profesionales
const getAllProfesionales = async (req, res) => {
  const query = `
    SELECT p.*, s.nombre as servicio_nombre 
    FROM profesional p
    JOIN servicio s ON p.id_servicio = s.id_servicio
    WHERE p.activo = 1
  `;

  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener profesionales', detalles: err });
  }
};

const getProfesionalesPorServicio = async (req, res) => {
  const { id_servicio } = req.params;

  if (!id_servicio) {
    return res.status(400).json({ error: 'Se requiere el ID de servicio' });
  }

  const query = `
    SELECT p.*, s.nombre as servicio_nombre 
    FROM profesional p
    JOIN servicio s ON p.id_servicio = s.id_servicio
    WHERE p.id_servicio = ? AND p.activo = 1
  `;

  try {
    const [results] = await db.query(query, [id_servicio]);
    return res.json(results);
  } catch (err) {
    console.error('Error al obtener profesionales:', err);
    return res.status(500).json({ error: 'Error en la consulta', detalles: err });
  }
};

const getHorariosProfesional = async (req, res) => {
  const { id_profesional, fecha } = req.query;

  if (!id_profesional || !fecha) {
    return res.status(400).json({ error: 'Se requiere ID de profesional y fecha' });
  }

  // Primero verificamos los horarios ya ocupados
  const turnosQuery = `
    SELECT DATE_FORMAT(fecha_hora, '%H:%i') as hora
    FROM turno
    WHERE id_profesional = ? 
    AND DATE(fecha_hora) = ? 
    AND estado != 'Cancelado'
  `;

  try {
    const [results] = await db.query(turnosQuery, [id_profesional, fecha]);

    // Los horarios ya ocupados
    const horariosOcupados = results.map(r => r.hora);

    // Aquí podrías obtener los horarios disponibles del profesional
    // si tienes una tabla con los horarios de trabajo de cada profesional
    // Por ahora usaremos horarios fijos como ejemplo
    const todosLosHorarios = [
      "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00"
    ];

    // Filtramos los horarios que no están ocupados
    const horariosDisponibles = todosLosHorarios.filter(
      hora => !horariosOcupados.includes(hora)
    );

    res.json({
      id_profesional,
      fecha,
      horariosDisponibles
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener horarios', detalles: err });
  }
};

const putProfesionalesPassword = async (req, res) =>{
  const {email, psswd_actual, psswd_nueva, psswd_confirmada } = req.body;

  if(!email || !psswd_actual || !psswd_nueva || !psswd_confirmada) throw res.status(400).json({error:"Faltan campos requeridos"});
  
  if(psswd_nueva !== psswd_confirmada) throw res.status(400).json({error:"contraseñas no coinciden"});
  
  try {
    const querySelect =`
      SELECT * FROM PROFESIONAL WHERE email = ?
    `
    const queryUpdate =`
      UPDATE PROFESIONAL SET password = ? WHERE email = ?
    `
      const [results] = await db.query(querySelect, [email]);
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Profesional no encontrado' });
      }
  
      const profesional = results[0];
      
      
      if (profesional.email !== email) {
        return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
      }
  
     
      await db.query(queryUpdate, [psswd_confirmada, email]);
      
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor al cambiar contraseña' });
    }

  
}

const loginProfesionales = async (req, res) => {
  const { email, passwd } = req.body;

  // Función para comparar contraseñas
  function matchPasswd(passLogin, passActual) {
    return passLogin === passActual;
  }
  
  // Validar que lleguen las credenciales
  if (!email || !passwd) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  try {
    // Buscar profesional por email y obtener todos los datos necesarios
    const queryFindProfesional = `
      SELECT id_profesional, nombre, email, password 
      FROM profesional 
      WHERE email = ?
    `;
    
    const [resultProfesional] = await db.query(queryFindProfesional, [email]);

    // Verificar si el profesional existe
    if (resultProfesional.length === 0) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    const profesional = resultProfesional[0];

    // Verificar contraseña
    const matching = matchPasswd(passwd, profesional.password);

    if (!matching) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Login exitoso
    return res.json({
      message: "Login exitoso",
      profesional: {
        id_profesional: profesional.id_profesional,
        nombre: profesional.nombre,
        email: profesional.email
      }
    });

  } catch (error) {
    console.error('Error al validar credenciales:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllProfesionales,
  getProfesionalesPorServicio,
  getHorariosProfesional,
  putProfesionalesPassword,
  loginProfesionales
};