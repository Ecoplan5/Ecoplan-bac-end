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

    // Pregunta 1: ¿Posees vehículo particular?
    tipo_vehiculo: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: false,
    },

    // Pregunta 2: ¿Qué tipo de vehículo? (Carro o Moto)
    tipo_vehiculo_especifico: {
        type: DataTypes.CHAR(1), // '2' para "Moto", '3' para "Carro"
        allowNull: true,
    },

    // Pregunta 3: ¿Cuál es el km aproximado al día para tu vehículo?
    km_diario: {
        type: DataTypes.INTEGER, // Kilómetros al día
        allowNull: true,
    },

    // Pregunta 4: ¿Utilizas transporte público?
    transporte_publico: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: true,
    },

    // Pregunta 5: ¿Cuál de los siguientes medios de transporte usas?
    medio_transporte: {
        type: DataTypes.CHAR(1), // '1' para "Bus", '2' para "Metro"
        allowNull: true,
    },

    // Pregunta 6: ¿Cuál es el km aproximado al día usando transporte público?
    km_transporte: {
        type: DataTypes.INTEGER, // Kilómetros al día
        allowNull: true,
    },

    // Pregunta 7: ¿Ha realizado viajes en avión durante el último año?
    viajes_avion: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: true,
    },

    // Pregunta 8: ¿A dónde ha ido en avión?
    destino_avion: {
        type: DataTypes.STRING, // Texto del destino
        allowNull: true,
    },

    // Pregunta 9: ¿Cuál es el consumo de electricidad que aparece en la factura?
    consumo_electricidad: {
        type: DataTypes.FLOAT, // Consumo en kWh
        allowNull: true,
    },

    // Pregunta 10: ¿Qué tipo de gas utiliza?
    tipo_gas: {
        type: DataTypes.CHAR(1), // '1' para "Natural", '2' para "Pipeta", '3' para "No utiliza"
        allowNull: true,
    },

    // Pregunta 11: ¿Cuánto factura de acueducto (m³)?
    consumo_agua: {
        type: DataTypes.FLOAT, // Consumo en m³
        allowNull: true,
    },

    // Pregunta 12: ¿Cuántas personas viven en tu casa? (incluyéndote)
    num_personas: {
        type: DataTypes.INTEGER, // Número de personas
        allowNull: false,
    },

    // Pregunta 13: ¿Reciclas?
    reciclas: {
        type: DataTypes.CHAR(1), // '1' para "Sí", '0' para "No"
        allowNull: false,
    },

    // Pregunta 14: ¿Qué cantidad de correos hay actualmente en tu bandeja de entrada?
    correos_bandeja: {
        type: DataTypes.INTEGER, // Cantidad de correos
        allowNull: true,
    },
});



// Definir las relaciones directamente aquí
Huella.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasMany(Huella, { foreignKey: 'id_usuario', as: 'huellas' });

module.exports = Huella;
