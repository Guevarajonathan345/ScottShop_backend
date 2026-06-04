import { Router } from 'express';
import { createVariantes, updateVariantes, deleteVariantes } from '../controllers/varianteController.js';
import { validateVariantesCreation, validateVariantesUpdate } from '../middlewares/varianteValidator.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = Router();

//Rutas
router.post ('/', protect, admin, validateVariantesCreation, createVariantes);
router.put ('/:id', protect, admin, validateVariantesUpdate, updateVariantes);
router.delete ('/:id', protect, admin, deleteVariantes);

export default router;
