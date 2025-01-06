// cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configuración de Cloudinary con las claves directamente en el código
cloudinary.config({
  cloud_name: 'vrrgusfrgazctcldrryo',  // Tu Cloud Name
  api_key: '956574229232433',         // Tu API Key
  api_secret: 'aFM0SXY4k_ztWyPKGsji6gNABUs'  // Tu API Secret
});

// Configuración de almacenamiento con multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

// Crear el middleware de multer
const upload = multer({ storage: storage });

// Función para manejar la subida de imagen
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ninguna imagen.');
  }

  res.json({
    message: 'Imagen subida correctamente',
    url: req.file.path,
  });
};

// Exportar las funciones
export { upload, uploadImage };
