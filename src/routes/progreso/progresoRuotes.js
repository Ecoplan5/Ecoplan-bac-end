const { Router } = require('express');
const route = Router();
const { Progreso } = require('../../controllers/progreso/progresoController');

const router = Router();

router.post('/crearProgreso', Progreso);

module.exports = route;
