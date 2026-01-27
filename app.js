import 'dotenv/config';
import express from 'express';
import productosRoute from './routes/productos.js';
import categoriasRoute from './routes/categorias.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

//Middleware CORS (Necesario para la comunicación entre puertos)
app.use(cors({
    origin: 'http://localhost:5173' // Puerto predeterminado de Vite/React
}));

//PARSEAR COMO JSON
app.use(express.json());

import authRouter from './routes/auth.js';

//Imagenes estaticas
app.use('/uploads', express.static('uploads'));

//ruta autenticacion
app.use('/api', authRouter);

//USAR RUTAS
app.use('/api/productos', productosRoute);
app.use('/api/categorias', categoriasRoute);

import { notFound, errorHandler } from './middlewares/errorHandler.js'

//despues de ir por todas las rutas, entra el manejador 404 
app.use(notFound);
//manejo general de errores en general
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});
