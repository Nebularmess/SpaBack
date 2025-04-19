const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientesRoutes.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
