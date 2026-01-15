import { body, validationResult } from 'express-validator';

//Reglas o validaciones para la creacion de productos

export const validateProductCreation = [
    body ('nombre') 
    .trim()
    .notEmpty().withMessage('No puede estar vacio')
    .isLength ({min: 3, max: 255 }).withMessage ('El nombre del producto debe tener mas de 3 letras'),

    body ('precio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo' ),

    body ('stock')
    .isInt({ gt: -1 }).withMessage('El stock debe ser un numero entero positivo'),

    body ('categoria_id')
    .isInt({ gt: 0 }).withMessage('La ID de categoría debe ser un número entero válido.'),

     // Middleware que verifica y maneja los errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, devolvemos un 400 (Bad Request)
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Si no hay errores, pasa al controlador
    }

];

