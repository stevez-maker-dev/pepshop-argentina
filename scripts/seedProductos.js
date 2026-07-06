const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const productosIniciales = require('../data/productos');

async function poblarProductos() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pepshop');
        console.log('Conectado a MongoDB');

        await Producto.deleteMany({});
        console.log('Colección limpiada');

        await Producto.insertMany(productosIniciales);
        console.log(`${productosIniciales.length} productos insertados correctamente`);

    } catch (error) {
        console.log('Error al poblar la base de datos:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    }
}

poblarProductos();