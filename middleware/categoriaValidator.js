import e from "express";
import { body, validationResult } from "express-validator";

export const validateCategoriaCreation = [
    body ('nombre')
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacio')
    .isLength ({min: 3, max: 255}).withMessage('El nombre de la categoria debe tenee mas de 3 caractereres'),

    // Middleware que verifica y maneja los errores
    (req, res , next) => {
        const errors = validationResult (req);

        if (!errors.isEmpty()){
            return res.status(400).json ({errors: errors.array()})
        }
        next();
    }
];
