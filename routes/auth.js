import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { SECRETO } from '../middleware/auth.js';

const router = express.Router();

router.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400),json({ error: 'Todos los campos son obligatorios' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Ya existe una cuenta con ese email' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const usuario = new Usuario({ nombre, email, password: passwordHash });
        await usuario.save();

        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
            SECRETO,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorias' });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: 'Email y contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
            SECRETO,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
        
    }
});

export default router;