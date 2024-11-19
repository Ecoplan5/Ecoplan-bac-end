const { DataTypes } = require('sequelize');
const Rol = require('../rolesModel/rolesModel');

const { sequelize } = require('../../../database/config');

const Usuario = sequelize.define('usuarios', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_rol: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'Por favor, ingrese un correo electrónico válido',
            },
        },
    },

    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo',
      },
});
Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

module.exports = Usuario;
