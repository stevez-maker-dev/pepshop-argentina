const express = require('express');
const path = require('path');
const connectarDB = require('./config/db');
const rutasProductos = require('./routes/productos');
const rutasAuth = require('./routes/auth');
const rutasOrdenes = require('./routes/ordenes');

const app = express();
const PUERTO = 3000;

connectarDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/productos', rutasProductos);
app.use('/api/auth', rutasAuth);
app.use('/api/ordenes', rutasOrdenes);

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});