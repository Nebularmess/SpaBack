const express = require('express');
const cors = require('cors');
//usuarios
const clientesRoutes = require('./routes/clientesRoutes.js');
const turnosRoutes = require('./routes/turnosRoutes.js');
const serviciosRoutes = require('./routes/serviciosRoutes.js');
const profesionalesRoutes = require('./routes/profesionalesRoutes.js'); // Nueva línea
//admin
const turnosAdmRoutes = require('./routes/adm_routes/turnosAdmRoute.js'); // Cambia la ruta según tu estructura de carpetas
const serviciosAdmRoutes = require('./routes/adm_routes/serviciosAdmRoutes.js'); // Cambia la ruta según tu estructura de carpetas
const profesionalesAdmRoutes = require('./routes/adm_routes/profesionalesRoutes.js'); // Nueva línea
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
//usuariois
app.use('/api/clientes', clientesRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/profesionales', profesionalesRoutes); // Nueva línea

//adn¿min
app.use('/api/turnosAdmin', turnosAdmRoutes); // Cambia la ruta según tu estructura de carpetas
app.use('/api/serviciosAdm', serviciosAdmRoutes); // Cambia la ruta según tu estructura de carpetas
app.use('/api/profesionalesAdm', profesionalesAdmRoutes); // Nueva línea

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

