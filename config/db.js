import mongoose from 'mongoose';

const URL_MONGO = 'mongodb://localhost:27017/pepshop';

async function conectarDB() {
    try {
        await mongoose.connect(URL_MONGO);
        console.log('Conectado a MongoDB correctamente');
    } catch (error) {
        console.log('Error al conectar MongoDB', error);
        process.exit(1);
    }
}

export default conectarDB;