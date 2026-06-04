import { body, validationResult } from 'express-validator';

//Reglas o validaciones para la creacion de productos

// Middleware que verifica y maneja los errores
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
            // Si hay errores, devolvemos un 400 (Bad Request)
        return res.status(400).json({ 
            errors: errors.array() 
        });
    }
    next(); // Si no hay errores, pasa al controlador
};


//CREAR PRODUCTO
export const validateProductCreation = [
    body ('nombre') 
    .trim()
    .notEmpty().withMessage('No puede estar vacio')
    .isLength ({min: 3, max: 255 }).withMessage ('El nombre del producto debe tener mas de 3 letras'),

    body ('categoria_id')
    .isInt({ gt: 0 }).withMessage('La ID de categoría debe ser un número entero válido.'),

    body ('descripcion') 
    .notEmpty().withMessage('No puede estar vacio'),

    handleValidation
];

