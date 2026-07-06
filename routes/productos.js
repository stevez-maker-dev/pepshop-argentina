const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

router.get('/', async (req, res) => {
    try {
        const filtro = {};
        if (req.query.especie) {
            filtro.especie = req.query.especie;
        }

        const productos = await productos.find(filtro);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if(!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

module.exports = router;