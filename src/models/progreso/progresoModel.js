const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../database/config');

const Progreso = sequelize.define('progresO', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desafio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    progreso: {
        type: DataTypes.INTEGER, 
        defaultValue: 0,
    },
}, {
    timestamps: true,
});

module.exports = Progreso;
