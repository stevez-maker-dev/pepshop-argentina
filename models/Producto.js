import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    especie: {
        type: String,
        required: true,
        enum: ['Perro', 'Gato']
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Alimento', 'Juguete', 'Accesorio', 'Higiene', 'Salud']
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    imagen: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Producto', productoSchema);