const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Usuario = require('../../models/usuariosModel/usuariosModel');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    }
});


const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imágenes'));
        }
    }
});

// Función para eliminar la imagen anterior
const eliminarImagenAnterior = (rutaImagen) => {
    const rutaCompleta = path.resolve('uploads', rutaImagen);
    console.log(`Intentando eliminar la imagen anterior: ${rutaCompleta}`);

    if (fs.existsSync(rutaCompleta)) {
        console.log('La imagen anterior existe:', rutaCompleta);
        fs.unlink(rutaCompleta, (err) => {
            if (err) {
                console.error('Error al eliminar la imagen antigua:', err);
            } else {
                console.log('Imagen anterior eliminada correctamente.');
            }
        });
    } else {
        console.log('No se encontró la imagen anterior para eliminar.');
    }
};

// Función para subir imagen del administrador
const subirImagenAvatar = (req, res) => {
    console.log('Solicitud recibida en subirImagenAvatar'); // Depuración
    upload.single('foto')(req, res, async (err) => {
        if (err) {
            console.error('Error de Multer:', err); // Depuración
            return res.status(400).json({ error: err.message });
        }

        try {
            const { id_usuario } = req.body;

            const usuario = await Usuario.findByPk(id_usuario);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontr' });
            }

            if (usuario.foto) {
                eliminarImagenAnterior(usuario.foto);
            }

            usuario.foto = req.file.filename;
            await usuario.save();

            res.json({
                message: 'Imagen de avatar subida y actualizada con éxito',
                filePath: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            });

        } catch (error) {
            console.error('Error al subir la imagen:', error);
            res.status(500).json({ error: 'Error al subir la imagen' });
        }
    });
};




module.exports = {
    subirImagenAvatar,
};
