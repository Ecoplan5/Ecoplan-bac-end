const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');  // Middleware para verificar el token

// Controlador para actualizar el avatar
const {     subirImagenAvatar,
} = require('../../controllers/adminProfile/adminProfileController');

// Ruta para actualizar el avatar de un usuario
// Esta ruta requiere el token de autenticación para asegurar que el usuario está autenticado
router.post('/actualizarAvatar', verificarToken,     subirImagenAvatar,
);

module.exports = router;
