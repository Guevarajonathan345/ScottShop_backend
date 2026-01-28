    import { Router } from 'express';
    import { getProductos, createProducto, updateProducto, deleteProducto } from '../controllers/productoController.js';
    import { validateProductCreation } from '../middlewares/productoValidator.js'; 
    import { protect, admin } from '../middlewares/authMiddleware.js';
    import upload from '../middlewares/upload.js';

    const router = Router();

    //RUTAS PROTEGIDAS (JWT)

    /*router.get('/', protect, getProductos);
    router.post('/', protect, validateProductCreation, createProducto);
    router.put('/:id', protect, validateProductCreation, updateProducto);
    router.delete('/:id', protect, deleteProducto);*/

    router.get('/', getProductos);
    router.post('/', protect, admin, upload.single("imagen"), validateProductCreation, createProducto);
    router.put('/:id', protect, admin, upload.single("imagen"), validateProductCreation, updateProducto);
    router.delete('/:id', protect, admin, deleteProducto);


    export default router;
