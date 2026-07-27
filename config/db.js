import mongoose from 'mongoose';
import ENVIRONMENT from './ENVIROMENT.js';

async function conectarDB() {
    try {
        await mongoose.connect(ENVIRONMENT.URL_MONGO);
        console.log('Conectado a MongoDB correctamente');
    } catch (error) {
        console.log('Error al conectar MongoDB', error);
        process.exit(1);
    }
}

export default conectarDB;