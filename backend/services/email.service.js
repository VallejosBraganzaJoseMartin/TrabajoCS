const nodemailer = require('nodemailer');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Envía una notificación de inicio de sesión al usuario
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} loginInfo - Información adicional del login
 */
const sendLoginNotification = async (userEmail, userName, loginInfo = {}) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const mailOptions = {
    from: `"Sistema de Pizzería" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🔐 Nuevo inicio de sesión en tu cuenta',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🍕 Sistema de Pizzería</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">¡Hola, ${userName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Se ha detectado un nuevo inicio de sesión en tu cuenta.
            </p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">📋 Detalles del acceso:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>📅 Fecha:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0; color: #666;"><strong>🕐 Hora:</strong> ${formattedTime}</p>
              <p style="margin: 5px 0; color: #666;"><strong>📧 Cuenta:</strong> ${userEmail}</p>
              ${loginInfo.ip ? `<p style="margin: 5px 0; color: #666;"><strong>🌐 IP:</strong> ${loginInfo.ip}</p>` : ''}
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ ¿No reconoces esta actividad?</strong><br>
                Si no fuiste tú quien inició sesión, te recomendamos cambiar tu contraseña inmediatamente y contactar al administrador del sistema.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático de seguridad. Por favor, no responda a este mensaje.
            </p>
          </div>
          
          <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
            © ${now.getFullYear()} Sistema de Pizzería - Todos los derechos reservados
          </p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Notificación de login enviada a:', userEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar notificación de login:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Envía una notificación de intento de inicio de sesión fallido
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre del usuario
 * @param {Object} attemptInfo - Información del intento
 */
const sendFailedLoginNotification = async (userEmail, userName, attemptInfo = {}) => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const mailOptions = {
    from: `"Sistema de Pizzería" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '⚠️ Intento de inicio de sesión fallido en tu cuenta',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🍕 Sistema de Pizzería</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #e74c3c; margin-top: 0;">⚠️ Alerta de Seguridad</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hola <strong>${userName}</strong>, se ha detectado un intento de inicio de sesión fallido en tu cuenta.
            </p>
            
            <div style="background-color: #fdf2f2; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">📋 Detalles del intento:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>📅 Fecha:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0; color: #666;"><strong>🕐 Hora:</strong> ${formattedTime}</p>
              <p style="margin: 5px 0; color: #666;"><strong>📧 Cuenta:</strong> ${userEmail}</p>
              ${attemptInfo.ip ? `<p style="margin: 5px 0; color: #666;"><strong>🌐 IP:</strong> ${attemptInfo.ip}</p>` : ''}
              <p style="margin: 5px 0; color: #e74c3c;"><strong>❌ Motivo:</strong> Contraseña incorrecta</p>
            </div>
            
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #721c24; font-size: 14px;">
                <strong>🔒 Recomendaciones de seguridad:</strong><br>
                • Si no reconoces este intento, alguien puede estar intentando acceder a tu cuenta.<br>
                • Considera cambiar tu contraseña por una más segura.<br>
                • Si recibes múltiples alertas, contacta al administrador del sistema.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático de seguridad. Por favor, no responda a este mensaje.
            </p>
          </div>
          
          <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
            © ${now.getFullYear()} Sistema de Pizzería - Todos los derechos reservados
          </p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Notificación de intento fallido enviada a:', userEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar notificación de intento fallido:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Envía una notificación de bienvenida al crear una cuenta
 * @param {string} userEmail - Email del usuario
 * @param {string} userName - Nombre completo del usuario
 */
const sendWelcomeNotification = async (userEmail, userName) => {
  const now = new Date();

  const mailOptions = {
    from: `"Sistema de Pizzería" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎉 ¡Bienvenido al Sistema de Pizzería!',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🍕 Sistema de Pizzería</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #27ae60; margin-top: 0;">🎉 ¡Bienvenido/a!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hola <strong>${userName}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Tu cuenta ha sido creada exitosamente en el Sistema de Pizzería. Ahora puedes acceder a todas las funcionalidades disponibles según tu rol asignado.
            </p>
            
            <div style="background-color: #d4edda; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">📋 Información de tu cuenta:</h3>
              <p style="margin: 5px 0; color: #666;"><strong>📧 Email:</strong> ${userEmail}</p>
              <p style="margin: 5px 0; color: #666;"><strong>👤 Usuario:</strong> ${userName}</p>
            </div>
            
            <div style="background-color: #e7f3ff; border: 1px solid #b6d4fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #084298; font-size: 14px;">
                <strong>💡 Consejos de seguridad:</strong><br>
                • Mantén tu contraseña segura y no la compartas con nadie.<br>
                • Cierra sesión cuando uses equipos compartidos.<br>
                • Si recibes alertas de acceso sospechoso, contacta al administrador.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; font-size: 16px;">¡Gracias por ser parte de nuestro equipo!</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Este es un correo automático. Por favor, no responda a este mensaje.
            </p>
          </div>
          
          <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
            © ${now.getFullYear()} Sistema de Pizzería - Todos los derechos reservados
          </p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Notificación de bienvenida enviada a:', userEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar notificación de bienvenida:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Verifica la configuración del servicio de email
 */
const verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log('✅ Servicio de email configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error.message);
    return false;
  }
};

module.exports = {
  sendLoginNotification,
  sendFailedLoginNotification,
  sendWelcomeNotification,
  verifyEmailService
};
