const Huella = require('../../models/huellasModel/huellasModel');
const Usuario = require('../../models/usuariosModel/usuariosModel');
const { spawn } = require("child_process");
const path = require('path');
const { format } = require('fecha'); // Importamos el método format de la librería fecha
const { response } = require('express');

const getHuellas = async (req, res = response) => {
    try {
        // Recuperar todas las huellas de la base de datos con su usuario asociado
        const huellas = await Huella.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre_usuario'], // Campos que deseas incluir
                },
            ],
        });

        // Calcular el resultado del script Python para cada huella
        const huellasConResultados = await Promise.all(
            huellas.map(async (huella) => {
                const resultado = await calcularHuellaPython(huella.toJSON());
                return { ...huella.toJSON(), resultado_huella: resultado };
            })
        );

        res.json({ huellas: huellasConResultados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener huellas' });
    }
};



const getHuellaById = async (req, res = response) => {
    const { id } = req.params;
    try {
        // Recuperar la huella específica con su usuario asociado por el id_usuario
        const huella = await Huella.findOne({
            where: { id_usuario: id },
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

        // Calcular el resultado del script Python
        const resultado = await calcularHuellaPython(huella.toJSON());

        res.json({ huella: { ...huella.toJSON(), resultado_huella: resultado } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la huella' });
    }
};




const calcularHuellaPython = (data) => {
    return new Promise((resolve, reject) => {
        // Convertir los datos a JSON
        const jsonData = JSON.stringify(data);
        console.log("Datos enviados al script Python:", jsonData);

        // Definir la ruta del script Python
        const scriptPath = path.join(__dirname, '../../../scripts/calcular_huella.py');

        // Iniciar el proceso Python con spawn
        const pythonProcess = spawn("python", [scriptPath]);

        let result = "";
        let error = "";

        // Escuchar la salida del script
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

     
        // Escuchar errores
        pythonProcess.stderr.on("data", (data) => {
            error += data.toString();
            console.error("Error en Python:", error); // Imprime lo que llega como error

        });

        // Enviar los datos JSON al script Python
        pythonProcess.stdin.write(jsonData);
        pythonProcess.stdin.end();

        // Cuando el proceso termina
        pythonProcess.on("close", (code) => {
            if (code !== 0 || error) {
                console.error(`Error al ejecutar el script Python: ${error}`);
                error += data.toString();
                console.error(`Error en Python: ${data.toString()}`);  // Imprimir el error

                reject(error || `Código de error: ${code}`);
            } else {
                try {
                    const resultado = JSON.parse(result);
                    resolve(resultado);
                } catch (parseError) {
                    console.error(`Error al parsear la salida de Python: ${parseError}`);
                    reject(parseError);
                }
            }
        });
    });
};

const createHuella = async (req, res = response) => {
    const {
        userId, // Cambié el nombre a userId para que coincida con el frontend
        tipo_vehiculo,
        tipo_vehiculo_especifico,
        km_diario,
        transporte_publico,
        medio_transporte,
        km_transporte,
        viajes_avion,
        destino_avion,
        consumo_electricidad,
        tipo_gas,
        consumo_agua,
        num_personas,
        reciclas,
        correos_bandeja,
    } = req.body;

    // Asignar el userId a id_usuario para que coincida con la base de datos
    const id_usuario = userId;

    // Capturar la fecha actual si no se proporciona
    const fechaActual = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    try {
        // Crear el objeto datosHuella para el cálculo
        const datosHuella = {
            tipo_vehiculo,
            tipo_vehiculo_especifico,
            km_diario,
            transporte_publico,
            medio_transporte,
            km_transporte,
            viajes_avion,
            destino_avion,
            consumo_electricidad,
            tipo_gas,
            consumo_agua,
            num_personas,
            reciclas,
            correos_bandeja,
        };

        // Calcular la huella de carbono usando Python
        const resultado = await calcularHuellaPython(datosHuella);

        // Crear la nueva huella
        const nuevaHuella = await Huella.create({
            id_usuario,
            tipo_vehiculo,
            tipo_vehiculo_especifico,
            km_diario,
            transporte_publico,
            medio_transporte,
            km_transporte,
            viajes_avion,
            destino_avion,
            consumo_electricidad,
            tipo_gas,
            consumo_agua,
            num_personas,
            reciclas,
            correos_bandeja,
            fecha_registro: fechaActual,
        });

        res.status(201).json({
            message: 'Huella creada exitosamente',
            huella: nuevaHuella,
            resultado_huella: resultado,
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
