import { body, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
      });
    }
    next();
};
// CREAR VARIANTE
export const validateVariantesCreation = [

  body("product_id")
    .isInt()
    .withMessage("ID de producto inválido"),

  body("almacenamiento")
    .notEmpty()
    .withMessage("El almacenamiento es obligatorio"),

  body("ram")
    .notEmpty()
    .withMessage("La RAM es obligatoria"),

  body("precio")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número positivo"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número mayor o igual a 0"),

  body("sku")
    .notEmpty()
    .withMessage("El SKU es obligatorio"),

  handleValidation
];

// ACTUALIZAR VARIANTE
export const validateVariantesUpdate = [

  body("almacenamiento")
    .notEmpty()
    .withMessage("El almacenamiento es obligatorio"),

  body("ram")
    .notEmpty()
    .withMessage("La RAM es obligatoria"),

  body("precio")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número positivo"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número mayor o igual a 0"),

  body("sku")
    .notEmpty()
    .withMessage("El SKU es obligatorio"),

  handleValidation
];

