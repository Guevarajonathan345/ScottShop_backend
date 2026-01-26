//Manejador error 404 (Ruta no encontrada)

export const notFound = (req, res, next) => {
const error = new Error (`Ruta no encontrada - ${req.originalUrl}`);
res.status(400);
next(error);// manda el error al manejador general
};

//Manejador error 500 (servidor) ya que a veces manda un 200ok aunque haya un error
//forzar el 500 si fuera necesario

export const errorHandler =(err, req, res, next ) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode);

    res.json({
        message: err.message, 
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
    });
};
