const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');

const { subirImagenAdmin, subirImagenEmpleado } = require('../../controllers/adminProfile/adminProfileController');

// Ruta para subir la imagen del administrador
router.post('/admin-profile', verificarToken, subirImagenAdmin);

// Ruta para subir la imagen del empleado
router.post('/empleado-profile', subirImagenEmpleado, verificarToken);

module.exports = router;
