const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../database/config');

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        args: true,
        msg: "El nombre no puede estar vacío.",
      },
      is: {
        args: [/^[a-zA-Z ]+$/],
        msg: "El nombre solo puede contener letras y espacios.",
      },
      len: {
        args: [3, 255],
        msg: "El nombre debe tener entre 3 y 255 caracteres.",
      },
    },
  },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});



module.exports = Rol;