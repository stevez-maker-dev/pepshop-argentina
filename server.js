const express = require('express');
const path = require('path');
const connectarDB = require('./config/db');
const rutasProductos = require('./routes/productos');

const app = express();
const PUERTO = 3000;

connectarDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/productos', rutasProductos);

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});