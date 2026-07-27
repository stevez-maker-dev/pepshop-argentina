import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/ENVIROMENT.js';

export function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Acceso denegado: token no proporcionado' });
    }

    try {
        const datos = jwt.verify(token, ENVIRONMENT.JWT_SECRETO);
        req.usuario = datos;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
}

export function soloAdmin(req, res, next) {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requiere rol admin' });
    }
    next();
}