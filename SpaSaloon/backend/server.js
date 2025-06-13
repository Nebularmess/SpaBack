const express = require('express');
const cors = require('cors');
//usuarios
const clientesRoutes = require('./routes/user_routes/clientesRoutes.js');
const turnosRoutes = require('./routes/user_routes/turnosRoutes.js');
const serviciosRoutes = require('./routes/user_routes/serviciosRoutes.js');
const profesionalesRoutes = require('./routes/user_routes/profesionalesRoutes.js'); // Nueva línea
const carritoRoutes = require('./routes/user_routes/carritoRoutes.js'); // Nueva línea para carritos
const adminRoutes = require('./routes/adm_routes/adminAdmRoutes.js');
const turnosAdmRoutes = require('./routes/adm_routes/turnosAdmRoute.js'); // Cambia la ruta según tu estructura de carpetas
const serviciosAdmRoutes = require('./routes/adm_routes/serviciosAdmRoutes.js'); // Cambia la ruta según tu estructura de carpetas
const profesionalesAdmRoutes = require('./routes/adm_routes/profesionalesRoutes.js'); // Nueva línea
const categoriaAdmRoutes = require('./routes/adm_routes/categoriaAdmRoutes.js');
const clienteRoutes = require('./routes/adm_routes/clienteAdmRoutes.js');
const emailRoutes = require('./routes/email/emailRoutes.js')//ruta de email

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
//usuariois
app.use('/api/clientes', clientesRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/profesionales', profesionalesRoutes); // Nueva línea
app.use('/api/carritos', carritoRoutes); // Nueva línea para carritos

//adn¿min
app.use('/api/admin', adminRoutes); 
app.use('/api/turnosAdmin', turnosAdmRoutes); // Cambia la ruta según tu estructura de carpetas
app.use('/api/serviciosAdm', serviciosAdmRoutes); // Cambia la ruta según tu estructura de carpetas
app.use('/api/profesionalesAdm', profesionalesAdmRoutes); // Nueva línea
app.use('/api/categoriasAdm', categoriaAdmRoutes);
app.use('/api/clientesAdm', clienteRoutes);

//email
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
