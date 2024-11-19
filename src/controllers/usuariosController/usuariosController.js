const Usuario = require('../../models/usuariosModel/usuariosModel');
const { response } = require('express');
const Rol = require('../../models/rolesModel/rolesModel');

const { Sequelize } = require('sequelize');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const getUsuarios = async (req, res = response) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: Rol,

        },

      ],
    });

    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};



const getUsuarioByd = async (req, res = response) => {
  const {id_usuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(id_usuario);

    if (usuario) {
      const usuarioConImagen = {
        ...usuario.toJSON(),
        foto: usuario.foto
          ? `http://localhost:8095/uploads/${usuario.foto}` // Ruta completa de la imagen
          : null, // O puedes asignar un avatar por defecto aquí
      };

      res.json(usuarioConImagen);
    } else {
      res.status(404).json({ error: `No se encontró el usuario con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};



// Crear un nuevo usuario
const postUsuario = async (req, res = response) => {
  // Incluye id_rol en el destructuring del request
  const { nombre_usuario, contrasena, email, foto, id_rol } = req.body;
  console.log(req.body);  // Verifica que id_rol esté presente

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        error: 'El correo electrónico ya está en uso.'
      });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // Crear el nuevo usuario incluyendo el campo id_rol
    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      contrasena: contrasenaEncriptada,
      email,
      foto,
      id_rol  // Asegúrate de incluir este campo
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado con éxito.',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error al crear el usuario.'
    });
  }
};


const putUsuario = async (req, res = response) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res
        .status(404)
        .json({ error: ` P002 - E002 No se encontró un elemento de Usuario con ID ${id}` });
    }

    // Validar si se está intentando cambiar el nombre de usuario (ignorando mayúsculas/minúsculas)
    if (
      updatedData.nombre_usuario &&
      updatedData.nombre_usuario.toLowerCase() !== usuario.nombre_usuario.toLowerCase()
    ) {
      const existingUsername = await Usuario.findOne({
        where: { nombre_usuario: updatedData.nombre_usuario },
      });

      if (existingUsername) {
        return res
          .status(400)
          .json({ error: " P002 - E002 El nombre de usuario ya está en uso" });
      }
    }

    // Validar si se está intentando cambiar el correo
    if (updatedData.correo && updatedData.correo !== usuario.correo) {
      const existingEmail = await Usuario.findOne({
        where: { correo: updatedData.correo },
      });

      if (existingEmail) {
        return res
          .status(400)
          .json({ error: " P002 - E002 El correo electrónico ya está en uso" });
      }
    }

    await usuario.update(updatedData);
    res.json({ msg: `El elemento de Usuario fue actualizado exitosamente.` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: " P002 - E002 Error al actualizar el elemento de Usuario" });
  }
};


const deleteUsuario = async (req, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      await usuario.destroy();
      res.json("Elemento de Usuario eliminado exitosamente");
    } else {
      res
        .status(404)
        .json({ error: ` P002 - E002 No se encontró un elemento de usuario con ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " P002 - E002 Error al eliminar el elemento de usuario" });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    // Desestructuramos los datos recibidos en el cuerpo de la solicitud
    const { nombre, correo, nuevaContrasena } = req.body;

    console.log("Payload recibido:", { nombre, correo, nuevaContrasena });

    // Verificamos la cabecera de autorización
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      console.error("Token no válido o ausente");
      return res.status(401).json({ mensaje: "Token no válido" });
    }

    // Extraemos el token y lo decodificamos
    const token = authorizationHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, "secreto-seguro");

    console.log("Token decodificado:", decodedToken);

    // Buscamos al usuario en la base de datos
    const usuario = await Usuario.findOne({
      where: { nombre_usuario: decodedToken.nombre_usuario },
    });

    if (!usuario) {
      console.error("Usuario no encontrado:", decodedToken.nombre_usuario);
      return res.status(404).json({ mensaje: "P002 - E002 Usuario no encontrado" });
    }

    console.log("Usuario encontrado:", usuario);

    // Actualizamos los campos del perfil
    usuario.nombre_usuario = nombre || usuario.nombre_usuario;
    usuario.email = correo || usuario.email;

    // Actualizamos la contraseña si se proporciona
    if (nuevaContrasena) {
      const hashedContrasena = await bcrypt.hash(nuevaContrasena, 10);
      usuario.contrasena = hashedContrasena;
    }

    // Log para verificar los valores antes de guardar
    console.log("Valores antes de guardar:", {
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      contrasena: nuevaContrasena ? "Actualizada" : "No modificada",
    });

    // Guardamos los cambios
    await usuario.save();

    res.json({ mensaje: "Perfil actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);

    // Manejo de errores específicos de Sequelize
    if (error.name === "SequelizeUniqueConstraintError") {
      if (error.fields.nombre_usuario) {
        return res
          .status(400)
          .json({ mensaje: "P002 - E002 El nombre de usuario ya está en uso" });
      } else if (error.fields.email) {
        return res
          .status(400)
          .json({ mensaje: "P002 - E002 El correo electrónico ya está en uso" });
      }
    }

    // Respuesta genérica para otros errores
    res.status(500).json({ mensaje: "P002 - E002 Error al actualizar el perfil" });
  }
};

const actualizarEstadoUsuario = async (req, res = response) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
      usuario.estado = estado;
      await usuario.save();

      res.json({ mensaje: "Estado de usuario actualizado correctamente" });
    } else {
      res.status(404).json({ error: ` P002 - E002 No se encontró un usuario con ID ${id}` });
    }
  } catch (error) {
    console.error(" P002 - E002 Error al actualizar estado de usuario:", error);
    res.status(500).json({ error: "Error al actualizar estado de usuario" });
  }
};

module.exports = {
  getUsuarioByd,
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
  actualizarPerfil,
  actualizarEstadoUsuario,
};
