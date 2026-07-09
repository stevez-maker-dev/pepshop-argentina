const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

async function crearAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pepshop');
        console.log('Conectado a MongoDB');

        const adminExistente = await Usuario.findOne({ email: 'admin@pepshop.com' });
        if (adminExistente) {
            console.log('El usuario admin ya existe');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('admin123', salt);

        const admin = new Usuario({
            nombre: 'Administrador',
            email: 'admin@pepshop.com',
            password: passwordHash,
            rol: 'admin'
        });

        await admin.save();
        console.log('Usuario admin creado correctamente');
        console.log('Email: admin@pepshop.com');
        console.log('Contraseña: admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

crearAdmin();