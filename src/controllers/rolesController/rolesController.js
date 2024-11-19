const Rol = require('../../models/rolesModel/rolesModel');
const { response } = require('express');


const getRoles = async (req, res = response) => {
    try {
        // Buscar todos los roles 
        const listaRoles = await Rol.findAll({
        });

        res.json({ listaRoles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
}

const getRol = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el rol por su ID 
    const rol = await Rol.findByPk(id, {
    });

    if (!rol) {
      return res.status(404).json({ error: "No se encontró un rol con el ID proporcionado" });
    }

    res.json(rol);
  } catch (error) {
    console.error("Error al obtener el rol por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};




const putRol = async (req, res = response) => {
  const { id } = req.params;
  const { nombre, estado,  } = req.body;

  try {
    const rol = await Rol.findByPk(id, {
    });

    if (!rol) {
      return res.status(404).json({ error: `No se encontró un rol con ID ${id}` });
    }
    // Validamos que el nuevo nombre no esté en uso por otro rol
if (nombre && nombre !== rol.nombre) {
  const rolWithSameName = await Rol.findOne({ where: { nombre } });
  if (rolWithSameName) {
    return res.status(400).json({ error: 'nombre del rol ya está en uso. Por favor, ingresa otro nombre.' });
  }
}

    // Actualizamos el nombre y el estado del rol
    await rol.update({ nombre, estado });


    res.json({
      msg: 'El rol fue actualizado exitosamente.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
}



const postRol = async (req, res = response) => {
  const { nombre, estado} = req.body;

  try {
    // Verifica si ya existe un rol con el mismo nombre
    const rolExistente = await Rol.findOne({ where: { nombre } });
    if (rolExistente) {
      return res.status(400).json({ error: 'El nombre del rol ya está en uso. Por favor, ingresa otro nombre.' });
    }

    // Crea el rol
    const nuevoRol = await Rol.create({ nombre, estado });


    res.json(nuevoRol);
  } catch (error) {
    console.error('Error al crear el rol:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const deleteRol = async (req, res = response) => {
  const { id } = req.params;

  try {
      const rol = await Rol.findByPk(id);
      if (!rol) {
          return res.status(404).json({ error: `No se encontró un rol con ID ${id}` });
      }

      await rol.destroy();
      res.json('El rol fue eliminado exitosamente');
  } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
          return res.status(400).json({ error: 'Este rol tiene un usuario asociado.' });
      }

      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el rol' });
  }
}






const cambiarEstadoRol = async (req, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
      const rol = await Rol.findByPk(id);
      if (!rol) {
          return res.status(404).json({ error: `No se encontró un rol con ID ${id}` });
      }

      await rol.update({ estado });

      res.json({
          msg: 'El estado del rol fue actualizado exitosamente.'
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el estado del rol' });
  }
}



module.exports = {
    getRol,
    getRoles,
    postRol,
    putRol,
    deleteRol,
    cambiarEstadoRol
};

