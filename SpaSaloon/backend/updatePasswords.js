const db = require('./db');  // Asegúrate de importar correctamente tu conexión a la base de datos
const bcrypt = require('bcrypt');

async function updatePasswords() {
  // Primero, obtenemos todos los clientes que no tienen la contraseña hasheada
  db.query('SELECT id_cliente, password FROM CLIENTE WHERE password IS NOT NULL', async (err, results) => {
    if (err) {
      console.error('Error al obtener los clientes:', err);
      return;
    }

    if (results.length === 0) {
      console.log('No hay clientes con contraseñas no hasheadas.');
      return;
    }

    // Ahora, recorremos los resultados y actualizamos la contraseña
    for (const cliente of results) {
      const idCliente = cliente.id_cliente;
      const password = cliente.password;

      try {
        // Hasheamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizamos la contraseña en la base de datos
        db.query(
          'UPDATE CLIENTE SET password = ? WHERE id_cliente = ?',
          [hashedPassword, idCliente],
          (updateErr) => {
            if (updateErr) {
              console.error(`Error al actualizar la contraseña del cliente ${idCliente}:`, updateErr);
            } else {
              console.log(`Contraseña del cliente ${idCliente} actualizada.`);
            }
          }
        );
      } catch (hashErr) {
        console.error(`Error al hashear la contraseña del cliente ${idCliente}:`, hashErr);
      }
    }
  });
}

// Ejecutamos la función
updatePasswords();
