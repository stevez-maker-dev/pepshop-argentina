import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectarDB from './config/db.js';
import ENVIRONMENT from './config/ENVIROMENT.js';
import rutasProductos from './routes/productos.js';
import rutasAuth from './routes/auth.js';
import rutasOrdenes from './routes/ordenes.js';
import rutasAdmin from './routes/admin.js';
import rutasPerfil from './routes/perfil.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectarDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/productos', rutasProductos);
app.use('/api/auth', rutasAuth);
app.use('/api/ordenes', rutasOrdenes);
app.use('/api/perfil', rutasPerfil);
app.use('/api/admin', rutasAdmin);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(ENVIRONMENT.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${ENVIRONMENT.PORT}`);
});