import express from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

router.put('/nombre', verificarToken, async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre || nombre.trim().length < 2)
      return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { nombre: nombre.trim() },
      { new: true }
    ).select('-password');

    res.json({ mensaje: 'Nombre actualizado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el nombre' });
  }
});

router.put('/password', verificarToken, async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    if (!passwordActual || !passwordNueva)
      return res.status(400).json({ error: 'Completá todos los campos' });

    if (passwordNueva.length < 6)
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });

    const usuario = await Usuario.findById(req.usuario.id);
    const passwordValida = await bcrypt.compare(passwordActual, usuario.password);

    if (!passwordValida)
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(passwordNueva, salt);
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
});

export default router;