const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurarse de que la carpeta 'uploads' exista
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Carpeta donde se almacenarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-processed${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix); // Nombre del archivo procesado
  }
});

// Filtro de archivo para validar tipos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imágenes (jpg, jpeg, png, gif)'));
  }
};

// Configuración de límites
const limits = {
  fileSize: 1024 * 1024 * 5 // Limite de tamaño de archivo: 5MB
};

// Exporta la configuración de multer sin usar .single directamente
const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;
