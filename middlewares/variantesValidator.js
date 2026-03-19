import { body, validationResult } from 'express-validator';

export const validateVariantUpdate = [
    body('product_id').isInt().withMessage('ID de producto invalido o no entero'),
    body('almacenamiento').notEmpty(),
    body('ram').notEmpty(),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').isInt({ min: 0 }),
    body('sku').notEmpty(),

    // Middleware que verifica y maneja los errores
    (req, res , next) => {
        const errors = validationResult (req);

        if (!errors.isEmpty()){
            return res.status(400).json ({errors: errors.array()})
        }
        next();
    }
];