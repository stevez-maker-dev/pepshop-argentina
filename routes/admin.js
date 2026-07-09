const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Orden = require('../models/Orden');
const { verificarToken, soloAdmin } = require('../middleware/auth');

router.use(verificarToken, soloAdmin);

router.get('/ordenes', async (req, res) => {
    try {
        const ordenes = await Orden.find()
            .populate('usuario', 'nombre email')
            .sort({ createdAt: -1 });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las ordenes' });
    }
});

router.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, especie, categoria, stock, imagen } = req.body;

        if (!nombre || !descripcion || !precio || !especie || !categoria || stock === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const producto = new Producto({ nombre, descripcion, precio, especie, categoria, stock, imagen });
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.put('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );

        if (!producto) {
            return res.status(500).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(re.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;