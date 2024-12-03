const Huella = require('../../models/huellasModel/huellasModel');
const Usuario = require('../../models/usuariosModel/usuariosModel');
const { format } = require('fecha'); // Importamos el método format de la librería fecha
const { response } = require('express');

const getHuellas = async (req, res = response) => {
    try {
        const huellas = await Huella.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre_usuario'], // Campos que deseas incluir
                },
            ],
        });

        res.json({ huellas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener huellas' });
    }
};



const getHuellaById = async (req, res = response) => {
    const { id } = req.params;

    try {
        const huella = await Huella.findOne({
            where: { id_huella: id },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre_usuario'], // Campos que deseas incluir del usuario
                },
            ],
        });

        if (!huella) {
            return res.status(404).json({ error: `No se encontró la huella con id ${id}` });
        }

        res.json({ huella });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la huella' });
    }
};



const createHuella = async (req, res = response) => {
    const {
        id_usuario,
        vehiculo,
        tipo_vehiculo,
        km_diario,
        transporte_publico,
        medio_transporte,
        km_transporte,
        viajes_avion,
        destino_avion,
        consumo_electricidad,
        tipo_gas,
        consumo_gas,
        consumo_agua,
        num_personas,
        reciclas,
        correos_bandeja,
        fecha_registro,  
    } = req.body;

    // Si la fecha de registro no se pasó desde el cliente, se asigna la fecha actual
    const fechaFormateada = format(new Date(fecha_registro), 'yyyy-MM-dd HH:mm:ss');

    try {
        // Crear la nueva huella con la fecha de registro formateada
        const nuevaHuella = await Huella.create({
            id_usuario,
            vehiculo,
            tipo_vehiculo,
            km_diario,
            transporte_publico,
            medio_transporte,
            km_transporte,
            viajes_avion,
            destino_avion,
            consumo_electricidad,
            tipo_gas,
            consumo_gas,
            consumo_agua,
            num_personas,
            reciclas,
            correos_bandeja,
            fecha_registro: fechaFormateada, // Asignamos la fecha formateada
        });

        res.status(201).json({
            message: 'Huella creada exitosamente',
            huella: nuevaHuella,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la huella' });
    }
};




module.exports = {
    getHuellas,
    getHuellaById,
    createHuella
};
