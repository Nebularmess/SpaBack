const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientesRoutes.js');
const turnosRoutes = require('./routes/turnosRoutes.js');
const serviciosRoutes = require('./routes/serviciosRoutes.js');
const profesionalesRoutes = require('./routes/profesionalesRoutes.js'); // Nueva línea
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/profesionales', profesionalesRoutes); // Nueva línea

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

