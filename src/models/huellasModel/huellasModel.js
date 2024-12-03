const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../database/config');
const Usuario = require('../usuariosModel/usuariosModel'); // Importamos el modelo Usuario para definir la relación

const Huella = sequelize.define('huellas', {
    id_huella: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    vehiculo: {
        type: DataTypes.CHAR(1), 
        allowNull: false,
    },

    tipo_vehiculo: {
        type: DataTypes.CHAR(1), // '1' para "Carro", '2' para "Moto"
        allowNull: true,
    },

    km_diario: {
        type: DataTypes.INTEGER, // Kilómetros al día
        allowNull: true,
    },

    transporte_publico: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: true,
    },


    medio_transporte: {
        type: DataTypes.CHAR(1), // '1' para "Metro", '2' para "Bus"
        allowNull: true,
    },

    km_transporte: {
        type: DataTypes.INTEGER, // Kilómetros al día en transporte público
        allowNull: true,
    },

    viajes_avion: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: true,
    },
    
    destino_avion: {
        type: DataTypes.TEXT, // Consumo en m³
        allowNull: true,
    },

    consumo_electricidad: {
        type: DataTypes.FLOAT, // Consumo en kWh
        allowNull: true,
    },

    tipo_gas: {
        type: DataTypes.CHAR(1), // '1' para "Natural", '2' para "Pipeta", '3' para "No utiliza"
        allowNull: true,
    },

    consumo_gas: {
        type: DataTypes.FLOAT, // Consumo en m³
        allowNull: true,
    },

    consumo_agua: {
        type: DataTypes.FLOAT, // Consumo en m³
        allowNull: true,
    },
   

    num_personas: {
        type: DataTypes.INTEGER, // Número de personas en la casa
        allowNull: false,
    },

    reciclas: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: false,
    },

    correos_bandeja: {
        type: DataTypes.INTEGER, // Cantidad de correos en la bandeja de entrada
        allowNull: true,
    },
});

// Definir las relaciones directamente aquí
Huella.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasMany(Huella, { foreignKey: 'id_usuario', as: 'huellas' });

module.exports = Huella;
