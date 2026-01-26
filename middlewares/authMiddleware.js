import jwt from 'jsonwebtoken';
import pool from '../db.js';

export const protect = async (req, res, next) => {
    let token;
    // 1. Buscar el token en los headers (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token de la cadena "Bearer token..."
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Encontrar al usuario y adjuntarlo a la petición
            const [users] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [decoded.id]);
            
            if (users.length > 0){
            req.user = users[0]; // Adjunta los datos del usuario a la petición
            return next();
            } 
            else {
                res.status(404).json({message: "No autorizado, usuario no encontrado"});
            }
        } catch (error){
            console.error("Error de verificacion de token", error.message);
            return res.status(401).json({message: "No autorizado, token invalido"});
        }
    }
    
    if (!token){
        return res.status(401).json({message: 'No autorizado, no hay token'});
    }
};

//Verifica que el usuario autenticado es 'admin'
 export const admin = (req, res, next)=> {
    //La información del usuario (incluido el rol) fue adjuntada por 'protect'
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        //// 403 Forbidden: El usuario está logueado, pero no tiene los permisos necesarios.
        res.status(403).json({message: 'No autorizado como administrador'});
    }
 };