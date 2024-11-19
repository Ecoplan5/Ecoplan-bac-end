// const nodemailer = require('nodemailer');

// const enviarCorreo = async (destinatario, asunto, contenido, credenciales) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: credenciales.usuario,
//         pass: credenciales.contrasena,
//       },
//     });

//     const mailOptions = {
//       from: credenciales.usuario,
//       to: destinatario,
//       subject: asunto,
//       text: contenido,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Correo de notificación enviado:', info.response);
//   } catch (error) {
//     console.error('Error al enviar el correo electrónico:', error);
//     throw error;
//   }
// };

// Middleware para manejar errores
function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    let statusCode = err.statusCode || 500;
    let message;
  
    // Manejar errores específicos de Sequelize
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400; // Solicitud incorrecta
      message = err.errors.map(e => translateSequelizeError(e)).join(', ');
    } else {
      // Otros casos de error
      switch (statusCode) {
        case 400:
          message = 'Solicitud incorrecta. Verifique los datos enviados.';
          break;
        case 401:
          message = 'No autorizado. Verifique sus credenciales.';
          break;
        case 403:
          message = 'Prohibido. No tiene permisos para acceder a este recurso.';
          break;
        case 404:
          message = 'Recurso no encontrado. Verifique la URL.';
          break;
        case 500:
          message = 'Error interno del servidor. Por favor, contacte a soporte.';
          break;
        default:
          message = 'Error desconocido. Por favor, contacte a soporte.';
          break;
      }
    }
  
    // Verificar si la cabecera ya fue enviada
    if (!res.headersSent) {
      res.status(statusCode).json({
        status: statusCode,
        message: message,
      });
    }
  
    // Opcional: Enviar correo electrónico para errores críticos
    // if (statusCode === 500) {
    //   const credencialesGmail = {
    //     usuario: 'sionbarbershop5@gmail.com',
    //     contrasena: 'rhvs lodh xrbl hoon',
    //   };
    //   const destinatario = 'felixx-21@hotmail.com';
    //   const asunto = `Error en la aplicación - ${statusCode}`;
    //   const contenido = `Se ha producido un error:\n\nCódigo: ${statusCode}\nMensaje: ${message}`;
    //   enviarCorreo(destinatario, asunto, contenido, credencialesGmail)
    //     .then(() => {
    //       console.log('Correo de notificación enviado con éxito');
    //     })
    //     .catch((error) => {
    //       console.error('Error al enviar el correo de notificación:', error);
    //     });
    // }
  }
  
  // Función para traducir errores de Sequelize
  const translateSequelizeError = (error) => {
    switch (error.validatorKey) {
      case 'not_null':
        return `El campo ${error.path} no puede estar vacío.`;
      case 'isEmail':
        return `El campo ${error.path} debe ser un correo electrónico válido.`;
      case 'len':
        return `El campo ${error.path} debe tener entre ${error.validatorArgs[0]} y ${error.validatorArgs[1]} caracteres.`;
      case 'isIn':
        return `El campo ${error.path} debe estar en una de las opciones permitidas.`;
      case 'isNumeric':
        return `El campo ${error.path} debe ser numérico.`;
      case 'isInt':
        return `El campo ${error.path} debe ser un número entero.`;
      case 'isFloat':
        return `El campo ${error.path} debe ser un número decimal.`;
      case 'isAlpha':
        return `El campo ${error.path} solo puede contener letras.`;
      case 'isAlphanumeric':
        return `El campo ${error.path} solo puede contener letras y números.`;
      case 'isDate':
        return `El campo ${error.path} debe ser una fecha válida.`;
      case 'isAfter':
        return `El campo ${error.path} debe ser una fecha posterior a ${error.validatorArgs[0]}.`;
      case 'isBefore':
        return `El campo ${error.path} debe ser una fecha anterior a ${error.validatorArgs[0]}.`;
      case 'min':
        return `El valor del campo ${error.path} debe ser mayor o igual a ${error.validatorArgs[0]}.`;
      case 'max':
        return `El valor del campo ${error.path} debe ser menor o igual a ${error.validatorArgs[0]}.`;
      case 'isUrl':
        return `El campo ${error.path} debe ser una URL válida.`;
      case 'isUUID':
        return `El campo ${error.path} debe ser un UUID válido.`;
      case 'unique violation':
        return `El valor del campo ${error.path} ya está en uso. Debe ser único.`;
      case 'notNull Violation':
        return `El campo ${error.path} no puede ser nulo.`;
      default:
        return `Error en el campo ${error.path}: ${error.message}`;
    }
  };
  
  module.exports = errorHandler;
  