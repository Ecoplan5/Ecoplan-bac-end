const Progreso = require('../../models/progreso/progresoModel');
const Usuario = require('../../models/usuariosModel/usuariosModel');

const Progreso = async (req, res) => {
    const { categoria, desafio, id_usuario } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si ya existe un progreso para el desafío
        let progress = await ChallengeProgress.findOne({
            where: { user_id: id_usuario, categoria, desafio },
        });

        if (progress) {
            // Actualizar progreso existente
            progress.progreso += 10; // Ejemplo: Incrementar en 10 unidades
            await progress.save();
        } else {
            // Crear nuevo registro de progreso
            progress = await ChallengeProgress.create({
                user_id: id_usuario,
                categoria,
                desafio,
                progreso: 10, // Progreso inicial
            });
        }

        res.json({
            message: 'Progreso actualizado con éxito',
            progress,
        });
    } catch (error) {
        console.error('Error al actualizar el progreso del reto:', error);
        res.status(500).json({ error: 'Error al registrar el progreso del desafío' });
    }
};

module.exports = {
    Progreso,
};
