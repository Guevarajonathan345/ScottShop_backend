import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

//filtro: imagenes

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jepg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("tipo de archivo no permitido"), false);
    }
};

const upload = multer({
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //5mb 

});

export default upload;