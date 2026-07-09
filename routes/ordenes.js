import express from 'express';
import Orden from '../models/Orden.js';
import Producto from '../models/Producto.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verificarToken, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        const itemsValidos = [];
        let total = 0;

        for (const item of items) {
            const producto = await Producto.findById(item.id);

            if (!producto) {
                return res.status(400).json({ error: `Producto no encontrado: ${item.id}` });
            }

            if (producto.stock < item.cantidad) {
                return res.status(400).json({
                    error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`
                });
            }

            itemsValidos.push({
                producto: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: item.cantidad
            });

            total += producto.precio * item.cantidad;
        }

        for (const item of itemsValidos) {
            await Producto.findByIdAndUpdate(item.producto, {
                $inc: { stock: -item.cantidad }
            });
        }

        const orden = new Orden({
            usuario: req.usuario.id,
            items: itemsValidos,
            total,
            estado: 'pagado'
        })

        await orden.save();

        res.status(201).json({
            mensaje: '¡Compra realizada con éxito!',
            orden: {
                id: orden._id,
                total: orden.total,
                estado: orden.estado,
                fecha: orden.createdAt
            }
        });

    } catch (error) {
        console.error('Error al crear orden:', error);
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
});

router.get('/mis-ordenes', verificarToken, async (req, res) => {
    try {
        const ordenes = await Orden.find({ usuario: req.usuario.id })
            .sort({ createdAt: -1 });

        res.json(ordenes);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
});

export default router;