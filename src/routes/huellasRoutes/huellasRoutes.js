const { Router } = require('express');
const route = Router();
const verificarToken = require('../../../middlewares/vefiricarToken');

const { getHuellas,  getHuellaById ,createHuella} = require('../../controllers/huellasController/huellasController');

// Obtener todas las huellas
route.get('/huellas', getHuellas);

// Obtener  la  huella por id 
route.get('/obtener/:id_huella', getHuellaById);

// Crear una nueva  huella
route.post('/huellas', createHuella);

// Obtener un usuario por ID

module.exports = route;
