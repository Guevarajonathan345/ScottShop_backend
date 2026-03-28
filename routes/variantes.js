import { Route } from 'express';
import { createVariantes, updateVariantes, deleteVariantes } from '../controllers/VariantesController.js';
import { validateVariantesCreation } from '../middlewares/variantesValidator.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = Route ();

//Rutas
router.post ('/', protect, admin, validateVariantesCreation, createVariantes);
router.put ('/:id', protect, admin, validateVariantesCreation, updateVariantes);
router.delete ('/:id', protect, admin, deleteVariantes);

export default router;
