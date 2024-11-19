const { Router } = require('express');
const route = Router();
const { getRol, getRoles, postRol, putRol, deleteRol,cambiarEstadoRol } = require('../../controllers/rolesController/rolesController');

//route.use(verificarToken);

route.get('/rol', getRoles);
route.get('/rol/:id', getRol);
route.post('/rol', postRol);
route.put('/rol/:id', putRol);
route.delete('/rol/:id', deleteRol);


module.exports = route;
